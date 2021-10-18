import nav_items from "../tools/nav";
import styles from "../../styles/components/header.module.scss";
import Link from "next/link";
// function createTag() {
//   let ul = document.createElement("ul");
//   for (let i = 0, leng = nav_items.length; i < leng; i++) {
//     let li = document.createElement("li");
//     li.innerText = nav_items[i].kor_name;
//     ul.append(li);
//   }

//   return ul;
// }

const Header = () => {
  return (
    <header className={styles.header}>
      <ul>
        {nav_items.map((data) => {
          const href = data.path;

          return (
            <li>
              <Link href={href}>
                <a>{data.kor_name}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </header>
  );
};

export default Header;
