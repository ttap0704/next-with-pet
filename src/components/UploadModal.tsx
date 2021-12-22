import nav_items from "../tools/nav";
import Link from "next/link";
import {RootState} from "../../reducers";
import styles from "../../styles/components.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../../reducers/common/upload";
import UploadInput from "./UploadInput"

const UploadModal = (props) => {
  const dispatch = useDispatch();
  const {upload_modal_visible, title} = useSelector((state: RootState) => state.uploadReducer);

  function hideModal (e) {
    e.preventDefault();
    dispatch(
      actions.setUploadModalVisible({
        visible: false,
        title: ""
      })
    )
  }

  function test() {
    console.log('test')
  }

  return (
    <div
      id="upload_modal"
      className={styles.upload_modal_warp}
      style={upload_modal_visible ? {display: "block"} : {display: "none"}}
    >
      <span>{upload_modal_visible}</span>
      <div className={styles.upload_modal}>
        <div></div>
        <div>
          <UploadInput
          onChange={() => test()}
          title={title}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
