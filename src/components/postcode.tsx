import React, { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import styles from "../../styles/components/postcode.module.scss";

const Post = (props) => {
  const onCompletePost = (data) => {
    console.log(data)
    const f_data = {
      zonecode: data.zonecode,
      sido: data.sido,
      sigungu: data.sigungu,
      bname1: data.bname,
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

export default Post;
