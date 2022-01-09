import styles from "../../styles/components.module.scss";
import React from "react";

const ModalContainer = (props) => {
  const visible = props.visible;
  const zIndex = props.zIndex ? props.zIndex : 0

  function hideModal(e) {
    e.preventDefault();
    props.backClicked()
  }

 

  return (
    <div
      className={styles.modal_container}
      style={visible ? {display: "block", zIndex} : {display: "none", zIndex}}
    >
      <div className={styles.back} onClick={(e) => hideModal(e)} />
      {props.children}
    </div>
  );
};

export default ModalContainer;
