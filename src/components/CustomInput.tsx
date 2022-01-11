
import styles from "../../styles/components.module.scss";

const CustomInput = (props) => {
  const id = props.id;
  const placeholder = props.placeholder;
  const value = props.value;
  const style = props.style;
  const disabled = props.disabled == true ? true : false;
  const custom_class = props.bottom == true ? styles.custom_bottom_input : styles.custom_all_input;
  const width = props.width ? props.width : '100% !important';
  const align = props.align ? props.align : 'left';
  const readOnly = props.readOnly ? props.readOnly : false;

  return (
    <input
      type="text" 
      id={id}
      className={custom_class}
      placeholder={placeholder}
      value={value}
      style={{...style, width: width, textAlign: align}}
      disabled={disabled}
      onChange={(e) => props.onChange ? props.onChange(e) : false}
      onKeyDown={(e) => props.onKeyDown ? props.onKeyDown(e) : false}
      readOnly={readOnly}
    />
  );
};

export default CustomInput;
