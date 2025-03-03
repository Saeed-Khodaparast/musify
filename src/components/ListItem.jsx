import { useState } from "react";
import styles from "./ListItem.module.css";
import emptyHeartIcon from "../assets/images/ic-heart-empty.svg";
import filledHeartIcon from "../assets/images/ic-heart-fill.svg";

const ListItem = ({ artist, onClick, key }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <li className={styles.listItem} onClick={() => onClick(artist)}>
      <img className={styles.image} src={artist.images[0]?.url} alt="" />
      <div className={styles.textContainer}>
        <h2 className={styles.name}>{artist.name}</h2>
        <img
          className={styles.icon}
          src={isFavorite ? filledHeartIcon : emptyHeartIcon}
          alt=""
          onClick={() => setIsFavorite(!isFavorite)}
        />
        <div>
          <p className={styles.genres}>
            {artist.genres.map((item) => {
              return <span className={styles.genre}>{item}</span>;
            })}
          </p>
        </div>
        <p className={styles.id}>{artist.id}</p>
      </div>
    </li>
  );
};
export default ListItem;
