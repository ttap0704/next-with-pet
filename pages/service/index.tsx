// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/pages/service.module.scss";
// import { actions, RESET_USER } from "../../reducers/models/user";
import { RootState } from "../../reducers";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Service = () => {
  const router = useRouter();
  const { unick, profile_path } = useSelector(
    (state: RootState) => state.userReducer
  );

  const service_cotents = [
    {
      label: "회원정보 수정",
      type: "modify",
      path: "info",
      icon_path: "들어갈 예정",
    },
    {
      label: "숙박업소 등록",
      type: "accommodation",
      path: "registration",
      icon_path: "들어갈 예정",
    },
    {
      label: "식당 등록",
      type: "restaurant",
      path: "registration",
      icon_path: "들어갈 예정",
    },
  ];

  const movePage = (data: { path: string; type: string }) => {
    if (data.type == "modify") {
      router.push({ pathname: "/service/info" });
    } else {
      router.push({
        pathname: `/service/${data.path}/[type]`,
        query: { type: data.type },
      });
    }
  };

  return (
    <div className={styles.service_container}>
      <div
        className={styles.service_profile_img}
        style={{ backgroundImage: `url(${profile_path})` }}
      ></div>
      <div className={styles.service_service}>
        <h2>{unick}님</h2>
        <div className={styles.service_btn_container}>
          {service_cotents.map((data) => {
            return (
              <div
                className={styles.service_btn}
                key={data.type}
                onClick={() => movePage(data)}
              >
                <a>
                  <span>{data.label}</span>
                  <p>{data.icon_path}</p>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Service;
