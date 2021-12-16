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
  const [introduction, setIntroduction] = useState("");
  const [exposureMenu, setExposureMenu] = useState([]);
  const [entireMenu, setEntireMenu] = useState([]);
  useEffect(() => {
    fetchGetApi(`/restaurant/${id}`).then(async (data) => {
      setExposureImages([...data.restaurant_images]);
      setTitle(data.label);
      setAddress(`${data.sigungu} ${data.bname}`);
      setIntroduction(data.introduction);
      setExposureMenu([...data.exposure_menu]);
      setEntireMenu([...data.entire_menu]);
    });
    return () => {};
  }, []);

  function changePreviewImg(idx: number) {
    const img_tag: HTMLElement = document.getElementById("exposure_image");
    img_tag.setAttribute("src", `http://localhost:3000/api/image/restaurant/${exposureImages[idx].file_name}`);
  }

  function setEntireMenuViews() {
    let data = {};

    for (let x of entireMenu) {
      if (!data[x.category]) {
        data[x.category] = [];
      }

      data[x.category].push({label: x.label, price: x.price});
    }

    // <li className={res_style.rest_entire_menu} key={`entire_category_${idx}`}>
    //   <div className={res_style.rest_menu_circle}></div>
    //   <div className={res_style.res_entire_menu_category}>
    //     {data.category}
    //     <ul>
    //       {data.menu.map((menu, menu_idx) => {
    //         return (
    //           <li className={res_style.rest_entire_menu_detail} key={`entire_menu_${menu_idx}`}>
    //             <div className={res_style.rest_menu_circle}></div>
    //             <input type="text" placeholder="메뉴 이름을 입력해주세요." value={menu.label} />
    //             <div
    //               className={res_style.rest_entire_menu_price}
    //               style={menu.price.length > 0 ? {paddingRight: "56px"} : null}
    //             >
    //               <input type="text" placeholder="메뉴 가격을 입력해주세요." value={menu.price} />{" "}
    //               {menu.price.length > 0 ? "원" : null}
    //             </div>
    //           </li>
    //         );
    //       })}
    //     </ul>
    //   </div>
    // </li>
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
                id="exposure_image"
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
      <div className={res_style.detail_warp}>
        {preview()}
        <div className={res_style.detail_contents}>
          <h2>식당 소개</h2>
          <div className={res_style.detail_introduction}>{introduction}</div>
        </div>
        <div className={res_style.detail_contents}>
          <h2>메뉴</h2>
          <div className={res_style.rest_menu}>
            <h3>대표 메뉴</h3>
            <ul className={res_style.rest_menu_wrap} style={{border: "1px solid #e3e3e3"}}>
              {exposureMenu.map((data, index) => {
                return (
                  <li className={res_style.rest_exposure_menu} key={`exposure_menu_${index}`}>
                    <div className={res_style.rest_menu_circle}></div>
                    <div className={res_style.rest_exposure_menu_imgbox}>
                      <div className={res_style.rest_exposure_menu_img_wrap}>
                        <img
                          className={res_style.detail_exposure_menu_image}
                          src={`http://localhost:3000/api/image/restaurant/${data.exposure_menu_image.file_name}`}
                        />
                      </div>
                    </div>
                    <div className={res_style.rest_exposure_menu_textbox}>
                      <span>{data.label}</span>
                      <span>{data.price.toLocaleString() + "원"}</span>
                      <span>{data.comment}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <h3>전체 메뉴</h3>
            <ul className={res_style.rest_menu_wrap}>
              {/* {entireMenu.map((data, idx) => {
                return (
                  <li className={res_style.rest_entire_menu} key={`entire_category_${idx}`}>
                    <div className={res_style.rest_menu_circle}></div>
                    <div className={res_style.res_entire_menu_category}>
                      {data.category}
                      <ul>
                        {data.menu.map((menu, menu_idx) => {
                              return (
                                <li
                                  className={res_style.rest_entire_menu_detail}
                                  key={`entire_menu_${menu_idx}`}
                                >
                                  <div className={res_style.rest_menu_circle}></div>
                                  <input
                                    type="text"
                                    placeholder="메뉴 이름을 입력해주세요."
                                    value={menu.label}
                                  />
                                  <div
                                    className={res_style.rest_entire_menu_price}
                                    style={menu.price.length > 0 ? {paddingRight: "56px"} : null}
                                  >
                                    <input
                                      type="text"
                                      placeholder="메뉴 가격을 입력해주세요."
                                      value={menu.price}
                                    />{" "}
                                    {menu.price.length > 0 ? "원" : null}
                                  </div>
                                </li>
                              );
                            })}
                      </ul>
                    </div>
                  </li>
                );
              })} */}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;
