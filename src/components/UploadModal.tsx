import { RootState } from "../../reducers";
import styles from "../../styles/components.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../reducers/common/upload";
import UploadInput from "./UploadInput";
import ImageBox from "./ImageBox";
import { useState } from "react";


const UploadModal = (props) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);

  const { upload_modal_visible, title, target, target_idx, multiple } = useSelector(
    (state: RootState) => state.uploadReducer
  );

  function hideModal(e) {
    e.preventDefault();
    dispatch(actions.resetFiles());
  }

  function onChangeEvent(e) {
    let file = e.currentTarget.files;
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

  function changeImageOrder(e, idx: number) {
    let items = files;
    let item = items[idx];
    console.log(e)
  }

  return (
    <div
      id="upload_modal"
      className={styles.upload_modal_warp}
      style={upload_modal_visible ? { display: "block" } : { display: "none" }}
    >
      <div className={styles.back} onClick={(e) => hideModal(e)} />
      <div className={styles.upload_modal}>
        <ImageBox
          type="accommodation"
          shadow={false}
          imgId="upload_modal_preview"
          src={files.length > 0 ? files[0].imageUrl : null}
        />
        {files.length == 0 ?
          (<h3>파일을 123123 해주세요.</h3>)
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
                      value={data.number}
                      onChange={(e) => changeImageOrder(e, idx)}
                    />
                    <span>
                      {data.file.name}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        <div style={{ height: '4rem', padding: '0.5rem 0' }}>
          <UploadInput onChange={(e) => onChangeEvent(e)} title={title} multiple={multiple} />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
