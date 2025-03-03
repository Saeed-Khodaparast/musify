import { useState, useEffect } from "react";
import "./App.css";
import DesktopLayout from "./components/DesktopLayout";
import MobileLayout from "./components/MobileLayout";

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

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default App;
