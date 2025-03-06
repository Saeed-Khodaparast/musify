import { useState, useEffect } from "react";
import closeIcon from "../assets/images/ic-close.svg";
import menuIcon from "../assets/images/ic-menu.svg";
import styles from "./Home.module.css";
import List from "../components/List";
import ListItem from "../components/ListItem";
import { spotifyApi } from "../services/SpotifyAPI";

let timeoutId;

const Home = () => {
  const [text, setText] = useState("");
  const [artists, setArtists] = useState([]);
  const [artist, setArtist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSpotifyAuth = async () => {
      // Check if we're returning from auth redirect
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        const success = await spotifyApi.handleAuthCallback(code);
        if (success) {
          window.history.replaceState({}, document.title, "/");
        }
      } else if (spotifyApi.getAccessToken()) {
        await spotifyApi.initializeAuth();
      }
      setIsLoading(false);
    };

    handleSpotifyAuth();
  }, []);

  function handleInputChange(e) {
    const query = e.target.value;
    setText(query);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      try {
        const data = await spotifyApi.makeApiRequest(
          `/search?q=artist:${query}&type=artist`
        );
        console.log(data);
        console.log(data.artists.items);
        setArtists(data.artists.items);
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  }

  function handleItemClick(item) {
    setArtist(item);
    console.log("Key: ", item.id);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Musify</h1>
      </header>
      <main className={styles.content}>
        <List>
          {artists.map((artist) => (
            <ListItem
              artist={artist}
              onClick={handleItemClick}
              key={artist.id}
            />
          ))}
        </List>
      </main>
      <section className={styles.toolbar}>
        <img className={styles.menuIcon} src={menuIcon} alt="" />
        <div className={`${styles.inputContainer}`}>
          <input
            className={styles.input}
            type="text"
            placeholder="add artist name"
            value={text}
            onChange={handleInputChange}
          />
          <img className={styles.endIcon} src={closeIcon} alt="" />
        </div>
      </section>

      <aside></aside>

      <aside></aside>
    </div>
  );
};

export default Home;
