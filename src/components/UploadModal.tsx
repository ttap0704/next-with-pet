import {RootState} from "../../reducers";
import styles from "../../styles/components.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../../reducers/common/upload";
import UploadInput from "./UploadInput";
import ImageBox from "./ImageBox";
import {useState} from "react";


const UploadModal = (props) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);

  const {upload_modal_visible, title, target, target_idx, multiple} = useSelector(
    (state: RootState) => state.uploadReducer
  );

  function hideModal(e) {
    e.preventDefault();
    dispatch(actions.resetFiles());
  }

  function onChangeEvent(e) {
    let file = e.currentTarget.files;
    // if (file.length > 0) {
    //     let files = Array.from(file);
    //     files.forEach((file) => {
    //       let reader = new FileReader();
    //       reader.onloadend = () => {
    //         setFiles((state) => [...state, {file: file, imageUrl: reader.result.toString()}]);
    //       };
    //       reader.readAsDataURL(file);
    //     });
    //   }
    // }
    // if (target_idx != undefined) {
    //   props.onChange(e, target, target_idx);
    // } else {
    //   props.onChange(e, target);
    // }
  }

  return (
    <div
      id="upload_modal"
      className={styles.upload_modal_warp}
      style={upload_modal_visible ? {display: "block"} : {display: "none"}}
    >
      <div className={styles.back} onClick={(e) => hideModal(e)} />
      <div className={styles.upload_modal}>
        <ImageBox type="accommodation" />
        <ul>
          <li>file 1</li>
          <li>file 2</li>
          <li>file 3</li>
          <li>file 4</li>
          <li>file 5</li>
        </ul>
        <UploadInput onChange={(e) => onChangeEvent(e)} title={title} multiple={multiple} />
      </div>
    </div>
  );
};

export default UploadModal;
