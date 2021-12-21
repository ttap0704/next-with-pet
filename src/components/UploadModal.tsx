import nav_items from "../tools/nav";
import Link from "next/link";
import {RootState} from "../../reducers";
import styles from "../../styles/components/upload_modal.module.scss";
import {useDispatch, useSelector} from "react-redux";

const UploadModal = (props) => {
  const dispatch = useDispatch();
  const {upload_modal_visible} = useSelector((state: RootState) => state.uploadReducer);

  console.log(props);
  return (
    <div
      id="upload_modal"
      className={styles.upload_modal_warp}
      style={upload_modal_visible ? {display: "block"} : {display: "none"}}
    >
      <span>{upload_modal_visible}</span>
      <div className={styles.upload_modal}>{props.name}</div>
    </div>
  );
};

export default UploadModal;
