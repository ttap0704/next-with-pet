import styles from "../../../styles/pages/service.module.scss";
import { RootState } from "../../../reducers";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchGetApi } from "../../../src/tools/api";
import CustonTable from "../../../src/components/CustomTable"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';



const EditAccommodation = () => {
  const router = useRouter();
  const { uid } = useSelector(
    (state: RootState) => state.userReducer
  );

  const [accommodations, setAccommodations] = useState([]);
  const [rooms, setRooms] = useState([]);

  const accommodation_header = ['이름', '버튼']
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
    },
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

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
              deatil_address: x.detail_address,
              introduction: x.introduction,
              label: x.label,
              sido: x.sido,
              zonecode: x.zonecode
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

  return (
    <div>
      <h2>숙박업소 관리</h2>
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
      <h2>객실 관리 관리</h2>
    </div>
  );
};

export default EditAccommodation;
