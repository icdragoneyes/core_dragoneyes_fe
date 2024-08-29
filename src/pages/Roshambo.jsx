import BottomNavBar from "../components/BottomNavbar";
import LastHouseShot from "../components/LastHouseShot";
import Arena from "../components/Roshambo/Arena";

const Roshambo = () => {
  return (
    <main className={`${window.innerWidth < 768 ? "overflow-hidden h-screen" : "h-screen w-screen"}`}>
      <LastHouseShot />
      <Arena />
      <BottomNavBar />
    </main>
  );
};

export default Roshambo;
