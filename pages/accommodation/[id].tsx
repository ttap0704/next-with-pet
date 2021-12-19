import React, { useEffect, useState } from "react";
import color from "../../accom_style/color.module.scss";
import accom_style from "../../styles/pages/accommodation.module.scss"
import { useRouter } from "next/router";
import { fetchGetApi } from "../../src/tools/api";
import { HiChevronUp, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { toggleButton } from "../../src/tools/common";

const Detail = () => {
  const router = useRouter();
  const id = router.query.id;
  const [exposureImages, setExposureImages] = useState([]);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [detailPreviewNum, setDetailPreviewNum] = useState(0);

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

  function detailSlider(type: string) {
    const exposure_image = document.getElementById(`exposure_image`);
    let num = detailPreviewNum;
    if (type == "next") {
      num++;
    } else {
      num--;
    }

    if (num >= exposureImages.length) {
      num = 0;
    } else if (num < 0) {
      num = exposureImages.length - 1;
    }
    setDetailPreviewNum(num);
    exposure_image.setAttribute(
      "src",
      `http://localhost:3000/api/image/accommodation/${exposureImages[num].file_name}`
    );
  }


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
          className={accom_style.detail_img}
          onMouseEnter={() => toggleButton([`detail_room_slider`], "enter")}
          onMouseLeave={() => toggleButton([`detail_room_slider`], "leave")}
        >
          <img
            id="exposure_image"
            src={exposureImages.length > 0 ? `http://localhost:3000/api/image/accommodation/${exposureImages[0].file_name}` : nill}
            alt="exposure_image"
          />
          <div className={accom_style.detail_room_slider} id="detail_room_slider">
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
