import React, {
  useEffect,
  useState,
  useLayoutEffect,
  cloneElement,
} from "react";
import styles from "../../../styles/pages/registration.module.scss";
import common from "../../../styles/common.module.scss";
import res_style from "../../../styles/pages/restaurant.module.scss";
import { useRouter } from "next/router";
import { FaFileUpload } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import {
  HiChevronDoubleRight,
  HiChevronDoubleLeft,
  HiChevronLeft,
  HiChevronRight,
  HiPlusCircle,
  HiOutlinePlusCircle,
} from "react-icons/hi";
import { Tooltip, IconButton } from "@mui/material";

const Service = () => {
  const router = useRouter();
  let [curPage, setCurPage] = useState("exposure");
  const [exposureImages, setExposureImages] = useState([]);
  const [exposureMenu, setExposureMenu] = useState([
    {
      file: {
        file: null,
        imageUrl: "",
      },
      label: "",
      price: "",
    },
  ]);
  const [entireMenu, setEntireMenu] = useState([
    {
      category: "",
      menu: [{ label: "", price: "" }],
    },
  ]);

  function movePage(type: string) {
    const slider_btn = document.getElementById("slider_btn");
    if (type == "exposure") {
      setCurPage("detail");
      slider_btn.children[0].innerHTML = "뒤로가기";
      slider_btn.style.left = "0";
      slider_btn.style.right = "unset";
      slider_btn.style.marginLeft = "-12rem";
      slider_btn.style.marginRight = "0";
    } else {
      setCurPage("exposure");
      slider_btn.children[0].innerHTML = "상세페이지 등록";
      slider_btn.style.right = "0";
      slider_btn.style.left = "unset";
      slider_btn.style.marginRight = "-12rem";
      slider_btn.style.marginLeft = "0";
    }
    const slider = document.getElementById("slider_wrap");
    const distance = type == "exposure" ? "-61rem" : "0px";
    slider.style.transition = "500ms";
    slider.style.transform = `translate3d(${distance}, 0px, 0px)`;
  }

  function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
    key?: number,
    data?: object
  ) {
    let file = event.currentTarget.files;
    if (file.length > 0) {
      if (type == "exposure_menu") {
        let items = exposureMenu;
        let item = items[key];
        let reader = new FileReader();
        reader.onload = () => {
          item.file.file = file[0];
          item.file.imageUrl = reader.result.toString();

          items[key] = item;
          setExposureMenu([...items]);
        };
        reader.readAsDataURL(file[0]);
      }
    } else {
      if (type == "exposure_menu") {
        let items = exposureMenu;
        let item = items[key];
        item.file.file = null;
        item.file.imageUrl = "";

        items[key] = item;
        setExposureMenu([...items]);
      }
    }
  }

  function setMenuData(e, idx: number, type: string) {
    e.preventDefault();
    let items = [...entireMenu];
    let item = items[idx];
    // if (type == "category") {
    //   item.category = e.target.value;
    // } else if (type == "label") {
    // }
    items[idx] = item;
    setEntireMenu([...items]);
    console.log(entireMenu);
  }

  function toggleEntireMenubtn(type: string, idx: number, menu_idx: number) {
    let del_btn = document.getElementById(`menu_del_btn_${idx}_${menu_idx}`);
    let add_btn = document.getElementById(`menu_add_btn_${idx}_${menu_idx}`);
    if (type == "enter") {
      del_btn.style.display = "block";
      add_btn.style.display = "block";
    } else {
      del_btn.style.display = "none";
      add_btn.style.display = "none";
    }
  }

  function addExposureMenu() {
    let items = exposureMenu;
    if (items.length >= 5) {
      return false;
    }
    items.push({
      file: {
        file: null,
        imageUrl: "",
      },
      label: "",
      price: "",
    });

    setExposureMenu([...items]);
  }

  function addEntireMenu(idx: number) {
    let items = entireMenu;
    let item = items[idx];

    item.menu.push({ label: "", price: "" });
    items[idx] = item;

    setEntireMenu([...items]);
  }

  function deleteEntireMenu(idx: number, menu_idx: number) {
    let items = entireMenu;
    let item = items[idx];

    item.menu.splice(menu_idx, 1);
    items[idx] = item;

    setEntireMenu([...items]);
  }

  function addEntireCategory() {
    let items = entireMenu;
    if (items.length >= 5) {
      return false;
    }
    items.push({
      category: "",
      menu: [{ label: "", price: "" }],
    });

    setEntireMenu([...items]);
    console.log(entireMenu);
  }

  function inputExposureMenu(e, idx: number, type: string) {
    const value = e.target.value;
    let items = exposureMenu;
    let item = items[idx];
    item[type] = value;

    items[idx] = item;
    setExposureMenu([...items]);
    console.log(items, value);
  }

  const preview = () => {
    return (
      <div className={styles.rest_preview}>
        <div className={res_style.list}>
          <div className={res_style.list_img}>
            {exposureImages.length == 0 ? (
              <h3
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#666",
                }}
              >
                대표이미지를 업로드해주세요.
              </h3>
            ) : null}
          </div>
          <div className={res_style.list_text_container}>
            <div className={res_style.list_text}>
              <h2>제목 들어갈 자리</h2>
              <span className={res_style.list_rating}>위치 들어갈 자리</span>
              <p className={res_style.list_hashtags}>해시태그 들어갈 자리</p>
            </div>
            <div className={res_style.list_deco}></div>
          </div>
        </div>
        <div className={styles.rest_img_container}>
          {exposureImages.length == 0 ? (
            <h3>이미지를 업로드 해주세요.</h3>
          ) : (
            exposureImages.map((data) => {
              <img src={data.imageUrl} alt="exposureImage" />;
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.test}>
        <div className={styles.page_wrap}>
          <div id="slider_wrap" className={styles.slider_wrap}>
            <div className={styles.page}>
              <h1>노출 페이지</h1>
              {preview()}
              <form className={styles.form_box}>
                <div style={{ marginBottom: "12px" }}>
                  <label
                    htmlFor="preview_img"
                    className={common.file_input}
                    style={{ float: "right" }}
                  >
                    대표이미지 업로드
                    <FaFileUpload />
                  </label>
                  <input
                    type="file"
                    onChange={(e) => uploadImage(e, "exposure")}
                    id="preview_img"
                  ></input>
                </div>
                <input
                  type="text"
                  placeholder="제목을 입력해주세요."
                  className={styles.custom_input}
                ></input>
                <div>위치 선택 들어갈 자리!!!!!</div>
              </form>
            </div>
            <div className={styles.page}>
              <h1>상세 페이지</h1>
              <div>
                <h2>식당 메뉴</h2>
                <div className={styles.rest_menu}>
                  <div className={styles.rest_menu_title}>
                    <h3>대표 메뉴</h3>
                    <Tooltip
                      title="클릭하여 대표메뉴를 추가할 수 있습니다. (최대 5개)"
                      placement="top"
                    >
                      <IconButton onClick={() => addExposureMenu()}>
                        <HiPlusCircle />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <ul
                    className={styles.rest_menu_wrap}
                    style={{ border: "1px solid #e3e3e3" }}
                  >
                    {exposureMenu.map((data, index) => {
                      return (
                        <li
                          className={styles.rest_exposure_menu}
                          key={`exposure_menu_${index}`}
                        >
                          <div className={styles.rest_exposure_menu_imgbox}>
                            <div className={styles.rest_menu_circle}></div>
                            <label htmlFor={`exposure_menu_img_${index}`}>
                              이미지
                              {data.file.file == null ? null : (
                                <img
                                  src={data.file.imageUrl}
                                  alt="entire_image"
                                />
                              )}
                            </label>
                            <input
                              type="file"
                              onChange={(e) =>
                                uploadImage(e, "exposure_menu", index)
                              }
                              id={`exposure_menu_img_${index}`}
                            />
                          </div>
                          <div className={styles.rest_exposure_menu_textbox}>
                            <input
                              type="text"
                              placeholder="메뉴 이름을 입력해주세요."
                            />
                            <div style={data.price.length > 0 ? {paddingRight: '8px'} : null}>
                              <input
                                type="text"
                                placeholder="메뉴 가격을 입력해주세요."
                                onChange={(e) =>
                                  inputExposureMenu(e, index, "price")
                                }
                                value={data.price}
                              />
                              {data.price.length > 0 ? '원' : null}
                            </div>
                            <input
                              type="text"
                              placeholder="한 줄 설명을 입력해주세요."
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className={styles.rest_menu_title}>
                    <h3>전체 메뉴</h3>
                    <Tooltip
                      title="클릭하여 카테고리를 추가할 수 있습니다. (최대 5개)"
                      placement="top"
                    >
                      <IconButton onClick={() => addEntireCategory()}>
                        <HiPlusCircle />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <ul className={styles.rest_menu_wrap}>
                    {entireMenu.map((data, idx) => {
                      return (
                        <li
                          className={styles.rest_entire_menu}
                          key={`entire_category_${idx}`}
                        >
                          <div className={styles.rest_menu_circle}></div>
                          <input
                            type="text"
                            placeholder="이 곳에 카테고리 이름을 입력해주세요."
                            value={data.category}
                            onChange={(e) => setMenuData(e, idx, "category")}
                          />
                          <ul>
                            {data.menu.map((menu, menu_idx) => {
                              return (
                                <li
                                  className={styles.rest_entire_menu_detail}
                                  key={`entire_menu_${menu_idx}`}
                                  onMouseEnter={() =>
                                    toggleEntireMenubtn("enter", idx, menu_idx)
                                  }
                                  onMouseLeave={() =>
                                    toggleEntireMenubtn("leave", idx, menu_idx)
                                  }
                                >
                                  <div
                                    className={styles.rest_menu_circle}
                                  ></div>
                                  <input
                                    type="text"
                                    placeholder="메뉴 이름을 입력해주세요."
                                    value={menu.label}
                                    onChange={(e) =>
                                      setMenuData(e, menu_idx, "label")
                                    }
                                  />
                                  <div
                                    className={styles.rest_entire_menu_price}
                                  >
                                    <input
                                      type="text"
                                      placeholder="메뉴 가격을 입력해주세요."
                                      value={menu.price}
                                      onChange={(e) =>
                                        setMenuData(e, menu_idx, "price")
                                      }
                                    />{" "}
                                    {menu.price.length > 0 ? '원' : null}
                                  </div>
                                  <TiDelete 
                                  id={`menu_del_btn_${idx}_${menu_idx}`}
                                    onClick={() => deleteEntireMenu(idx, menu_idx)}
                                  />
                                  <Tooltip
                                    title="클릭하여 메뉴를 추가할 수 있습니다."
                                    placement="bottom"
                                  >
                                    <IconButton
                                      id={`menu_add_btn_${idx}_${menu_idx}`}
                                      onClick={() => addEntireMenu(idx)}
                                    >
                                      <HiOutlinePlusCircle />
                                    </IconButton>
                                  </Tooltip>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="slider_btn"
          className={styles.slider_btn}
          onClick={() => movePage(curPage)}
          style={{ marginRight: "-10rem", right: 0 }}
        >
          {curPage == "detail" ? (
            <HiChevronDoubleLeft />
          ) : (
            <HiChevronDoubleRight />
          )}
          <p style={{ margin: "0 12px", display: "block" }}>
            {curPage == "detail" ? "뒤로가기" : "상세페이지 등록"}
          </p>
        </div>
      </div>
    </>
  );
};

export default Service;
