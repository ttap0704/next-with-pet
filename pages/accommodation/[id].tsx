import React, {useEffect, useState} from "react";
import color from "../../accom_style/color.module.scss";
import accom_style from "../../styles/pages/accommodation.module.scss";
import {useRouter} from "next/router";
import {fetchGetApi} from "../../src/tools/api";
import {HiChevronRight} from "react-icons/hi";
import {toggleButton} from "../../src/tools/common";
import ImageBox from "../../src/components/ImageBox";
import LabelBox from "../../src/components/LabelBox";
import ImageSlider from "../../src/components/ImageSlider";
import InfoModal from "../../src/components/InfoModal";

const Detail = () => {
  const router = useRouter();
  const id = router.query.id;
  const [exposureImages, setExposureImages] = useState([]);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [detailPreviewNum, setDetailPreviewNum] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalIndex, setInfoModalIndex] = useState(undefined);

  useEffect(() => {
    fetchGetApi(`/accommodation/${id}`).then((data) => {
      setExposureImages([...data.accommodation_images]);
      setTitle(data.label);
      setAddress(`${data.sigungu} ${data.bname}`);
      setIntroduction(data.introduction);

      let rooms = [...data.accommodation_rooms];
      for (let i = 0, leng = rooms.length; i < leng; i++) {
        rooms[i].cur_num = 0;
      }
      setRooms([...rooms]);
    });
    return () => {};
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
    const slider = document.getElementById(`room_image_${idx}`);
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

    slider.setAttribute("src", `http://localhost:3000/api/image/rooms/${item.rooms_images[item.cur_num].file_name}`);

    setRooms([...items]);
  }

  function setInfoModal(idx: number) {
    setInfoModalIndex(idx);
    setInfoModalVisible(true);
  }

  return (
    <>
      <div className={accom_style.detail_warp}>
        <ImageBox
          boxId="detail_slider_warp"
          imgId="exposure_image"
          onMouseEnter={() => toggleButton([`detail_room_slider`], "enter")}
          onMouseLeave={() => toggleButton([`detail_room_slider`], "leave")}
          src={
            exposureImages.length > 0
              ? `http://localhost:3000/api/image/accommodation/${exposureImages[0].file_name}`
              : null
          }
          alt="exposure_image"
          type="accommodation"
        >
          <ImageSlider
            id="detail_room_slider"
            sliderStyle={{width: "3rem", height: "3rem"}}
            onSlideLeft={() => detailSlider("prev")}
            onSlideRight={() => detailSlider("next")}
          />
        </ImageBox>
        <LabelBox title={title} address={address} type="accommodation" />
        <div className={accom_style.detail_contents}>
          <h2>식당 소개</h2>
          <div className={accom_style.detail_introduction}>{introduction}</div>
        </div>
        <div className={accom_style.detail_contents}>
          <h2>객실 정보</h2>
          {rooms.map((data, index) => {
            return (
              <div className={accom_style.detail_room} key={index}>
                <div className={accom_style.detail_room_info}>
                  <ImageBox
                    className={accom_style.detail_room_slider_wrap}
                    imgId={`room_image_${index}`}
                    type="room"
                    src={`http://localhost:3000/api/image/rooms/${data.rooms_images[0].file_name}`}
                    onMouseEnter={() => toggleButton([`detail_room_slider_${index}`], "enter")}
                    onMouseLeave={() => toggleButton([`detail_room_slider_${index}`], "leave")}
                  >
                    <ImageSlider
                      id={`detail_room_slider_${index}`}
                      sliderStyle={{width: "2.5rem", height: "2.5rem"}}
                      onSlideRight={() => roomSlider("next", index)}
                      onSlideLeft={() => roomSlider("prev", index)}
                    />
                  </ImageBox>
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
                <div className={accom_style.detail_room_util_box} style={{justifyContent: "flex-end"}}>
                  <span className={accom_style.detail_room_other_info} onClick={() => setInfoModal(index)}>
                    추가정보 확인
                    <HiChevronRight />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <InfoModal
        visible={infoModalVisible}
        parent_info={
          infoModalIndex == undefined
            ? null
            : {
                amenities: rooms[infoModalIndex].amenities,
                additional_info: rooms[infoModalIndex].additional_info,
              }
        }
        hideModal={() => setInfoModalVisible(false)}
        type="view"
      />
    </>
  );
};

export default Detail;
