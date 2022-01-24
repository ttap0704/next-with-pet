import styles from "../../styles/components.module.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import ModalContainer from "./ModalContainer";
import {TiDelete} from "react-icons/ti";
import {HiX} from "react-icons/hi";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const RadioModal = (props) => {
  const dispatch = useDispatch();
  const visible: Boolean = props.visible;
  const title: string = props.title;
  const contents: {id: number; value: string}[] = props.contents;
  const [value, setValue] = useState("");

  function update() {
    const ok = confirm(`${title}을 하시겠습니까?`);
    if (ok) {
      const idx = contents.findIndex(data => {
        return data.id == Number(value)
      })

      props.onChange(contents[idx]);
    } else {
      return;
    }
  }

  return (
    <ModalContainer backClicked={() => props.hideModal()} visible={visible} zIndex={1}>
      <div className={styles.radio_modal}>
        <h2 className={styles.modal_title}>
          {title ? title : "임시"}
          <HiX onClick={() => props.hideModal()} />
        </h2>
        <div className={styles.radio_modal_contents}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            onChange={(e) => setValue(e.target.value)}
          >
            {contents.map((data) => {
              return (
                <FormControlLabel value={data.id} control={<Radio />} label={data.value} key={`radio_${data.id}`} />
              );
            })}
          </RadioGroup>
          <button onClick={() => update()} className={styles.regi_button}>
            등록
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default RadioModal;
