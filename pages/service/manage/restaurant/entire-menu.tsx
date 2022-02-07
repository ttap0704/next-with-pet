import React, {ReactElement, useEffect, useState} from "react";
import {useDispatch} from "react-redux";

import styles from "../../../../styles/pages/service.module.scss";

import CustomDropdown from "../../../../src/components/CustomDrodown";
import CustomTable from "../../../../src/components/CustomTable";
import EditModal from "../../../../src/components/EditModal";
import RadioModal from "../../../../src/components/RadioModal";

import {fetchGetApi, fetchDeleteApi, fetchPatchApi} from "../../../../src/tools/api";
import {Checkbox, TableCell, TableRow} from "@mui/material";

const MangeRestaurantEntrieMenu = () => {
  useEffect(() => {
    getTableItems("entire_menu");
  }, []);

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
    let url = `/manager/${1}/restaurant/entire_menu?page=${page_num}`;
    fetchGetApi(url).then((res) => {
      count = res.count;
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
    const target = contents.table_items.find((item) => {
      return item.checked == true;
    });

    const restaurant_id = target.restaurant_id;

    stauts = await fetchDeleteApi(`/manager/1/restaurant/${restaurant_id}/entire_menu/${id}`);

    return status;
  }

  function setTableCell(cell: string, idx: number, type: string) {
    let tag: ReactElement | string;
    switch (cell) {
      case "":
        tag = (
          <Checkbox
            checked={contents.table_items[idx].checked}
            onChange={(e) => setChecked(idx, "entire_menu", "change", e)}
          ></Checkbox>
        );
        break;
      case "음식점":
        tag = contents.table_items[idx].restaurant_label;
        break;
      case "카테고리":
        tag = contents.table_items[idx].category;
        break;
      case "메뉴명":
        tag = contents.table_items[idx].label;
        break;
      case "가격":
        tag = Number(contents.table_items[idx].price).toLocaleString() + " 원";
        break;
    }

    return tag;
  }

  function updateValues(val: string) {
    const target = editModal.edit_target;
    const value = val;
    const item = contents.table_items.find((data) => {
      return data.checked == true;
    });

    fetchPatchApi(`/manager/1/restaurant/${item.restaurant_id}/entire_menu/${item.id}`, {target, value}).then(
      (status) => {
        if (status == 200) {
          alert("수정이 완료되었습니다.");
        } else {
          alert("수정이 실패되었습니다.");
        }
        setEditModal({title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: ""});
        getTableItems("restaurant");
      }
    );
  }

  async function setRadioModal(target) {
    let restaurant_id = target.restaurant_id;
    let title = "카테고리 수정";

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
    const item = contents.table_items.find((data) => {
      return data.checked == true;
    });
    setRadioModalContents({
      visible: false,
      title: "",
      contents: [],
      target: "",
    });

    const value = val.id;

    fetchPatchApi(`/manager/1/restaurant/${item.restaurant_id}/entire_menu/${item.id}`, {
      target: "category_id",
      value,
    }).then((status) => {
      if (status == 200) {
        alert("수정이 완료되었습니다.");
      } else {
        alert("수정이 실패되었습니다.");
      }
      getTableItems("exposure_menu");
    });
  }

  function handleDropdown(type: string, idx: number) {
    const target = contents.table_items.find((data) => {
      return data.checked == true;
    });

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
      <RadioModal
        visible={radioModalContents.visible}
        contents={radioModalContents.contents}
        title={radioModalContents.title}
        hideModal={() => setRadioModalContents({visible: false, title: "", contents: [], target: ""})}
        onChange={(val) => handleRadioModal(val)}
      />
    </div>
  );
};
export default MangeRestaurantEntrieMenu;
