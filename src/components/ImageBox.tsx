import styles from "../../styles/components.module.scss";

const ImageBox = (props) => {
  const boxId = props.boxId;
  const imgId = props.imgId;
  const src = props.src;
  const art = props.art;
  const type = props.type;
  const shadow = props.shadow === false ? false : true


  function onMouseEvent(type: string) {
    if (type == "enter" && props.onMouseEnter) {
      props.onMouseEnter();
    } else if (type == "leave" && props.onMouseLeave) {
      props.onMouseLeave();
    }
  }

  function setBoxStyle() {
    let res = {
      width: "",
      height: "",
      boxShadow: ""
    };

    if (type == "accommodation") {
      res = {
        width: "60rem",
        height: "21rem",
        boxShadow: shadow ? "2px 2px 4px #999" : "none"        
      };
    } else if (type == "restaurant") {
      res =  {
        width: "28.8rem",
        height: "17.4rem",
        boxShadow: shadow ? "2px 2px 4px #999" : "none"        
      };
    }

    return res;
  }

  return (
    <>
      <div
        id={boxId}
        className={styles.image_box}
        onMouseEnter={() => onMouseEvent("enter")}
        onMouseLeave={() => onMouseEvent("leave")}
        style={{...setBoxStyle()}}
      >
        <img id={imgId} src={src ? src : null} alt={art} />
        {props.children}
      </div>
    </>
  );
};

export default ImageBox;
