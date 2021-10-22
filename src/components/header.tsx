import nav_items from "../tools/nav";
import styles from "../../styles/components/header.module.scss";
import Link from "next/link";
import { RootState } from "../../reducers";
import { useSelector } from "react-redux";

const Header = () => {
  const { uid } = useSelector((state: RootState) => state.userReducer);

  if (uid > 0) {
    nav_items[4].display = false;
    nav_items[5].display = true;
  }

  return (
    <header className={styles.header}>
      <ul>
        {nav_items.map((data) => {
          const href = data.path;
          if (data.display) {
            return (
              <li key={data.name}>
                <Link href={href}>
                  <a>{data.kor_name}</a>
                </Link>
              </li>
            );
          }
        })}
      </ul>
    </header>
  );
};

export default Header;
