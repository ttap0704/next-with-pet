import styles from "../../styles/components.module.scss";

import {TiDelete} from "react-icons/ti";

const OrderList = (props) => {
  const list = props.data;

  return (
    <ul className={styles.order_list}>
      {list.map((data, idx) => {
        return (
          <li key={`order_list_${idx}`} onClick={() => (props.onListClick ? props.onListClick(data) : false)}>
            <input
              type="text"
              id={`order_${idx}`}
              value={data.number}
              onChange={(e) => (props.changeOrder ? props.changeOrder(e, idx) : false)}
              onBlur={() => (props.onBlur ? props.onBlur() : false)}
              onKeyDown={(e) => (props.onKeyDown ? props.onKeyDown(e, idx) : false)}
            />
            {data.file ? (
              <span>{data.file.name ? data.file.name : `이미지 ${data.number}번`}</span>
            ) : (
              <span>{data.label}</span>
            )}
            <TiDelete onClick={() => (props.onClickDelete? props.onClickDelete(idx) : false)} />
          </li>
        );
      })}
    </ul>
  );
};

export default OrderList;
