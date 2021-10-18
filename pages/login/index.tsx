// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../reducers";
import c_style from "../styles/color.module.scss";
import styles from "../../styles/pages/login.module.scss";

const Comunity = () => {
  // const { no, text } = useSelector((state: RootState) => state.testReducer);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch({
  //     type: RESET_TEXT,
  //   });
  // }, []);

  const contents = (type: string) => {
    const login_contents = [
      {
        label: "아이디",
        placeholder: "아이디를 입력해주세요.",
      },
      {
        label: "비밀번호",
        placeholder: "비밀번호를 입력해주세요.",
      },
    ];

    let contents;
    if (type == "login") {
      contents = login_contents;
    }

    return (
      <form className={styles.form_box}>
        {contents.map((data) => {
          return (
            <div className={styles.input_box}>
              <label>{data.label}</label>
              <input type="text" placeholder={data.placeholder} />
            </div>
          );
        })}
      </form>
    );
  };

  return <>{contents("login")}</>;
};

export default Comunity;
