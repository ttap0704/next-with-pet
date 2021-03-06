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
import {setSlideNumber} from "../../src/tools/common";

const Detail = ({list}) => {
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
    console.log(list);
    // fetchGetApi(`/accommodation/${id}`).then((data) => {
    setExposureImages([...list.accommodation_images]);
    setTitle(list.label);
    setAddress(`${list.sigungu} ${list.bname}`);
    setIntroduction(list.introduction);

    let rooms = [...list.accommodation_rooms];
    for (let i = 0, leng = rooms.length; i < leng; i++) {
      rooms[i].cur_num = 0;
    }
    setRooms([...rooms]);
    // });
    return () => {};
  }, []);

  async function detailSlider(type: string) {
    const num = await setSlideNumber(detailPreviewNum, type, exposureImages.length);
    setDetailPreviewNum(num);
  }

  async function roomSlider(type: string, idx: number) {
    let items = [...rooms];
    let item = items[idx];

    item.cur_num = await setSlideNumber(item.cur_num, type, item.rooms_images.length);
    items[idx] = item;

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
              ? `http://localhost:3000/api/image/accommodation/${exposureImages[detailPreviewNum].file_name}`
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
          <h2>?????? ??????</h2>
          <div className={accom_style.detail_introduction}>{introduction}</div>
        </div>
        <div className={accom_style.detail_contents}>
          <h2>?????? ??????</h2>
          {rooms.map((data, index) => {
            return (
              <div className={accom_style.detail_room} key={index}>
                <div className={accom_style.detail_room_info}>
                  <ImageBox
                    className={accom_style.detail_room_slider_wrap}
                    imgId={`room_image_${index}`}
                    type="rooms"
                    src={`http://localhost:3000/api/image/rooms/${data.rooms_images[data.cur_num].file_name}`}
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
                      <span>?????????</span>
                      <span>{data.label}</span>
                    </div>
                    <div className={accom_style.detail_room_explain}>
                      <span>?????? ??????</span>
                      <span>{data.standard_num} ???</span>
                    </div>
                    <div className={accom_style.detail_room_explain}>
                      <span>?????? ??????</span>
                      <span>{data.maximum_num} ???</span>
                    </div>
                    <div className={accom_style.detail_room_explain}>
                      <span>??????</span>
                      <span>{data.price.toLocaleString()} ???</span>
                    </div>
                  </div>
                </div>
                <div className={accom_style.detail_room_util_box} style={{justifyContent: "flex-end"}}>
                  <span className={accom_style.detail_room_other_info} onClick={() => setInfoModal(index)}>
                    ???????????? ??????
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

export async function getStaticPaths() {
  const list = await fetchGetApi(`/accommodation`);
  const paths = list.map((item) => ({
    params: {id: item.id},
  }));

  return {paths, fallback: false};
}

export async function getStaticProps({params}) {
  console.log(params)
  const list = await fetch(`http://localhost:3000/accommodation/${params.id}`);

  return {props: {list}};
}


export default Detail;
