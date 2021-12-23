import styles from "../../styles/components.module.scss"
import {
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

const ImageSlider = (props) => {
  const title = props.title;

  function sildeEvent(e, type:string) {
    e.preventDefault();
    if (type == 'prev') {
      props.onSlideLeft();
    } else if (type == 'next') {
      props.onSlideRight();
    }
  }

  return (
    <div className={styles.image_slier} id={props.id}>
      <HiChevronLeft
        onClick={(e) => sildeEvent(e, "prev")}
        style={{...props.sliderStyle}}
      />
      <HiChevronRight
        onClick={(e) => sildeEvent(e, "next")}
        style={{...props.sliderStyle}}
      />
    </div>
  );
};

export default ImageSlider;
