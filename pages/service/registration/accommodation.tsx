import React, {
  useEffect,
  useState,
  useLayoutEffect,
  cloneElement,
} from "react";
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
  let [detailPreviewNum, setDetailPreviewNum] = useState(0);
  let [roomDetail, setRoomDetail] = useState([
    {
      key: "0",
      title: "",
      people: "",
      max_people: "",
      price: "",
      files: [],
      cur_num: 0,
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
    key?: string,
    data?: object
  ) {
    const detail_slider = document.getElementById(`detail_img_slider_${key}`);
    const detail_slider_wrap = document.getElementById(
      `room_slider_wrap_${key}`
    );
    let file = event.currentTarget.files;
    if (file.length > 0) {
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
      } else if (type == "detail") {
        let files = Array.from(file);
        files.forEach((file) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            setDetailPreview((state) => [
              ...state,
              { file: file, imageUrl: reader.result.toString() },
            ]);
          };
          reader.readAsDataURL(file);
        });
      } else {
        console.log(key, roomDetail, data);
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
          detail_slider_wrap.children[1].setAttribute(
            "style",
            "display: none;"
          );
        });
        detail_slider.style.width = `${files.length * 17}rem`;
        items[key] = item;
        setRoomDetail([...items]);
      }
    } else {
      switch (type) {
        case "exposure":
          setPreviewFile({ file: null, imageUrl: "" });
          break;
        case "room":
          console.log("room");
          let items = [...roomDetail];
          let item = items[key];
          item.files = [];
          items[key] = item;
          setRoomDetail([...items]);
          detail_slider.innerHTML = "";
          detail_slider_wrap.children[1].setAttribute(
            "style",
            "display: block;"
          );
          detail_slider.style.width = `100%`;
      }
    }
  }

  function inputHandler(e) {
    setTitle(e.target.value);
  }

  function toggleDetailImageSlider(type: string) {
    const slider = document.getElementById(`detail_slider_wrap`).children[0];
    if (detailPreview.length > 0) {
      if (type == "enter") {
        slider.setAttribute("style", "display: block");
      } else {
        slider.setAttribute("style", "display: none");
      }
    }
  }

  function toggleRoomImageSlider(idx: string, type: string) {
    const slider = document.getElementById(`room_slider_wrap_${idx}`)
      .children[2];
    if (slider.tagName == "DIV" && roomDetail[idx].files.length > 0) {
      if (type == "enter") {
        slider.setAttribute("style", "display: block");
      } else {
        slider.setAttribute("style", "display: none");
      }
    }
  }

  function detailSlider(type: string) {
    const slider = document.getElementById(`detail_slider_wrap`);
    let num = detailPreviewNum;
    console.log(slider);

    if (type == "next") {
      num++;
    } else {
      num--;
    }

    if (num >= detailPreview.length) {
      num = 0;
    } else if (num < 0) {
      num = detailPreview.length - 1;
    }
    setDetailPreviewNum(num);
    slider.setAttribute(
      "style",
      `background-image: url(${detailPreview[num].imageUrl})`
    );
  }

  function roomSlider(type: string, idx: string) {
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

    slider.children[
      item.cur_num - 1 < 0 ? item.files.length - 1 : item.cur_num - 1
    ].setAttribute("style", "display: none");
    slider.children[item.cur_num].setAttribute("style", "display: block");
    console.log(item.cur_num);

    items[idx] = item;
    setRoomDetail([...items]);
  }

  function addRoom() {
    setRoomDetail((state) => [
      ...state,
      {
        key: roomDetail.length.toString(),
        title: "",
        people: "",
        max_people: "",
        price: "",
        files: [],
        cur_num: 0,
      },
    ]);

    console.log(roomDetail);
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
                <div
                  id="detail_slider_wrap"
                  className={styles.detail_img}
                  style={{ backgroundImage: `url(${previewFile.imageUrl})` }}
                  onMouseEnter={() => toggleDetailImageSlider("enter")}
                  onMouseLeave={() => toggleDetailImageSlider("leave")}
                >
                  {previewFile.file == null ? (
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
                  <div className={styles.detail_room_slider}>
                    <HiChevronLeft
                      style={{ width: "3rem", height: "3rem" }}
                      onClick={() => detailSlider("next")}
                    />
                    <HiChevronRight
                      style={{ width: "3rem", height: "3rem" }}
                      onClick={() => detailSlider("prev")}
                    />
                  </div>
                </div>
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
                    multiple
                  ></input>
                  <span
                    style={{
                      color: "#666",
                      marginTop: "4px",
                      textAlign: "right",
                    }}
                  >
                    * 상세페이지의 대표이미지 설정입니다. <br />
                    추가로 이미지를 등록하실 수 있습니다. <br />
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
                {roomDetail.map((data) => {
                  return (
                    <div className={styles.detail_room} key={data.key}>
                      <div className={styles.detail_room_img}>
                        <div
                          className={styles.detail_room_slider_wrap}
                          id={`room_slider_wrap_${data.key}`}
                          onMouseEnter={() =>
                            toggleRoomImageSlider(data.key, "enter")
                          }
                          onMouseLeave={() =>
                            toggleRoomImageSlider(data.key, "leave")
                          }
                        >
                          <ul id={`detail_img_slider_${data.key}`}></ul>
                          <h3>객실 이미지를 등록해주세요.</h3>
                          <div className={styles.detail_room_slider}>
                            <HiChevronLeft
                              onClick={() => roomSlider("prev", data.key)}
                              style={{ width: "2.5rem", height: "2.5rem" }}
                            />
                            <HiChevronRight
                              onClick={() => roomSlider("next", data.key)}
                              style={{ width: "2.5rem", height: "2.5rem" }}
                            />
                          </div>
                        </div>
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
                            onChange={(e) =>
                              uploadImage(e, "room", data.key, data)
                            }
                            id="rooms_img"
                            multiple
                          ></input>
                        </div>
                      </div>
                      <div className={styles.detail_room_intro}>
                        <div className={styles.detail_room_explain}>
                          <label>객실명</label>
                          <input
                            type="text"
                            placeholder="객실명을 입력해주세요."
                            onChange={() => console.log("hi")}
                          />
                        </div>
                        <div className={styles.detail_room_explain}>
                          <label>기준 인원</label>
                          <input
                            type="text"
                            placeholder="기준 인원을 입력해주세요."
                            onChange={() => console.log("hi")}
                          />
                        </div>
                        <div className={styles.detail_room_explain}>
                          <label>최대 인원</label>
                          <input
                            type="text"
                            placeholder="최대 인원을 입력해주세요."
                            onChange={() => console.log("hi")}
                          />
                        </div>
                        <div className={styles.detail_room_explain}>
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
                <div className={styles.util_btn}>
                  <div onClick={addRoom}>객실 추가</div>
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
