import styles from "../../../styles/pages/service.module.scss";
import res_style from "../../../styles/pages/restaurant.module.scss";
import { RootState } from "../../../reducers";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { fetchGetApi, fetchDeleteApi, fetchPatchApi, fetchFileApi, fetchPostApi } from "../../../src/tools/api";
import { Checkbox, TableCell, TableRow } from "@mui/material";
import { getDate } from "../../../src/tools/common";
import { Button } from "@mui/material";
import { HiX } from "react-icons/hi";

import CustomDropdown from "../../../src/components/CustomDrodown";
import CustomTable from "../../../src/components/CustomTable";
import EditModal from "../../../src/components/EditModal";
import PostCode from "../../../src/components/PostCode";
import UploadModal from "../../../src/components/UploadModal";
import ModalContainer from "../../../src/components/ModalContainer";
import CustomInput from "../../../src/components/CustomInput";
import RadioModal from "../../../src/components/RadioModal";
import CategoryModal from "../../../src/components/CategoryModal";

import { actions } from "../../../reducers/common/upload";
import { readFile } from "../../../src/tools/common";

const ManageRestraunt = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getTableItems("restaurant");
    getTableItems("exposure_menu");
    getTableItems("entire_menu");
  }, []);

  const router = useRouter();
  const { uid } = useSelector((state: RootState) => state.userReducer);
  const [categoryModalContents, setCategoryModalContents] = useState({
    target: "",
    visible: false,
    title: "",
    category: {id: 0, value: ""}
  })
  const [editModal, setEditModal] = useState({
    title: "",
    visible: false,
    value: "",
    type: "",
    read_only: false,
    target: "",
    edit_target: "",
  });
  const [exposureMenuContents, setExposureMenuContents] = useState({
    modal_visible: false,
    label: "",
    price: "",
    comment: "",
    image: {
      file: null,
      imageUrl: "",
    },
  });
  const [categoryContents, setCategoryContents] = useState({
    category: "",
    visible: false,
    menus: [
      {
        label: "",
        price: "",
      }
    ],
  })
  const [radioModalContents, setRadioModalContents] = useState({
    visible: false,
    title: "",
    contents: [],
    target: ""
  });
  const [postCodeVisible, setPostCodeVisible] = useState(false);
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
        "카테고리 추가",
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
            images: x.restaurant_images,
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
          setExposureMenuContents({ ...exposureMenuContents, modal_visible: true });
          break;
        case 1:
          setCategoryModalContents({visible: true, target: 'category', title: "카테고리 추가", category: {id: 0, value: ""}})
          break;
        case 2:
          setRadioModal(target, type);
          break;
        case 3:
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
        case 4:
          setPostCodeVisible(true);
          break;
        case 5:
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
        case 6:
          imageToBlob(target, type);
          break;
        case 7:
          const ok = confirm(`${target.label} 음식점을 삭제하시겠습니까?`);
          if (ok) {
            deleteData("restaurant", target.id).then(() => {
              getTableItems("restaurant");
              getTableItems("exposure_menu");
              getTableItems("entire_menu");
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
          const ok = confirm(`${target.label} 메뉴를 삭제하시겠습니까?`);
          if (ok) {
            fetchDeleteApi(`/image/exposure_menu/${target.id}`).then(() => {
              deleteData("exposure_menu", target.id).then(() => {
                getTableItems("restaurant");
                getTableItems("exposure_menu");
              });
            });
          }
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
          setRadioModal(target, type);
          break;
        case 3:
          const ok = confirm(`${target.label} 메뉴를 삭제하시겠습니까?`);
          if (ok) {
            deleteData("entire_menu", target.id).then(() => {
              getTableItems("restaurant");
              getTableItems("entire_menu");
            });
          }
          break;
      }
    }
  }

  async function setRadioModal(target, type: string) {
    let restaurant_id = 0;
    let title = "";
    if (type == 'restaurant') {
      restaurant_id = target.id;
      title = "카테고리 선택";
    } else {
      restaurant_id = target.restaurant_id
      title = "카테고리 수정";
    }
    const category = await fetchGetApi(`/restaurant/${restaurant_id}/category`);

    let data = [];
    for (let x of category) {
      data.push({ id: x.id, value: x.category });
    }

    setRadioModalContents({
      visible: true,
      title: title,
      contents: [...data],
      target: type
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

  function updateImages(files: File[], target: string) {
    const item = contents[target].table_items.find((data) => {
      return data.checked == true;
    });
    const target_id = item.id;

    let upload_images = new FormData();
    for (let i = 0, leng = files.length; i < leng; i++) {
      const file_name_arr = files[i].name.split(".");
      const file_extention = file_name_arr[file_name_arr.length - 1];
      let file_name = "";
      if (target == "restaurant") {
        file_name = `${target_id}_${i}_${new Date().getTime()}.${file_extention}`;
      } else if (target == "exposure_menu") {
        file_name = `${item.restaurant_id}_${target_id}_0_${new Date().getTime()}.${file_extention}`;
      }

      const new_file = new File([files[i]], file_name, {
        type: "image/jpeg",
      });

      upload_images.append(`files_${i}`, new_file);
    }
    let category = "";
    if (target == "restaurant") {
      category = "1";
    }
    upload_images.append("length", files.length.toString());
    upload_images.append("category", category);

    fetchDeleteApi(`/image/${target}/${target_id}`);
    fetchFileApi("/upload/image/multi", upload_images)
      .then((res) => console.log(res, "1"))
      .then(() => {
        getTableItems("restaurant");
      });
  }

  async function deleteData(type: string, id: number) {
    const status = await fetchDeleteApi(`/${type}/${id}`);

    return status;
  }

  function updateAddress(data) {
    console.log(data);
  }

  function test(files: File[], target: string) {
    console.log(files, target);
  }

  function updateValues(val: string) {
    const path = editModal.target;
    const target = editModal.edit_target;
    const value = val;
    const item = contents[path].table_items.find((data) => {
      return data.checked == true;
    });

    fetchPatchApi(`/${path}/${item.id}`, { target, value }).then((status) => {
      if (status == 200) {
        alert("수정이 완료되었습니다.");
      } else {
        alert("수정이 실패되었습니다.");
      }
      setEditModal({ title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: "" });
      getTableItems("restaurant");
      getTableItems("exposure_menu");
      getTableItems("entire_menu");
    });
  }

  function handleRadioModal(val: {id: number, value: string}) {
    const item = contents[radioModalContents.target].table_items.find((data) => {
      return data.checked == true;
    });
    setRadioModalContents({
      visible: false,
      title: "",
      contents: [],
      target: ""
    });

    console.log(val, radioModalContents.target)

    if (radioModalContents.target == 'entire_menu') {
      const value = val.id;

      fetchPatchApi(`/entire_menu/${item.id}`, { target: 'category_id', value }).then((status) => {
        if (status == 200) {
          alert("수정이 완료되었습니다.");
        } else {
          alert("수정이 실패되었습니다.");
        }
        getTableItems("restaurant");
        getTableItems("exposure_menu");
        getTableItems("entire_menu");
      });
    } else {
      setCategoryModalContents({visible: true, target: 'entire_menu', title: '전체메뉴 추가', category: val})
    }
  }

  function clearExposureMenuContents() {
    setExposureMenuContents({
      modal_visible: false,
      label: "",
      price: "",
      comment: "",
      image: {
        file: null,
        imageUrl: "",
      },
    });
  }

  function clearCategoryContents() {
    setCategoryContents({
      category: "",
      visible: false,
      menus: [
        {
          label: "",
          price: "",
        }
      ],
    })
  }

  function handleExposureMenuContents(e: React.ChangeEvent<HTMLInputElement>, target) {
    let value = e.target.value;
    if (target == 'price') {
      value = value.toLocaleString()
    }
    setExposureMenuContents({
      ...exposureMenuContents,
      [target]: value,
    });
  }

  async function setExposureMenuContentsImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (files.length == 0) return;
    const new_file_name = await readFile(files[0]);
    setExposureMenuContents({
      ...exposureMenuContents,
      image: {
        file: files[0],
        imageUrl: new_file_name
      }
    })
  }

  async function addExposureMenu() {
    const ok = confirm('대표메뉴를 등록하시겠습니까?')
    if (ok) {
      const target = contents.restaurant.table_items.find(data => {
        return data.checked == true
      })

      const param = {
        label: exposureMenuContents.label,
        price: exposureMenuContents.price,
        comment: exposureMenuContents.comment,
        restaurant_id: target.id
      }

      const menu = await fetchPostApi(`/restaurant/${target.id}/exposure_menu`, param)

      let upload_image = new FormData();
      const file_name_arr = exposureMenuContents.image.file.name.split(".");
      const file_extention = file_name_arr[file_name_arr.length - 1];
      const new_file = new File([exposureMenuContents.image.file], `${target.id}_${menu.id}_0_${new Date().getTime()}.${file_extention}`, {
        type: "image/jpeg",
      });

      upload_image.append(`files_0`, new_file);
      upload_image.append("length", '1');
      upload_image.append("category", "11");

      fetchFileApi("/upload/image/multi", upload_image)
        .then(() => {
          clearExposureMenuContents()
          getTableItems("restaurant");
          getTableItems("exposure_menu");
        })
    }
  }

  async function addCategory (data: {category: string, menu: {label: string, price: string}[]}) {
    let category_id = 0;
    if (categoryModalContents.target == 'category') {
      const res_category = await fetchPostApi(`/entire_menu_category`, {category: data.category})
      category_id = res_category[0].id
    } else {
      category_id = categoryModalContents.category.id
    }
    

    const menu = data.menu;
    const target = contents.restaurant.table_items.find(item => {
      return item.checked == true
    })
    let params = [];
    for (let x of menu) {
      params.push({
        label: x.label,
        price: x.price,
        restaurant_id: target.id,
        category_id: category_id
      })
    }

    const res_entire_menu = await fetchPostApi(`/entire_menu`, {params});
    if (res_entire_menu.length > 0) {
      clearCategoryContents()
      getTableItems("restaurant");
      getTableItems("entire_menu");
    }
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
            <div style={{ height: "28rem", width: "100%" }}>
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
          setEditModal({ title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: "" })
        }
        onSubmit={(value) => updateValues(value)}
      />
      <UploadModal onChange={(files, target) => updateImages(files, target)} />
      <RadioModal
        visible={radioModalContents.visible}
        contents={radioModalContents.contents}
        title={radioModalContents.title}
        hideModal={() => setRadioModalContents({ visible: false, title: "", contents: [], target: "" })}
        onChange={(val) => handleRadioModal(val)}
      />
      <CategoryModal 
        visible={categoryModalContents.visible}
        target={categoryModalContents.target}
        title={categoryModalContents.title}
        hideModal={() => setCategoryModalContents({visible: false, target: "", title: "", category: {id: 0, value: ""}})}
        onSubmit={(data) => addCategory(data)}
      />
      <ModalContainer backClicked={() => clearExposureMenuContents()} visible={exposureMenuContents.modal_visible}>
        <div
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
          <h2 className={styles.modal_title} style={{ marginBottom: "1rem" }}>
            대표메뉴 추가
            <HiX onClick={() => clearExposureMenuContents()} />
          </h2>
          <div className={res_style.rest_exposure_menu}>
            <div className={res_style.rest_menu_circle}></div>
            <div className={res_style.rest_exposure_menu_imgbox}>
              <label htmlFor={`exposure_menu_img`}>
                {exposureMenuContents.image.file == null ? (
                  <span>업로드</span>
                ) : (
                  <div className={res_style.rest_exposure_menu_img_wrap}>
                    <img src={exposureMenuContents.image.imageUrl} alt="exposure_menu_image" />
                  </div>
                )}
              </label>
              <input
                type="file"
                onChange={(e) => setExposureMenuContentsImage(e)}
                id={`exposure_menu_img`}
              />
            </div>
            <div className={res_style.rest_exposure_menu_textbox}>
              <CustomInput
                type="text"
                placeholder="메뉴 이름을 입력해주세요."
                onChange={(e) => handleExposureMenuContents(e, "label")}
                value={exposureMenuContents.label}
                align="right"
              />

              <div style={exposureMenuContents.price.length > 0 ? { paddingRight: "8px" } : null}>
                <CustomInput
                  type="text"
                  placeholder="메뉴 가격을 입력해주세요."
                  onChange={(e) => handleExposureMenuContents(e, "price")}
                  value={exposureMenuContents.price}
                  align="right"
                />
                {exposureMenuContents.price.length > 0 ? "원" : null}
              </div>
              <CustomInput
                type="text"
                placeholder="한 줄 설명을 입력해주세요."
                onChange={(e) => handleExposureMenuContents(e, "comment")}
                value={exposureMenuContents.comment}
                align="right"
              />
            </div>
          </div>
          <div className={styles.util_box} style={{ paddingRight: '48px' }}>
            <button className={styles.regi_button} onClick={() => addExposureMenu()}>등록</button>
          </div>
        </div>
      </ModalContainer>
      
    </div>
  );
};

export default ManageRestraunt;
