
import styles from "../../styles/components.module.scss";

const UtilBox = (props) => {
  const style = props.style

  return (
    <div className={styles.util_box} style={{...style}}>
      {props.children}
    </div>
  );
};

export default UtilBox;
