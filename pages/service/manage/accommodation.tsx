import styles from "../../../styles/pages/service.module.scss";
import accom_style from "../../../styles/pages/accommodation.module.scss";
import {RootState} from "../../../reducers";
import {useSelector, useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {ReactElement, useEffect, useState} from "react";
import {fetchGetApi} from "../../../src/tools/api";
import {Checkbox, Modal, TableCell, TableRow} from "@mui/material";
import {getDate} from "../../../src/tools/common";
import {Button} from "@mui/material";
import {HiX} from "react-icons/hi";

import CustomDropdown from "../../../src/components/CustomDrodown";
import CustomTable from "../../../src/components/CustomTable";
import EditModal from "../../../src/components/EditModal";
import PostCode from "../../../src/components/PostCode";
import UploadModal from "../../../src/components/UploadModal";
import ModalContainer from "../../../src/components/ModalContainer";
import ImageBox from "../../../src/components/ImageBox";
import CustomInput from "../../../src/components/CustomInput";
import ImageSlider from "../../../src/components/ImageSlider";

import {actions} from "../../../reducers/common/upload";

const EditAccommodation = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getTableItems("accommodation");
    getTableItems("rooms");
  }, []);

  const router = useRouter();
  const {uid} = useSelector((state: RootState) => state.userReducer);
  const [editModal, setEditModal] = useState({title: "", visible: false, value: "", type: ""});
  const [postCodeVisible, setPostCodeVisible] = useState(false);
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [addRoomContents, setAddRoomContents] = useState({
    files: [],
    info: {
      lable: "",
      standard_num: "",
      maximum_num: "",
      price: "",
      amenities: "",
      additional_info: "",
    },
  })

  const [contents, setContents] = useState({
    accommodation: {
      header: [
        {
          label: "",
          center: true,
        },
        {
          label: "이름",
          center: false,
        },
        {
          label: "주소",
          center: false,
        },
        {
          label: "방 개수",
          center: false,
        },
        {
          label: "소개",
          center: true,
        },
        {
          label: "등록일",
          center: false,
        },
      ],
      table_items: [],
      edit_items: ["객실 추가", "업소명 수정", "주소 수정", "소개 수정", "대표이미지 수정", "업소 삭제"],
      type: "accommodation",
      count: 0,
      title: "숙박업소 관리",
      button_disabled: true,
    },
    rooms: {
      header: [
        {
          label: "",
          center: true,
        },
        {
          label: "숙박 업소명",
          center: false,
        },
        {
          label: "객실명",
          center: false,
        },
        {
          label: "기준 인원",
          center: false,
        },
        {
          label: "추가 정보",
          center: true,
        },
      ],
      table_items: [],
      edit_items: ["객실명 수정", "추가 정보 수정", "인원 수정", "대표이미지 수정", "객실 삭제"],
      type: "rooms",
      count: 0,
      title: "객실 관리",
      button_disabled: true,
    },
  });

  function setChecked(idx: number, type: string, event_type: string, e?: React.ChangeEvent<HTMLInputElement>) {
    let checked = undefined;
    if (event_type == "change") {
      checked = e.target.checked;
    } else {
      checked = !contents[type].table_items[idx].checked;
    }

    setContents((state) => {
      return {
        ...state,
        [type]: {
          ...state[type],
          table_items: [
            ...state[type].table_items.map((data, index) => {
              if (checked) {
                if (index != idx) {
                  data.checked = false;
                  return data;
                } else {
                  data.checked = true;
                  return data;
                }
              } else {
                if (index == idx) {
                  data.checked = false;
                  return data;
                } else {
                  return data;
                }
              }
            }),
          ],
          button_disabled: !checked,
        },
      };
    });
  }

  function getTableItems(type: string, page?: number) {
    let page_num = 1;
    if (page) {
      page_num = page;
    }
    fetchGetApi(`/${type}?uid=1&page=${page_num}`).then((res) => {
      setContents((state) => {
        return {
          ...state,
          [type]: {
            ...state[type],
            count: res.count,
          },
        };
      });
      if (type == "accommodation") {
        for (let x of res.rows) {
          setContents((state) => {
            return {
              ...state,
              [type]: {
                ...state[type],
                table_items: [
                  ...state[type].table_items,
                  {
                    id: x.id,
                    bname: x.bname,
                    building_name: x.building_name,
                    detail_address: x.detail_address,
                    introduction: x.introduction,
                    label: x.label,
                    sido: x.sido,
                    sigungu: x.sigungu,
                    zonecode: x.zonecode,
                    rooms_num: x.accommodation_rooms.length,
                    created_at: x.createdAt,
                    images: x.accommodation_images,
                    checked: false,
                  },
                ],
              },
            };
          });
        }
      } else {
        let rooms_tmp = [];
        for (let x of res.rows) {
          x.checked = false;
          rooms_tmp.push({
            ...x,
          });
        }
        setContents((state) => {
          return {
            ...state,
            [type]: {
              ...state[type],
              table_items: [...rooms_tmp],
            },
          };
        });
      }
    });
  }

  function setTableCell(cell: string, idx: number, type: string) {
    let tag: ReactElement | string;
    if (type == "accommodation") {
      switch (cell) {
        case "":
          tag = (
            <Checkbox
              checked={contents.accommodation.table_items[idx].checked}
              onChange={(e) => setChecked(idx, "accommodation", "change", e)}
            ></Checkbox>
          );
          break;
        case "이름":
          tag = contents.accommodation.table_items[idx].label;
          break;
        case "주소":
          tag = `${contents.accommodation.table_items[idx].sido} ${contents.accommodation.table_items[idx].sigungu} ${contents.accommodation.table_items[idx].bname}`;
          break;
        case "방 개수":
          tag = contents.accommodation.table_items[idx].rooms_num;
          break;
        case "소개":
          tag = <Button>확인</Button>;
          break;
        case "등록일":
          tag = getDate(contents.accommodation.table_items[idx].created_at);
          break;
      }
    } else {
      switch (cell) {
        case "":
          tag = (
            <Checkbox
              checked={contents.rooms.table_items[idx].checked}
              onChange={(e) => setChecked(idx, "rooms", "change", e)}
            ></Checkbox>
          );
          break;
        case "숙박 업소명":
          tag = contents.rooms.table_items[idx].accommodation_label;
          break;
        case "객실명":
          tag = contents.rooms.table_items[idx].label;
          break;
        case "기준 인원":
          tag = contents.rooms.table_items[idx].standard_num;
          break;
        case "최대 인원":
          tag = contents.rooms.table_items[idx].maximum_num;
          break;
        case "추가 정보":
          tag = <Button>확인</Button>;
          break;
      }
    }

    return tag;
  }

  function handleDropdown(type: string, idx: number) {
    const target = contents[type].table_items.find((data) => {
      return data.checked == true;
    });

    if (type == "accommodation") {
      switch (idx) {
        case 0:
          setRoomModalVisible(true);
          break;
        case 1:
          setEditModal({title: "업소명 수정", visible: true, value: target.label, type: "input"});
          break;
        case 2:
          setPostCodeVisible(true);
          break;
        case 3:
          setEditModal({title: "소개 수정", visible: true, value: target.introduction, type: "textarea"});
          break;
        case 4:
          let files = [];
          for (let i = 0, leng = target.images.length; i < leng; i++) {
            fetch(`http://localhost:3000/api/image/accommodation/${target.images[i].file_name}`).then((res) => {
              res
                .blob()
                .then((blob) => {
                  files.push(blob);
                })
                .then(() => {
                  if (files.length == target.images.length) {
                    dispatch(
                      actions.pushFiles({
                        files: files,
                      })
                    );
                    dispatch(
                      actions.setUploadModalVisible({
                        visible: true,
                        title: "대표이미지 수정",
                        target: type,
                        multiple: true,
                        image_type: type,
                      })
                    );
                  }
                });
            });
          }
          break;
      }
    }
  }

  function updateAddress(data) {
    console.log(data);
  }

  function updateImages(files: Blob[], target: string) {
    console.log(files, target);
  }
  
  function changeRoomInfo(e:React.ChangeEvent<HTMLInputElement>, type: string) {
    const value = e.target.value;
    setAddRoomContents(state => {
      console.log(state.info[type])
      return {
        ...state,
        info: {
          ...state.info,
          [type]: value
        }
      }
    })
  }

  return (
    <div>
      {Object.keys(contents).map((key, idx) => {
        return (
          <div className={styles.manage_contents} key={`${contents[key].type}_content`}>
            <div className={styles.manage_title}>
              <h2>{contents[key].title}</h2>
              <CustomDropdown
                items={contents[key].edit_items}
                buttonDisabled={contents[key].button_disabled}
                type={key}
                onClick={(type, idx) => handleDropdown(type, idx)}
              />
            </div>
            <div style={{height: "28rem", width: "100%"}}>
              <CustomTable
                header={contents[key].header}
                footerColspan={6}
                rowsLength={contents[key].count}
                changePerPage={(page) => getTableItems(contents[key].type, page)}
              >
                {contents[key].table_items.map((data, index) => {
                  return (
                    <TableRow
                      key={`${contents[key].type}_row_${index}`}
                      onClick={() => setChecked(index, contents[key].type, "click")}
                    >
                      {contents[key].header.map((cell, index2) => {
                        return (
                          <TableCell
                            align={cell.center ? "center" : "left"}
                            key={`${contents[key].type}_cell_${index2}`}
                          >
                            {setTableCell(cell.label, index, contents[key].type)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </CustomTable>
            </div>
          </div>
        );
      })}
      <PostCode
        hideModal={() => setPostCodeVisible(false)}
        visible={postCodeVisible}
        complete={(data) => updateAddress(data)}
      />
      <EditModal
        visible={editModal.visible}
        title={editModal.title}
        value={editModal.value}
        type={editModal.type}
        hideModal={() => setEditModal({title: "", visible: false, value: "", type: ""})}
      />
      <UploadModal onChange={(files, target) => updateImages(files, target)} />
      <ModalContainer backClicked={() => setRoomModalVisible(false)} visible={roomModalVisible}>
        <div
          className={accom_style.detail_room}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60rem",
            backgroundColor: "#fff",
            height: 'auto'
          }}
        >
          <h2 className={styles.modal_title} style={{marginBottom: '1rem'}}>
            객실 추가
            <HiX onClick={() => setRoomModalVisible(false)} />
          </h2>
          <div className={accom_style.detail_room_info}>
            <ImageBox
              className={accom_style.detail_room_slider_wrap}
              imgId={`room_image`}
              type="room"
              // src={data.files.length > 0 ? data.files[data.cur_num].imageUrl : null}
              // onMouseEnter={() =>
              //   data.files.length > 0 ? toggleButton([`detail_room_slider_${index}`], "enter") : null
              // }
              // onMouseLeave={() =>
              //   data.files.length > 0 ? toggleButton([`detail_room_slider_${index}`], "leave") : null
              // }
            >
              {/* {data.files.length == 0 ? <h3>{data.files.length}</h3> : null} */}
              <ImageSlider
                id={`detail_room_slider`}
                sliderStyle={{width: "2.5rem", height: "2.5rem"}}
                // onSlideRight={() => roomSlider("next"}
                // onSlideLeft={() => roomSlider("prev"}
              />
            </ImageBox>

            <div className={accom_style.detail_room_intro}>
              <div className={accom_style.detail_room_explain}>
                {/* <label>객실명</label> */}
                <CustomInput
                  placeholder="객실명을 입력해주세요."
                  onChange={(e) => changeRoomInfo(e, "label")}
                  align="right"
                  bottom={true}
                  width="calc(100% - 6rem)"
                />
              </div>
              <div className={accom_style.detail_room_explain}>
                {/* <label>기준 인원</label> */}
                <CustomInput
                  placeholder="기준 인원을 입력해주세요."
                  onChange={(e) => changeRoomInfo(e, "standard_num")}
                  align="right"
                  bottom={true}
                  width="calc(100% - 6rem)"
                />
              </div>
              <div className={accom_style.detail_room_explain}>
                {/* <label>최대 인원</label> */}
                <CustomInput
                  placeholder="최대 인원을 입력해주세요."
                  onChange={(e) => changeRoomInfo(e, "maximum_num")}
                  align="right"
                  bottom={true}
                  width="calc(100% - 6rem)"
                />
              </div>
              <div className={accom_style.detail_room_explain}>
                {/* <label>가격</label> */}
                <CustomInput
                  placeholder="가격을 입력해주세요."
                  onChange={(e) => changeRoomInfo(e, "price")}
                  align="right"
                  bottom={true}
                  width="calc(100% - 6rem)"
                />
              </div>
            </div>
          </div>
          <div className={accom_style.detail_room_util_box}>
            {/* <UploadButton title="객실이미지 업로드" onClick={() => showUploadModal("rooms", index)} />
                        <button onClick={() => setInfoModal(index)}>추가 정보 입력</button> */}
          </div>
        </div>
      </ModalContainer>
    </div>
  );
};

export default EditAccommodation;
