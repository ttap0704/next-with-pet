import {FaFileUpload} from "react-icons/fa";
import styles from "../../styles/components.module.scss";
import ImageSlider from "./ImageSlider";

const AccommodationImageBox = (props) => {
  const boxId = props.boxId;
  const imgId = props.imgId;
  const src = props.src;
  const art = props.art;
  const slider = props.slider;

  function onMouseEvent (type: string) {
    if (type == 'enter' && props.onMouseEnter) {
      props.onMouseEnter();
    } else if (type == 'leave' && props.onMouseLeave) {
      props.onMouseLeave();
    }
  }

  return (
    <>
      <div
        id={boxId}
        className={styles.accommodation_image_box}
        onMouseEnter={() => onMouseEvent("enter")}
        onMouseLeave={() => onMouseEvent("leave")}
        style={{marginBottom: "0"}}
      >
        <img id={imgId} src={src ? src : null} alt={art} />
        {props.children}
      </div>
    </>
  );
};

export default AccommodationImageBox;
