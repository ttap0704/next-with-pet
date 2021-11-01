import React, { useEffect, useState, useLayoutEffect } from "react";
import styles from "../../../styles/pages/registration.module.scss";
import common from "../../../styles/common.module.scss";
import accom_style from "../../../styles/pages/accommodation.module.scss";
import { useRouter } from "next/router";
import { FaFileUpload } from "react-icons/fa";
import {
  HiChevronDoubleRight,
  HiChevronDoubleLeft,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

const Service = () => {
  const router = useRouter();
  let [curPage, setCurPage] = useState("exposure");
  let [title, setTitle] = useState("제목을 입력해주세요.");
  let [previewFile, setPreviewFile] = useState({
    file: null,
    imageUrl: "",
  });
  let [detailPreview, setDetailPreview] = useState([]);
  let [roomDetail, setRoomDetail] = useState([
    {
      title: "",
      people: "",
      max_people: "",
      price: "",
      files: [
        {
          file: null,
          imageUrl: "",
        },
      ],
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
    idx?: number
  ) {
    let file = event.currentTarget.files;
    if (file) {
      if (type == "exposure") {
        let reader = new FileReader();
        reader.onload = () => {
          setPreviewFile({ file: file[0], imageUrl: reader.result.toString() });
          setDetailPreview((state) => [
            ...state,
            { file: file[0], imageUrl: reader.result.toString() },
          ]);
        };
        reader.readAsDataURL(file[0]);
      } else {
        let files = Array.from(file);
        let items = [...roomDetail];
        let item = items[idx];
        files.forEach((file) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            if (item.files[0].file == null) {
              item.files[0].file = file;
              item.files[0].imageUrl = reader.result.toString();
            } else {
              item.files.push({
                file: file,
                imageUrl: reader.result.toString(),
              });
            }
          };
          reader.readAsDataURL(file);
        });
        items[idx] = item;
        setRoomDetail([...items]);
        console.log(roomDetail);
      }
    } else {
      switch (type) {
        case "exposure":
          setPreviewFile({ file: null, imageUrl: "" });
          break;
      }
    }
  }

  function inputHandler(e) {
    setTitle(e.target.value);
  }

  function toggleImageSlider(idx: number, type: string) {
    const slider = document.getElementById(
      `detail_img_slider_${idx}`
    ).lastElementChild;
    if (slider.tagName == "DIV") {
      if (type == "enter") {
        slider.setAttribute("style", "display: block");
      } else {
        slider.setAttribute("style", "display: none");
      }
    }
  }

  const preview = () => {
    return (
      <>
        <h2 style={{ marginBottom: "8px" }}>미리보기</h2>
        <div className={accom_style.list}>
          <div
            className={accom_style.list_img}
            style={{
              backgroundImage: `url(${previewFile.imageUrl})`,
              position: "relative",
            }}
          >
            {previewFile.file == null ? (
              <b
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "1.3rem",
                  color: "#666",
                }}
              >
                대표이미지를 업로드해주세요.
              </b>
            ) : null}
          </div>
          <div className={accom_style.list_text_container}>
            <div className={accom_style.list_text}>
              <h2>{title.length == 0 ? "제목을 입력해주세요." : title}</h2>
              <span className={accom_style.list_rating}>
                <span className={common.text_red}>5</span>/5 (1)
              </span>
              <p className={accom_style.list_location}>위치</p>
            </div>
            <div className={accom_style.list_deco}></div>
          </div>
        </div>
      </>
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
                  onChange={(e) => inputHandler(e)}
                ></input>
                <div>위치 선택 들어갈 자리!!!!!</div>
              </form>
            </div>
            <div className={styles.page}>
              <h1>상세 페이지</h1>
              <div>
                <h2>대표 이미지</h2>
                <div className={styles.detail_img}></div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    flexDirection: "column",
                  }}
                >
                  <label htmlFor="detail_img" className={common.file_input}>
                    대표이미지 업로드
                    <FaFileUpload />
                  </label>
                  <input
                    type="file"
                    onChange={(e) => uploadImage(e, "detail")}
                    id="detail_img"
                  ></input>
                  <span style={{ color: "#666", marginTop: "4px" }}>
                    * 상세페이지의 대표이미지 설정입니다.
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <h2>숙소 소개</h2>
                <textarea
                  className={styles.detail_intro}
                  placeholder="숙소에 대해 자유롭게 작성해주시길 바랍니다."
                />
              </div>
              <div>
                <h2>객실 정보</h2>
                {roomDetail.map((data, index) => {
                  return (
                    <div className={styles.detail_room} key={index}>
                      <div className={styles.detail_room_img}>
                        <ul
                          id={`detail_img_slider_${index}`}
                          onMouseEnter={() => toggleImageSlider(index, "enter")}
                          onMouseLeave={() => toggleImageSlider(index, "leave")}
                        >
                          {data.files[0].file == null ? (
                            <h3>객실 이미지를 등록해주세요.</h3>
                          ) : (
                            data.files.map((file, idx) => {
                              return (
                                <li key={idx}>
                                  <img src={file.imageUrl} alt="detail_image" />
                                </li>
                              );
                            })
                          )}
                          {data.files[index].file != null &&
                          data.files[index + 1].file != undefined ? (
                            <div className={styles.detail_room_slider}>
                              <HiChevronLeft />
                              <HiChevronRight />
                            </div>
                          ) : null}
                        </ul>
                        <div>
                          <label
                            htmlFor="rooms_img"
                            className={common.file_input}
                          >
                            객실이미지 업로드
                            <FaFileUpload />
                          </label>
                          <input
                            type="file"
                            onChange={(e) => uploadImage(e, "room", index)}
                            id="rooms_img"
                            multiple
                          ></input>
                        </div>
                      </div>
                      <div className={styles.detail_room_intro}>
                        <div className={styles.detailr_room_explain}>
                          <label>객실명</label>
                          <input
                            type="text"
                            placeholder="객실명을 입력해주세요."
                            onChange={() => console.log("hi")}
                          />
                        </div>
                        <div className={styles.detailr_room_explain}>
                          <label>기준 인원</label>
                          <input
                            type="text"
                            placeholder="기준 인원을 입력해주세요."
                            onChange={() => console.log("hi")}
                          />
                        </div>
                        <div className={styles.detailr_room_explain}>
                          <label>최대 인원</label>
                          <input
                            type="text"
                            placeholder="최대 인원을 입력해주세요."
                            onChange={() => console.log("hi")}
                          />
                        </div>
                        <div className={styles.detailr_room_explain}>
                          <label>가격</label>
                          <input
                            type="text"
                            placeholder="가격을 입력해주세요."
                            onChange={() => console.log("hi")}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className={styles.add_room_btn}>객실 추가</div>
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
