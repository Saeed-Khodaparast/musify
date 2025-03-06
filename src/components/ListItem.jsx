import { useState } from "react";
import styles from "./ListItem.module.css";
import { useNavigate } from "react-router-dom";

const ListItem = ({ artist }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  const handleFollowClick = (e) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  const handleItemClick = () => {
    navigate(`/artist/${artist.id}`);
  };

  return (
    <li className={styles.listItem} onClick={handleItemClick}>
      <img className={styles.image} src={artist.images[0]?.url} alt="" />
      <div className={styles.textContainer}>
        <h2 className={styles.name}>{artist.name}</h2>
        <span
          className={`${isFollowing ? styles.following : styles.follow}`}
          onClick={handleFollowClick}
        >
          {isFollowing ? "Following" : "Follow"}
        </span>
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
