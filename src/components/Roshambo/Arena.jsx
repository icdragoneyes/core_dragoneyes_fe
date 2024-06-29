import { useState, useEffect } from "react";
import ArenaMobile from "./ArenaMobile"; // Komponen untuk tampilan mobile
import ArenaDesktop from "./ArenaDesktop"; // Komponen untuk tampilan desktop

const Arena = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <>{isMobile ? <ArenaMobile /> : <ArenaDesktop />}</>;
};

export default Arena;
