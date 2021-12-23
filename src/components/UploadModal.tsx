import {RootState} from "../../reducers";
import styles from "../../styles/components.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../../reducers/common/upload";
import UploadInput from "./UploadInput";

const UploadModal = (props) => {
  const dispatch = useDispatch();
  const {upload_modal_visible, title, target, target_idx, multiple} = useSelector(
    (state: RootState) => state.uploadReducer
  );

  function hideModal(e) {
    e.preventDefault();
    dispatch(actions.resetFiles());
  }

  function onChangeEvent(e) {
    console.log(target_idx);
    if (target_idx != undefined) {
      props.onChange(e, target, target_idx);
    } else {
      props.onChange(e, target);
    }
  }

  return (
    <div
      id="upload_modal"
      className={styles.upload_modal_warp}
      style={upload_modal_visible ? {display: "block"} : {display: "none"}}
    >
      <div className={styles.back} onClick={(e) => hideModal(e)} />
      <div className={styles.upload_modal}>
        <div></div>
        <div>
          <UploadInput onChange={(e) => onChangeEvent(e)} title={title} multiple={multiple} />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
