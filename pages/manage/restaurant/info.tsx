import React, {ReactElement, useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";

import styles from "../../../styles/pages/service.module.scss";
import res_style from "../../../styles/pages/restaurant.module.scss";

import CustomDropdown from "../../../src/components/CustomDrodown";
import CustomTable from "../../../src/components/CustomTable";
import EditModal from "../../../src/components/EditModal";
import PostCode from "../../../src/components/PostCode";
import UploadModal from "../../../src/components/UploadModal";
import ModalContainer from "../../../src/components/ModalContainer";
import CustomInput from "../../../src/components/CustomInput";
import RadioModal from "../../../src/components/RadioModal";
import CategoryModal from "../../../src/components/CategoryModal";

import {RootState} from "../../../reducers";
import {useRouter} from "next/router";
import {fetchGetApi, fetchDeleteApi, fetchPatchApi, fetchFileApi, fetchPostApi} from "../../../src/tools/api";
import {Checkbox, TableCell, TableRow} from "@mui/material";
import {getDate} from "../../../src/tools/common";
import {Button} from "@mui/material";
import {HiX} from "react-icons/hi";

import {actions} from "../../../reducers/common/upload";
import {readFile} from "../../../src/tools/common";

const MangeRestaurantInfo = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getTableItems("restaurant");
  }, []);

  const [postCodeVisible, setPostCodeVisible] = useState(false);
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
  const [categoryModalContents, setCategoryModalContents] = useState({
    target: "",
    visible: false,
    title: "",
    category: {id: 0, value: ""},
  });
  const [radioModalContents, setRadioModalContents] = useState({
    visible: false,
    title: "",
    contents: [],
    target: "",
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
  const [contents, setContents] = useState({
    header: [
      {
        label: "",
        center: true,
      },
      {
        label: "??????",
        center: false,
      },
      {
        label: "??????",
        center: false,
      },
      {
        label: "????????????",
        center: false,
      },
      {
        label: "????????????",
        center: false,
      },
      {
        label: "??????",
        center: true,
      },
      {
        label: "?????????",
        center: false,
      },
    ],
    table_items: [],
    edit_items: [
      "???????????? ??????",
      "???????????? ??????",
      "???????????? ??????",
      "????????? ??????",
      "?????? ??????",
      "?????? ??????",
      "??????????????? ??????",
      "????????? ??????",
    ],
    type: "restaurant",
    count: 0,
    title: "????????? ??????",
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
    let count = 0;

    if (page) {
      setContents((state) => {
        return {
          ...state,
          page: page,
        };
      });
      page_num = page;
    }
    let url = `/manager/${1}/restaurant?page=${page_num}`;
    fetchGetApi(url).then((res) => {
      count = res.count;
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
      setContents((state) => {
        return {
          ...state,
          table_items: [...tmp_table_items],
          count: count,
          button_disabled: true,
        };
      });
    });
  }

  async function deleteData(type: string, id: number) {
    let stauts: any = undefined;
    if (type == "restaurant") {
      stauts = await fetchDeleteApi(`/manager/1/${type}/${id}`);
    } else {
      console.log(type);
      const target = contents.table_items.find((item) => {
        return item.checked == true;
      });

      const restaurant_id = target.restaurant_id;

      stauts = await fetchDeleteApi(`/manager/1/restaurant/${restaurant_id}/${type}/${id}`);
    }

    return status;
  }

  function setTableCell(cell: string, idx: number, type: string) {
    let tag: ReactElement | string;
    switch (cell) {
      case "":
        tag = (
          <Checkbox
            checked={contents.table_items[idx].checked}
            onChange={(e) => setChecked(idx, "restaurant", "change", e)}
          ></Checkbox>
        );
        break;
      case "??????":
        tag = contents.table_items[idx].label;
        break;
      case "??????":
        tag = `${contents.table_items[idx].sido} ${contents.table_items[idx].sigungu} ${contents.table_items[idx].bname}`;
        break;
      case "????????????":
        tag = contents.table_items[idx].exposure_menu_num + "???";
        break;
      case "????????????":
        tag = contents.table_items[idx].entire_menu_num + "???";
        break;
      case "??????":
        tag = (
          <Button
            onClick={() => {
              setEditModal({
                title: "??????",
                visible: true,
                value: contents.table_items[idx].introduction,
                type: "textarea",
                read_only: true,
                target: "restaurant",
                edit_target: "",
              });
            }}
          >
            ??????
          </Button>
        );
        break;
      case "?????????":
        tag = getDate(contents.table_items[idx].created_at);
        break;
    }

    return tag;
  }

  function imageToBlob(target) {
    let files = [];
    for (let i = 0, leng = target.images.length; i < leng; i++) {
      fetch(`http://localhost:3000/api/image/restaurant/${target.images[i].file_name}`).then((res) => {
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
                  title: "??????????????? ??????",
                  target: "restaurant",
                  multiple: true,
                  image_type: "restaurant",
                })
              );
            }
          });
      });
    }
  }

  function updateAddress(data) {
    console.log(data);
  }

  function updateImages(files: File[], target: string) {
    const item = contents.table_items.find((data) => {
      return data.checked == true;
    });
    const target_id = item.id;

    let upload_images = new FormData();
    for (let i = 0, leng = files.length; i < leng; i++) {
      const file_name_arr = files[i].name.split(".");
      const file_extention = file_name_arr[file_name_arr.length - 1];
      let file_name = "";
      file_name = `${target_id}_${i}_${new Date().getTime()}.${file_extention}`;

      const new_file = new File([files[i]], file_name, {
        type: "image/jpeg",
      });

      upload_images.append(`files_${i}`, new_file);
    }
    let category = "1";
    upload_images.append("length", files.length.toString());
    upload_images.append("category", category);

    fetchDeleteApi(`/image/${target}/${target_id}`);
    fetchFileApi("/upload/image", upload_images)
      .then((res) => console.log(res, "1"))
      .then(() => {
        getTableItems("restaurant");
      });
  }

  function updateValues(val: string) {
    const target = editModal.edit_target;
    const value = val;
    const item = contents.table_items.find((data) => {
      return data.checked == true;
    });

    fetchPatchApi(`/manager/1/restaurant/${item.id}`, {target, value}).then((status) => {
      if (status == 200) {
        alert("????????? ?????????????????????.");
      } else {
        alert("????????? ?????????????????????.");
      }
      setEditModal({title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: ""});
      getTableItems("restaurant");
    });
  }

  async function setRadioModal(target) {
    let restaurant_id = 0;
    let title = "";
    restaurant_id = target.id;
    title = "???????????? ??????";

    const category = await fetchGetApi(`/manager/1/restaurant/${restaurant_id}/category`);

    let data = [];
    for (let x of category) {
      data.push({id: x.id, value: x.category});
    }

    setRadioModalContents({
      visible: true,
      title: title,
      contents: [...data],
      target: "restaurant",
    });
  }

  function handleRadioModal(val: {id: number; value: string}) {
    setRadioModalContents({
      visible: false,
      title: "",
      contents: [],
      target: "",
    });

    setCategoryModalContents({visible: true, target: "entire_menu", title: "???????????? ??????", category: val});
  }

  function clearCategoryContents() {
    setCategoryModalContents({
      target: "",
      visible: false,
      title: "",
      category: {id: 0, value: ""},
    });
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

  function handleDropdown(type: string, idx: number) {
    const target = contents.table_items.find((data) => {
      return data.checked == true;
    });
    console.log(idx)
    switch (idx) {
      case 0:
        setExposureMenuContents({...exposureMenuContents, modal_visible: true});
        break;
      case 1:
        setCategoryModalContents({
          visible: true,
          target: "category",
          title: "???????????? ??????",
          category: {id: 0, value: ""},
        });
        break;
      case 2:
        setRadioModal(target);
        break;
      case 3:
        setEditModal({
          title: "????????? ??????",
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
          title: "?????? ??????",
          visible: true,
          value: target.introduction,
          type: "textarea",
          read_only: false,
          target: "restaurant",
          edit_target: "introduction",
        });
        break;
      case 6:
        imageToBlob(target);
        break;
      case 7:
        const ok = confirm(`${target.label} ???????????? ?????????????????????????`);
        if (ok) {
          deleteData("restaurant", target.id).then(() => {
            getTableItems("restaurant");
          });
        }
        break;
    }
  }

  async function setExposureMenuContentsImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (files.length == 0) return;
    const new_file_name = await readFile(files[0]);
    setExposureMenuContents({
      ...exposureMenuContents,
      image: {
        file: files[0],
        imageUrl: new_file_name,
      },
    });
  }

  async function addCategory(data: {category: string; menu: {label: string; price: string}[]}) {
    let category_id = 0;
    const target = contents.table_items.find((item) => {
      return item.checked == true;
    });
    if (categoryModalContents.target == "category") {
      const res_category = await fetchPostApi(`/restaurant/${target.id}/category`, {category: data.category});
      category_id = res_category.id;
    } else {
      category_id = categoryModalContents.category.id;
    }

    const menu = data.menu;
    let params = [];
    for (let i = 0, leng = menu.length; i < leng; i++) {
      params.push({
        label: menu[i].label,
        price: menu[i].price,
        restaurant_id: target.id,
        category_id: category_id,
        seq: i,
      });
    }

    const res_entire_menu = await fetchPostApi(`/entire_menu`, {params});
    if (res_entire_menu.length > 0) {
      clearCategoryContents();
      getTableItems("restaurant");
    }
  }
  
  function handleExposureMenuContents(e: React.ChangeEvent<HTMLInputElement>, target:string) {
    let value = e.target.value;
    if (target == "price") {
      value = value.toLocaleString();
    }
    setExposureMenuContents({
      ...exposureMenuContents,
      [target]: value,
    });
  }

  async function addExposureMenu() {
    const ok = confirm("??????????????? ?????????????????????????");
    if (ok) {
      const target = contents.table_items.find((data) => {
        return data.checked == true;
      });

      const param = {
        label: exposureMenuContents.label,
        price: exposureMenuContents.price,
        comment: exposureMenuContents.comment,
        restaurant_id: target.id,
      };

      const menu = await fetchPostApi(`/manager/1/restaurant/${target.id}/exposure_menu`, param);

      let upload_image = new FormData();
      const file_name_arr = exposureMenuContents.image.file.name.split(".");
      const file_extention = file_name_arr[file_name_arr.length - 1];
      const new_file = new File(
        [exposureMenuContents.image.file],
        `${target.id}_${menu.id}_0_${new Date().getTime()}.${file_extention}`,
        {
          type: "image/jpeg",
        }
      );

      upload_image.append(`files_0`, new_file);
      upload_image.append("length", "1");
      upload_image.append("category", "11");

      fetchFileApi("/upload/image", upload_image).then(() => {
        clearExposureMenuContents();
        getTableItems("restaurant");
      });
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
            type="restaurant"
            onClick={(type, idx) => handleDropdown(type, idx)}
          />
        </div>
        <div style={{height: "28rem", width: "100%"}}>
          <CustomTable
            header={contents.header}
            footerColspan={contents.header.length}
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
      <RadioModal
        visible={radioModalContents.visible}
        contents={radioModalContents.contents}
        title={radioModalContents.title}
        hideModal={() => setRadioModalContents({visible: false, title: "", contents: [], target: ""})}
        onChange={(val) => handleRadioModal(val)}
      />
      <CategoryModal
        visible={categoryModalContents.visible}
        target={categoryModalContents.target}
        title={categoryModalContents.title}
        hideModal={() => clearCategoryContents()}
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
          <h2 className={styles.modal_title} style={{marginBottom: "1rem"}}>
            ???????????? ??????
            <HiX onClick={() => clearExposureMenuContents()} />
          </h2>
          <div className={res_style.rest_exposure_menu}>
            <div className={res_style.rest_menu_circle}></div>
            <div className={res_style.rest_exposure_menu_imgbox}>
              <label htmlFor={`exposure_menu_img`}>
                {exposureMenuContents.image.file == null ? (
                  <span>?????????</span>
                ) : (
                  <div className={res_style.rest_exposure_menu_img_wrap}>
                    <img src={exposureMenuContents.image.imageUrl} alt="exposure_menu_image" />
                  </div>
                )}
              </label>
              <input type="file" onChange={(e) => setExposureMenuContentsImage(e)} id={`exposure_menu_img`} />
            </div>
            <div className={res_style.rest_exposure_menu_textbox}>
              <CustomInput
                type="text"
                placeholder="?????? ????????? ??????????????????."
                onChange={(e) => handleExposureMenuContents(e, "label")}
                value={exposureMenuContents.label}
                align="right"
              />
              <div style={exposureMenuContents.price.length > 0 ? {paddingRight: "8px"} : {}}>
                <CustomInput
                  type="text"
                  placeholder="?????? ????????? ??????????????????."
                  onChange={(e) => handleExposureMenuContents(e, "price")}
                  value={exposureMenuContents.price}
                  align="right"
                />
                {exposureMenuContents.price.length > 0 ? "???" : null}
              </div>
              <CustomInput
                type="text"
                placeholder="??? ??? ????????? ??????????????????."
                onChange={(e) => handleExposureMenuContents(e, "comment")}
                value={exposureMenuContents.comment}
                align="right"
              />
            </div>
          </div>
          <div className={styles.util_box} style={{paddingRight: "48px"}}>
            <Button onClick={() => addExposureMenu()} color="orange" variant="contained">
              ??????
            </Button>
          </div>
        </div>
      </ModalContainer>
    </div>
  );
};
export default MangeRestaurantInfo;
