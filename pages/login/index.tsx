// import { useEffect } from "react";
import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../reducers";
import styles from "../../styles/pages/login.module.scss";

const Login = () => {
  // const { no, text } = useSelector((state: RootState) => state.testReducer);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch({
  //     type: RESET_TEXT,
  //   });
  // }, []);
  let [contentsText, setContentsText] = useState("login");

  const button_txt = (type: string) => {
    if (type == "login") {
      return "로그인";
    } else {
      return "회원가입";
    }
  };

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
        label: '아이디',
        placeholder: '아이디를 입력해주세요.'
      },
      {
        label: '비밀번호',
        placeholder: '비밀번호를 입력해주세요.'
      },
      {
        label: '닉네임',
        placeholder: '닉네임을 입력해주세요.'
      },
    ]

    let contents;
    if (type == "login") {
      contents = login_contents;
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

  const changeContents = () => {
    if (contentsText == "login") {
      setContentsText('join')
    } else {
      setContentsText('login')
    }
  };

  return (
    <>
      <form className={styles.form_box}>
        {contents(contentsText)}
        <div style={{ textAlign: "right" }}>
          <span
            style={{ padding: "6px 0", display: "block", cursor: "pointer" }}
            onClick={changeContents}
          >
            {button_txt(contentsText)} 하기
          </span>
        </div>
        <button >{button_txt(contentsText)}</button>
      </form>
    </>
  );
};

export default Login;
