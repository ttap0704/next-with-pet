import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import color from "../../styles/color.module.scss";
import styles from "../../styles/pages/restaurant.module.scss";
import { fetchGetApi } from "../../services/_API";
import { actions, RESET_RESTRAURANT } from "../../reducers/models/restaurant"

const Restaurant = () => {
  const { list } = useSelector((state: RootState) => state.restaurantReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('ho')
    fetchGetApi('/restaurant').then(res => {
      dispatch(actions.pushRestaurantList(res))
    })
    return () => {
      dispatch({ type: RESET_RESTRAURANT })
    }
  }, []);

  const restaurant_list = () => {
    return list.map((data: any, idx) => {
      return (
        <div className={styles.list} key={idx}>
          <div
            className={styles.list_img}
            style={{ backgroundImage: `url(https://news.kbs.co.kr/data/news/2017/01/04/3405677_bH6.jpg)` }}
          // style={{ backgroundImage: `url(http://localhost:3080/uploads/exposure_menu/${data.exposure_menu[0].exposure_menu_image.file_name})` }}
          ></div>
          <div className={styles.list_text_container}>
            <div className={styles.list_text}>
              <h2>{data.label}</h2>
              <span className={styles.list_rating}>
                {`${data.sigungu} ${data.bname}`}
              </span>
            </div>
            <div className={styles.list_deco}></div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className={styles.restaurant_wrap}>
        {restaurant_list()}
      </div>
    </>
  );
};

export default Restaurant;
