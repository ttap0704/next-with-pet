import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {useRouter} from "next/router";

import styles from "../../styles/pages/login.module.scss";
import {Button} from "@mui/material";
import {actions, RESET_USER} from "../../reducers/models/user";

import {fetchPostApi, fecthCheckBusiness} from "../../src/tools/api";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: RESET_USER,
    });
  }, []);

  let [contentsText, setContentsText] = useState("login");
  let [loginContents, setLoginContents] = useState({id: "", password: ""});
  let [joinContents, setJoinContents] = useState({id: "", password: "", nickname: ""});
  let [certificationContents, setCertificationContents] = useState({
    b_no: "",
    start_dt: "",
    p_nm: "",
    p_nm2: "",
    b_nm: "",
    corp_no: "",
    b_sector: "",
    b_type: "",
  });

  const contents = (type: string) => {
    const login_contents = [
      {
        label: "아이디",
        placeholder: "아이디를 입력해주세요.",
        target: "id",
      },
      {
        label: "비밀번호",
        placeholder: "비밀번호를 입력해주세요.",
        target: "password",
      },
    ];

    const join_contents = [
      {
        label: "아이디",
        placeholder: "아이디를 입력해주세요.",
        target: "id",
      },
      {
        label: "비밀번호",
        placeholder: "비밀번호를 입력해주세요.",
        target: "password",
      },
      {
        label: "이름",
        placeholder: "이름을 입력해주세요.",
        target: "name",
      },
      {
        label: "휴대폰 번호",
        placeholder: "휴대폰 번호를 입력해주세요.",
        target: "phone",
      },
      {
        label: "닉네임",
        placeholder: "닉네임을 입력해주세요.",
        target: "nickname",
      },
    ];

    // b_no: "0000000000";
    // start_dt: "20000101";
    // p_nm: "홍길동";
    // p_nm2: "홍길동";
    // b_nm: "(주)테스트";
    // corp_no: "0000000000000";
    // b_sector: "";
    // b_type: "";
    const cetification_contents = [
      {
        label: "사업자등록번호 *",
        placeholder: "아이디를 입력해주세요.",
        target: "b_no",
      },
      {
        label: "개업일자 *",
        placeholder: "닉네임을 입력해주세요.",
        target: "start_dt",
      },
      {
        label: "대표자성명 *",
        placeholder: "비밀번호를 입력해주세요.",
        target: "p_nm",
      },
      {
        label: "대표자성명2",
        placeholder: "닉네임을 입력해주세요.",
        target: "p_nm2",
      },
      {
        label: "상호",
        placeholder: "닉네임을 입력해주세요.",
        target: "b_nm",
      },
      {
        label: "법인등록번호",
        placeholder: "닉네임을 입력해주세요.",
        target: "corp_no",
      },
      {
        label: "주업태",
        placeholder: "닉네임을 입력해주세요.",
        target: "b_sector",
      },
      {
        label: "주종목",
        placeholder: "닉네임을 입력해주세요.",
        target: "b_type",
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
          <input
            type={data.label == "비밀번호" ? "password" : "text"}
            placeholder={data.placeholder}
            onChange={(e) => handleInput(e, data.target)}
          />
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

  function changeContents() {
    if (contentsText == "login") {
      setContentsText("certification");
    } else {
      setContentsText("login");
    }
  }

  function handleInput(e, target) {
    let item;

    if (contentsText == "login") item = loginContents;
    else if (contentsText == "join") item = joinContents;
    else if (contentsText == "certification") item = certificationContents;

    item[target] = e.target.value;

    if (contentsText == "login") setLoginContents({...item});
    else if (contentsText == "join") setJoinContents({...item});
    else if (contentsText == "certification") setCertificationContents({...item});
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (contentsText == "certification") {
      console.log(certificationContents);

      const res = await fecthCheckBusiness(certificationContents)
      console.log(res)
      // setContentsText("join");
    } else if (contentsText == "join") {
      fetchPostApi("/user/join", joinContents).then((res) => {
        console.log(res);
      });
      // setContentsText("login");
    } else {
      fetchPostApi("/user/login", loginContents).then((res: any) => {
        alert(res.message);
        if (res.pass) {
          dispatch(
            actions.addUser({
              uid: res.uid,
              unick: res.nickname,
              profile_path: "http://localhost:3080/uploads/profile/" + res.profile_path,
            })
          );
          router.push("/service");
        }
      });
    }
  }

  return (
    <>
      <form className={styles.form_box}>
        {contents(contentsText)}
        <div style={{textAlign: "right"}}>
          {contentsText == "certification" ? (
            <span style={{padding: "6px 0", display: "block"}}>* 항목은 필수항목입니다.</span>
          ) : null}
          <span style={{padding: "6px 0", display: "block", cursor: "pointer"}} onClick={() => changeContents()}>
            {contentsText == "login" ? "사업자 회원가입" : "로그인"}하기
          </span>
        </div>
        <Button onClick={(e) => onSubmit(e)} color="orange" variant="contained">
          {button_txt(contentsText)}
        </Button>
      </form>
    </>
  );
};

export default Login;
