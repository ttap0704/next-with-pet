import {FaFileUpload} from "react-icons/fa";
import styles from "../../styles/components.module.scss";

const UploadInput = (props) => {
  const title = props.title;

  function onChangeEvent(e) {
    e.preventDefault();
    props.onChange();
  }

  return (
    <div style={{marginBottom: "12px"}}>
      <label htmlFor="upload_input" 
      className={styles.file_input} 
      style={{float: "right"}}
      >
        {title}
        <FaFileUpload />
      </label>
      <input
        type="file"
        onChange={(e) => onChangeEvent(e)}
        id="upload_input"
        name="upload_input"
        multiple
      ></input>
    </div>
  );
};

export default UploadInput;
