import React, {useEffect, useState, useLayoutEffect, cloneElement} from "react";
import styles from "../../../styles/pages/registration.module.scss";
import common from "../../../styles/common.module.scss";
import accom_style from "../../../styles/pages/accommodation.module.scss";
import {useRouter} from "next/router";
import {FaFileUpload} from "react-icons/fa";
import {HiChevronDoubleRight, HiChevronDoubleLeft, HiChevronLeft, HiChevronRight} from "react-icons/hi";
import PostCode from "../../../src/components/Postcode";
import {fetchPostApi, fetchFileApi} from "../../../src/tools/api";
import {toggleButton} from "../../../src/tools/common";
import UploadButton from "../../../src/components/UploadButton";
import UploadModal from "../../../src/components/UploadModal";
import ImageSlider from "../../../src/components/ImageSlider";
import ImageBox from "../../../src/components/ImageBox";
import LabelBox from "../../../src/components/LabelBox";
import {actions} from "../../../reducers/common/upload";
import {useDispatch} from "react-redux";

const Service = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [popupVisible, setPopupVisible] = useState(false);
  const [curPage, setCurPage] = useState("exposure");
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [previewFile, setPreviewFile] = useState([]);
  const [detailPreviewNum, setDetailPreviewNum] = useState(0);
  const [roomDetail, setRoomDetail] = useState([
    {
      title: "",
      people: "",
      max_people: "",
      price: "",
      files: [],
      cur_num: 0,
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

  function addAccommodation() {
    let rooms = [];
    for (let i = 0, leng = roomDetail.length; i < leng; i++) {
      rooms.push({
        label: roomDetail[i].title,
        maximum_num: roomDetail[i].max_people,
        standard_num: roomDetail[i].people,
        price: roomDetail[i].price,
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
      introduction: intro,
      rooms,
    };

    fetchPostApi("/accommodation/add", data).then((res) => {
      const res_accommodation_id = res.accommodation_id;
      const res_rooms: any = res.rooms;

      let rooms_images_cnt = 0;

      let accommodation_images = new FormData();
      let rooms_images = new FormData();
      for (let i = 0, leng = previewFile.length; i < leng; i++) {
        const file_name_arr = previewFile[i].file.name.split(".");
        const file_extention = file_name_arr[file_name_arr.length - 1];
        const new_file = new File([previewFile[i].file], `${res_accommodation_id}_${i}.${file_extention}`, {
          type: "image/jpeg",
        });
        accommodation_images.append(`files_${i}`, new_file);
      }

      for (let i = 0, leng = roomDetail.length; i < leng; i++) {
        const room_idx = roomDetail.findIndex((room) => {
          return room.title == res_rooms[i].label;
        });
        const room_id = res_rooms[room_idx].id;
        for (let y = 0, yleng = roomDetail[i].files.length; y < yleng; y++) {
          const file_name_arr = roomDetail[i].files[y].file.name.split(".");
          const file_extention = file_name_arr[file_name_arr.length - 1];
          const new_file = new File(
            [roomDetail[i].files[y].file],
            `${res_accommodation_id}_${room_id}_${y}.${file_extention}`,
            {type: "image/jpeg"}
          );
          rooms_images.append(`files_${rooms_images_cnt}`, new_file);
          rooms_images_cnt++;
        }
      }
      accommodation_images.append("length", previewFile.length.toString());
      accommodation_images.append("category", "2");
      rooms_images.append("length", rooms_images_cnt.toString());
      rooms_images.append("category", "21");

      fetchFileApi("/upload/image/multi", accommodation_images).then((res) => console.log(res, "1"));
      fetchFileApi("/upload/image/multi", rooms_images).then((res) => console.log(res, "2"));
    });
  }

  function updateAddress(data: object) {
    if (data) {
      setPopupVisible(false);
      setAddress((state) => ({
        ...state,
        ...data,
      }));
    }
  }

  function movePage(type: string) {
    const slider_btn = document.getElementById("slider_btn");
    const __next: HTMLElement = document.getElementById("__next");
    if (type == "exposure") {
      setCurPage("detail");
      slider_btn.children[0].innerHTML = "뒤로가기";
      slider_btn.style.left = "0";
      slider_btn.style.right = "unset";
      slider_btn.style.marginLeft = "-12rem";
      slider_btn.style.marginRight = "0";
      __next.style.overflowY = "auto";
    } else {
      setCurPage("exposure");
      slider_btn.children[0].innerHTML = "상세페이지 등록";
      slider_btn.style.right = "0";
      slider_btn.style.left = "unset";
      slider_btn.style.marginRight = "-12rem";
      slider_btn.style.marginLeft = "0";
      __next.style.overflowY = "hidden";
    }
    const slider = document.getElementById("slider_wrap");
    const distance = type == "exposure" ? "-61rem" : "0px";
    slider.style.transition = "500ms";
    slider.style.transform = `translate3d(${distance}, 0px, 0px)`;
  }

  function uploadImage(event: React.ChangeEvent<HTMLInputElement>, type: string, key?: number) {
    const detail_slider = document.getElementById(`detail_img_slider_${key}`);
    const detail_slider_wrap = document.getElementById(`room_slider_wrap_${key}`);
    let file = event.currentTarget.files;
    if (file.length > 0) {
      if (type == "exposure") {
        let files = Array.from(file);
        files.forEach((file) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            setPreviewFile((state) => [...state, {file: file, imageUrl: reader.result.toString()}]);
          };
          reader.readAsDataURL(file);
        });
      } else {
        let files = Array.from(file);
        let items = [...roomDetail];
        let item = items[key];
        item.files = [];
        files.forEach((file) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            item.files.push({
              file: file,
              imageUrl: reader.result.toString(),
            });
            const li_tag = document.createElement("li");
            const image = document.createElement("img");
            image.setAttribute("src", reader.result.toString());
            li_tag.append(image);
            detail_slider.append(li_tag);
          };
          reader.readAsDataURL(file);
          detail_slider_wrap.children[1].setAttribute("style", "display: none;");
        });
        detail_slider.style.width = `${files.length * 17}rem`;
        items[key] = item;
        setRoomDetail([...items]);
      }
    } else {
      switch (type) {
        case "exposure":
          setPreviewFile([]);
          break;
        case "room":
          let items = [...roomDetail];
          let item = items[key];
          item.files = [];
          items[key] = item;
          setRoomDetail([...items]);
          detail_slider.innerHTML = "";
          detail_slider_wrap.children[1].setAttribute("style", "display: block;");
          detail_slider.style.width = `100%`;
      }
    }
  }

  function previewSlider(type: string) {
    const slider = document.getElementById(`exposure_slider_image`);
    let num = detailPreviewNum;
    if (type == "next") {
      num++;
    } else {
      num--;
    }

    if (num >= previewFile.length) {
      num = 0;
    } else if (num < 0) {
      num = previewFile.length - 1;
    }
    setDetailPreviewNum(num);
    slider.setAttribute("src", `${previewFile[num].imageUrl}`);
  }

  function roomSlider(type: string, idx: number) {
    const slider = document.getElementById(`detail_img_slider_${idx}`);
    let items = [...roomDetail];
    let item = items[idx];

    if (type == "next") {
      item.cur_num++;
    } else {
      item.cur_num--;
    }

    if (item.cur_num >= item.files.length) {
      item.cur_num = 0;
    } else if (item.cur_num < 0) {
      item.cur_num = item.files.length - 1;
    }

    slider.children[item.cur_num - 1 < 0 ? item.files.length - 1 : item.cur_num - 1].setAttribute(
      "style",
      "display: none"
    );
    slider.children[item.cur_num].setAttribute("style", "display: block");

    items[idx] = item;
    setRoomDetail([...items]);
  }

  function addRoom() {
    setRoomDetail((state) => [
      ...state,
      {
        title: "",
        people: "",
        max_people: "",
        price: "",
        files: [],
        cur_num: 0,
      },
    ]);
  }

  function inputRoomsDetial(e, idx: number, type: string) {
    let items = [...roomDetail];
    let item = items[idx];
    let value = e.target.value;

    item[type] = value;
    items[idx] = item;

    setRoomDetail([...items]);
  }

  function updateDetailAddress(e) {
    const val = e.target.value;
    setAddress((state) => ({
      ...state,
      detail_address: val,
    }));
  }

  return (
    <>
      <div className={styles.test}>
        <div className={styles.page_wrap}>
          <div id="slider_wrap" className={styles.slider_wrap}>
            <div className={styles.page}>
              <h1>노출 페이지</h1>
              <h2 style={{marginBottom: "8px"}}>미리보기</h2>
              <div className={accom_style.list} style={{cursor: "unset"}}>
                <ImageBox
                  src={previewFile.length ? `${previewFile[0].imageUrl}` : null}
                  alt="exposure_images"
                  type="accommodation"
                  imgId="exposure_slider_image"
                  onMouseEnter={() => toggleButton([`exposure_image_slider`], "enter")}
                  onMouseLeave={() => toggleButton([`exposure_image_slider`], "leave")}
                >
                  {previewFile.length == 0 ? (
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
                  <ImageSlider
                    id="exposure_image_slider"
                    sliderStyle={{width: "3rem", height: "3rem"}}
                    onSlideLeft={() => previewSlider("prev")}
                    onSlideRight={() => previewSlider("next")}
                  />
                </ImageBox>
                <LabelBox
                  title={title ? title : "식당 이름을 입력해주세요."}
                  address={address.bname ? `${address.sigungu} ${address.bname}` : "장소를 등록해주세요."}
                  type="accommodation"
                />
              </div>
              <form className={styles.form_box}>
                <div style={{marginBottom: "12px"}}>
                  <UploadButton
                    title="대표이미지 업로드"
                    onClick={() =>
                      dispatch(
                        actions.setUploadModalVisible({
                          visible: true,
                          title: "대표이미지 업로드",
                          target: "exposure",
                          multiple: true,
                        })
                      )
                    }
                  />
                </div>
                <h3>숙박업소 이름</h3>
                <input
                  type="text"
                  placeholder="제목을 입력해주세요."
                  style={{marginBottom: "16px"}}
                  className={styles.custom_input}
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                ></input>
                <h3>주소</h3>
                <div className={styles.with_btn} style={{marginBottom: "4px"}}>
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
                    style={{marginBottom: "4px"}}
                    value={address.road_address ?? ""}
                    disabled
                  />
                  <input
                    type="text"
                    placeholder="참고항목"
                    className={styles.custom_input}
                    style={{marginBottom: "4px"}}
                    value={address.building_name ? `(${address.building_name})` : ""}
                    disabled
                  />
                </div>
                <input
                  type="text"
                  placeholder="상세주소"
                  className={styles.custom_input}
                  style={{marginBottom: "4px"}}
                  value={address.detail_address}
                  onChange={(e) => updateDetailAddress(e)}
                />
              </form>
            </div>
            <div className={styles.page}>
              <h1>상세 페이지</h1>
              <div style={{marginBottom: "1rem"}}>
                <h2>숙소 소개</h2>
                <textarea
                  className={styles.detail_intro}
                  placeholder="숙소에 대해 자유롭게 작성해주시길 바랍니다."
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                />
              </div>
              <div>
                <h2>객실 정보</h2>
                {roomDetail.map((data, index) => {
                  return (
                    <div className={accom_style.detail_room} key={index}>
                      <div className={accom_style.detail_room_img}>
                        <div
                          className={accom_style.detail_room_slider_wrap}
                          id={`room_slider_wrap_${index}`}
                          onMouseEnter={() =>
                            data.files.length > 0 ? toggleButton([`detail_room_slider_${index}`], "enter") : null
                          }
                          onMouseLeave={() =>
                            data.files.length > 0 ? toggleButton([`detail_room_slider_${index}`], "leave") : null
                          }
                        >
                          <ul id={`detail_img_slider_${index}`}></ul>
                          <h3>객실 이미지를 등록해주세요.</h3>
                          <ImageSlider
                            id={`detail_room_slider_${index}`}
                            sliderStyle={{width: "2.5rem", height: "2.5rem"}}
                            onSlideRight={() => roomSlider("next", index)}
                            onSlideLeft={() => roomSlider("next", index)}
                          />
                        </div>
                        <div>
                          <UploadButton
                            title="객실이미지 업로드"
                            onClick={() =>
                              dispatch(
                                actions.setUploadModalVisible({
                                  visible: true,
                                  title: "객실이미지 업로드",
                                  target: "room",
                                  target_idx: index,
                                  multiple: true,
                                })
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className={accom_style.detail_room_intro}>
                        <div className={accom_style.detail_room_explain}>
                          <label>객실명</label>
                          <input
                            type="text"
                            placeholder="객실명을 입력해주세요."
                            onChange={(e) => inputRoomsDetial(e, index, "title")}
                          />
                        </div>
                        <div className={accom_style.detail_room_explain}>
                          <label>기준 인원</label>
                          <input
                            type="text"
                            placeholder="기준 인원을 입력해주세요."
                            onChange={(e) => inputRoomsDetial(e, index, "people")}
                          />
                        </div>
                        <div className={accom_style.detail_room_explain}>
                          <label>최대 인원</label>
                          <input
                            type="text"
                            placeholder="최대 인원을 입력해주세요."
                            onChange={(e) => inputRoomsDetial(e, index, "max_people")}
                          />
                        </div>
                        <div className={accom_style.detail_room_explain}>
                          <label>가격</label>
                          <input
                            type="text"
                            placeholder="가격을 입력해주세요."
                            onChange={(e) => inputRoomsDetial(e, index, "price")}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className={styles.util_btn}>
                  <div onClick={addRoom}>객실 추가</div>
                </div>
              </div>
              <div className={styles.registration_btn}>
                <span onClick={() => addAccommodation()}>등록</span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="slider_btn"
          className={styles.slider_btn}
          onClick={() => movePage(curPage)}
          style={{marginRight: "-10rem", right: 0}}
        >
          {curPage == "detail" ? <HiChevronDoubleLeft /> : <HiChevronDoubleRight />}
          <p style={{margin: "0 12px", display: "block"}}>{curPage == "detail" ? "뒤로가기" : "상세페이지 등록"}</p>
        </div>
      </div>
      {popupVisible ? (
        <div className={styles.postcode_back} onClick={() => setPopupVisible(false)}>
          <PostCode complete={(data) => updateAddress(data)} />
        </div>
      ) : null}
      <UploadModal onChange={(e, target, target_idx) => uploadImage(e, target, target_idx)} />
    </>
  );
};

export default Service;
