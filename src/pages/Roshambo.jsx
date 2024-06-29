import Arena from "../components/Roshambo/Arena";
import NavBar from "../components/Roshambo/NavBar";

const Roshambo = () => {
  return (
    <main className={`${window.innerWidth < 768 ? "overflow-hidden h-screen" : "h-screen w-screen"}`}>
      <NavBar />
      <Arena />
    </main>
  );
};

export default Roshambo;
