import { lazy, Suspense, useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import rock from "../assets/img/rock.png";
import paper from "../assets/img/paper.png";
import scissors from "../assets/img/scissors.png";
import bgm from "../assets/bgm.wav";
import useAlert from "../hooks/useAlert";
import { getRandomInt, determineOutcome } from "../utils/gameLogic";

const Options = lazy(() => import("../components/Options"));
const Arena = lazy(() => import("../components/Arena"));
const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

const Roshambo = () => {
  const [gameState, setGameState] = useState({
    selected: "Rock",
    cpuSelected: "Rock",
    showResult: 0,
  });
  const audioRef = useRef(new Audio(bgm));
  const navigate = useNavigate();
  const showAlert = useAlert(navigate);
  const choices = useMemo(() => ["Rock", "Paper", "Scissors"], []);

  useEffect(() => {
    document.title = "Roshambo";
    const audio = audioRef.current;
    audio.loop = true;

    Swal.fire({
      title: "Welcome to Roshambo!",
      text: "Choose between Rock, Paper, or Scissors to start the game and see if you can beat the computer!",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: true,
      html: '<button id="start-game" class="bg-yellow-400 text-black p-4 rounded-lg">Start Game</button>',
      didOpen: () => {
        const startButton = Swal.getPopup().querySelector("#start-game");
        startButton.addEventListener("click", () => {
          audio.play();
          Swal.close();
        });
      },
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleClick = useCallback(
    (name) => {
      setGameState((prevState) => ({
        selected: name,
        cpuSelected: choices[getRandomInt(3)],
        showResult: prevState.showResult + 1,
      }));
    },
    [choices]
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
        });
      }, 1000);
    }
  }, [gameState.showResult, gameState.selected, gameState.cpuSelected, showAlert]);

  return (
    <main className="bg-black text-white w-full h-screen md:block flex flex-col justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      <div className="md:block flex flex-col justify-center gap-4 h-full bg-black">
        <div className="flex flex-col items-center md:my-12">
          <Suspense fallback={<div>Loading...</div>}>
            <Arena selected={gameState.selected} cpuSelected={gameState.cpuSelected} />
          </Suspense>
        </div>
        <div className="flex flex-row my-2 lg:my-5 w-full justify-center">
          <Suspense fallback={<div>Loading...</div>}>
            {choices.map((choice) => (
              <Options key={choice} selected={choice} img={{ Rock: rock, Paper: paper, Scissors: scissors }[choice]} name={choice.toUpperCase()} onClick={handleClick} />
            ))}
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </main>
  );
};

export default Roshambo;
