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

import {actions} from "../../../reducers/common/upload";
import {toggleButton, readFile, setSlideNumber} from "../../../src/tools/common";

const ManageRestraunt = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getTableItems("accommodation");
    getTableItems("rooms");
  }, []);

  const router = useRouter();
  const {uid} = useSelector((state: RootState) => state.userReducer);
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
      type: "restaurant",
      count: 0,
      title: "음식점 관리",
      button_disabled: true,
      page: 1,
    },
    entire_menu: {
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
      type: "exposure_menu",
      count: 0,
      title: "객실 관리",
      button_disabled: true,
      page: 1,
    },
    exposure_menu: {
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
      type: "exposure_menu",
      count: 0,
      title: "객실 관리",
      button_disabled: true,
      page: 1,
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
    let page_num = contents[type].page;
    let tmp_table_items = [];

    if (page) {
      setContents(state => {
        return {
          ...state,
          [type]: {
            ...state[type],
            page: page
          }
        }
      })
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
            accommodation_id: x.accommodation_id,
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
                  title: "소개",
                  visible: true,
                  value: contents.accommodation.table_items[idx].introduction,
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
          tag = getDate(contents.accommodation.table_items[idx].created_at);
          break;
      }
    } else {
      switch (cell) {
        case "":
          tag = (
            <Checkbox
              checked={contents.entire_menu.table_items[idx].checked}
              onChange={(e) => setChecked(idx, "entire_menu", "change", e)}
            ></Checkbox>
          );
          break;
        case "숙박 업소명":
          tag = contents.entire_menu.table_items[idx].accommodation_label;
          break;
        case "객실명":
          tag = contents.entire_menu.table_items[idx].label;
          break;
        case "기준 인원":
          tag = contents.entire_menu.table_items[idx].standard_num + "명";
          break;
        case "최대 인원":
          tag = contents.entire_menu.table_items[idx].maximum_num + "명";
          break;
        case "추가 정보":
          const data = {
            amenities: contents.entire_menu.table_items[idx].amenities,
            additional_info: contents.entire_menu.table_items[idx].additional_info,
          };
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
          setEditModal({
            title: "객실명 수정",
            visible: true,
            value: target.label,
            type: "input",
            read_only: false,
            target: "rooms",
            edit_target: "label",
          });
          break;
        case 1:
          const data = {
            amenities: target.amenities,
            additional_info: target.additional_info,
          };
          break;
        case 2:
          setEditModal({
            title: "기준 인원 수정",
            visible: true,
            value: target.standard_num,
            type: "input",
            read_only: false,
            target: "rooms",
            edit_target: "standard_num",
          });
          break;
        case 3:
          setEditModal({
            title: "최대 인원 수정",
            visible: true,
            value: target.maximum_num,
            type: "input",
            read_only: false,
            target: "rooms",
            edit_target: "maximum_num",
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
              getTableItems("accommodation");
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
    const status = await fetchDeleteApi(`/${type}/${id}`);

    console.log(status);
  }

  function updateAddress(data) {
    console.log(data);
  }

  function updateValues(val: string) {
    const path = editModal.target;
    const target = editModal.edit_target;
    const value = val;
    const item = contents[path].table_items.find((data) => {
      return data.checked == true;
    });

    fetchPatchApi(`/${path}/${item.id}`, {target, value}).then((status) => {
      if (status == 200) {
        alert("수정이 완료되었습니다.");
      } else {
        alert("수정이 실패되었습니다.");
      }
      setEditModal({title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: ""});
      getTableItems("accommodation");
      getTableItems("rooms");
    });
  }

  return (
    <div>
      {/* {Object.keys(contents).map((key, idx) => {
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
      })} */}
      {/* <PostCode
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
      /> */}
      {/* <UploadModal onChange={(files, target) => updateImages(files, target)} /> */}
    </div>
  );
};

export default ManageRestraunt;
