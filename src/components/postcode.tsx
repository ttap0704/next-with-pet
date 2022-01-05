import React, {useEffect, useState} from "react";
import DaumPostcode from "react-daum-postcode";
import styles from "../../styles/components.module.scss";
import ModalContainer from "./ModalContainer";

const PostCode = (props) => {
  const visible = props.visible;

  const onCompletePost = (data) => {
    const f_data = {
      zonecode: data.zonecode,
      sido: data.sido,
      sigungu: data.sigungu,
      bname: data.bname,
      road_address: data.roadAddress,
      building_name: data.buildingName,
    };
    props.complete(f_data);
  };

  return (
    <>
      <ModalContainer backClicked={() => props.hideModal()} visible={visible}>
        <DaumPostcode className={styles.postcode} autoClose onComplete={onCompletePost} />
      </ModalContainer>
    </>
  );
};

export default PostCode;
