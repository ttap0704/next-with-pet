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
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    fetchGetApi(`/accommodation/${id}`).then((data) => {
      console.log(data);
      setExposureImages([...data.accommodation_images]);
      setTitle(data.label);
      setAddress(`${data.sigungu} ${data.bname}`);
      setIntroduction(data.introduction);
      setRooms([...data.accommodation_rooms])
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


  function roomSlider(type: string, idx: number) {
    const slider = document.getElementById(`detail_img_slider_${idx}`);
    let items = [...rooms];
    let item = items[idx];
    
    if (!item.cur_num) {
      item.cur_num = 0;
    }

    if (type == "next") {
      item.cur_num++;
    } else {
      item.cur_num--;
    }

    if (item.cur_num >= item.rooms_images.length) {
      item.cur_num = 0;
    } else if (item.cur_num < 0) {
      item.cur_num = item.rooms_images.length - 1;
    }

    slider.children[
      item.cur_num - 1 < 0 ? item.rooms_images.length - 1 : item.cur_num - 1
    ].setAttribute("style", "display: none");
    slider.children[item.cur_num].setAttribute("style", "display: block");

    items[idx] = item;
    setRooms([...items]);
  }

  const preview = () => {
    return (
      <>
        <div
          id="detail_slider_wrap"
          className={accom_style.detail_img}
          onMouseEnter={() => toggleButton([`detail_room_slider`], "enter")}
          onMouseLeave={() => toggleButton([`detail_room_slider`], "leave")}
          style={{ marginBottom: '0' }}
        >
          <img
            id="exposure_image"
            src={exposureImages.length > 0 ? `http://localhost:3000/api/image/accommodation/${exposureImages[0].file_name}` : null}
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
        <div className={accom_style.list_text_container}>
          <div className={accom_style.list_text}>
            <h2>{title}</h2>
            <span className={accom_style.list_rating}>
              {address}
            </span>
          </div>
          <div className={accom_style.list_deco}></div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={accom_style.detail_warp}>
        {preview()}
        <div className={accom_style.detail_contents}>
          <h2>식당 소개</h2>
          <div className={accom_style.detail_introduction}>{introduction}</div>
        </div>
        <div className={accom_style.detail_contents}>
          <h2>객실 정보</h2>
          {rooms.map((data, index) => {
            return (
              <div className={accom_style.detail_room} key={index} style={{height: '19rem'}}>
                <div className={accom_style.detail_room_img}>
                  <div
                    className={accom_style.detail_room_slider_wrap}
                    id={`room_slider_wrap_${index}`}
                    onMouseEnter={() =>
                      data.rooms_images.length > 0 ?
                        toggleButton([`detail_room_slider_${index}`], "enter") :
                        null
                    }
                    onMouseLeave={() =>
                      data.rooms_images.length > 0 ?
                        toggleButton([`detail_room_slider_${index}`], "leave") :
                        null
                    }
                  >
                    <ul id={`detail_img_slider_${index}`}>
                      {data.rooms_images.map(data => {
                        return (
                          <li key={data.id}>
                            <img src={`http://localhost:3000/api/image/rooms/${data.file_name}`} alt="rooms_images" />
                          </li>
                        )
                      })}
                    </ul>
                    <div className={accom_style.detail_room_slider} id={`detail_room_slider_${index}`}>
                      <HiChevronLeft
                        onClick={() => roomSlider("prev", index)}
                        style={{ width: "2.5rem", height: "2.5rem" }}
                      />
                      <HiChevronRight
                        onClick={() => roomSlider("next", index)}
                        style={{ width: "2.5rem", height: "2.5rem" }}
                      />
                    </div>
                  </div>
                </div>
                <div className={accom_style.detail_room_intro}>
                  <div className={accom_style.detail_room_explain}>
                    <span>객실명</span>
                    <span>{data.label}</span>
                  </div>
                  <div className={accom_style.detail_room_explain}>
                    <span>기준 인원</span>
                    <span>{data.standard_num} 명</span>
                  </div>
                  <div className={accom_style.detail_room_explain}>
                    <span>최대 인원</span>
                    <span>{data.maximum_num} 명</span>
                  </div>
                  <div className={accom_style.detail_room_explain}>
                    <span>가격</span>
                    <span>{data.price.toLocaleString()} 원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Detail;
