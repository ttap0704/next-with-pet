import nav_items from "../tools/nav";
import styles from "../../styles/components.module.scss";
import Link from "next/link";
import { RootState } from "../../reducers";
import { useSelector } from "react-redux";
import { HiChevronUp } from "react-icons/hi";
import { Button } from "@mui/material"

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

  function openChildren(idx: number) {
    const icon = document.getElementById(`nav_icon_${idx}`);
    const child = document.getElementById(`nav_children_${idx}`);

    if (child.style.display == 'block') {
      icon.style.transform = 'rotate(180deg)'
      child.style.display = 'none';
    } else {
      icon.style.transform = 'rotate(0deg)'
      child.style.display = 'block';
    }
  }
  console.log('testtest2')

  const menu_item = (item: { label: string, path: string, children?: { label: string, path: string }[] }, idx: number) => {
    return (
      <li key={`menu_item1_${idx}`} onClick={() => openChildren(idx)} className={styles.nav_parent}>
        <div className={styles.nav_label_wrap}>
          <span>{item.label}</span>
          <div className={styles.nav_icon}>
            <HiChevronUp style={{ transform: "rotate(180deg)" }} id={`nav_icon_${idx}`} />
          </div>
        </div>
        <ul style={{ display: 'none' }} id={`nav_children_${idx}`}>
          {item.children ? item.children.map((child, idx2) => {
            return (
              <li key={`menu_item2_${idx2}`}>{child.label}</li>
            )
          })
            : null}
        </ul>
      </li>
    )
  }

  return (
    <div className={styles.side_navigation}>
      <div className={styles.side_navigation_logo}>
        logo
      </div>
      <ul>
        {manage_items().map((menu1, idx1) => {
          return (
            menu_item(menu1, idx1)
          )
        })}
      </ul>
    </div>
  );
};

export default SideNavigation;
