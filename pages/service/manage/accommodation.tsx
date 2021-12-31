// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/pages/service.module.scss";
// import { actions, RESET_USER } from "../../reducers/models/user";
import { RootState } from "../../../reducers";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {fetchGetApi} from "../../../src/tools/api";

const EditAccommodation = () => {
  const router = useRouter();
  const { uid } = useSelector(
    (state: RootState) => state.userReducer
  );

  const edit_contents = [
    {
      label: ''
    }
  ]

  useEffect(() => {
    fetchGetApi(`/accommodation?uid=1`).then((res) => {
      console.log(res)
    })
    console.log(uid)
  }, [])

  return (
    <div className={styles.service_container}>
      EditAccommodation
    </div>
  );
};

export default EditAccommodation;
