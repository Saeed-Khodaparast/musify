import styles from "./ListItem.module.css";

const ListItem = ({ artist, onClick, key }) => {
  return (
    <li className={styles.listItem} onClick={() => onClick(artist)}>
      <img className={styles.image} src={artist.images[0]?.url} alt="" />
      <div className={styles.textContainer}>
        <h2 className={styles.name}>{artist.name}</h2>
        <div>
          <p>Genres</p>
          <p className={styles.genres}>
            {artist.genres.map((item) => {
              return <span className={styles.genre}>{item}</span>;
            })}
          </p>
        </div>
        <p>Artist ID: {artist.id}</p>
      </div>
    </li>
  );
};
export default ListItem;
