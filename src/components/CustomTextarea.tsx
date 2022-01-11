import styles from "../../styles/components.module.scss";

const CustomTextarea = (props) => {
  const id = props.id;
  const placeholder = props.placeholder;
  const value = props.value;
  const height = props.height;
  const readOnly = props.readOnly ? props.readOnly : false;

  const custom_style = {
    height: height,
    minHeight: height
  }

  return (
    <textarea 
      id={id}
      className={styles.custom_textarea}
      onChange={(e) => props.onChange ? props.onChange(e) : false}
      placeholder={placeholder}
      value={value}
      style={{...custom_style}}
      readOnly={readOnly}
    />
  );
};

export default CustomTextarea;
