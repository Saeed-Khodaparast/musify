import { useEffect } from "react";
import "./App.css";
import closeIcon from "../assets/images/ic-close.svg";
import menuIcon from "../assets/images/ic-menu.svg";

const App = () => {
  // Add this to your main App.jsx or a utility file
  useEffect(() => {
    const updateHeight = () => {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Initial call
    updateHeight();

    // Add event listener
    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <img className="menuIcon" src={menuIcon} alt="" />
        <h1 className="logo">Musify</h1>
      </header>
      <section className="inputContainer">
        <input className="input" type="text" placeholder="add artist name" />
        <img className="endIcon" src={closeIcon} alt="" />
      </section>
      <aside></aside>
      <main className="content">Content</main>
      <aside></aside>
    </div>
  );
};

export default App;
