import "./App.css";
import closeIcon from "../assets/images/ic-close.svg";
import menuIcon from "../assets/images/ic-menu.svg";

const App = () => {
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
