import styles from "../../styles/components.module.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import ModalContainer from "./ModalContainer";
import CustomInput from "./CustomInput";

const UploadModal = (props) => {
  const dispatch = useDispatch();
  const visible = props.visible;
  const [info, setInfo] = useState({
    amenities: [],
    additional_info: [],
  });
  const [tmpInfo, setTmpInfo] = useState({
    amenities: "",
    additional_info: "",
  });

  useEffect(() => {}, []);

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
    if (code == 13) {
      console.log(tmpInfo[type]);
      setInfo(state => {
        return {
          ...state,
          [type]: [
            ...state[type],
            tmpInfo[type]
          ]
        }
      })
      setTmpInfo(state => {
        return {
          ...state,
          [type]: ""
        }
      })
    }
  }

  return (
    <ModalContainer backClicked={() => props.hideModal()} visible={visible}>
      <div className={styles.info_modal}>
        <h2 style={{padding: "2rem", backgroundColor: "#fff", width: "100%", textAlign: "center"}}>추가 정보 입력</h2>
        <div className={styles.info_container}>
          <div className={styles.info_contents}>
            <h3>편의시설</h3>
            <div>
              {info.amenities.map((data, index) => {
                return (
                  <span key={`amenities${index}`}>{data}</span>
                )
              })}
            </div>
            <CustomInput 
              placeholder="편의 시설을 입력해주세요. ex) 바베큐장, 강아지 수영장..."
              onChange={(e) => setInfoValue(e, 'amenities')}
              onKeyDown={(e) => keyDownHandler(e, 'amenities')}
              value={tmpInfo.amenities}
            />
          </div>
          <div className={styles.info_contents}>
            <h3>추가정보</h3>
            <div>
            {info.additional_info.map((data, index) => {
                return (
                  <span key={`additional_info${index}`}>{data}</span>
                )
              })}
            </div>
            <CustomInput 
              placeholder="추가정보를 입력해주세요. ex) 흡연금지, 숯불..."
              onChange={(e) => setInfoValue(e, 'additional_info')}
              onKeyDown={(e) => keyDownHandler(e, 'additional_info')}
              value={tmpInfo.additional_info}
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default UploadModal;
