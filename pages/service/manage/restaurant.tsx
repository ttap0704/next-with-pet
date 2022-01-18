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
import RadioModal from "../../../src/components/RadioModal";

import {actions} from "../../../reducers/common/upload";
import {toggleButton, readFile, setSlideNumber} from "../../../src/tools/common";

const ManageRestraunt = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getTableItems("restaurant");
    getTableItems("exposure_menu");
    getTableItems("entire_menu");
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
  const [radioModalVisible, setRadioModalVisible] = useState(true);
  const [radioModalContents, setRadioModalContents] = useState({
    visible: false,
    title: "",
    contents: []
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
    restaurant: {
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
          label: "대표메뉴",
          center: false,
        },
        {
          label: "전체메뉴",
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
        "대표메뉴 추가",
        "전체메뉴 추가",
        "업소명 수정",
        "주소 수정",
        "소개 수정",
        "대표이미지 수정",
        "음식점 삭제",
      ],
      type: "restaurant",
      count: 0,
      title: "음식점 관리",
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
          label: "음식점",
          center: false,
        },
        {
          label: "메뉴명",
          center: false,
        },
        {
          label: "가격",
          center: false,
        },
        {
          label: "한 줄 설명",
          center: true,
        },
      ],
      table_items: [],
      edit_items: ["메뉴명 수정", "가격 수정", "대표이미지 수정", "설명 수정", "메뉴 삭제"],
      type: "exposure_menu",
      count: 0,
      title: "대표메뉴 관리",
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
          label: "음식점",
          center: false,
        },
        {
          label: "카테고리",
          center: false,
        },
        {
          label: "메뉴명",
          center: false,
        },
        {
          label: "가격",
          center: false,
        },
      ],
      table_items: [],
      edit_items: ["메뉴명 수정", "가격 수정", "카테고리 수정", "메뉴 삭제"],
      type: "entire_menu",
      count: 0,
      title: "전체메뉴 관리",
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
    let count = 0;

    if (page) {
      setContents((state) => {
        return {
          ...state,
          [type]: {
            ...state[type],
            page: page,
          },
        };
      });
      page_num = page;
    }
    fetchGetApi(`/${type}?uid=1&page=${page_num}`).then((res) => {
      count = res.count;
      if (type == "restaurant") {
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
            created_at: x.createdAt,
            exposure_menu_num: x.exposure_menu.length,
            entire_menu_num: x.entire_menu.length,
            images: x.accommodation_images,
            checked: false,
          });
        }
      } else if (type == "exposure_menu") {
        for (let x of res.rows) {
          tmp_table_items.push({
            id: x.id,
            label: x.label,
            restaurant_label: x.restaurant_label,
            restaurant_id: x.restaurant_id,
            comment: x.comment,
            price: x.price,
            images: x.exposure_menu_image,
            checked: false,
          });
        }
      } else if (type == "entire_menu") {
        for (let x of res.rows) {
          tmp_table_items.push({
            id: x.id,
            label: x.label,
            restaurant_label: x.restaurant_label,
            restaurant_id: x.restaurant_id,
            category: x.category,
            price: x.price,
            checked: false,
          });
        }
      }
      setContents((state) => {
        return {
          ...state,
          [type]: {
            ...state[type],
            table_items: [...tmp_table_items],
            count: count,
            button_disabled: true,
          },
        };
      });
    });
  }

  function setTableCell(cell: string, idx: number, type: string) {
    let tag: ReactElement | string;
    if (type == "restaurant") {
      switch (cell) {
        case "":
          tag = (
            <Checkbox
              checked={contents.restaurant.table_items[idx].checked}
              onChange={(e) => setChecked(idx, "restaurant", "change", e)}
            ></Checkbox>
          );
          break;
        case "이름":
          tag = contents.restaurant.table_items[idx].label;
          break;
        case "주소":
          tag = `${contents.restaurant.table_items[idx].sido} ${contents.restaurant.table_items[idx].sigungu} ${contents.restaurant.table_items[idx].bname}`;
          break;
        case "대표메뉴":
          tag = contents.restaurant.table_items[idx].exposure_menu_num + "개";
          break;
        case "전체메뉴":
          tag = contents.restaurant.table_items[idx].entire_menu_num + "개";
          break;
        case "소개":
          tag = (
            <Button
              onClick={() => {
                setEditModal({
                  title: "소개",
                  visible: true,
                  value: contents.restaurant.table_items[idx].introduction,
                  type: "textarea",
                  read_only: true,
                  target: "restaurant",
                  edit_target: "",
                });
              }}
            >
              확인
            </Button>
          );
          break;
        case "등록일":
          tag = getDate(contents.restaurant.table_items[idx].created_at);
          break;
      }
    } else if (type == "exposure_menu") {
      switch (cell) {
        case "":
          tag = (
            <Checkbox
              checked={contents.exposure_menu.table_items[idx].checked}
              onChange={(e) => setChecked(idx, "exposure_menu", "change", e)}
            ></Checkbox>
          );
          break;
        case "음식점":
          tag = contents.exposure_menu.table_items[idx].restaurant_label;
          break;
        case "메뉴명":
          tag = contents.exposure_menu.table_items[idx].label;
          break;
        case "가격":
          tag = Number(contents.exposure_menu.table_items[idx].price).toLocaleString() + " 원";
          break;
        case "한 줄 설명":
          tag = (
            <Button
              onClick={() => {
                setEditModal({
                  title: "설명 확인",
                  visible: true,
                  value: contents.exposure_menu.table_items[idx].comment,
                  type: "input",
                  read_only: true,
                  target: "exposure_menu",
                  edit_target: "comment",
                });
              }}
            >
              확인
            </Button>
          );
          break;
      }
    } else if (type == "entire_menu") {
      switch (cell) {
        case "":
          tag = (
            <Checkbox
              checked={contents.entire_menu.table_items[idx].checked}
              onChange={(e) => setChecked(idx, "entire_menu", "change", e)}
            ></Checkbox>
          );
          break;
        case "음식점":
          tag = contents.entire_menu.table_items[idx].restaurant_label;
          break;
        case "카테고리":
          tag = contents.entire_menu.table_items[idx].category;
          break;
        case "메뉴명":
          tag = contents.entire_menu.table_items[idx].label;
          break;
        case "가격":
          tag = Number(contents.entire_menu.table_items[idx].price).toLocaleString() + " 원";
          break;
      }
    }

    return tag;
  }

  function handleDropdown(type: string, idx: number) {
    const target = contents[type].table_items.find((data) => {
      return data.checked == true;
    });

    if (type == "restaurant") {
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
          setEditModal({
            title: "업소명 수정",
            visible: true,
            value: target.label,
            type: "input",
            read_only: false,
            target: "restaurant",
            edit_target: "label",
          });
          break;
        case 3:
          setPostCodeVisible(true);
          break;
        case 4:
          setEditModal({
            title: "소개 수정",
            visible: true,
            value: target.introduction,
            type: "textarea",
            read_only: false,
            target: "restaurant",
            edit_target: "introduction",
          });
          break;
        case 5:
          imageToBlob(target, type);
          break;
        case 6:
          const ok = confirm(`${target.label} 음식점을 삭제하시겠습니까?`);
          if (ok) {
            deleteData("accommodation", target.id).then(() => {
              getTableItems("accommodation");
              getTableItems("rooms");
            });
          }
          break;
      }
    } else if (type == "exposure_menu") {
      switch (idx) {
        case 0:
          setEditModal({
            title: "메뉴명 수정",
            visible: true,
            value: target.label,
            type: "input",
            read_only: false,
            target: "exposure_menu",
            edit_target: "label",
          });
          break;
        case 1:
          setEditModal({
            title: "가격 수정",
            visible: true,
            value: target.price,
            type: "input",
            read_only: false,
            target: "exposure_menu",
            edit_target: "price",
          });
          break;
        case 2:
          // 대표이미지 수정
          break;
        case 3:
          setEditModal({
            title: "설명 수정",
            visible: true,
            value: target.comment,
            type: "input",
            read_only: false,
            target: "exposure_menu",
            edit_target: "comment",
          });
          break;
        case 4:
          // 메뉴 삭제
          break;
      }
    } else if (type == "entire_menu") {
      switch (idx) {
        case 0:
          setEditModal({
            title: "메뉴명 수정",
            visible: true,
            value: target.label,
            type: "input",
            read_only: false,
            target: "entire_menu",
            edit_target: "label",
          });
          break;
        case 1:
          setEditModal({
            title: "가격 수정",
            visible: true,
            value: target.price,
            type: "input",
            read_only: false,
            target: "entire_menu",
            edit_target: "price",
          });
          break;
        case 2:
          setRadioModal(target);
          // 카테고리 수정
          break;
        case 3:
          // 메뉴 삭제
          break;
      }
    }
  }

  async function setRadioModal(target) {
    const category = await fetchGetApi(`/restaurant/${target.restaurant_id}/category`);

    let data = [];
    for (let x of category) {
      data.push({id: x.id, value: x.category})
    }

    setRadioModalContents({
      visible: true,
      title: '카테고리 수정',
      contents: [...data]
    });
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
      getTableItems("restaurant");
      getTableItems("exposure_menu");
      getTableItems("entire_menu");
    });
  }

  function handleRadioModal (val) {
    const item = contents.entire_menu.table_items.find(data => {
      return data.checked == true;
    })
    const target = "category_id";
    const value = val;
    fetchPatchApi(`/entire_menu/${item.id}`, {target, value}).then((status) => {
      if (status == 200) {
        alert("수정이 완료되었습니다.");
      } else {
        alert("수정이 실패되었습니다.");
      }
      getTableItems("restaurant");
      getTableItems("exposure_menu");
      getTableItems("entire_menu");
      setRadioModalContents({
        visible: false,
        title: "",
        contents: []
      })
    });
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
                footerColspan={contents[key].header.length}
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
        hideModal={() =>
          setEditModal({title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: ""})
        }
        onSubmit={(value) => updateValues(value)}
      />
      {/* <UploadModal onChange={(files, target) => updateImages(files, target)} /> */}
      <RadioModal
        visible={radioModalContents.visible}
        contents={radioModalContents.contents}
        title={radioModalContents.title}
        hideModal={() => setRadioModalContents({visible: false, title: "", contents: []})}
        onChange={(val) => handleRadioModal(val)}
      />
    </div>
  );
};

export default ManageRestraunt;
