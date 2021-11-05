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
  const [exposureImages, setExposureImages] = useState([]);
  const [exposureMenu, setExposureMenu] = useState([
    {
      file: {
        file: null,
        imageUrl: "",
      },
      label: "",
      price: "",
    },
  ]);
  const [entireMenu, setEntireMenu] = useState([
    {
      category: "",
      menu: [{ label: "", price: "" }],
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
  ) {}

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
    flexDirection: "row",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(180deg)",
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  const preview = () => {
    return (
      <div className={styles.rest_preview}>
        <div className={res_style.list}>
          <div className={res_style.list_img}>
            {exposureImages.length == 0 ? (
              <h3
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#666",
                }}
              >
                대표이미지를 업로드해주세요.
              </h3>
            ) : null}
          </div>
          <div className={res_style.list_text_container}>
            <div className={res_style.list_text}>
              <h2>제목 들어갈 자리</h2>
              <span className={res_style.list_rating}>위치 들어갈 자리</span>
              <p className={res_style.list_hashtags}>해시태그 들어갈 자리</p>
            </div>
            <div className={res_style.list_deco}></div>
          </div>
        </div>
        <div className={styles.rest_img_container}>
          {exposureImages.length == 0 ? (
            <h3>이미지를 업로드 해주세요.</h3>
          ) : (
            exposureImages.map((data) => {
              <img src={data.imageUrl} alt="exposureImage" />;
            })
          )}
        </div>
      </div>
    );
  };

  function setMenuData(e, idx: number, type: string) {
    e.preventDefault();
    let items = [...entireMenu];
    let item = items[idx];
    // if (type == "category") {
    //   item.category = e.target.value;
    // } else if (type == "label") {
    // }
    items[idx] = item;
    setEntireMenu([...items]);
    console.log(entireMenu);
  }

  return (
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
              expandIcon={<HiChevronDown />}
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography>대표 메뉴</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {exposureMenu.map((data, index) => {
                return (
                  <div
                    className={styles.rest_exposure_menu}
                    key={`exposure_menu_${index}`}
                  >
                    {data.file.file == null ? (
                      <div>
                        <label htmlFor="detail_img">이미지</label>
                        <input
                          type="file"
                          onChange={(e) => uploadImage(e, "detail")}
                          id="detail_img"
                        />
                      </div>
                    ) : (
                      <img src={data.file.imageUrl} alt="entire_image" />
                    )}
                  </div>
                );
              })}
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<HiChevronDown />}
              aria-controls="panel2d-content"
              id="panel2d-header"
            >
              <Typography>전체 메뉴</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ padding: 0 }}>
              {entireMenu.map((data, idx) => {
                return (
                  <Accordion
                    style={{ border: "none" }}
                    key={`entire_category_${idx}`}
                  >
                    <AccordionSummary
                      expandIcon={<HiChevronDown />}
                      aria-controls="panel2d-content"
                      id="panel2d-header"
                      style={{ paddingLeft: "24px" }}
                    >
                      <input
                        type="text"
                        placeholder="카테고리 이름을 입력해주세요."
                        style={{ padding: "8px", width: "70%" }}
                        value={data.category}
                        onChange={(e) => setMenuData(e, idx, "category")}
                        onFocus={e => e.preventDefault()}
                      />
                    </AccordionSummary>
                    <AccordionDetails style={{ paddingLeft: "36px" }}>
                      {data.menu.map((menu, menu_idx) => {
                        return (
                          <div
                            className={styles.rest_entire_menu}
                            key={`entire_menu_${menu_idx}`}
                          >
                            <input
                              type="text"
                              placeholder="메뉴 이름을 입력해주세요."
                              value={menu.label}
                              onChange={(e) =>
                                setMenuData(e, menu_idx, "label")
                              }
                            />
                            <div>
                              <input
                                type="text"
                                placeholder="메뉴 가격을 입력해주세요."
                                value={menu.price}
                                onChange={(e) =>
                                  setMenuData(e, menu_idx, "price")
                                }
                              />{" "}
                              원
                            </div>
                          </div>
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Service;
