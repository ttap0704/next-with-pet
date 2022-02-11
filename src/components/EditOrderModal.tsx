import styles from "../../styles/components.module.scss";

import React, {useEffect} from "react";
import ModalContainer from "./ModalContainer";

import {HiX} from "react-icons/hi";

import {useState} from "react";

import OrderList from "./OrderList";

const CategoryMenuModal = (props) => {
  const visible = props.visible;
  const type = props.type;
  let target = "";
  if (type == "category") {
    target = "메뉴";
  } else if (type == "rooms") {
    target = "객실";
  } else {
    target = "카테고리";
  }

  const [data, setData] = useState([]);

  useEffect(() => {
    if (visible) {
      const tmp_data = props.data.sort((a, b) => {
        return a.number - b.number;
      });
      setData([...tmp_data]);
    } else {
      setData([]);
    }
  }, [visible]);

  function setOrder() {
    setData((state) => {
      return [
        ...state
          .sort((a, b) => {
            return a.number - b.number;
          })
          .map((item, idx) => {
            return {...item, number: idx + 1};
          }),
      ];
    });
  }

  function changeOrder(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const value = e.target.value;
    let items = data;
    let item = items[idx];
    console.log(data);

    item.number = value;

    items[idx] = item;
    setData([...items]);
  }

  function blurInput(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    const code = e.code;
    if (code == "Enter" || code == "NumpadEnter") {
      const el: HTMLElement = document.getElementById(`order_${idx}`);
      el.blur();
    }
  }

  function deleteMenu(idx: number) {
    const ok = confirm(`${idx + 1}번 ${target}를 삭제하시겠습니까?`);
    if (ok) {
      let items = [...data];
      items.splice(idx, 1);

      setData([...items]);
      setOrder();
    }
  }

  return (
    <ModalContainer backClicked={() => props.hideModal()} visible={visible} zIndex={1}>
      <div className={styles.category_menu_modal}>
        <h2 className={styles.modal_title}>
          {target} 수정
          <HiX onClick={() => props.hideModal()} />
        </h2>
        <div className={styles.category_menu_modal_contents}>
          <OrderList
            data={data}
            onBlur={() => setOrder()}
            changeOrder={(e, idx) => changeOrder(e, idx)}
            onKeyDown={(e, idx) => blurInput(e, idx)}
            onClickDelete={(idx) => deleteMenu(idx)}
          />
          <div className={styles.util_box} style={{padding: "0 2rem"}}>
            <button className={styles.regi_button} onClick={() => props.onSubmit(data)}>
              등록
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CategoryMenuModal;
