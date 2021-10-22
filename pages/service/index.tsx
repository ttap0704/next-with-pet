// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/pages/service.module.scss";
// import { actions, RESET_USER } from "../../reducers/models/user";
import { RootState } from "../../reducers";
import { useSelector } from "react-redux";
import Link from "next/link";

const Service = () => {
  const { uid, unick, profile_img_path } = useSelector(
    (state: RootState) => state.userReducer
  );

  const service_cotents = [
    { label: "회원정보 수정", type: "modify", path: "registration" },
    { label: "숙박업소 등록", type: "add_accom", path: "registration" },
    { label: "식당 등록", type: "add_rest", path: "registration" },
  ];
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch({
  //     type: RESET_USER,
  //   });
  // }, []);

  return (
    <div className={styles.service_container}>
      <div
        className={styles.service_profile_img}
        style={{ backgroundImage: `url(${profile_img_path})` }}
      ></div>
      <div className={styles.service_service}>
        <h2>{unick}님</h2>
        <div className={styles.service_btn_container}>
          {service_cotents.map((data) => {
            return (
              <div className={styles.service_btn} key={data.type}>
                <Link href={`/service/${data.path}`}>
                  <a>{data.label}</a>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Service;
