import maincar from "../../assets/img/maincar.png";
import handImage from "../../assets/img/hands/hands";
import eth from "../../assets/img/eth.png";
import bubble from "../../assets/img/bubble.png";
import { useCallback, useEffect, useState } from "react";
import { useLongPress } from "use-long-press";
import { determineOutcome, getRandomInt } from "../../utils/gameLogic";
import ResultOverlay from "./ResultOverlay";

const ArenaDesktop = () => {
  const [logedIn, setLogedIn] = useState(false);
  const [balance, setBalance] = useState(10);
  const [bet, setBet] = useState(0.01);
  const [gameState, setGameState] = useState({
    selected: "",
    cpuSelected: "",
    outcome: "",
  });
  const [bigButton, setBigButton] = useState("");

  const handleLogin = () => {
    console.log("login");
    setLogedIn(true);
  };

  const handleAction = useCallback(
    (choice) => {
      const cpuChoice = ["Rock", "Paper", "Scissor"][getRandomInt(3)];
      const outcome = determineOutcome(choice, cpuChoice);
      // add balance if player won
      if (outcome === "You Win!") {
        setBalance((prevBalance) => prevBalance + bet * 0.95);
      }
      // remove balance if player lost
      if (outcome === "You Lose!") {
        setBalance((prevBalance) => prevBalance - bet);
      }
      // update game state
      setGameState({
        selected: choice,
        cpuSelected: cpuChoice,
        outcome: outcome,
      });
    },
    [bet]
  );

  // function to handle long press
  const callback = useCallback(
    (event, meta) => {
      handleAction(meta.context);
    },
    [handleAction]
  );

  const bind = useLongPress(callback, {
    onStart: (event, meta) => {
      setBigButton(meta.context);
      console.log("long press started");
    },
    onFinish: () => {
      setBigButton("");
      console.log("Finished");
    },
    onCancel: () => {
      setBigButton("");
      console.log("Press cancelled");
    },
    threshold: 3000, // 3 seconds
    captureEvent: true,
    cancelOnMovement: false,
    cancelOutsideElement: true,
  });

  // function to handle context menu
  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [gameState]);

  return (
    <section className="relative w-screen h-screen flex justify-center items-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/src/assets/img/bg-desktop.png')] bg-cover bg-center"></div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Content */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col self-start pt-5 w-3/4 gap-6">
          {!logedIn && (
            <>
              <div className="text-[#FAAC52] font-normal font-passero text-7xl leading-8 drop-shadow-md">ROSHAMBO</div>
              <div className="text-white font-normal font-alatsi text-3xl leading-9 drop-shadow-md">
                Welcome to Roshambo! <br /> Choose rock, paper, or scissor <br /> and see if you can beat me.
              </div>
            </>
          )}
          {/* Bet Card */}
          {logedIn && (
            <div className="h-36 w-60 flex flex-col self-center justify-between items-center bg-[#AE9F99] rounded-lg p-1 font-alatsi text-3xl  z-20">
              <div className="flex flex-col items-center">
                <div className="flex gap-2 items-center h-full text-black">
                  <span>Pick Your Bet</span>
                  <img src={eth} alt="eth" className="w-7" />
                </div>

                <div className="flex items-center gap-2 text-white text-2xl font-alatsi">
                  <span>Balance:</span>
                  <img src={eth} alt="eth" className="w-6" />
                  <span>{balance.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-center items-center text-center gap-1 text-white">
                <button onClick={() => setBet(0.01)} className={`w-[76px] h-[61px] rounded-bl-lg flex items-center justify-center transition duration-300 ease-in-out ${bet === 0.01 ? "bg-[#006823]" : "bg-[#E35721] hover:bg-[#d14b1d]"}`}>
                  0.01
                </button>
                <button onClick={() => setBet(0.1)} className={`w-[76px] h-[61px] text-center flex items-center justify-center transition duration-300 ease-in-out ${bet === 0.1 ? "bg-[#006823]" : "bg-[#E35721] hover:bg-[#d14b1d]"}`}>
                  0.1
                </button>
                <button
                  onClick={() => setBet(1)}
                  className={`w-[76px] h-[61px] text-center rounded-br-lg flex items-center justify-center transition duration-300 ease-in-out ${bet === 1 ? "bg-[#006823]" : "bg-[#E35721] hover:bg-[#d14b1d]"}`}
                >
                  1
                </button>
              </div>
            </div>
          )}
          {/* Action Button */}
          {!logedIn ? (
            <div className={`flex gap-14 items-baseline mt-5 z-20`}>
              <button className="text-center">
                <img src={handImage.Rock} alt="Rock" className="w-40" />
                <span className="font-alatsi  text-white text-4xl">Rock</span>
              </button>
              <button className="text-center">
                <img src={handImage.Paper} alt="Paper" className="w-40" />
                <span className="font-alatsi  text-white text-4xl">Paper</span>
              </button>
              <button className="text-center">
                <img src={handImage.Scissors} alt="Scissor" className="w-40" />
                <span className="font-alatsi  text-white text-4xl">Scissor</span>
              </button>
            </div>
          ) : (
            <>
              <div className={`flex gap-6 translate-y-20 items-baseline mt-5 z-20`}>
                <button {...bind("Rock")} className={`text-center ${bigButton === "Rock" ? "scale-125 -translate-y-6" : ""} transition-transform duration-300`}>
                  {bigButton === "Rock" && <div className="absolute border-gray-300 h-[115px] w-[115px] animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />}
                  <img src={handImage.Rock} alt="Rock" className="w-40" />
                  <span className="font-alatsi text-3xl text-white lg:text-4xl">Rock</span>
                </button>
                <button {...bind("Paper")} className={`text-center ${bigButton === "Paper" ? "scale-125 -translate-y-6" : ""} transition-transform duration-300`}>
                  {bigButton === "Paper" && <div className="absolute border-gray-300 h-[115px] w-[115px] animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />}
                  <img src={handImage.Paper} alt="Paper" className="w-40" />
                  <span className="font-alatsi text-3xl text-white lg:text-4xl">Paper</span>
                </button>
                <button {...bind("Scissor")} className={`text-center ${bigButton === "Scissor" ? "scale-125 -translate-y-6" : ""} transition-transform duration-300`}>
                  {bigButton === "Scissor" && <div className="absolute border-gray-300 h-[115px] w-[115px] animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />}
                  <img src={handImage.Scissors} alt="Scissor" className="w-40" />
                  <span className="font-alatsi text-[1.6rem] text-white lg:text-4xl">Scissor</span>
                </button>
              </div>
              <div className="justify-center items-center translate-y-20 text-center font-alatsi text-[#FFF4BC] text-2xl drop-shadow-md">Hold To Shoot</div>
            </>
          )}
          {!logedIn && (
            <div className="relative mt-5 z-30">
              <button onClick={handleLogin} className="bg-[#006823] px-6 py-2 border-[#AE9F99] border-[3px] rounded-2xl w-64 h-16 font-alatsi text-2xl text-white hover:cursor-pointer z-30">
                Connect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Character Beside CTA */}
        <div className={`flex justify-center items-center z-30 ${!logedIn ? "h-full w-1/2" : "absolute translate-x-80"}`}>
          <img src={maincar} alt="Main Character" className="w-60 h-full" />
          {logedIn && <img src={bubble} alt="Bubble Chat" className="absolute -translate-y-28 translate-x-32 z-20" />}
        </div>
      </div>

      {/* Game Result Overlay */}
      {gameState.outcome && <ResultOverlay userChoice={gameState.selected} cpuChoice={gameState.cpuSelected} onClose={() => setGameState({ ...gameState, outcome: "" })} />}
    </section>
  );
};

export default ArenaDesktop;
