import React, { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import styles from "../../styles/components/postcode.module.scss";

const PostCode = (props) => {
  const onCompletePost = (data) => {
    const f_data = {
      zonecode: data.zonecode,
      sido: data.sido,
      sigungu: data.sigungu,
      bname: data.bname,
      road_address: data.roadAddress,
      building_name: data.buildingName
    };
    props.complete(f_data);
  };

  return (
    <>
      <DaumPostcode className={styles.postcode} autoClose onComplete={onCompletePost} />
    </>
  );
};

export default PostCode;
