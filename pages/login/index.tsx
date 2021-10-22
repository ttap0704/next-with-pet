import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/router";

import styles from "../../styles/pages/login.module.scss";
import { actions, RESET_USER } from "../../reducers/models/user";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: RESET_USER,
    });
  }, []);

  let [contentsText, setContentsText] = useState("login");

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

    const join_contents = [
      {
        label: "아이디",
        placeholder: "아이디를 입력해주세요.",
      },
      {
        label: "비밀번호",
        placeholder: "비밀번호를 입력해주세요.",
      },
      {
        label: "닉네임",
        placeholder: "닉네임을 입력해주세요.",
      },
    ];

    const cetification_contents = [
      {
        label: "사업자등록번호 *",
        placeholder: "아이디를 입력해주세요.",
      },
      {
        label: "개업일자 *",
        placeholder: "닉네임을 입력해주세요.",
      },
      {
        label: "대표자성명 *",
        placeholder: "비밀번호를 입력해주세요.",
      },
      {
        label: "대표자성명2",
        placeholder: "닉네임을 입력해주세요.",
      },
      {
        label: "법인등록번호",
        placeholder: "닉네임을 입력해주세요.",
      },
      {
        label: "주업태 *",
        placeholder: "닉네임을 입력해주세요.",
      },
      {
        label: "주종목 *",
        placeholder: "닉네임을 입력해주세요.",
      },
    ];

    let contents;
    if (type == "login") {
      contents = login_contents;
    } else if (type == "certification") {
      contents = cetification_contents;
    } else {
      contents = join_contents;
    }

    return contents.map((data) => {
      return (
        <div className={styles.input_box} key={data.label}>
          <label>{data.label}</label>
          <input type="text" placeholder={data.placeholder} />
        </div>
      );
    });
  };

  const button_txt = (type: string) => {
    if (type == "login") {
      return "로그인";
    } else if (type == "certification") {
      return "사업자 인증";
    } else {
      return "회원가입";
    }
  };

  const changeContents = () => {
    if (contentsText == "login") {
      setContentsText("certification");
    } else {
      setContentsText("login");
    }
  };

  const onLogin = (e) => {
    e.preventDefault();
    dispatch(
      actions.addUser({
        uid: 1,
        unick: "쪼앙",
        profile_img_path:
          "https://fluffyhund.com/wp-content/uploads/Toy-Poodle-thumb-300x300.jpg",
      })
    );
    router.push("/service");
  };

  return (
    <>
      <form className={styles.form_box}>
        {contents(contentsText)}
        <div style={{ textAlign: "right" }}>
          {contentsText == "certification" ? (
            <span style={{ padding: "6px 0", display: "block" }}>
              * 항목은 필수항목입니다.
            </span>
          ) : null}
          <span
            style={{ padding: "6px 0", display: "block", cursor: "pointer" }}
            onClick={changeContents}
          >
            {contentsText == "login" ? "사업자 회원가입" : "로그인"}하기
          </span>
        </div>
        <button onClick={onLogin}>{button_txt(contentsText)}</button>
      </form>
    </>
  );
};

export default Login;
