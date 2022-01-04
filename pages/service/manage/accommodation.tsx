import styles from "../../../styles/pages/service.module.scss";
import {RootState} from "../../../reducers";
import {useSelector} from "react-redux";
import {useRouter} from "next/router";
import {ReactElement, useEffect, useState} from "react";
import {fetchGetApi} from "../../../src/tools/api";
import CustomTable from "../../../src/components/CustomTable";
import {Checkbox, TableCell, TableRow} from "@mui/material";
import CustomDropdown from "../../../src/components/CustomDrodown";
import {getDate} from "../../../src/tools/common";
import {Button} from "@mui/material"

const EditAccommodation = () => {
  useEffect(() => {
    getTableItems("accommodation");
    getTableItems("rooms");
  }, []);

  const router = useRouter();
  const {uid} = useSelector((state: RootState) => state.userReducer);

  const [contents, setContents] = useState({
    accommodation: {
      header: [{
        label: "",
        center: true
      },
      {
        label: "이름",
        center: false
      },
      {
        label: "주소",
        center: false
      },
      {
        label: "방 개수",
        center: false
      },
      {
        label: "소개",
        center: true
      },
      {
        label: "등록일",
        center: false
      }],
      table_items: [],
      edit_items: ["객실 추가", "소개 수정", "주소 수정", "업소명 수정", "대표이미지 수정", "업소 삭제"],
      type: "accommodation",
      count: 0,
      title: "숙박업소 관리",
      button_disabled: true
    },
    rooms: {
      header: [{
        label: "",
        center: true
      },
      {
        label: "숙박 업소명",
        center: false
      },
      {
        label: "객실명",
        center: false
      },
      {
        label: "기준 인원",
        center: false
      },
      {
        label: "추가 정보",
        center: true
      }],
      table_items: [],
      edit_items: ["객실명 수정", "추가 정보 수정", "인원 수정", "대표이미지 수정", "객실 삭제"],
      type: "rooms",
      count: 0,
      title: "객실 관리",
      button_disabled: true
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
          button_disabled: !checked
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
                          <TableCell align={cell.center ? 'center' : 'left'} key={`${contents[key].type}_cell_${index2}`}>
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
    </div>
  );
};

export default EditAccommodation;
