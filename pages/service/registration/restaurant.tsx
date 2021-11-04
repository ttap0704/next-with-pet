import React, {
  useEffect,
  useState,
  useLayoutEffect,
  cloneElement,
} from "react";
import styles from "../../../styles/pages/registration.module.scss";
import common from "../../../styles/common.module.scss";
import res_style from "../../../styles/pages/restaurant.module.scss";
import color from "../../../styles/color.module.scss";
import { useRouter } from "next/router";
import { FaFileUpload } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight, HiChevronDown } from "react-icons/hi";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const Service = () => {
  const router = useRouter();
  let [curPage, setCurPage] = useState("exposure");
  let [title, setTitle] = useState("제목을 입력해주세요.");
  let [previewFile, setPreviewFile] = useState({
    file: null,
    imageUrl: "",
  });
  let [detailPreview, setDetailPreview] = useState([]);
  let [detailPreviewNum, setDetailPreviewNum] = useState(0);
  let [roomDetail, setRoomDetail] = useState([
    {
      key: "0",
      title: "",
      people: "",
      max_people: "",
      price: "",
      files: [],
      cur_num: 0,
    },
  ]);
  const [expanded, setExpanded] = React.useState<string | false>("panel1");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
    key?: string,
    data?: object
  ) {
    const detail_slider = document.getElementById(`detail_img_slider_${key}`);
    const detail_slider_wrap = document.getElementById(
      `room_slider_wrap_${key}`
    );
    let file = event.currentTarget.files;
    if (file.length > 0) {
      if (type == "exposure") {
        let reader = new FileReader();
        reader.onload = () => {
          setPreviewFile({ file: file[0], imageUrl: reader.result.toString() });
          setDetailPreview((state) => [
            ...state,
            { file: file[0], imageUrl: reader.result.toString() },
          ]);
        };
        reader.readAsDataURL(file[0]);
      } else if (type == "detail") {
        let files = Array.from(file);
        files.forEach((file) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            setDetailPreview((state) => [
              ...state,
              { file: file, imageUrl: reader.result.toString() },
            ]);
          };
          reader.readAsDataURL(file);
        });
      } else {
        console.log(key, roomDetail, data);
        let files = Array.from(file);
        let items = [...roomDetail];
        let item = items[key];
        item.files = [];
        files.forEach((file) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            item.files.push({
              file: file,
              imageUrl: reader.result.toString(),
            });
            const li_tag = document.createElement("li");
            const image = document.createElement("img");
            image.setAttribute("src", reader.result.toString());
            li_tag.append(image);
            detail_slider.append(li_tag);
          };
          reader.readAsDataURL(file);
          detail_slider_wrap.children[1].setAttribute(
            "style",
            "display: none;"
          );
        });
        detail_slider.style.width = `${files.length * 17}rem`;
        items[key] = item;
        setRoomDetail([...items]);
      }
    } else {
      switch (type) {
        case "exposure":
          setPreviewFile({ file: null, imageUrl: "" });
          break;
        case "room":
          console.log("room");
          let items = [...roomDetail];
          let item = items[key];
          item.files = [];
          items[key] = item;
          setRoomDetail([...items]);
          detail_slider.innerHTML = "";
          detail_slider_wrap.children[1].setAttribute(
            "style",
            "display: block;"
          );
          detail_slider.style.width = `100%`;
      }
    }
  }

  const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid #e3e3e3`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary {...props} />
  ))(({ theme }) => ({
    backgroundColor: "#fff",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  const preview = () => {
    return (
      <div className={styles.rest_preview}>
        <div className={res_style.list}>
          <div className={res_style.list_img}></div>
          <div className={res_style.list_text_container}>
            <div className={res_style.list_text}>
              <h2>제목 들어갈 자리</h2>
              <span className={res_style.list_rating}>위치 들어갈 자리</span>
              <p className={res_style.list_hashtags}>해시태그 들어갈 자리</p>
            </div>
            <div className={res_style.list_deco}></div>
          </div>
        </div>
        <div className={styles.rest_img_container}>이미지</div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.page} style={{ marginLeft: "0" }}>
        <h1>상세 페이지</h1>
        <div>
          <h2>대표 이미지</h2>
          {preview()}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
            }}
          >
            <label htmlFor="detail_img" className={common.file_input}>
              대표이미지 업로드
              <FaFileUpload />
            </label>
            <input
              type="file"
              onChange={(e) => uploadImage(e, "detail")}
              id="detail_img"
              multiple
            ></input>
            <span
              style={{
                color: "#666",
                marginTop: "4px",
                textAlign: "right",
              }}
            >
              * 식당의 대표이미지 설정입니다.
            </span>
          </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <h2>식당 소개</h2>
          <form className={styles.form_box}>
            <input
              type="text"
              placeholder="식당 이름을 입력해주세요."
              className={styles.custom_input}
            ></input>
            <div>위치 들어갈 자리</div>
          </form>
        </div>
        <div>
          <h2>식당 메뉴</h2>
          <div className={styles.rest_menu}>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>대표 메뉴</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles.rest_exposure_menu}>
                  <label htmlFor="detail_img">
                    이미지
                  </label>
                  <input
                    type="file"
                    onChange={(e) => uploadImage(e, "detail")}
                    id="detail_img"
                    multiple
                  />
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography>전체 메뉴</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>전체 메뉴 1</Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default Service;
