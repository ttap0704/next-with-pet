import styles from "../../styles/components.module.scss";

const LabelBox = (props) => {
  const type = props.type;
  const title = props.title;
  const address = props.address;

  function setBoxStyle() {
    if (type == "accommodation") {
      return {
        width: "100%",
        height: "5.5rem",
      };
    } else if (type == "restaurant") {
      return {
        width: "100%",
        height: "4.6rem",
      };
    }
  }

  return (
    <>
      <div className={styles.label_box} style={{...setBoxStyle()}}>
        <div className={type == 'restaurant' ? styles.rest_label_text : styles.accom_label_text}>
          <h2>{title}</h2>
          <span>{address}</span>
        </div>
        <div className={styles.label_deco}></div>
      </div>
    </>
  );
};

export default LabelBox;
