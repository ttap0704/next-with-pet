import React, { useEffect, useState } from "react";
import color from "../../accom_style/color.module.scss";
import accom_style from "../../styles/pages/accommodation.module.scss"
import { useRouter } from "next/router";
import { fetchGetApi } from "../../src/tools/api";
import { HiChevronUp } from "react-icons/hi";

const Detail = () => {
  const router = useRouter();
  const id = router.query.id;
  const [exposureImages, setExposureImages] = useState([]);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [introduction, setIntroduction] = useState("");
  useEffect(() => {
    fetchGetApi(`/accommodation/${id}`).then((data) => {
      console.log(data);
      setExposureImages([...data.accommodation_images]);
      setTitle(data.label);
      setAddress(`${data.sigungu} ${data.bname}`);
      setIntroduction(data.introduction);

    });
    return () => { };
  }, []);


  // function showEntireMenu(idx: number) {
  //   const icon: HTMLElement = document.getElementById(`entire_menu_category_icon_${idx}`);
  //   const list: HTMLElement = document.getElementById(`entire_menu_list_${idx}`);

  //   if (list.style.display == "none") {
  //     list.style.display = "block";
  //     icon.style.transform = "rotate(0deg)"
  //   } else {
  //     list.style.display = "none";
  //     icon.style.transform = "rotate(180deg)"
  //   }
  // }

  const preview = () => {
    return (
      <>
        <div
          id="detail_slider_wrap"
        // className={accom_style.detail_img}
        // style={{ backgroundImage: `url(${previewFile.imageUrl})` }}
        // onMouseEnter={() => toggleDetailImageSlider("enter")}
        // onMouseLeave={() => toggleDetailImageSlider("leave")}
        >
          {/* {previewFile.file == null ? (
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
                  ) : null} */}
          <div className={accom_style.detail_room_slider}>
            {/* <HiChevronLeft
                      style={{ width: "3rem", height: "3rem" }}
                      onClick={() => detailSlider("next")}
                    />
                    <HiChevronRight
                      style={{ width: "3rem", height: "3rem" }}
                      onClick={() => detailSlider("prev")}
                    /> */}
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
      </>
    );
  };

  return (
    <>
      <div className={accom_style.detail_warp}>
        {preview()}
      </div>
    </>
  );
};

export default Detail;
