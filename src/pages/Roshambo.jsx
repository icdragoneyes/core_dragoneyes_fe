import Arena from "../components/Roshambo/Arena";
import NavBar from "../components/Roshambo/NavBar";

const Roshambo = () => {
  return (
    <main className="overflow-hidden h-screen">
      <NavBar />
      <Arena />
    </main>
  );
};

export default Roshambo;
