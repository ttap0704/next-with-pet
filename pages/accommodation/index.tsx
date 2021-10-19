// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../reducers";
import c_style from "../styles/color.module.scss";

const Accommodation = () => {
  // const { no, text } = useSelector((state: RootState) => state.testReducer);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch({
  //     type: RESET_TEXT,
  //   });
  // }, []);

  const addTextHandler = () => {
    const value = "숙박이라니까";

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

export default Accommodation;
