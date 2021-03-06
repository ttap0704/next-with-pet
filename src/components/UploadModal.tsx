import styles from "../../styles/components.module.scss";

import {RootState} from "../../reducers";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../../reducers/common/upload";
import React, {useState, useEffect} from "react";

import {readFile} from "../tools/common";

import {TiDelete} from "react-icons/ti";
import {Tooltip, IconButton} from "@mui/material";
import {FaInfoCircle} from "react-icons/fa";
import {HiX} from "react-icons/hi";

import ModalContainer from "./ModalContainer";
import UploadInput from "./UploadInput";
import ImageBox from "./ImageBox";
import OrderList from "./OrderList";

const UploadModal = (props) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);

  const {upload_modal_visible, title, target, target_idx, multiple, upload_files, image_type} = useSelector(
    (state: RootState) => state.uploadReducer
  );

  useEffect(() => {
    setFiles([]);
    if (upload_files.length > 0) {
      setPreviewFiles(upload_files);
    }
  }, [upload_files]);

  function hideModal() {
    dispatch(actions.resetFiles());
    setFiles([]);
  }

  function onChangeEvent(e) {
    let file = e.currentTarget.files;
    setPreviewFiles(file);
  }

  function setPreviewFiles(file) {
    if (file.length > 0) {
      let res_files = Array.from(file);
      let number = files.length == 0 ? 1 : files[files.length - 1].number + 1;
      res_files.forEach(async (file: any) => {
        const new_file_name = await readFile(file);
        const duplicated_image_idx = files.findIndex((data) => {
          return data.imageUrl == new_file_name;
        });
        if (duplicated_image_idx < 0) {
          setFiles((state) => {
            console.log(files);
            return [...state, {file: file, imageUrl: new_file_name, number}];
          });
          number++;
        } else {
          alert("이미 같은 이미지가 추가되어 있습니다.");
        }
      });
    }
  }

  function changePreview(data: any) {
    const preview: HTMLElement = document.getElementById("upload_modal_preview");
    preview.setAttribute("src", data.imageUrl);
  }

  function changeImageOrder(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const value = e.target.value;
    let items = files;
    let item = items[idx];

    item.number = value;

    items[idx] = item;
    setFiles([...items]);
  }

  function setImageOrder() {
    let items = files;
    let sorted_items = items
      .sort((a, b) => a.number - b.number)
      .map((data, index) => {
        return {...data, number: index + 1};
      });
    console.log(sorted_items);
    setFiles([...sorted_items]);
  }

  function blurInput(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    const code = e.code;
    if (code == "Enter" || code == "NumpadEnter") {
      const el: HTMLElement = document.getElementById(`order_${idx}`);
      el.blur();
    }
  }

  function confirmData() {
    const ok = confirm("입력하신 순서대로 이미지를 업로드 하시겠습니까?");
    if (ok) {
      let f_files = [];

      for (let x of files) {
        f_files.push(x.file);
      }

      props.onChange(f_files, target, target_idx);
      dispatch(actions.resetFiles());
    }
  }

  function deleteImage(idx: number) {
    const ok = confirm(`${idx + 1}번 이미지를 삭제하시겠습니까?`);
    if (ok) {
      let items = [...files];
      items.splice(idx, 1);

      setFiles([...items]);
    }
  }

  return (
    <ModalContainer backClicked={() => hideModal()} visible={upload_modal_visible} zIndex={1}>
      <div className={styles.upload_modal}>
        <h2 className={styles.modal_title}>
          이미지 업로드
          <HiX onClick={() => hideModal()} />
        </h2>
        <ImageBox
          shadow={false}
          imgId="upload_modal_preview"
          src={files.length > 0 ? files[0].imageUrl : null}
          type={image_type}
        />
        <div className={styles.tooltip_box}>
          <Tooltip
            title="리스트 왼쪽 숫자를 변경하여, 이미지 순서를 정해주세요."
            placement="top"
            style={{float: "right"}}
          >
            <IconButton>
              <FaInfoCircle />
            </IconButton>
          </Tooltip>
        </div>
        {files.length == 0 ? (
          <h3>파일을 업로드 해주세요.</h3>
        ) : (
          <OrderList
            data={files}
            onListClick={(data) => changePreview(data)}
            onBlur={() => setImageOrder()}
            changeOrder={(e, idx) => changeImageOrder(e, idx)}
            onKeyDown={(e, idx) => blurInput(e, idx)}
            onClickDelete={(idx) => deleteImage(idx)}
          />
          // <ul>
          //   {files.map((data, idx) => {
          //     return (
          //       <li key={data.imageUrl} onClick={() => changePreview(data)}>
          //         <input
          //           type="text"
          //           id={`image_order_${idx}`}
          //           value={data.number}
          //           onChange={(e) => changeImageOrder(e, idx)}
          //           onBlur={() => setImageOrder()}
          //           onKeyDown={(e) => blurInput(e, idx)}
          //         />
          //         <span>{data.file.name ? data.file.name : `이미지 ${data.number}번`}</span>
          //         <TiDelete onClick={() => deleteImage(idx)} />
          //       </li>
          //     );
          //   })}
          // </ul>
        )}
        <div className={styles.util_box}>
          <UploadInput onChange={(e) => onChangeEvent(e)} title={title} multiple={multiple} />
          <button className={styles.regi_button} onClick={() => confirmData()}>
            등록
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default UploadModal;
