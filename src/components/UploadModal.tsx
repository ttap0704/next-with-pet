import { RootState } from "../../reducers";
import styles from "../../styles/components.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../reducers/common/upload";
import UploadInput from "./UploadInput";
import ImageBox from "./ImageBox";
import React, { useState, useEffect } from "react";


const UploadModal = (props) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  
  const { upload_modal_visible, title, target, target_idx, multiple, upload_files } = useSelector(
    (state: RootState) => state.uploadReducer
  );

  useEffect(() => {
    setFiles([])
    if (upload_files.length > 0) {
      setPreviewFiles(upload_files)
    }
  }, [upload_files]);


  function hideModal(e) {
    e.preventDefault();
    dispatch(actions.resetFiles());
    setFiles([]);
  }

  function onChangeEvent(e) {
    let file = e.currentTarget.files;
    setPreviewFiles(file)
  }

  function setPreviewFiles(file) {
    if (file.length > 0) {
      let files = Array.from(file);
      let number = 1;
      files.forEach((file: any) => {
        let reader = new FileReader();
        reader.onloadend = () => {
          setFiles((state) => [...state, { file: file, imageUrl: reader.result.toString(), number }]);
          number++;
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function changePreview(data: any) {
    const preview: HTMLElement = document.getElementById('upload_modal_preview');
    preview.setAttribute('src', data.imageUrl)
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
    let sorted_items = items.sort((a, b) => a.number - b.number);
    setFiles([...sorted_items])
  }

  function blurInput(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    const code = e.code;
    if (code == 'Enter' || code == 'NumpadEnter') {
      const el: HTMLElement = document.getElementById(`image_order_${idx}`);
      el.blur();
    }
  }

  function confirmData () {
    const ok = confirm('입력하신 순서대로 이미지를 \r\n업로드 하시겠습니까?');
    if (ok) {
      let f_files = [];

      for (let x of files) {
        f_files.push(x.file)
      }

      props.onChange(f_files, target, target_idx);
      dispatch(actions.resetFiles());
    }
  }

  return (
    <div
      id="upload_modal"
      className={styles.upload_modal_warp}
      style={upload_modal_visible ? { display: "block" } : { display: "none" }}
    >
      <div className={styles.back} onClick={(e) => hideModal(e)} />
      <div className={styles.upload_modal}>
        <h2 style={{ padding: '2rem', backgroundColor: '#fff', width: '100%', textAlign: 'center' }}>이미지 업로드</h2>
        <ImageBox
          type="accommodation"
          shadow={false}
          imgId="upload_modal_preview"
          src={files.length > 0 ? files[0].imageUrl : null}
        />
        {files.length == 0 ?
          (<h3>파일을 업로드 해주세요.</h3>)
          :
          (
            <ul>
              {files.map((data, idx) => {
                return (
                  <li
                    key={data.imageUrl}
                    onClick={() => changePreview(data)}
                  >
                    <input
                      type="text"
                      id={`image_order_${idx}`}
                      value={data.number}
                      onChange={(e) => changeImageOrder(e, idx)}
                      onBlur={() => setImageOrder()}
                      onKeyDown={(e) => blurInput(e, idx)}
                    />
                    <span>
                      {data.file.name}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        <div className={styles.util_box}>
          <UploadInput onChange={(e) => onChangeEvent(e)} title={title} multiple={multiple} />
          <button onClick={() => confirmData()}>등록</button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
