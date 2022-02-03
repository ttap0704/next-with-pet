import nav_items from "../tools/nav";
import styles from "../../styles/components.module.scss";
import Link from "next/link";
import {RootState} from "../../reducers";
import {useSelector} from "react-redux";

const SideNavigation = () => {
  const restaurant_items = [
    {
      label: "매장 관리",
      path: "/retaurant",
      children: [
        {
          label: "음식점 관리",
          path: "/info"
        },
        {
          label: "대표메뉴 관리",
          path: "/exposure_menu"
        },
        {
          label: "카테고리 관리",
          path: "/category"
        },
        {
          label: "전체메뉴 관리",
          path: "/entire_menu"
        },
      ]
    },
  ];

  const accommodation_items = [
    {
      label: "매장 관리",
      path: "/accommodation",
      children: [
        {
          label: "숙박업소 관리",
          path: "/info"
        },
        {
          label: "객실 관리",
          path: "/rooms"
        }
      ]
    },
  ];

  const info_items = [
    {
      label: "사업자 정보 관리",
      path: "info",
    },
  ];

  const manage_items = () => {
    return [...restaurant_items, ...accommodation_items, ...info_items]
  }

  const menu_item = (item: {label: string, path: string, children?: {label: string, path: string}[]}, idx: number) => {
    if (item.children) {
      return (
      <li key={`menu_item1_${idx}`}>
        <span>아이콘 자리</span>
        {item.label}
      </li>
      )
    } else {
      return (
        <li key={`menu_item1_${idx}`}>
          {item.label}
        </li>
      )
    }
  }

  return (
    <ul className={styles.side_navigation}>
      {manage_items().map((menu1, idx1) => {
        return (
          menu_item(menu1, idx1)
        )
      })}
    </ul>
  );
};

export default SideNavigation;
