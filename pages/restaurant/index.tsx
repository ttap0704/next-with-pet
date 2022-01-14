import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducers";
import color from "../../styles/color.module.scss";
import styles from "../../styles/pages/restaurant.module.scss";
import {fetchGetApi} from "../../src/tools/api";
import {actions, RESET_RESTRAURANT} from "../../reducers/models/restaurant";
import {useRouter} from "next/router";
import ImageBox from "../../src/components/ImageBox";
import LabelBox from "../../src/components/LabelBox";

const Restaurant = () => {
  const {restaurant_list} = useSelector((state: RootState) => state.restaurantReducer);
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchGetApi("/restaurant").then((res) => {
      console.log(res)
      dispatch(actions.pushRestaurantList(res));
    });
    return () => {
      dispatch({type: RESET_RESTRAURANT});
    };
  }, []);

  function moveDetail(data: any) {
    router.push({
      pathname: `/restaurant/[id]`,
      query: {id: data.id},
    });
  }

  return (
    <>
      <div className={styles.restaurant_wrap}>
        {restaurant_list.map((data: any, idx) => {
          return (
            <div className={styles.list} key={idx} onClick={() => moveDetail(data)}>
              <ImageBox
                src={`api/image/restaurant/${data.restaurant_images[0].file_name}`}
                alt="exposure_image"
                type="restaurant"
              />
              <LabelBox title={data.label} address={`${data.sigungu} ${data.bname}`} type="restaurant" />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Restaurant;
