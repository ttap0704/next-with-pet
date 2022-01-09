import styles from "../../styles/components.module.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import ModalContainer from "./ModalContainer";
import CustomInput from "./CustomInput";
import {TiDelete} from "react-icons/ti";
import {HiX} from "react-icons/hi";

const UploadModal = (props) => {
  const dispatch = useDispatch();
  const visible: Boolean = props.visible;
  const parent_info: {
    amenities: string;
    additional_info: string;
  } = props.parent_info;
  const type: string = props.type;

  const [info, setInfo] = useState({
    amenities: [],
    additional_info: [],
  });
  const [tmpInfo, setTmpInfo] = useState({
    amenities: "",
    additional_info: "",
  });
  const info_contents = [
    {
      title: "편의시설",
      placeholder: "편의 시설을 입력해주세요. ex) 바베큐장, 강아지 수영장...",
      type: "amenities",
    },
    {
      title: "추가정보",
      placeholder: "추가정보를 입력해주세요. ex) 흡연금지, 숯불...",
      type: "additional_info",
    },
  ];

  useEffect(() => {
    if (parent_info == null) {
      setInfo({
        amenities: [],
        additional_info: [],
      });
    } else {
      setInfo({
        amenities:
          !parent_info.amenities || parent_info.amenities.length == 0 ? [] : [...parent_info.amenities.split(",")],
        additional_info:
          !parent_info.additional_info || parent_info.additional_info.length == 0
            ? []
            : [...parent_info.additional_info.split(",")],
      });
    }
  }, [parent_info]);

  function setInfoValue(e: React.ChangeEvent<HTMLTextAreaElement>, type: string) {
    let value = e.target.value;
    setTmpInfo((state) => {
      return {
        ...state,
        [type]: value,
      };
    });
  }

  function keyDownHandler(e: React.KeyboardEvent<HTMLTextAreaElement>, type: string) {
    const code = e.keyCode;
    if (code == 13 && tmpInfo[type].length > 0) {
      setInfo((state) => {
        return {
          ...state,
          [type]: [...state[type], tmpInfo[type]],
        };
      });
      setTmpInfo((state) => {
        return {
          ...state,
          [type]: "",
        };
      });
    }
  }

  function removeContents(idx: number, type: string) {
    setInfo((state) => {
      return {
        ...state,
        [type]: state[type]
          .map((data, index) => {
            if (index != idx) {
              console.log(data);
              return data;
            }
          })
          .filter((data) => {
            return data != undefined;
          }),
      };
    });
  }

  return (
    <ModalContainer backClicked={() => props.hideModal()} visible={visible} zIndex={1}>
      <div className={styles.info_modal}>
        <h2 className={styles.modal_title}>
          추가 정보 입력
          <HiX onClick={() => props.hideModal()} />
        </h2>
        <div className={styles.info_container}>
          {info_contents.map((data, index) => {
            return (
              <div className={styles.info_contents} key={`${data.type}_${index}`}>
                <h3>{data.title}</h3>
                <div className={styles[`info_${type}`]}>
                  {type == "registration" ? (
                    info[data.type].map((item, index) => {
                      return (
                        <span key={`${data.type}_contents_${index}`}>
                          {item}
                          <TiDelete onClick={() => removeContents(index, data.type)} />
                        </span>
                      );
                    })
                  ) : (
                    <span>{info[data.type].toString().replace(",", ", ")}</span>
                  )}
                </div>
                {type == "registration" ? (
                  <CustomInput
                    placeholder={data.placeholder}
                    onChange={(e) => setInfoValue(e, data.type)}
                    onKeyDown={(e) => keyDownHandler(e, data.type)}
                    value={tmpInfo[data.type]}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
        {type == "registration" ? (
          <button onClick={() => props.onRegistered(info)} className={styles.regi_button}>
            등록
          </button>
        ) : null}
      </div>
    </ModalContainer>
  );
};

export default UploadModal;
