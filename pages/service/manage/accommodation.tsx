import styles from "../../../styles/pages/service.module.scss";
import { RootState } from "../../../reducers";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { fetchGetApi } from "../../../src/tools/api";
import CustomTable from "../../../src/components/CustomTable"
import { Checkbox, TableCell, TableRow } from "@mui/material";
import CustomDropdown from "../../../src/components/CustomDrodown"
import {getDate} from "../../../src/tools/common"

const EditAccommodation = () => {
  const router = useRouter();
  const { uid } = useSelector(
    (state: RootState) => state.userReducer
  );

  const [accommodations, setAccommodations] = useState([]);
  const [rooms, setRooms] = useState([]);

  const accommodation_header = ['', '이름', '주소', '방 개수', '소개', '등록일']


  useEffect(() => {
    fetchGetApi(`/accommodation?uid=1`).then((res) => {
      for (let x of res) {
        setAccommodations(state => {
          return [
            ...state,
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
              checked: false
            }
          ]
        })

        for (let i = 0, leng = x.accommodation_rooms.length; i < leng; i++) {
          setRooms(state => {
            return [
              ...state,
              {
                ...x.accommodation_rooms[i],
                accommodation_name: x.label
              }
            ]
          })
        }
      }
    })
  }, [])

  function setChecked(idx: number, type: string, event_type:string, e?: React.ChangeEvent<HTMLInputElement>) {
    let checked = undefined;
    if (event_type == 'change') {
      checked = e.target.checked;
    } else {
      checked = !accommodations[idx].checked;
    }
    
    if (type == 'accommodation') {
      setAccommodations(state => {
        return [
          ...state.map((data, index) => {
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
          })
        ]
      })
    }
  }

  function setAccommodationCell(cell: string, idx: number) {
    let tag: ReactElement | string;
    switch (cell) {
      case '':
        tag = <Checkbox
          checked={accommodations[idx].checked}
          onChange={(e) => setChecked(idx, 'accommodation', 'change', e)}
        ></Checkbox>
        break;
      case '이름':
        tag = accommodations[idx].label;
        break;
      case '주소':
        tag = `${accommodations[idx].sido} ${accommodations[idx].sigungu} ${accommodations[idx].bname}`
        break;
      case '방 개수':
        tag = accommodations[idx].rooms_num;
        break;
      case '소개':
        tag = '확인';
        break;
      case '등록일':
        tag = getDate(accommodations[idx].created_at);
        break;
    }

    return tag;
  }

  function test(page) {
      console.log(page)
  }

  return (
    <div>
      <div className={styles.manage_title}>
        <h2>숙박업소 관리</h2>
        < CustomDropdown />
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <CustomTable
          header={accommodation_header}
          footerColspan={6}
          rowsLength={10}
          changePerPage={(page) => {test(page)}}
        >
          {accommodations.map((data, index) => {
            return (
              <TableRow key={`accommodations_row_${index}`}
                onClick={() => setChecked(index, 'accommodation', 'click')}
              >
                {accommodation_header.map((cell, index2) => {
                  return (
                    <TableCell key={`accommodations_cell_${index2}`}>
                      {setAccommodationCell(cell, index)}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </CustomTable>
      </div>
      <h2>객실 관리</h2>
    </div>
  );
};

export default EditAccommodation;
