import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/pages/registration.module.scss";
import c_styles from "../../../styles/custom.module.scss";
// import { actions, RESET_USER } from "../../reducers/models/user";
// import { RootState } from "../../reducers";
// import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Service = () => {
  const router = useRouter();
  let [title, setTitle] = useState("");

  return (
    <form className={styles.form_box}>
      <input
        type="text"
        placeholder="제목을 입력해주세요."
        className={styles.custom_input}
      ></input>
      <textarea placeholder="내용을 입력해주세요"></textarea>
    </form>
  );
};

export default Service;
