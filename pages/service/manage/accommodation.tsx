import styles from "../../../styles/pages/service.module.scss";
import accom_style from "../../../styles/pages/accommodation.module.scss";
import {RootState} from "../../../reducers";
import {useSelector, useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {ReactElement, useEffect, useState} from "react";
import {fetchGetApi, fetchDeleteApi, fetchPatchApi} from "../../../src/tools/api";
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
import UploadButton from "../../../src/components/UploadButton";
import InfoModal from "../../../src/components/InfoModal";

import {actions} from "../../../reducers/common/upload";
import {toggleButton, readFile, setSlideNumber} from "../../../src/tools/common";

const EditAccommodation = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getTableItems("accommodation");
    getTableItems("rooms");
  }, []);

  const router = useRouter();
  const {uid} = useSelector((state: RootState) => state.userReducer);
  const [editModal, setEditModal] = useState({title: "", visible: false, value: "", type: "", read_only: false});
  const [postCodeVisible, setPostCodeVisible] = useState(false);
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalType, setInfoModalType] = useState("");
  const [infoModalData, setInfoModalData] = useState({
    amenities: "",
    additional_info: "",
  });
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
    cur_num: 0,
  });

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
          label: "최대 인원",
          center: false,
        },
        {
          label: "추가 정보",
          center: true,
        },
      ],
      table_items: [],
      edit_items: ["객실명 수정", "추가 정보 수정", "기준 인원 수정", "최대 인원 수정", "대표이미지 수정", "객실 삭제"],
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
    let tmp_table_items = [];

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
          tmp_table_items.push({
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
          });
        }
        setContents((state) => {
          return {
            ...state,
            [type]: {
              ...state[type],
              table_items: [...tmp_table_items],
            },
          };
        });
      } else {
        for (let x of res.rows) {
          tmp_table_items.push({
            id: x.id,
            maximum_num: x.maximum_num,
            standard_num: x.standard_num,
            label: x.label,
            accommodation_label: x.accommodation_label,
            price: x.price,
            images: x.rooms_images,
            additional_info: x.additional_info,
            amenities: x.amenities,
            checked: false,
          });
        }
        setContents((state) => {
          return {
            ...state,
            [type]: {
              ...state[type],
              table_items: [...tmp_table_items],
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
          tag = (
            <Button
              onClick={() => {
                setEditModal({
                  title: "최대 인원 수정",
                  visible: true,
                  value: contents.accommodation.table_items[idx].introduction,
                  type: "input",
                  read_only: true,
                });
              }}
            >
              확인
            </Button>
          );
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
          tag = contents.rooms.table_items[idx].standard_num + "명";
          break;
        case "최대 인원":
          tag = contents.rooms.table_items[idx].maximum_num + "명";
          break;
        case "추가 정보":
          const data = {
            amenities: contents.rooms.table_items[idx].amenities,
            additional_info: contents.rooms.table_items[idx].additional_info,
          };
          tag = <Button onClick={() => showInfoModal("check", data)}>확인</Button>;
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
          setEditModal({title: "업소명 수정", visible: true, value: target.label, type: "input", read_only: false});
          break;
        case 2:
          setPostCodeVisible(true);
          break;
        case 3:
          setEditModal({
            title: "소개 수정",
            visible: true,
            value: target.introduction,
            type: "textarea",
            read_only: false,
          });
          break;
        case 4:
          imageToBlob(target, type);
          break;
        case 5:
          const ok = confirm(`${target.label} 업소를 삭제하시겠습니까?`);
          if (ok) {
            deleteData("accommodation", target.id).then(() => {
              getTableItems("accommodation");
              getTableItems("rooms");
            });
          }
          break;
      }
    } else {
      switch (idx) {
        case 0:
          setEditModal({title: "객실명 수정", visible: true, value: target.label, type: "input", read_only: false});
          break;
        case 1:
          const data = {
            amenities: target.amenities,
            additional_info: target.additional_info,
          };
          showInfoModal("edit", data);
          break;
        case 2:
          setEditModal({
            title: "기준 인원 수정",
            visible: true,
            value: target.standard_num,
            type: "input",
            read_only: false,
          });
          break;
        case 3:
          setEditModal({
            title: "최대 인원 수정",
            visible: true,
            value: target.maximum_num,
            type: "input",
            read_only: false,
          });
          break;
        case 4:
          imageToBlob(target, type);
          break;
        case 5:
          const ok = confirm(`${target.label} 객실을 삭제하시겠습니까?`);
          if (ok) {
            console.log(target);
            deleteData("rooms", target.id).then(() => {
              getTableItems("rooms");
            });
          }
          break;
      }
    }
  }

  function imageToBlob(target, type: string) {
    let files = [];
    for (let i = 0, leng = target.images.length; i < leng; i++) {
      fetch(`http://localhost:3000/api/image/${type}/${target.images[i].file_name}`).then((res) => {
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
  }

  async function deleteData(type: string, id: number) {
    const status = await fetchDeleteApi(`/${type}/${id}`);

    console.log(status);
  }

  function updateAddress(data) {
    console.log(data);
  }

  function updateValues(val: string) {
    console.log(val)
  }

  function updateImages(files: Blob[], target: string) {
    if (target == "rooms") {
      files.forEach(async (file: any) => {
        const new_file_name = await readFile(file);
        setAddRoomContents((state) => {
          return {
            ...state,
            files: [...state.files, {file: file, imageUrl: new_file_name}],
          };
        });
      });
    }
  }

  async function roomSlider(dir: string) {
    const num = addRoomContents.cur_num;
    const res_num = await setSlideNumber(num, dir, addRoomContents.files.length);

    setAddRoomContents((state) => {
      return {
        ...state,
        cur_num: res_num,
      };
    });
  }

  function changeRoomInfo(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    const value = e.target.value;
    setAddRoomContents((state) => {
      console.log(state.info[type]);
      return {
        ...state,
        info: {
          ...state.info,
          [type]: value,
        },
      };
    });
  }

  function showRoomUploadModal() {
    dispatch(
      actions.pushFiles({
        files: [],
      })
    );
    dispatch(
      actions.setUploadModalVisible({
        visible: true,
        title: "객실이미지 업로드",
        target: "rooms",
        multiple: true,
        image_type: "rooms",
      })
    );
  }

  function showInfoModal(type: string, data?: {amenities: string; additional_info: string}) {
    if (type == "add") {
      setInfoModalData({
        amenities: addRoomContents.info.amenities.toString(),
        additional_info: addRoomContents.info.additional_info.toString(),
      });
      setInfoModalType("registration");
    } else if (type == "edit") {
      setInfoModalData(data);
      setInfoModalType("registration");
    } else if (type == "check") {
      setInfoModalData(data);
      setInfoModalType("view");
    }

    setInfoModalVisible(true);
  }

  function setAdditionalInfo(data: {amenities: string[]; additional_info: string[]}) {
    setAddRoomContents((state) => {
      return {
        ...state,
        info: {
          ...state.info,
          amenities: data.amenities.toString(),
          additional_info: data.additional_info.toString(),
        },
      };
    });
    setInfoModalVisible(false);
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
        readOnly={editModal.read_only}
        hideModal={() => setEditModal({title: "", visible: false, value: "", type: "", read_only: false})}
        onSubmit={(value) => updateValues(value)}
      />
      <UploadModal onChange={(files, target) => updateImages(files, target)} />
      <InfoModal
        visible={infoModalVisible}
        parent_info={infoModalData}
        hideModal={() => setInfoModalVisible(false)}
        onRegistered={(info) => setAdditionalInfo(info)}
        type={infoModalType}
      />
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
            height: "auto",
          }}
        >
          <h2 className={styles.modal_title} style={{marginBottom: "1rem"}}>
            객실 추가
            <HiX onClick={() => setRoomModalVisible(false)} />
          </h2>
          <div className={accom_style.detail_room_info}>
            <ImageBox
              className={accom_style.detail_room_slider_wrap}
              imgId={`room_image`}
              type="rooms"
              src={addRoomContents.files.length > 0 ? addRoomContents.files[addRoomContents.cur_num].imageUrl : null}
              onMouseEnter={() =>
                addRoomContents.files.length > 0 ? toggleButton([`detail_room_slider`], "enter") : null
              }
              onMouseLeave={() =>
                addRoomContents.files.length > 0 ? toggleButton([`detail_room_slider`], "leave") : null
              }
            >
              {addRoomContents.files.length == 0 ? <h3>{addRoomContents.files.length}</h3> : null}
              <ImageSlider
                id={`detail_room_slider`}
                sliderStyle={{width: "2.5rem", height: "2.5rem"}}
                onSlideRight={() => roomSlider("next")}
                onSlideLeft={() => roomSlider("prev")}
              />
            </ImageBox>

            <div className={accom_style.detail_room_intro}>
              <div className={accom_style.detail_room_explain}>
                <label>객실명</label>
                <CustomInput
                  placeholder="객실명을 입력해주세요."
                  onChange={(e) => changeRoomInfo(e, "label")}
                  align="right"
                  bottom={true}
                  width="calc(100% - 6rem)"
                />
              </div>
              <div className={accom_style.detail_room_explain}>
                <label>기준 인원</label>
                <CustomInput
                  placeholder="기준 인원을 입력해주세요."
                  onChange={(e) => changeRoomInfo(e, "standard_num")}
                  align="right"
                  bottom={true}
                  width="calc(100% - 6rem)"
                />
              </div>
              <div className={accom_style.detail_room_explain}>
                <label>최대 인원</label>
                <CustomInput
                  placeholder="최대 인원을 입력해주세요."
                  onChange={(e) => changeRoomInfo(e, "maximum_num")}
                  align="right"
                  bottom={true}
                  width="calc(100% - 6rem)"
                />
              </div>
              <div className={accom_style.detail_room_explain}>
                <label>가격</label>
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
            <UploadButton title="객실이미지 업로드" onClick={() => showRoomUploadModal()} />
            <button onClick={() => showInfoModal("add")}>추가 정보 입력</button>
          </div>
        </div>
      </ModalContainer>
    </div>
  );
};

export default EditAccommodation;
