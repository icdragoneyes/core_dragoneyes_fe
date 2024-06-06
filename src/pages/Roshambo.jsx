import { lazy, Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import rock from "../assets/img/rock.png";
import paper from "../assets/img/paper.png";
import scissors from "../assets/img/scissors.png";
import dragonhouse from "../assets/img/dragonhouse.jpeg";
import useAlert from "../hooks/useAlert";
import { getRandomInt, determineOutcome } from "../utils/gameLogic";

const Options = lazy(() => import("../components/Options"));
const ArenaV2 = lazy(() => import("../components/ArenaV2"));

const Roshambo = () => {
  const [gameState, setGameState] = useState({
    selected: "Rock",
    cpuSelected: "Rock",
    showResult: 0,
  });
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [activeOption, setActiveOption] = useState(null); // State untuk melacak tombol yang aktif
  const navigate = useNavigate();
  const showAlert = useAlert(navigate);
  const choices = useMemo(() => ["Rock", "Paper", "Scissors"], []);

  useEffect(() => {
    document.title = "Roshambo";

    Swal.fire({
      title: '<span style="color: white;">Welcome to Roshambo!</span>',
      showConfirmButton: false,
      allowOutsideClick: true,
      buttonsStyling: false,
      background: "#1e3557",
      html: '<p style="color: white; margin-bottom: 20px">Choose between Rock, Paper, or Scissors to start the game and see if you can beat the computer!</p><button id="start-game" class="bg-[#ee5151] hover:bg-red-500 outline-none text-white px-3 py-2 rounded-md">Start Game</button>',
      didOpen: () => {
        const startButton = Swal.getPopup().querySelector("#start-game");
        startButton.addEventListener("click", () => {
          Swal.close();
        });
      },
    });
  }, []);

  const handleClick = useCallback(
    (name) => {
      if (!isOptionDisabled) {
        setIsOptionDisabled(true);
        setGameState((prevState) => ({
          selected: name,
          cpuSelected: choices[getRandomInt(3)],
          showResult: prevState.showResult + 1,
        }));
      }
    },
    [choices, isOptionDisabled]
  );

  useEffect(() => {
    if (gameState.showResult > 0) {
      const outcome = determineOutcome(gameState.selected, gameState.cpuSelected);
      setTimeout(() => {
        showAlert(outcome).then((playAgain) => {
          if (playAgain) {
            setGameState({
              selected: "Rock",
              cpuSelected: "Rock",
              showResult: 0,
            });
          }
          setIsOptionDisabled(false);
        });
      }, 1000);
    }
  }, [gameState.showResult, gameState.selected, gameState.cpuSelected, showAlert]);

  return (
    <main className="w-full h-full min-h-screen overflow-hidden" style={{ backgroundImage: `url(${dragonhouse})`, backgroundSize: "cover" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <header className="bg-[#ee5151] py-3 w-full fixed top-0 z-10 block md:hidden">
          <h1 className="text-center text-4xl font-bold text-white">Roshambo</h1>
        </header>
      </Suspense>
      <div className="relative h-full w-full flex flex-col items-center md:pt-28 pt-16">
        <Suspense fallback={<div>Loading...</div>}>
          <ArenaV2 outcome={gameState.showResult > 0 ? determineOutcome(gameState.selected, gameState.cpuSelected) : ""} cpuSelected={gameState.cpuSelected} />
        </Suspense>
        <div className="absolute md:bottom-0 bottom-12 flex flex-row justify-center w-full mb-4">
          <Suspense fallback={<div>Loading...</div>}>
            {choices.map((choice) => (
              <Options
                key={choice}
                selected={choice}
                img={{ Rock: rock, Paper: paper, Scissors: scissors }[choice]}
                name={choice.toUpperCase()}
                onClick={handleClick}
                disabled={isOptionDisabled}
                isSelected={gameState.selected === choice && gameState.showResult > 0}
                isActive={activeOption === choice}
                setActiveOption={setActiveOption}
              />
            ))}
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default Roshambo;
