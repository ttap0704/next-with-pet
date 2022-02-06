import React from "react";
import {FaFileUpload} from "react-icons/fa";
import styles from "../../styles/components.module.scss";
import {Button} from "@mui/material";

const UploadButton = (props: {title: string; onClick: Function}) => {
  const title = props.title;

  function onClickEvent(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    props.onClick();
  }

  return (
    <Button
      onClick={(e) => onClickEvent(e)}
      className={styles.upload_button}
      color="orange"
      variant="contained"
    >
      {title}
      <FaFileUpload />
    </Button>
  );
};

export default UploadButton;
