import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import color from "../../styles/color.module.scss";
import styles from "../../styles/pages/accommodation.module.scss";
import { fetchGetApi } from "../../src/tools/api"
import { actions, RESET_ACCOMMODATION } from "../../reducers/models/accommodation"
import { useRouter } from "next/router";


const Accommodation = () => {
  const dispatch = useDispatch();
  const { accommodation_list } = useSelector((state: RootState) => state.accommodationReducer);
  const router = useRouter();

  useEffect(() => {
    fetchGetApi('/accommodation').then(res => {
      console.log(res)
      dispatch(actions.pushAccommodationList(res))
    })
    return () => {
      dispatch({ type: RESET_ACCOMMODATION })
    }
  }, []);

  useEffect(() => {
    return () => {
      console.log('컴포넌트가 화면에서 사라짐');
    };
  }, []);

  function moveDetail (data: any) {
    router.push({
      pathname: `/accommodation/[id]`,
      query: { id: data.id },
    });
  }

  const list = () => {
    return accommodation_list.map((data: any) => {
      return (
        <div className={styles.list} key={data.id} onClick={() => moveDetail(data)}>
          <div
            className={styles.list_img}
          >
            <img src={data.accommodation_images.length > 0 ? `api/image/accommodation/${data.accommodation_images[0].file_name}` : null} alt="exposure_image" />
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
      <div>{list()}</div>
    </>
  );
};

export default Accommodation;
