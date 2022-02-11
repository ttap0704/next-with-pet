import styles from "../../../styles/pages/service.module.scss";
import accom_style from "../../../styles/pages/accommodation.module.scss";
import {RootState} from "../../../reducers";
import {useSelector, useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {ReactElement, useEffect, useState} from "react";
import {fetchGetApi, fetchDeleteApi, fetchPatchApi, fetchFileApi, fetchPostApi} from "../../../src/tools/api";
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
import EditOrderModal from "../../../src/components/EditOrderModal";

import {actions} from "../../../reducers/common/upload";
import {toggleButton, readFile, setSlideNumber} from "../../../src/tools/common";

const ManageAccommodationInfo = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getTableItems("accommodation");
  }, []);

  const router = useRouter();
  const {uid} = useSelector((state: RootState) => state.userReducer);
  const [editOrderModal, setEditOrderModal] = useState({
    visible: false,
    data: [],
    type: "",
  });
  const [editModal, setEditModal] = useState({
    title: "",
    visible: false,
    value: "",
    type: "",
    read_only: false,
    target: "",
    edit_target: "",
  });
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
      label: "",
      standard_num: "",
      maximum_num: "",
      price: "",
      amenities: "",
      additional_info: "",
    },
    cur_num: 0,
  });

  const [contents, setContents] = useState({
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
    edit_items: [
      "객실 추가",
      "업소명 수정",
      "주소 수정",
      "소개 수정",
      "대표이미지 수정",
      "객실 순서 변경",
      "업소 삭제",
    ],
    type: "accommodation",
    count: 0,
    title: "숙박업소 관리",
    button_disabled: true,
    page: 1,
  });

  function setChecked(idx: number, type: string, event_type: string, e?: React.ChangeEvent<HTMLInputElement>) {
    let checked = undefined;
    if (event_type == "change") {
      checked = e.target.checked;
    } else {
      checked = !contents.table_items[idx].checked;
    }

    setContents((state) => {
      return {
        ...state,
        table_items: [
          ...state.table_items.map((data, index) => {
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
      };
    });
  }

  function getTableItems(type: string, page?: number) {
    let page_num = contents.page;
    let tmp_table_items = [];

    if (page) {
      setContents((state) => {
        return {
          ...state,
          page: page,
        };
      });
      page_num = page;
    }
    let url = `/manager/1/accommodation?page=${page_num}`;

    fetchGetApi(url).then((res) => {
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
          rooms: x.accommodation_rooms,
          rooms_num: x.accommodation_rooms.length,
          created_at: x.createdAt,
          images: x.accommodation_images,
          checked: false,
        });
      }
      setContents((state) => {
        return {
          ...state,
          count: res.count,
          table_items: [...tmp_table_items],
        };
      });
    });
  }

  function setTableCell(cell: string, idx: number, type: string) {
    let tag: ReactElement | string;
    switch (cell) {
      case "":
        tag = (
          <Checkbox
            checked={contents.table_items[idx].checked}
            onChange={(e) => setChecked(idx, "accommodation", "change", e)}
          ></Checkbox>
        );
        break;
      case "이름":
        tag = contents.table_items[idx].label;
        break;
      case "주소":
        tag = `${contents.table_items[idx].sido} ${contents.table_items[idx].sigungu} ${contents.table_items[idx].bname}`;
        break;
      case "방 개수":
        tag = contents.table_items[idx].rooms_num;
        break;
      case "소개":
        tag = (
          <Button
            onClick={() => {
              setEditModal({
                title: "소개",
                visible: true,
                value: contents.table_items[idx].introduction,
                type: "textarea",
                read_only: true,
                target: "accommodation",
                edit_target: "",
              });
            }}
          >
            확인
          </Button>
        );
        break;
      case "등록일":
        tag = getDate(contents.table_items[idx].created_at);
        break;
    }

    return tag;
  }

  function handleDropdown(type: string, idx: number) {
    const target = contents.table_items.find((data) => {
      return data.checked == true;
    });

    switch (idx) {
      case 0:
        setRoomModalVisible(true);
        break;
      case 1:
        setEditModal({
          title: "업소명 수정",
          visible: true,
          value: target.label,
          type: "input",
          read_only: false,
          target: "accommodation",
          edit_target: "label",
        });
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
          target: "accommodation",
          edit_target: "introduction",
        });
        break;
      case 4:
        imageToBlob(target, type);
        break;
      case 5:
        console.log(target);
        setEditOrderModal({
          visible: true,
          data: target.rooms.map((item) => {
            return {
              ...item,
              number: Number(item.seq) + 1,
            };
          }),
          type: "rooms",
        });
        break;
      case 6:
        const ok = confirm(`${target.label} 업소를 삭제하시겠습니까?`);
        if (ok) {
          deleteData("accommodation", target.id).then(() => {
            getTableItems("accommodation");
          });
        }
        break;
    }
  }

  function imageToBlob(target, type: string) {
    let files = [];
    for (let i = 0, leng = target.images.length; i < leng; i++) {
      fetch(`http://localhost:3000/api/image/${type}/${target.images[i].file_name}`).then((res) => {
        console.log(res);
        res
          .blob()
          .then((blob) => {
            const file = new File([blob], target.images[i].file_name, {
              lastModified: new Date().getTime(),
              type: blob.type,
            });
            files.push(file);
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
    let url = `/manager/1/accommodation/${id}`;
    const status = await fetchDeleteApi(url);
    console.log(status);
  }

  function updateAddress(data) {
    console.log(data);
  }

  function updateValues(val: string) {
    const path = editModal.target;
    const target = editModal.edit_target;
    const value = val;
    const item = contents.table_items.find((data) => {
      return data.checked == true;
    });

    let url = `/manager/1/accommodation/${item.id}`;

    fetchPatchApi(url, {target, value}).then((status) => {
      if (status == 200) {
        alert("수정이 완료되었습니다.");
      } else {
        alert("수정이 실패되었습니다.");
      }
      setEditModal({title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: ""});
      getTableItems("accommodation");
    });
  }

  function updateImages(files: File[], target: string, add_room?: Boolean) {
    if (!roomModalVisible) {
      const item = contents.table_items.find((data) => {
        return data.checked == true;
      });
      const target_id = item.id;

      let upload_images = new FormData();
      for (let i = 0, leng = files.length; i < leng; i++) {
        const file_name_arr = files[i].name.split(".");
        const file_extention = file_name_arr[file_name_arr.length - 1];
        let file_name = "";
        if (target == "accommodation") {
          file_name = `${target_id}_${i}_${new Date().getTime()}.${file_extention}`;
        } else if (target == "rooms") {
          file_name = `${item.accommodation_id}_${target_id}_${i}_${new Date().getTime()}.${file_extention}`;
        }

        const new_file = new File([files[i]], file_name, {
          type: "image/jpeg",
        });

        upload_images.append(`files_${i}`, new_file);
      }
      let category = "";
      if (target == "accommodation") {
        category = "2";
      } else if (target == "rooms") {
        category = "21";
      }
      upload_images.append("length", files.length.toString());
      upload_images.append("category", category);

      fetchDeleteApi(`/image/${target}/${target_id}`);
      fetchFileApi("/upload/image", upload_images)
        .then((res) => console.log(res, "1"))
        .then(() => {
          getTableItems("accommodation");
        });
    } else {
      setAddRoomImages(files, target);
    }
  }

  function setAddRoomImages(files: File[], target: string) {
    console.log(target);
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

  function addRoom() {
    const item = contents.table_items.find((data) => {
      return data.checked == true;
    });
    const accommodation_id = item.id;

    const ok = confirm("객실을 추가하시겠습니까?");
    if (ok) {
      const data = {
        ...addRoomContents.info,
        accommodation_id,
      };
      const files = addRoomContents.files;
      console.log(files);

      fetchPostApi(`/manager/1/accommodation/${accommodation_id}/rooms`, data).then((res) => {
        const room_id = res.id;
        let upload_images = new FormData();
        for (let i = 0, leng = files.length; i < leng; i++) {
          const file_name_arr = files[i].file.name.split(".");
          const file_extention = file_name_arr[file_name_arr.length - 1];
          const file_name = `${accommodation_id}_${room_id}_${i}_${new Date().getTime()}.${file_extention}`;

          const new_file = new File([files[i].file], file_name, {
            type: "image/jpeg",
          });

          upload_images.append(`files_${i}`, new_file);
        }
        let category = "21";
        upload_images.append("length", files.length.toString());
        upload_images.append("category", category);

        fetchFileApi("/upload/image", upload_images)
          .then((res) => console.log(res, "1"))
          .then(() => {
            getTableItems("accommodation");
          });
      });
    }
  }

  async function setRoomsOrder(data) {
    const ok = confirm("객실 순서를 변경하시겠습니까?");
    if (ok) {
      const target = contents.table_items.find((data) => {
        return data.checked == true;
      });

      const req_data = data.map((item, idx) => {
        return {
          id: item.id,
          seq: item.seq,
        };
      });

      const body = data.map((item) => {
        return {
          id: item.id,
          seq: item.number - 1,
        };
      });

      console.log(body);

      const response = await fetchPostApi(`/manager/1/accommodation/${target.id}/rooms/order`, {data: body});

      console.log(response);
    }
  }

  return (
    <div>
      <div className={styles.manage_contents} key={`${contents.type}_content`}>
        <div className={styles.manage_title}>
          <h2>{contents.title}</h2>
          <CustomDropdown
            items={contents.edit_items}
            buttonDisabled={contents.button_disabled}
            type="accommodation"
            onClick={(type, idx) => handleDropdown(type, idx)}
          />
        </div>
        <div style={{height: "28rem", width: "100%"}}>
          <CustomTable
            header={contents.header}
            footerColspan={6}
            rowsLength={contents.count}
            changePerPage={(page) => getTableItems(contents.type, page)}
          >
            {contents.table_items.map((data, index) => {
              return (
                <TableRow
                  key={`${contents.type}_row_${index}`}
                  onClick={() => setChecked(index, contents.type, "click")}
                >
                  {contents.header.map((cell, index2) => {
                    return (
                      <TableCell align={cell.center ? "center" : "left"} key={`${contents.type}_cell_${index2}`}>
                        {setTableCell(cell.label, index, contents.type)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </CustomTable>
        </div>
      </div>
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
        hideModal={() =>
          setEditModal({title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: ""})
        }
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
      <EditOrderModal
        visible={editOrderModal.visible}
        data={editOrderModal.data}
        type={editOrderModal.type}
        onSubmit={(data) => setRoomsOrder(data)}
        hideModal={() => setEditOrderModal({visible: false, data: [], type: ""})}
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
              onMouseEnter={() => toggleButton([`detail_room_slider`], "enter", addRoomContents.files.length)}
              onMouseLeave={() => toggleButton([`detail_room_slider`], "leave", addRoomContents.files.length)}
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
          <div className={accom_style.detail_room_util_box} style={{justifyContent: "center"}}>
            <button onClick={() => addRoom()}>객실 등록</button>
          </div>
        </div>
      </ModalContainer>
    </div>
  );
};

export default ManageAccommodationInfo;
