import { useState, useEffect } from "react";
import "./App.css";
import DesktopLayout from "./components/DesktopLayout";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Artist from "./pages/Artist";

const App = () => {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handler = (e) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isMobile ? (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artist/:artistID" element={<Artist />} />
    </Routes>
  ) : (
    <DesktopLayout />
  );
};

export default App;
