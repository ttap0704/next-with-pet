import styles from "../../styles/components.module.scss";
import React, { useState, useEffect } from "react";
import { Tooltip, IconButton, Button } from "@mui/material";
import { HiX, HiOutlinePlusCircle } from "react-icons/hi";
import { TiDelete } from "react-icons/ti";

import ModalContainer from "./ModalContainer";
import CustomInput from "./CustomInput";
import UtilBox from "./UtilBox";

const CategoryModal = (props) => {
  const visible = props.visible;
  const target = props.target;
  const title = props.title;
  const [category, setCategory] = useState("");
  const [menu, setMenu] = useState([
    {
      label: "",
      price: ""
    }
  ])

  useEffect(() => {
  });


  function addEntireMenu() {
    const data = {
      category: category,
      menu: menu
    }

    const ok = confirm('카테고리를 등록하시겠습니까?');
    if (ok) {
      props.onSubmit(data);
    }
  }

  function addMenu() {
    setMenu(state => {
      return [
        ...state,
        {
          label: "",
          price: ""
        }
      ]
    })
  }

  function deleteMenu(idx: number) {
    if (menu.length == 1) return false;
    setMenu(state => {
      return state.map((item, index) => {
        if (idx != index) {
          return item;
        };
      }).filter(item => item != undefined)
    })
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>, idx: number, type: string) {
    setMenu(state => {
      return state.map((item, index) => {
        if (idx != index) {
          return item
        } else {
          return {
            ...menu[idx],
            [type]: e.target.value
          }
        }
      })
    })
  }

  
  return (
    <ModalContainer backClicked={() => props.hideModal()} visible={visible}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60rem",
          backgroundColor: "#fff",
          height: "auto",
        }}
      >
        <h2>
          {title}
          <HiX onClick={() => props.hideModal()} />
        </h2>
        <div
          className={styles.entire_menu_modal}
        >
          <div className={styles.entire_menu_modal_container}>
            {target == 'category' ? (
              <CustomInput
                placeholder="카테고리를 입력해주세요."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            ) : null}
            <div style={{ textAlign: 'right', padding: '1rem 0' }}>
              <Button onClick={() => addMenu()}>
                메뉴 추가하기
              </Button>
            </div>
            <ul className={styles.menu_list}>
              {menu.map((data, index) => {
                return (
                  <li key={`menu_list_${index}`} >
                    <b>
                      {index + 1}.
                    </b>
                    <CustomInput
                      value={data.label}
                      bottom={true}
                      width="60%"
                      placeholder="메뉴를 입력해주세요."
                      onChange={(e) => handleInput(e, index, 'label')}
                    />
                    <CustomInput
                      value={data.price}
                      bottom={true}
                      width="40%"
                      placeholder="가격을 입력해주세요."
                      align="right"
                      onChange={(e) => handleInput(e, index, 'price')}
                    />
                    <IconButton onClick={() => deleteMenu(index)}>
                      <TiDelete />
                    </IconButton>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <UtilBox style={{paddingRight: '1rem'}}>
          <button className={styles.regi_button} onClick={() => addEntireMenu()}>등록</button>
        </UtilBox>
      </div>
    </ModalContainer >
  );
};

export default CategoryModal;


