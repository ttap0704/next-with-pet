import React, { useEffect, useState } from "react";
import styles from "../../../styles/pages/registration.module.scss";
import common from "../../../styles/common.module.scss";
import accom_style from "../../../styles/pages/accommodation.module.scss";
import { useRouter } from "next/router";
import { FaFileUpload } from "@react-icons/all-files/fa/FaFileUpload";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";
import { FaChevronLeft } from "@react-icons/all-files/fa/FaChevronLeft";

const Service = () => {
  const router = useRouter();
  let [curPage, setCurPage] = useState("exposure");
  let [title, setTitle] = useState("제목을 입력해주세요.");
  let [previewFile, setPreviewFile] = useState({
    file: null,
    imageUrl: "",
  });

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
    const distance = type == "exposure" ? "-60rem" : "0px";
    slider.style.transition = "500ms";
    slider.style.transform = `translate3d(${distance}, 0px, 0px)`;
  }

  function uploadPreview(event: React.ChangeEvent<HTMLInputElement>) {
    let reader = new FileReader();
    let file = event.currentTarget.files[0];
    if (file) {
      reader.onloadend = () => {
        setPreviewFile({ file: file, imageUrl: reader.result.toString() });
        console.log(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewFile({ file: null, imageUrl: "" });
    }
  }

  function inputHandler(e) {
    setTitle(e.target.value);
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
                    onChange={(e) => uploadPreview(e)}
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
              <form className={styles.form_box}>
                <input
                  type="text"
                  placeholder="제목을 입력해주세요."
                  className={styles.custom_input}
                  onChange={(e) => inputHandler(e)}
                ></input>
                <div>위치 선택 들어갈 자리!!!!!</div>
              </form>
            </div>
          </div>
        </div>
        <div
          id="slider_btn"
          className={styles.slider_btn}
          onClick={() => movePage(curPage)}
          style={{ marginRight: "-10rem", right: 0 }}
        >
          {curPage == "detail" ? <FaChevronLeft /> : null}
          <span style={{ margin: "0 12px" }}>
            {curPage == "detail" ? "뒤로가기" : "상세페이지 등록"}
          </span>
          {curPage == "exposure" ? <FaChevronRight /> : null}
        </div>
      </div>
    </>
  );
};

export default Service;
