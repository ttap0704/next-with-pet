import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import color from "../../styles/color.module.scss";
import styles from "../../styles/pages/restaurant.module.scss";
import { fetchGetApi } from "../../src/tools/api"
import { actions, RESET_RESTRAURANT } from "../../reducers/models/restaurant"
import { useRouter } from "next/router";


const Restaurant = () => {
  const { restaurant_list } = useSelector((state: RootState) => state.restaurantReducer);
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchGetApi('/restaurant').then(res => {
      dispatch(actions.pushRestaurantList(res))
    })
    return () => {
      dispatch({ type: RESET_RESTRAURANT })
    }
  }, []);

  function moveDetail (data: any) {
    router.push({
      pathname: `/restaurant/[id]`,
      query: { id: data.id },
    });
  }

  const list = () => {
    return restaurant_list.map((data: any, idx) => {
      return (
        <div className={styles.list} key={idx} onClick={() => moveDetail(data)}>
          <div
            className={styles.list_img}
          >
            <img src={`api/image/restaurant/${data.restaurant_images[0].file_name}`} alt="exposure_image"/>
          </div>
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
        {list()}
      </div>
    </>
  );
};

export default Restaurant;
