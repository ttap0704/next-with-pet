import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducers";
import color from "../../styles/color.module.scss";
import styles from "../../styles/pages/accommodation.module.scss";
import {fetchGetApi} from "../../src/tools/api";
import {actions, RESET_ACCOMMODATION} from "../../reducers/models/accommodation";
import {useRouter} from "next/router";

import ImageBox from "../../src/components/ImageBox";
import LabelBox from "../../src/components/LabelBox";

const Accommodation = ({list}) => {
  const dispatch = useDispatch();
  const {accommodation_list} = useSelector((state: RootState) => state.accommodationReducer);
  const router = useRouter();

  useEffect(() => {
    dispatch(actions.pushAccommodationList(list));
    return () => {
      dispatch({type: RESET_ACCOMMODATION});
    };
  }, []);

  function moveDetail(data: any) {
    router.push({
      pathname: `/accommodation/[id]`,
      query: {id: data.id},
    });
  }

  return (
    <>
      <div>
        {accommodation_list.map((data: any) => {
          return (
            <div className={styles.list} key={data.id} onClick={() => moveDetail(data)}>
              <ImageBox
                src={
                  data.accommodation_images.length > 0
                    ? `api/image/accommodation/${data.accommodation_images[0].file_name}`
                    : null
                }
                alt="exposure_image"
                type="accommodation"
              />
              <LabelBox title={data.label} address={`${data.sigungu} ${data.bname}`} type="accommodation" />
            </div>
          );
        })}
      </div>
    </>
  );
};

// // 빌드될 때 실행
// export const getStaticPaths = async () => {
//   // posts를 받기 위해 fetch
//   // const data = await fetchGetApi(`/accommodation`)
//   const res = await fetch(`https://localhost:3000/accommodation`)
//   const data = await res.json();
//   const paths = data.map((item) => ({
//     params: { id: item.id },
//   }))

//   return { paths, fallback: false }
// }

// // 빌드될 때 실행 
// export const getStaticProps = async ({ params }) => {
//   // params는 post `id`를 포함하고 있다
//   const res = await fetch(`https://localhost:3000/accommodation/${params.id}`)
//   const list = await res.json()

//   // 해당 페이지에 props로 보냄
//   console.log(list)
//   return { props: { list } }
// }

export async function getStaticProps() {
  const data = await fetchGetApi(`/accommodation`);

  return {
    props: {
      list: data,
    },
  };
}

export default Accommodation;
