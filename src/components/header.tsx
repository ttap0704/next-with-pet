import nav_items from "../tools/nav";
import styles from "../../styles/header.module.scss";
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
          return <li>{data.kor_name}</li>;
        })}
      </ul>
    </header>
  );
};

export default Header;
