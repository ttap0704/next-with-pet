import styles from "../../styles/components.module.scss";

import React from "react";
import ModalContainer from "./ModalContainer";

import {HiX} from "react-icons/hi";

import OrderList from "./OrderList";

const CategoryMenuModal = (props) => {
  const visible = props.visible;
  const data = props.data;

  return (
    <ModalContainer backClicked={() => props.hideModal()} visible={visible} zIndex={1}>
      <div className={styles.category_menu_modal}>
        <h2 className={styles.modal_title}>
          카테고리 메뉴
          <HiX onClick={() => props.hideModal()} />
        </h2>
        <div className={styles.category_menu_modal_contents}>
          <OrderList data={data} />
          <button className={styles.regi_button}>등록</button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CategoryMenuModal;
