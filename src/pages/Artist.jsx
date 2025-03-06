import { useState } from "react";
import { useEffect } from "react";
import styles from "./Artist.module.css";
import { useParams } from "react-router-dom";
import { spotifyApi } from "../services/SpotifyAPI";

const Artist = () => {
  const { artistID } = useParams();
  const [artist, setArtist] = useState({});
  console.log("ArtistID: " + artistID);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await spotifyApi.makeApiRequest(`/artists/${artistID}`);
        console.log(data);
        setArtist(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [artistID]);

  return (
    <div>
      {artist?.images && artist.images[0] && (
        <img className={styles.image} src={artist.images[0].url} alt="" />
      )}
      <div className={styles.textContainer}>
        <h2 className={styles.name}>{artist?.name}</h2>
        {/* <span
          className={`${isFollowing ? styles.following : styles.follow}`}
          onClick={handleFollowClick}
        >
          {isFollowing ? "Following" : "Follow"}
        </span> */}
        {artist?.genres && (
          <div>
            <p className={styles.genres}>
              {artist.genres.map((item, index) => (
                <span key={index} className={styles.genre}>
                  {item}
                </span>
              ))}
            </p>
          </div>
        )}

        <p className={styles.id}>{artist?.id}</p>
      </div>
      <div></div>
    </div>
  );
};

export default Artist;
