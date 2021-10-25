import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/pages/service.module.scss";
// import { actions, RESET_USER } from "../../reducers/models/user";
// import { RootState } from "../../reducers";
// import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Service = () => {
  const router = useRouter();
  let [serviceType, setserviceType] = useState("");

  return <div>h2</div>;
};

export default Service;
