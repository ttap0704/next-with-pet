import styles from "../../../styles/pages/service.module.scss";
import {RootState} from "../../../reducers";
import {useSelector, useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {ReactElement, useEffect, useState} from "react";
import {fetchGetApi, fetchDeleteApi, fetchPatchApi, fetchFileApi, fetchPostApi} from "../../../src/tools/api";
import {Checkbox, TableCell, TableRow} from "@mui/material";
import {Button} from "@mui/material";

import CustomDropdown from "../../../src/components/CustomDrodown";
import CustomTable from "../../../src/components/CustomTable";
import EditModal from "../../../src/components/EditModal";
import UploadModal from "../../../src/components/UploadModal";
import InfoModal from "../../../src/components/InfoModal";

import {actions} from "../../../reducers/common/upload";
import {readFile} from "../../../src/tools/common";

const ManageAccommodationRoom = () => {
  const dispatch = useDispatch();
  useEffect(() => {
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
    type: "rooms",
    count: 0,
    title: "객실 관리",
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

    if (page) {
      setContents((state) => {
        return {
          ...state,
          page: page,
        };
      });
      page_num = page;
    }
    let url = `/manager/1/accommodation/rooms?page=${page_num}`;

    fetchGetApi(url).then((res) => {
      setContents((state) => {
        return {
          ...state,
          count: res.count,
        };
      });

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
          table_items: [...tmp_table_items],
        };
      });
    });
  }

  function setTableCell(cell: string, idx: number, type: string) {
    let tag: ReactElement | string;
    switch (cell) {
      case "":
        tag = (
          <Checkbox
            checked={contents.table_items[idx].checked}
            onChange={(e) => setChecked(idx, "rooms", "change", e)}
          ></Checkbox>
        );
        break;
      case "숙박 업소명":
        tag = contents.table_items[idx].accommodation_label;
        break;
      case "객실명":
        tag = contents.table_items[idx].label;
        break;
      case "기준 인원":
        tag = contents.table_items[idx].standard_num + "명";
        break;
      case "최대 인원":
        tag = contents.table_items[idx].maximum_num + "명";
        break;
      case "추가 정보":
        const data = {
          amenities: contents.table_items[idx].amenities,
          additional_info: contents.table_items[idx].additional_info,
        };
        tag = <Button onClick={() => showInfoModal("check", data)}>확인</Button>;
        break;
    }

    return tag;
  }

  function handleDropdown(type: string, idx: number) {
    const target = contents.table_items.find((data) => {
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
          showInfoModal("edit", data);
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
    let url = "";
    if (type == "accommodation") {
      url = `/accommodation/${id}`;
    } else {
      const target = contents.table_items.find((item) => {
        return item.checked == true;
      });
      url = `/accommodation/${target.accommodation_id}/rooms/${id}`;
    }
    const status = await fetchDeleteApi(url);

    console.log(status);
  }

  function updateAddress(data) {
    console.log(data);
  }

  function updateValues(val: string) {
    const path = editModal.target;
    const target = editModal.edit_target;
    const value = val;
    const item = contents.table_items.find((data) => {
      return data.checked == true;
    });

    let url = "";
    if (path == "accommodation") {
      url = `/manager/1/accommodation/${item.id}`;
    } else {
      url = `/manager/1/accommodation/${item.accommodation_id}/rooms/${item.id}`;
    }

    fetchPatchApi(url, {target, value}).then((status) => {
      if (status == 200) {
        alert("수정이 완료되었습니다.");
      } else {
        alert("수정이 실패되었습니다.");
      }
      setEditModal({title: "", visible: false, value: "", type: "", read_only: false, target: "", edit_target: ""});
      getTableItems("rooms");
    });
  }

  function updateImages(files: File[], target: string, add_room?: Boolean) {
    if (!roomModalVisible) {
      const item = contents.table_items.find((data) => {
        return data.checked == true;
      });
      const target_id = item.id;

      let upload_images = new FormData();
      for (let i = 0, leng = files.length; i < leng; i++) {
        const file_name_arr = files[i].name.split(".");
        const file_extention = file_name_arr[file_name_arr.length - 1];
        let file_name = "";
        if (target == "accommodation") {
          file_name = `${target_id}_${i}_${new Date().getTime()}.${file_extention}`;
        } else if (target == "rooms") {
          file_name = `${item.accommodation_id}_${target_id}_${i}_${new Date().getTime()}.${file_extention}`;
        }

        const new_file = new File([files[i]], file_name, {
          type: "image/jpeg",
        });

        upload_images.append(`files_${i}`, new_file);
      }
      let category = "";
      if (target == "accommodation") {
        category = "2";
      } else if (target == "rooms") {
        category = "21";
      }
      upload_images.append("length", files.length.toString());
      upload_images.append("category", category);

      fetchDeleteApi(`/image/${target}/${target_id}`);
      fetchFileApi("/upload/image", upload_images)
        .then((res) => console.log(res, "1"))
        .then(() => {
          getTableItems("accommodation");
          getTableItems("rooms");
        });
    } else {
      setAddRoomImages(files, target);
    }
  }

  function setAddRoomImages(files: File[], target: string) {
    console.log(target);
    files.forEach(async (file: any) => {
      const new_file_name = await readFile(file);
      setAddRoomContents((state) => {
        return {
          ...state,
          files: [...state.files, {file: file, imageUrl: new_file_name}],
        };
      });
    });
  }

  function showInfoModal(type: string, data?: {amenities: string; additional_info: string}) {
    if (type == "add") {
      setInfoModalData({
        amenities: addRoomContents.info.amenities.toString(),
        additional_info: addRoomContents.info.additional_info.toString(),
      });
      setInfoModalType("registration");
    } else if (type == "edit") {
      setInfoModalData(data);
      setInfoModalType("registration");
    } else if (type == "check") {
      setInfoModalData(data);
      setInfoModalType("view");
    }

    setInfoModalVisible(true);
  }

  async function setAdditionalInfo(data: {amenities: string[]; additional_info: string[]}) {
    const ok = confirm("수정하시겠습니까?");
    if (ok) {
      const target = contents.table_items.find((item) => {
        return item.checked == true;
      });
      const edit_data1 = {
        target: "amenties",
        value: data.amenities.toString(),
      };
      const res1 = await fetchPatchApi(
        `/manager/1/accommodation/${target.accommodation_id}/rooms/${target.id}`,
        edit_data1
      );
      const edit_data2 = {
        target: "additional_info",
        value: data.additional_info.toString(),
      };
      const res2 = await fetchPatchApi(
        `/manager/1/accommodation/${target.accommodation_id}/rooms/${target.id}`,
        edit_data2
      );

      if (res1 == 200 && res2 == 200) {
        alert("수정이 완료되었습니다.");
        getTableItems("rooms");
        setInfoModalVisible(false);
      } else {
        alert("수정이 실패되었습니다.");
      }
    }
  }

  return (
    <div>
      <div className={styles.manage_contents}>
        <div className={styles.manage_title}>
          <h2>{contents.title}</h2>
          <CustomDropdown
            items={contents.edit_items}
            buttonDisabled={contents.button_disabled}
            type="rooms"
            onClick={(type, idx) => handleDropdown(type, idx)}
          />
        </div>
        <div style={{height: "28rem", width: "100%"}}>
          <CustomTable
            header={contents.header}
            footerColspan={6}
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
      <InfoModal
        visible={infoModalVisible}
        parent_info={infoModalData}
        hideModal={() => setInfoModalVisible(false)}
        onRegistered={(info) => setAdditionalInfo(info)}
        type={infoModalType}
      />
    </div>
  );
};

export default ManageAccommodationRoom;
