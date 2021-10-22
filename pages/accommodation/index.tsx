// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../reducers";
import c_style from "../../styles/color.module.scss";
import styles from "../../styles/pages/accommodation.module.scss";

const Accommodation = () => {
  const data = [
    {
      idx: 0,
      title: "수영장 펜션, 반려동물과 함께 즐가세요.",
      img_path:
        "https://uploads-ssl.webflow.com/5e5cad32512f4ebf86ae2fa1/5e942f6e5f867827a4659114_mrp_6140-hdr.jpeg",
      rating: 3.5,
      review_cnt: 1,
      location: "화성시 반월동",
    },
    {
      idx: 1,
      title: "수영장 펜션, 반려동물과 함께 즐가세요.",
      img_path:
        "https://uploads-ssl.webflow.com/5e5cad32512f4ebf86ae2fa1/5e942f6e5f867827a4659114_mrp_6140-hdr.jpeg",
      rating: 3.5,
      review_cnt: 1,
      location: "화성시 반월동",
    },
    {
      idx: 2,
      title: "수영장 펜션, 반려동물과 함께 즐가세요.",
      img_path:
        "https://uploads-ssl.webflow.com/5e5cad32512f4ebf86ae2fa1/5e942f6e5f867827a4659114_mrp_6140-hdr.jpeg",
      rating: 3.5,
      review_cnt: 1,
      location: "화성시 반월동",
    },
  ];
  // const { no, text } = useSelector((state: RootState) => state.testReducer);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch({
  //     type: RESET_TEXT,
  //   });
  // }, []);

  const list = () => {
    return data.map((data) => {
      return (
        <div className={styles.list} key={data.idx}>
          <div
            className={styles.list_img}
            style={{ backgroundImage: `url(${data.img_path})` }}
          ></div>
          <div className={styles.list_text_container}>
            <div className={styles.list_text}>
              <h2>{data.title}</h2>
              <span className={styles.list_rating}>
                <span className={c_style.text_red}>{data.rating}</span>/5 (
                {data.review_cnt})
              </span>
              <p className={styles.list_location}>{data.location}</p>
            </div>
            <div className={styles.list_deco}></div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div>{list()}</div>
    </>
  );
};

export default Accommodation;
