import React, {ReactElement, useEffect, useState} from "react";
import {useDispatch} from "react-redux";

import styles from "../../../../styles/pages/service.module.scss";

import CustomDropdown from "../../../../src/components/CustomDrodown";
import CustomTable from "../../../../src/components/CustomTable";
import EditModal from "../../../../src/components/EditModal";
import UploadModal from "../../../../src/components/UploadModal";

import {fetchGetApi, fetchDeleteApi, fetchPatchApi, fetchFileApi, fetchPostApi} from "../../../../src/tools/api";
import {Checkbox, TableCell, TableRow} from "@mui/material";
import {Button} from "@mui/material";

const MangeRestaurantExposureMenu = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getTableItems("exposure_menu");
  }, []);

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
    let url = `/manager/${1}/restaurant/exposure_menu?page=${page_num}`;
    fetchGetApi(url).then((res) => {
      count = res.count;
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
      const target = contents[type].table_items.find((item) => {
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
            onChange={(e) => setChecked(idx, "exposure_menu", "change", e)}
          ></Checkbox>
        );
        break;
      case "음식점":
        tag = contents.table_items[idx].restaurant_label;
        break;
      case "메뉴명":
        tag = contents.table_items[idx].label;
        break;
      case "가격":
        tag = Number(contents.table_items[idx].price).toLocaleString() + " 원";
        break;
      case "한 줄 설명":
        tag = (
          <Button
            onClick={() => {
              setEditModal({
                title: "설명 확인",
                visible: true,
                value: contents.table_items[idx].comment,
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

    return tag;
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

    fetchPatchApi(`/manager/1/restaurant/${item.restaurant_id}/exposure_menu/${item.id}`, {target, value}).then((status) => {
      if (status == 200) {
        alert("수정이 완료되었습니다.");
      } else {
        alert("수정이 실패되었습니다.");
      }
      setEditModal({title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: ""});
      getTableItems("exposure_menu");
    });
  }

  function handleDropdown(type: string, idx: number) {
    const target = contents.table_items.find((data) => {
      return data.checked == true;
    });
    console.log(idx);
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
    </div>
  );
};
export default MangeRestaurantExposureMenu;
