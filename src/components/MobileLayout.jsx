import { useEffect } from "react";
import closeIcon from "../assets/images/ic-close.svg";
import menuIcon from "../assets/images/ic-menu.svg";
import searchIcon from "../assets/images/ic-search.svg";
import styles from "./MobileLayout.module.css";
import { useState } from "react";
import List from "./List";
import ListItem from "./ListItem";

let timeoutId;

// ***
const CLIENT_ID = "e64aaf2241684dedbf22fcb9cea58518";
// const REDIRECT_URI = "http://localhost:5173";
const REDIRECT_URI = "https://saeed-khodaparast.github.io/musify/";

// Generate random string for state
function generateRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Generate code challenge from verifier
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
// ***

const MobileLayout = () => {
  const [text, setText] = useState("");
  const [artists, setArtists] = useState([]);
  const [artist, setArtist] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("spotify_access_token")
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSpotifyAuth = async () => {
      // Check if we're returning from auth redirect
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const verifier = localStorage.getItem("code_verifier");
          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                client_id: CLIENT_ID,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
                code_verifier: verifier,
              }),
            }
          );

          const data = await response.json();
          if (data.access_token) {
            localStorage.setItem("spotify_access_token", data.access_token);
            setAccessToken(data.access_token);
            // Clear the URL parameters
            window.history.replaceState({}, document.title, "/");
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else if (!accessToken) {
        // Only initialize auth if we don't have a token and aren't handling a redirect
        const verifier = generateRandomString(128);
        const state = generateRandomString(16);

        localStorage.setItem("code_verifier", verifier);

        const challenge = await generateCodeChallenge(verifier);
        const args = new URLSearchParams({
          response_type: "code",
          client_id: CLIENT_ID,
          scope: "user-read-private user-read-email",
          redirect_uri: REDIRECT_URI,
          state: state,
          code_challenge_method: "S256",
          code_challenge: challenge,
        });

        window.location = "https://accounts.spotify.com/authorize?" + args;
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

    timeoutId = setTimeout(() => {
      fetch(`https://api.spotify.com/v1/search?q=artist:${query}&type=artist`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          console.log(data.artists.items);
          setArtists(data.artists.items);
        })
        .catch((error) => console.log(error));
    }, 1000);
  }

  function handleItemClick(item) {
    setArtist(item);
    console.log("Key: ", item.id);
  }

  // useEffect(() => {
  //   fetch("https://accounts.spotify.com/api/token", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({
  //       grant_type: "client_credentials",
  //       client_id: "e64aaf2241684dedbf22fcb9cea58518",
  //       client_secret: "c5d438bb60e14c5296191834d4b13eb6",
  //     }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! Status: ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       console.log(data.access_token);
  //       accessToken = data.access_token;
  //     })
  //     .catch((error) => console.error(error));
  // }, []);

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
        <div
          className={`${styles.inputContainer} ${
            isSearchOpen ? styles.open : ""
          }`}
        >
          <input
            className={styles.input}
            type="text"
            placeholder="add artist name"
            value={text}
            onChange={handleInputChange}
          />
          <img className={styles.endIcon} src={closeIcon} alt="" />
        </div>
        <img
          className={`${styles.searchIcon} ${isSearchOpen ? styles.close : ""}`}
          src={searchIcon}
          alt=""
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        />
      </section>

      <aside></aside>

      <aside></aside>
    </div>
  );
};

export default MobileLayout;
