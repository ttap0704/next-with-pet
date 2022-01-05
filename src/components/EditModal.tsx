import styles from "../../styles/components.module.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import ModalContainer from "./ModalContainer";
import CustomInput from "./CustomInput";
import CustomTextarea from "./CustomTextarea";
import {HiX} from "react-icons/hi";

const UploadModal = (props) => {
  const dispatch = useDispatch();

  const visible = props.visible;
  const title = props.title;
  const props_value = props.value;
  const type = props.type;
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(props.value);
  }, [props_value]);

  return (
    <ModalContainer backClicked={() => props.hideModal()} visible={visible}>
      <div className={styles.edit_modal}>
        <h2 className={styles.modal_title}>
          {title}
          <HiX onClick={() => props.hideModal()} />
        </h2>
        {type == "input" ? (
          <div className={styles.input_contents}>
            <CustomInput value={value} disabled={false} onChange={(e) => setValue(e.target.value)} />
            <button className={styles.regi_button}>수정</button>
          </div>
        ) : (
          <div className={styles.textarea_contents}>
            <CustomTextarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              height="15rem"
            />
            <button className={styles.regi_button}>수정</button>
          </div>
        )}
      </div>
    </ModalContainer>
  );
};

export default UploadModal;
