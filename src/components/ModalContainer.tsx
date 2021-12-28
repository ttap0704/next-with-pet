import styles from "../../styles/components.module.scss";
import React from "react";

const ModalContainer = (props) => {
  const visible = props.visible;

  function hideModal(e) {
    e.preventDefault();
    props.backClicked()
  }

 

  return (
    <div
      className={styles.modal_container}
      style={visible ? {display: "block"} : {display: "none"}}
    >
      <div className={styles.back} onClick={(e) => hideModal(e)} />
      {props.children}
    </div>
  );
};

export default ModalContainer;
