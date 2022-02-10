import React, {ReactElement, useEffect, useState} from "react";
import {useDispatch} from "react-redux";

import styles from "../../../styles/pages/service.module.scss";

import CustomDropdown from "../../../src/components/CustomDrodown";
import CustomTable from "../../../src/components/CustomTable";
import EditModal from "../../../src/components/EditModal";
import RadioModal from "../../../src/components/RadioModal";
import EditOrderModal from "../../../src/components/EditOrderModal";

import {fetchGetApi, fetchDeleteApi, fetchPatchApi, fetchPostApi} from "../../../src/tools/api";
import {Checkbox, TableCell, TableRow} from "@mui/material";

const MangeRestaurantCategory = ({data}) => {

  useEffect(() => {
    console.log(data)
    getTableItems("entire_menu");
  }, []);

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
        label: "메뉴수",
        center: false,
      },
    ],
    table_items: [],
    edit_items: ["카테고리명 수정", "메뉴 순서 변경", "카테고리 삭제"],
    type: "category",
    count: 0,
    title: "카테고리 관리",
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
    let url = `/manager/${1}/restaurant/category?page=${page_num}`;
    fetchGetApi(url).then((res) => {
      count = res.count;
      for (let x of res.rows) {
        tmp_table_items.push({
          id: x.id,
          restaurant_label: x.restaurant_label,
          restaurant_id: x.restaurant_id,
          category: x.category,
          menu: x.menu,
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

    stauts = await fetchDeleteApi(`/manager/1/restaurant/${restaurant_id}/category/${id}`);

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
      case "메뉴수":
        tag = contents.table_items[idx].menu.length + "개";
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

    fetchPatchApi(`/manager/1/restaurant/${item.restaurant_id}/category/${item.id}`, {target, value}).then((status) => {
      if (status == 200) {
        alert("수정이 완료되었습니다.");
      } else {
        alert("수정이 실패되었습니다.");
      }
      setEditModal({title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: ""});
      getTableItems("category");
    });
  }

  function handleDropdown(type: string, idx: number) {
    const target = contents.table_items.find((data) => {
      return data.checked == true;
    });

    switch (idx) {
      case 0:
        setEditModal({
          title: "카테고리명 수정",
          visible: true,
          value: target.category,
          type: "input",
          read_only: false,
          target: "category",
          edit_target: "category",
        });
        break;
      case 1:
        console.log(target.menu);
        setEditOrderModal({
          visible: true,
          data: target.menu.map((item) => {
            return {
              ...item,
              number: Number(item.seq) + 1,
            };
          }),
          type: "category",
        });
        break;
      case 2:
        const ok = confirm(`${target.category} 카테고리를 삭제하시겠습니까?`);
        if (ok) {
          deleteData("category", target.id).then(() => {
            getTableItems("category");
          });
        }
        break;
    }
  }

  async function setMenuOrder(data) {
    const ok = confirm("메뉴 순서를 변경하시겠습니까?");
    if (ok) {
      const target = contents.table_items.find((data) => {
        return data.checked == true;
      });

      const body = data.map((item) => {
        return {
          ...item,
          seq: item.number - 1,
        };
      });

      const response = await fetchDeleteApi(`/manager/1/restaurant/${target.restaurant_id}/category/${target.id}/menu`);
      if (response) {
        const menu = await fetchPostApi(`/manager/1/restaurant/${target.restaurant_id}/category/${target.id}/menu`, {
          menu: body,
        });
        console.log(menu);
      }
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
      <EditOrderModal
        visible={editOrderModal.visible}
        data={editOrderModal.data}
        type={editOrderModal.type}
        onSubmit={(data) => setMenuOrder(data)}
        hideModal={() => setEditOrderModal({visible: false, data: [], type: ""})}
      />
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetchGetApi(`/manager/${1}/restaurant/category?page=1`);

  console.log(res, 'serversideporps')

  return {props: {data: res}};
}

export default MangeRestaurantCategory;
