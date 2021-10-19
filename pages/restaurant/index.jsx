// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../reducers";
// import c_style from "../styles/color.module.scss";

const Restaurant = () => {
  // const { no, text } = useSelector((state: RootState) => state.testReducer);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch({
  //     type: RESET_TEXT,
  //   });
  // }, []);

  const addTextHandler = () => {
    const value = "레스토랑";

    return value;
  };

  return (
    <>
      <div>
        {addTextHandler()}
      </div>
    </>
  );
};

export default Restaurant;
