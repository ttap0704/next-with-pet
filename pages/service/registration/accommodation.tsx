import React, {useEffect, useState, useLayoutEffect, cloneElement} from "react";
import styles from "../../../styles/pages/registration.module.scss";
import accom_style from "../../../styles/pages/accommodation.module.scss";
import {useRouter} from "next/router";
import {HiChevronDoubleRight, HiChevronDoubleLeft, HiChevronLeft, HiChevronRight} from "react-icons/hi";
import PostCode from "../../../src/components/PostCode";
import {fetchPostApi, fetchFileApi} from "../../../src/tools/api";
import {toggleButton} from "../../../src/tools/common";
import UploadButton from "../../../src/components/UploadButton";
import UploadModal from "../../../src/components/UploadModal";
import InfoModal from "../../../src/components/InfoModal";
import ImageSlider from "../../../src/components/ImageSlider";
import CustomTextarea from "../../../src/components/CustomTextarea";
import CustomInput from "../../../src/components/CustomInput";
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
  const [detailModalVisible, setInfoModalVisible] = useState(false);
  const [detailModalIndex, setInfoModalIndex] = useState(undefined)
  const [roomDetail, setRoomDetail] = useState([
    {
      title: "",
      people: "",
      max_people: "",
      price: "",
      files: [],
      cur_num: 0,
      other_info: {
        amenities: "",
        additional_info: "",
      },
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

  function showPostCode(e:React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setPopupVisible(true)
  }

  function setInfoModal(idx: number) {
    setInfoModalIndex(idx);
    setInfoModalVisible(true);
  }

  function setAdditionalInfo(info: {amenities: string[], additional_info: string[]}) {
    let items = [...roomDetail];
    let item = items[detailModalIndex];

    item.other_info.amenities = info.amenities.length > 0 ? info.amenities.toString() : "";
    item.other_info.additional_info = info.additional_info.length > 0 ? info.additional_info.toString() : "";

    items[detailModalIndex] = item;

    setRoomDetail([...items]);
    setInfoModalVisible(false)
    setInfoModalIndex(undefined)
  }

  function addAccommodation() {
    let rooms = [];
    for (let i = 0, leng = roomDetail.length; i < leng; i++) {
      rooms.push({
        label: roomDetail[i].title,
        maximum_num: roomDetail[i].max_people,
        standard_num: roomDetail[i].people,
        price: roomDetail[i].price,
        amenities: roomDetail[i].other_info.amenities,
        additional_info: roomDetail[i].other_info.additional_info,
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

  function showUploadModal(target: string, idx?: number) {
    let files = [];
    if (target == "exposure") {
      if (previewFile.length > 0) {
        for (let x of previewFile) {
          files.push(x.file);
        }
      }
      dispatch(
        actions.pushFiles({
          files: files,
        })
      );
      dispatch(
        actions.setUploadModalVisible({
          visible: true,
          title: previewFile.length == 0 ? "대표이미지 업로드" : "대표이미지 수정",
          target: target,
          multiple: true,
          image_type: "accommodation",
        })
      );
    } else if (target == "rooms") {
      console.log(roomDetail[idx]);
      if (roomDetail[idx].files.length > 0) {
        for (let x of roomDetail[idx].files) {
          files.push(x.file);
        }
      }
      dispatch(
        actions.pushFiles({
          files: files,
        })
      );
      dispatch(
        actions.setUploadModalVisible({
          visible: true,
          title: "객실이미지 업로드",
          target: "room",
          target_idx: idx,
          multiple: true,
          image_type: "room",
        })
      );
    }
  }

  function uploadImage(files: File[], type: string, key?: number) {
    if (files.length > 0) {
      if (type == "exposure") {
        setPreviewFile([]);
        setDetailPreviewNum(0);
        files.forEach((file) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            setPreviewFile((state) => [...state, {file: file, imageUrl: reader.result.toString()}]);
          };
          reader.readAsDataURL(file);
        });
      } else {
        let file_arr = [];
        files.forEach((file) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            file_arr.push({
              file: file,
              imageUrl: reader.result.toString(),
            });

            setRoomDetail((state) => {
              return state.map((data, index) => {
                if (index != key) {
                  return data;
                } else {
                  return {
                    ...data,
                    files: [...file_arr],
                  };
                }
              });
            });
          };
          reader.readAsDataURL(file);
        });
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
    const img_tag: HTMLElement = document.getElementById(`room_image_${idx}`);
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

    img_tag.setAttribute("src", item.files[item.cur_num].imageUrl);

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
        other_info: {
          amenities: "",
          additional_info: "",
        },
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
                  ) : (
                    <b style={{position: "absolute", top: "1rem", right: "1rem", zIndex: 100}}>{`${
                      detailPreviewNum + 1
                    }/${previewFile.length}`}</b>
                  )}
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
                    title={previewFile.length == 0 ? "대표이미지 업로드" : "대표이미지 수정"}
                    onClick={() => showUploadModal("exposure")}
                  />
                </div>
                <h3>숙박업소 이름</h3>
                <CustomInput
                  placeholder="제목을 입력해주세요."
                  style={{marginBottom: "16px"}}
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
                <h3>주소</h3>
                <div className={styles.with_btn} style={{marginBottom: "4px"}}>
                  <CustomInput
                    placeholder="우편번호"
                    className={styles.custom_input}
                    value={address.zonecode ?? ""}
                    disabled={true}
                  />
                  <button onClick={(e) => showPostCode(e)}>우편번호 찾기</button>
                </div>
                <div>
                  <CustomInput
                    type="text"
                    placeholder="도로명 주소"
                    className={styles.custom_input}
                    style={{marginBottom: "4px"}}
                    value={address.road_address ?? ""}
                    disabled={true}
                  />
                  <CustomInput
                    type="text"
                    placeholder="참고항목"
                    className={styles.custom_input}
                    style={{marginBottom: "4px"}}
                    value={address.building_name ? `(${address.building_name})` : ""}
                    disabled={true}
                  />
                </div>
                <CustomInput
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
                <CustomTextarea
                  placeholder="숙소에 대해 자유롭게 작성해주시길 바랍니다."
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  height="15rem"
                />
              </div>
              <div>
                <h2>객실 정보</h2>
                {roomDetail.map((data, index) => {
                  return (
                    <div className={accom_style.detail_room} key={index}>
                      <div className={accom_style.detail_room_info}>
                        <ImageBox
                          className={accom_style.detail_room_slider_wrap}
                          imgId={`room_image_${index}`}
                          type="room"
                          src={data.files.length > 0 ? data.files[data.cur_num].imageUrl : null}
                          onMouseEnter={() =>
                            data.files.length > 0 ? toggleButton([`detail_room_slider_${index}`], "enter") : null
                          }
                          onMouseLeave={() =>
                            data.files.length > 0 ? toggleButton([`detail_room_slider_${index}`], "leave") : null
                          }
                        >
                          {data.files.length == 0 ? <h3>{data.files.length}</h3> : null}
                          <ImageSlider
                            id={`detail_room_slider_${index}`}
                            sliderStyle={{width: "2.5rem", height: "2.5rem"}}
                            onSlideRight={() => roomSlider("next", index)}
                            onSlideLeft={() => roomSlider("prev", index)}
                          />
                        </ImageBox>

                        <div className={accom_style.detail_room_intro}>
                          <div className={accom_style.detail_room_explain}>
                            <label>객실명</label>
                            <CustomInput
                              placeholder="객실명을 입력해주세요."
                              onChange={(e) => inputRoomsDetial(e, index, "title")}
                              align="right"
                              bottom={true}
                              width="calc(100% - 6rem)"
                            />
                          </div>
                          <div className={accom_style.detail_room_explain}>
                            <label>기준 인원</label>
                            <CustomInput
                              placeholder="기준 인원을 입력해주세요."
                              onChange={(e) => inputRoomsDetial(e, index, "people")}
                              align="right"
                              bottom={true}
                              width="calc(100% - 6rem)"
                            />
                          </div>
                          <div className={accom_style.detail_room_explain}>
                            <label>최대 인원</label>
                            <CustomInput
                              placeholder="최대 인원을 입력해주세요."
                              onChange={(e) => inputRoomsDetial(e, index, "max_people")}
                              align="right"
                              bottom={true}
                              width="calc(100% - 6rem)"
                            />
                          </div>
                          <div className={accom_style.detail_room_explain}>
                            <label>가격</label>
                            <CustomInput
                              placeholder="가격을 입력해주세요."
                              onChange={(e) => inputRoomsDetial(e, index, "price")}
                              align="right"
                              bottom={true}
                              width="calc(100% - 6rem)"
                            />
                          </div>
                        </div>
                      </div>
                      <div className={accom_style.detail_room_util_box}>
                        <UploadButton title="객실이미지 업로드" onClick={() => showUploadModal("rooms", index)} />
                        <button onClick={() => setInfoModal(index)}>추가 정보 입력</button>
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
      <InfoModal
        visible={detailModalVisible}
        parent_info={detailModalIndex == undefined ? null : roomDetail[detailModalIndex].other_info}
        hideModal={() => setInfoModalVisible(false)}
        onRegistered={(info) => setAdditionalInfo(info)}
        type="registration"
      />
    </>
  );
};

export default Service;
