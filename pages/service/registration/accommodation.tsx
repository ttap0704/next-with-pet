import React, { useEffect, useState } from "react";
import styles from "../../../styles/pages/registration.module.scss";
import common from "../../../styles/common.module.scss";
import accom_style from "../../../styles/pages/accommodation.module.scss";
import { useRouter } from "next/router";
import { relative } from "path/posix";

const Service = () => {
  const router = useRouter();
  let [title, setTitle] = useState("제목을 입력해주세요.");
  let [previewFile, setPreviewFile] = useState({
    file: null,
    imageUrl: "",
  });

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

  const preview = () => {
    return (
      <>
        <h2 style={{marginBottom: '8px'}}>미리보기</h2>
        <div className={accom_style.list}>
          <div
            className={accom_style.list_img}
            style={{
              backgroundImage: `url(${previewFile.imageUrl})`,
              position: "relative",
            }}
          >
            <b
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "1.3rem",
                color: "#e3e3e3s",
              }}
            >
              대표이미지를 선택해주세요.
            </b>
          </div>
          <div className={accom_style.list_text_container}>
            <div className={accom_style.list_text}>
              <h2>제목</h2>
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
      {preview()}
      <form className={styles.form_box}>
        <div style={{ height: "3rem" }} className={common.d_flex_center}>
          <label htmlFor="preview_img">대표이미지 선택</label>
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
        ></input>
        <textarea placeholder="내용을 입력해주세요"></textarea>
      </form>
    </>
  );
};

export default Service;
