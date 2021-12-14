import React, {useEffect, useState} from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../reducers";
import color from "../../styles/color.module.scss";
import res_style from "../../styles/pages/restaurant.module.scss";
import {useRouter} from "next/router";
import {fetchGetApi} from "../../src/tools/api";

const Detail = () => {
  const router = useRouter();
  const id = router.query.id;
  const [exposureImages, setExposureImages] = useState([]);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  useEffect(() => {
    fetchGetApi(`/restaurant/${id}`).then((data) => {
      setExposureImages([...data.restaurant_images]);
      setTitle(data.label);
      setAddress(`${data.sigungu} ${data.bname}`);
    });
    return () => {};
  }, []);

  function changePreviewImg(idx: number) {
    const img_tag:HTMLElement = document.getElementById(`exposure_image_${idx}`);
    console.log(img_tag)
    img_tag.setAttribute('src', `http://localhost:3000/api/image/restaurant/${exposureImages[idx].file_name}`)
  }

  const preview = () => {
    return (
      <div className={res_style.rest_preview}>
        <div className={res_style.list} style={{cursor: "unset"}}>
          <div id="exposure_img" className={res_style.list_img}>
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
            ) : (
              <img
                src={`http://localhost:3000/api/image/restaurant/${exposureImages[0].file_name}`}
                alt="exposure_image"
              />
            )}
          </div>
          <div className={res_style.list_text_container}>
            <div className={res_style.list_text}>
              <h2>{title}</h2>
              <span className={res_style.list_rating}>{address}</span>
            </div>
            <div className={res_style.list_deco}></div>
          </div>
        </div>
        <div className={res_style.rest_img_container}>
          {exposureImages.map((data, index) => {
            return (
              <div key={index} onClick={() => changePreviewImg(index)}>
                <div>
                  <img
                    id={`exposure_image_${index}`}
                    src={`http://localhost:3000/api/image/restaurant/${exposureImages[index].file_name}`}
                    alt="exposure_image"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={res_style.detail_warp}>{preview()}</div>
    </>
  );
};

export default Detail;
