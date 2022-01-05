import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "../../../styles/pages/registration.module.scss";
import common from "../../../styles/common.module.scss";
import res_style from "../../../styles/pages/restaurant.module.scss";
import { useRouter } from "next/router";
import { TiDelete } from "react-icons/ti";
import { HiChevronDoubleRight, HiChevronDoubleLeft, HiPlusCircle, HiOutlinePlusCircle } from "react-icons/hi";
import { Tooltip, IconButton, Button } from "@mui/material";
import PostCode from "../../../src/components/PostCode";
import UploadButton from "../../../src/components/UploadButton";
import ImageBox from "../../../src/components/ImageBox";
import LabelBox from "../../../src/components/LabelBox";
import UploadModal from "../../../src/components/UploadModal";
import CustomTextarea from "../../../src/components/CustomTextarea";
import { RESET_RESTRAURANT } from "../../../reducers/models/restaurant";
import { actions } from "../../../reducers/common/upload";
import { fetchPostApi, fetchFileApi } from "../../../src/tools/api";
import { toggleButton } from "../../../src/tools/common";


const Service = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: RESET_RESTRAURANT,
    });
  }, []);

  const router = useRouter();
  let [curPage, setCurPage] = useState("exposure");
  const [popupVisible, setPopupVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [exposureImages, setExposureImages] = useState([]);
  const [exposureMenu, setExposureMenu] = useState([
    {
      file: {
        file: null,
        imageUrl: "",
      },
      label: "",
      price: "",
      comment: "",
    },
  ]);
  const [entireMenu, setEntireMenu] = useState([
    {
      category: "",
      menu: [{ label: "", price: "" }],
    },
  ]);
  const [address, setAddress] = useState({
    zonecode: "",
    sido: "",
    sigungu: "",
    bname: "",
    road_address: "",
    detail_address: "",
    building_name: "",
  });

  function updateAddress(data: object) {
    if (data) {
      setPopupVisible(false);
      setAddress((state) => ({
        ...state,
        ...data,
      }));
      console.log(data);
    }
  }

  function updateDetailAddress(e) {
    const val = e.target.value;
    setAddress((state) => ({
      ...state,
      detail_address: val,
    }));
  }

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

  function uploadImage(event: React.ChangeEvent<HTMLInputElement>, type: string, key?: number, data?: object) {
    let file = event.currentTarget.files;
    if (file.length > 0) {
      if (type == "exposure") {
        let files = Array.from(file);
        files.forEach((file) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            setExposureImages((state) => [...state, { file: file, imageUrl: reader.result.toString() }]);
          };
          reader.readAsDataURL(file);
        });
      } else if (type == "exposure_menu") {
        let items = [...exposureMenu];
        let item = items[key];

        let files = Array.from(file);
        let reader = new FileReader();
        reader.onloadend = () => {
          item.file.file = files[0];
          item.file.imageUrl = reader.result.toString();

          items[key] = item;

          setExposureMenu([...items]);
        };
        reader.readAsDataURL(files[0]);
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

  function changePreviewImg(idx: number) {
    const el = document.getElementById("exposure_img");
    el.setAttribute("src", exposureImages[idx].imageUrl);
  }

  function setMenuData(e, idx: number, type: string, menu_idx?: number) {
    e.preventDefault();
    let items = [...entireMenu];
    let item = items[idx];
    if (type == "category") {
      item.category = e.target.value;
    } else {
      item.menu[menu_idx][type] = e.target.value;
    }
    items[idx] = item;
    setEntireMenu([...items]);
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
      comment: "",
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

  function deleteExposureMenu(idx: number) {
    let items = exposureMenu;

    items.splice(idx, 1);

    setExposureMenu([...items]);
  }

  function deleteEntireMenuCategory(idx: number) {
    let items = entireMenu;

    items.splice(idx, 1);

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
  }

  function inputExposureMenu(e, idx: number, type: string) {
    const value = e.target.value;
    let items = exposureMenu;
    let item = items[idx];
    item[type] = value;

    items[idx] = item;
    setExposureMenu([...items]);
  }

  function addRestaurant() {
    // 예외 처리
    let notice: string = "";
    if (title.length <= 0) {
      notice = "식당 이름을 입력해주세요";
    } else if (intro.length <= 0) {
      notice = "식당 소개 입력해주세요";
    } else if (exposureImages.length <= 0) {
      notice = "대표 이미지를 1개이상 등록해주세요";
    } else if (exposureMenu.length <= 0) {
      notice = "대표 메뉴를 1개이상 등록해주세요";
    } else if (address.road_address.length <= 0) {
      notice = "주소를 등록해주세요";
    } else if (address.detail_address.length <= 0) {
      notice = "상세 주소를 입력해주세요";
    }

    if (notice.length > 0) {
      alert(notice);
      return false;
    }

    let exposure_menu = [];
    for (let i = 0, leng = exposureMenu.length; i < leng; i++) {
      exposure_menu.push({
        comment: exposureMenu[i].comment,
        label: exposureMenu[i].label,
        price: exposureMenu[i].price,
      });
    }

    const data = {
      label: title,
      bname: address.bname,
      building_name: address.building_name,
      detail_address: address.detail_address,
      road_address: address.road_address,
      sido: address.sido,
      sigungu: address.sigungu,
      zonecode: address.zonecode,
      entireMenu,
      exposureMenu: exposure_menu,
      introduction: intro,
    };

    fetchPostApi("/restaurant/add", data).then((res: { restaurant_id: number; exposure_menu: object[] }) => {
      const res_restaraunt_id = res.restaurant_id;
      const res_exposure_menu: any = res.exposure_menu;

      let exposure_images = new FormData();
      let exposure_menu_images = new FormData();
      for (let i = 0, leng = exposureImages.length; i < leng; i++) {
        const file_name_arr = exposureImages[i].file.name.split(".");
        const file_extention = file_name_arr[file_name_arr.length - 1];
        const new_file = new File([exposureImages[i].file], `${res_restaraunt_id}_${i}.${file_extention}`, {
          type: "image/jpeg",
        });
        exposure_images.append(`files_${i}`, new_file);
      }

      for (let i = 0, leng = res_exposure_menu.length; i < leng; i++) {
        const file_name_arr = exposureMenu[i].file.file.name.split(".");
        const file_extention = file_name_arr[file_name_arr.length - 1];
        const menu_idx = exposureMenu.findIndex((menu) => {
          return menu.label == res_exposure_menu[i].label;
        });

        const new_file = new File(
          [exposureMenu[menu_idx].file.file],
          `${res_restaraunt_id}_${res_exposure_menu[i].id}.${file_extention}`,
          { type: "image/jpeg" }
        );
        exposure_menu_images.append(`files_${i}`, new_file);
      }
      exposure_images.append("length", exposureImages.length.toString());
      exposure_images.append("category", "1");
      exposure_menu_images.append("length", exposureMenu.length.toString());
      exposure_menu_images.append("category", "11");

      fetchFileApi("/upload/image/multi", exposure_images).then((res) => console.log(res, "1"));
      fetchFileApi("/upload/image/multi", exposure_menu_images).then((res) => console.log(res, "2"));
    });

    console.log(data);
  }

  return (
    <>
      <div className={styles.test}>
        <div className={styles.page_wrap}>
          <div id="slider_wrap" className={styles.slider_wrap}>
            <div className={styles.page}>
              <h1>노출 페이지</h1>
              <div className={res_style.rest_preview}>
                <div className={res_style.list} style={{ cursor: "unset" }}>
                  <ImageBox
                    type="restaurant"
                    src={exposureImages.length > 0 ? exposureImages[0].imageUrl : null}
                    alt="exposure_image"
                    imgId="exposure_img"
                  >
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
                  </ImageBox>
                  <LabelBox
                    title={title ? title : "식당 이름을 입력해주세요."}
                    address={address.bname ? `${address.sigungu} ${address.bname}` : "장소를 등록해주세요."}
                    type="restaurant"
                  />
                </div>
                <div className={res_style.rest_img_container}>
                  {exposureImages.length == 0
                    ? null
                    : exposureImages.map((data, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => changePreviewImg(index)}
                          onMouseEnter={() => toggleButton([`exposure_image_del_btn_${index}`], "enter")}
                          onMouseLeave={() => toggleButton([`exposure_image_del_btn_${index}`], "leave")}
                        >
                          <TiDelete
                            id={`exposure_image_del_btn_${index}`}
                            className={styles.delete_btn}
                            onClick={() => deleteEntireMenuCategory(index)}
                          />
                          <div>
                            <img src={data.imageUrl} alt="exposure_image" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <form className={styles.form_box} id="preview_images">
                <UploadButton
                  title={exposureImages.length == 0 ? "대표이미지 업로드" : "대표이미지 수정"}
                  onClick={() =>
                    dispatch(
                      actions.setUploadModalVisible({
                        visible: true,
                        title: exposureImages.length == 0 ? "대표이미지 업로드" : "대표이미지 수정",
                        target: "exposure",
                        multiple: true,
                        image_type: "restaurant"
                      })
                    )
                  }
                />
                <h3>식당 이름</h3>
                <input
                  type="text"
                  placeholder="식당 이름을 입력해주세요."
                  className={styles.custom_input}
                  style={{ marginBottom: "16px" }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <h3>주소</h3>
                <div className={styles.with_btn} style={{ marginBottom: "4px" }}>
                  <input
                    type="text"
                    placeholder="우편번호"
                    className={styles.custom_input}
                    value={address.zonecode ?? ""}
                    disabled
                  />
                  <div onClick={() => setPopupVisible(true)}>우편번호 찾기</div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="도로명 주소"
                    className={styles.custom_input}
                    style={{ marginBottom: "4px" }}
                    value={address.road_address ?? ""}
                    disabled
                  />
                  <input
                    type="text"
                    placeholder="참고항목"
                    className={styles.custom_input}
                    style={{ marginBottom: "4px" }}
                    value={address.building_name ? `(${address.building_name})` : ""}
                    disabled
                  />
                </div>
                <input
                  type="text"
                  placeholder="상세주소"
                  className={styles.custom_input}
                  style={{ marginBottom: "4px" }}
                  value={address.detail_address}
                  onChange={(e) => updateDetailAddress(e)}
                />
              </form>
            </div>
            <div className={styles.page}>
              <h1>상세 페이지</h1>
              <div style={{ marginBottom: "3rem" }}>
                <h2>소개</h2>
                <CustomTextarea
                  placeholder="식당에 대해 자유롭게 작성해주시길 바랍니다."
                  onChange={(e) => setIntro(e.target.value)}
                  height="15rem"
                />
              </div>
              <div>
                <h2>메뉴</h2>
                <div className={res_style.rest_menu}>
                  <div className={res_style.rest_menu_title}>
                    <h3>대표 메뉴</h3>
                    <Tooltip title="클릭하여 대표메뉴를 추가할 수 있습니다. (최대 5개)" placement="top">
                      <IconButton onClick={() => addExposureMenu()}>
                        <HiPlusCircle />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <ul className={res_style.rest_menu_wrap} style={{ border: "1px solid #e3e3e3" }}>
                    {exposureMenu.map((data, index) => {
                      return (
                        <li
                          className={res_style.rest_exposure_menu}
                          key={`exposure_menu_${index}`}
                          onMouseEnter={() => toggleButton([`exposure_del_btn_${index}`], "enter")}
                          onMouseLeave={() => toggleButton([`exposure_del_btn_${index}`], "leave")}
                        >
                          <div className={res_style.rest_menu_circle}></div>
                          <div className={res_style.rest_exposure_menu_imgbox}>
                            <label htmlFor={`exposure_menu_img_${index}`}>
                              {data.file.file == null ? (
                                <span>이미지</span>
                              ) : (
                                <div className={res_style.rest_exposure_menu_img_wrap}>
                                  <img src={data.file.imageUrl} alt="exposure_menu_image" />
                                </div>
                              )}
                            </label>
                            <input
                              type="file"
                              onChange={(e) => uploadImage(e, "exposure_menu", index)}
                              id={`exposure_menu_img_${index}`}
                            />
                          </div>
                          <div className={res_style.rest_exposure_menu_textbox}>
                            <input
                              type="text"
                              placeholder="메뉴 이름을 입력해주세요."
                              onChange={(e) => inputExposureMenu(e, index, "label")}
                              value={data.label}
                            />
                            <div style={data.price.length > 0 ? { paddingRight: "8px" } : null}>
                              <input
                                type="text"
                                placeholder="메뉴 가격을 입력해주세요."
                                onChange={(e) => inputExposureMenu(e, index, "price")}
                                value={data.price}
                              />
                              {data.price.length > 0 ? "원" : null}
                            </div>
                            <input
                              type="text"
                              placeholder="한 줄 설명을 입력해주세요."
                              onChange={(e) => inputExposureMenu(e, index, "comment")}
                              value={data.comment}
                            />
                          </div>
                          <TiDelete
                            id={`exposure_del_btn_${index}`}
                            className={styles.delete_btn}
                            onClick={() => deleteExposureMenu(index)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                  <div className={res_style.rest_menu_title}>
                    <h3>전체 메뉴</h3>
                    <Tooltip title="클릭하여 카테고리를 추가할 수 있습니다. (최대 5개)" placement="top">
                      <IconButton onClick={() => addEntireCategory()}>
                        <HiPlusCircle />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <ul className={res_style.rest_menu_wrap}>
                    {entireMenu.map((data, idx) => {
                      return (
                        <li
                          className={res_style.rest_entire_menu}
                          key={`entire_category_${idx}`}
                          onMouseEnter={() => toggleButton([`menu_add_btn_${idx}`, `category_del_btn_${idx}`], "enter")}
                          onMouseLeave={() => toggleButton([`menu_add_btn_${idx}`, `category_del_btn_${idx}`], "leave")}
                        >
                          <div className={res_style.rest_menu_circle}></div>
                          <input
                            type="text"
                            placeholder="이 곳에 카테고리 이름을 입력해주세요."
                            value={data.category}
                            onChange={(e) => setMenuData(e, idx, "category")}
                          />
                          <TiDelete
                            id={`category_del_btn_${idx}`}
                            className={styles.delete_btn}
                            onClick={() => deleteEntireMenuCategory(idx)}
                          />
                          <Tooltip title="클릭하여 메뉴를 추가할 수 있습니다." placement="bottom">
                            <IconButton id={`menu_add_btn_${idx}`} onClick={() => addEntireMenu(idx)}>
                              <HiOutlinePlusCircle />
                            </IconButton>
                          </Tooltip>
                          <ul>
                            {data.menu.map((menu, menu_idx) => {
                              return (
                                <li
                                  className={res_style.rest_entire_menu_detail}
                                  key={`entire_menu_${menu_idx}`}
                                  onMouseEnter={() => toggleButton([`menu_del_btn_${idx}_${menu_idx}`], "enter")}
                                  onMouseLeave={() => toggleButton([`menu_del_btn_${idx}_${menu_idx}`], "leave")}
                                >
                                  <div className={res_style.rest_menu_circle}></div>
                                  <input
                                    type="text"
                                    placeholder="메뉴 이름을 입력해주세요."
                                    value={menu.label}
                                    onChange={(e) => setMenuData(e, idx, "label", menu_idx)}
                                  />
                                  <div
                                    className={res_style.rest_entire_menu_price}
                                    style={menu.price.length > 0 ? { paddingRight: "56px" } : null}
                                  >
                                    <input
                                      type="text"
                                      placeholder="메뉴 가격을 입력해주세요."
                                      value={menu.price}
                                      onChange={(e) => setMenuData(e, idx, "price", menu_idx)}
                                    />{" "}
                                    {menu.price.length > 0 ? "원" : null}
                                  </div>
                                  <TiDelete
                                    id={`menu_del_btn_${idx}_${menu_idx}`}
                                    className={styles.delete_btn}
                                    onClick={() => deleteEntireMenu(idx, menu_idx)}
                                  />
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
              <div className={styles.registration_btn}>
                <span onClick={() => addRestaurant()}>등록</span>
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
          {curPage == "detail" ? <HiChevronDoubleLeft /> : <HiChevronDoubleRight />}
          <p style={{ margin: "0 12px", display: "block" }}>{curPage == "detail" ? "뒤로가기" : "상세페이지 등록"}</p>
        </div>
      </div>
      <PostCode
        hideModal={() => setPopupVisible(false)}
        visible={popupVisible}
        complete={(data) => updateAddress(data)}
      />
      <UploadModal onChange={(e, target) => uploadImage(e, target)} />
    </>
  );
};

export default Service;
