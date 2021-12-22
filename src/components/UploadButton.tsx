import { FaFileUpload } from "react-icons/fa";
import styles from "../../styles/components.module.scss"

const UploadButton = (props) => {
  const title = props.title;

  function onClickEvent(e) {
    e.preventDefault();
    props.onClick();
  }

  return (
    <button 
      onClick={(e) => onClickEvent(e)}
      className={styles.upload_button}
    >
      {title}
      <FaFileUpload />
    </button>
  );
};

export default UploadButton;
