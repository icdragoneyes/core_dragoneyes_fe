import maincar from "../../assets/img/maincar.png";
import handImage from "../../assets/img/hands/hands";
import icp from "../../assets/img/icp.png";
import bubble from "../../assets/img/bubble.png";
import ConnectModal from "../ConnectModal";
import Wallet from "../Wallet";
import ResultOverlay from "./ResultOverlay";
import RandomizerOverlay from "./RandomizerOverlay";
import { useLongPress } from "use-long-press";
import { useCallback, useEffect, useState } from "react";
import {
  eyesWonAtom,
  icpAgentAtom,
  icpBalanceAtom,
  isLoggedInAtom,
  isModalOpenAtom,
  roshamboActorAtom,
  timeMultiplierAtom,
  walletAddressAtom,
  eyesBalanceAtom,
} from "../../store/Atoms";
import { useAtom, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { Principal } from "@dfinity/principal";

const ArenaMobile = () => {
  const setConnectOpen = useSetAtom(isModalOpenAtom);
  const setEyesWon = useSetAtom(eyesWonAtom);
  const [eyesBalance, setEyesBalance] = useAtom(eyesBalanceAtom);
  const [logedIn] = useAtom(isLoggedInAtom);
  const [icpAgent] = useAtom(icpAgentAtom);
  const [walletAddress] = useAtom(walletAddressAtom);
  const [roshamboActor] = useAtom(roshamboActorAtom);
  const [timeMultiplier, setTimeMultiplier] = useAtom(timeMultiplierAtom);
  // this icp balance is retrieved from store getUserBalance function run on Wallet
  const [icpBalance, setIcpBalance] = useAtom(icpBalanceAtom);
  const [bet, setBet] = useState(0);
  const [bigButton, setBigButton] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [multiplier, setMultiplier] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [uchoice, setuChoice] = useState(0);
  const [icpWon, setIcpWon] = useState(0);
  const [gameState, setGameState] = useState({
    userChoice: "",
    cpuChoice: "",
    outcome: "",
  });

  // Function to refresh user data (balance, game state, etc.)
  async function refreshBalance() {
    //console.log("calling eyes balance");
    var balanceICP = 0;
    const acc = { owner: Principal?.fromText(walletAddress), subaccount: [] };
    balanceICP = await icpAgent.icrc1_balance_of(acc);
    setIcpBalance(Number(balanceICP) / 1e8);
    //console.log(balanceICP, "calling eyes balance success");
  }

  // Function to refresh user data (balance, game state, etc.)
  const refreshUserData = useCallback(async () => {
    if (walletAddress && roshamboActor && icpAgent) {
      //const acc = { owner: Principal?.fromText(walletAddress), subaccount: [] };
      //const balanceICP = await icpAgent.icrc1_balance_of(acc);
      //setIcpBalance(Number(balanceICP) / 1e8);
      console.log("refresh user");
      const currentGameData = await roshamboActor.getCurrentGame();
      setIcpBalance(Number(currentGameData.ok.icpbalance) / 1e8);
      if (eyesBalance == 0) {
        setEyesBalance(Number(currentGameData.ok.eyesbalance) / 1e8);
      }
      setEyesBalance(Number(currentGameData.ok.eyesbalance) / 1e8);
      setTimeMultiplier(Number(currentGameData.ok.multiplierTimerEnd) / 1e6);
      setMultiplier(Number(currentGameData.ok.currentMultiplier));
      refreshBalance();
    }
  }, [
    icpAgent,
    roshamboActor,
    walletAddress,
    setIcpBalance,
    setTimeMultiplier,
    setMultiplier,
    eyesBalance,
    setEyesBalance,
  ]);

  // Effect to handle timer countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (timeMultiplier <= 0) return 0;
      const timeDifference = timeMultiplier - new Date().getTime();
      return timeDifference <= 0 ? 0 : Math.floor(timeDifference / 1000);
    };

    const timerInterval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeMultiplier, refreshUserData]);

  // Function to handle user action (placing a bet)
  const handleAction = useCallback(
    async (choice) => {
      setIsLoading(true);
      const roshamboCanisterAddress = {
        owner: Principal.fromText(process.env.REACT_APP_ROSHAMBO_LEDGER_ID),
        subaccount: [],
      };

      const handList = ["none", "ROCK", "PAPER", "SCISSORS"];
      const betValues = [0.01, 0.1, 1];
      const betAmount = betValues[bet] * 1e8 + 10000;
      setuChoice(handList[Number(choice)]);
      try {
        await icpAgent.icrc2_approve({
          fee: [],
          memo: [],
          from_subaccount: [],
          created_at_time: [],
          amount: betAmount,
          expected_allowance: [],
          expires_at: [],
          spender: roshamboCanisterAddress,
        });

        const placeBetResult = await roshamboActor.place_bet(
          Number(bet),
          Number(choice)
        );

        if (placeBetResult.success) {
          const { userChoice, cpuChoice, outcome, eyes, icp, userData } =
            placeBetResult.success;

          setGameState({ userChoice, cpuChoice, outcome });
          if (Number(icp) > 0) setIcpWon(Number(betValues[bet] * 2));
          if (Number(eyes) > 0) console.log("");
          // setEyesWon(Number(eyes) / 1e8);
          //const currentGameData = await roshamboActor.getCurrentGame();
          //setIcpBalance(Number(userData.icpbalance) / 1e8);
          // if (eyesBalance == 0) {
          // setEyesBalance(Number(userData.eyesbalance) / 1e8);
          //}
          //setEyesBalance(Number(userData.eyesbalance) / 1e8);
          setTimeMultiplier(Number(userData.multiplierTimerEnd) / 1e6);
          setMultiplier(Number(userData.currentMultiplier));
          //await refreshUserData();
          console.log("s-refreshing balance");
          refreshBalance();
        } else {
          refreshBalance();
          toast.error("Insufficient Balance. Please Top Up First", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {
        console.error("Error in handleAction:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
        setBtnDisabled(false);
      }
    },
    [
      icpAgent,
      roshamboActor,
      bet,
      setEyesWon,
      setEyesBalance,
      setIcpBalance,
      setTimeMultiplier,
      setMultiplier,
    ]
  );

  // Callback for long press action
  const longPressCallback = useCallback(
    (event, meta) => {
      handleAction(meta.context);
      setBigButton(null);
      setBtnDisabled(true);
    },
    [handleAction]
  );

  // Configuration for long press hook
  const longPressConfig = {
    onStart: (event, meta) => setBigButton(meta.context),
    onFinish: () => {},
    onCancel: () => setBigButton(null),
    threshold: 3000, // 3 seconds
    captureEvent: true,
    cancelOnMovement: false,
    cancelOutsideElement: true,
  };

  // Hook for handling long press
  const bind = useLongPress(longPressCallback, longPressConfig);

  // Function to prevent context menu
  const handleContextMenu = (event) => event.preventDefault();

  // Effect to add and remove context menu event listener
  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <section
      className="relative w-screen h-screen overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/src/assets/img/bg.png')] bg-cover bg-center"></div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Content */}
      <div className="relative flex flex-col justify-center items-center pt-12">
        <div
          className={`flex justify-center items-center text-center px-8 ${
            !logedIn ? "block" : "hidden"
          }`}
        >
          <h1 className="text-[#FAAC52] font-normal font-passero text-6xl leading-5 drop-shadow-md">
            ROSHAMBO
          </h1>
        </div>
        <div className="flex justify-center items-center mt-10 relative h-full w-full">
          <img
            src={maincar}
            alt="Main Character"
            className={`${logedIn ? "w-9/12 translate-y-[-12%]" : ""}`}
          />
          {/* bubble */}
          {logedIn && (
            <img
              src={bubble}
              alt="Bubble Chat"
              className="absolute -translate-y-56 translate-x-32"
            />
          )}

          <div
            className={`absolute ${
              logedIn ? "-bottom-12" : "bottom-3"
            } flex flex-col justify-center items-center ${
              timeMultiplier ? "gap-5" : "gap-16"
            }`}
          >
            {/* Bet Card */}
            {logedIn && (
              <div className="h-36 w-60 flex flex-col justify-between items-center bg-[#AE9F99] rounded-lg p-1 font-passion text-3xl lg:text-4xl">
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 items-center h-full text-black">
                    <span>Pick Your Bet</span>
                    <img src={icp} alt="icp" className="w-7" />
                  </div>

                  <div className="flex items-center gap-2 text-white text-base font-passion">
                    <span>Balance:</span>
                    <img src={icp} alt="icp" className="w-6" />
                    <span>
                      {Number(icpBalance?.toFixed(2)).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center items-center text-center gap-1 text-white">
                  <button
                    onClick={() => setBet(0)}
                    className={`w-[76px] h-[61px] rounded-bl-lg flex items-center justify-center transition duration-300 ease-in-out ${
                      bet === 0
                        ? "bg-[#006823]"
                        : "bg-[#E35721] hover:bg-[#d14b1d]"
                    }`}
                  >
                    0.01
                  </button>
                  <button
                    onClick={() => setBet(1)}
                    className={`w-[76px] h-[61px] text-center flex items-center justify-center transition duration-300 ease-in-out ${
                      bet === 1
                        ? "bg-[#006823]"
                        : "bg-[#E35721] hover:bg-[#d14b1d]"
                    }`}
                  >
                    0.1
                  </button>
                  <button
                    onClick={() => setBet(2)}
                    className={`w-[76px] h-[61px] text-center rounded-br-lg flex items-center justify-center transition duration-300 ease-in-out ${
                      bet === 2
                        ? "bg-[#006823]"
                        : "bg-[#E35721] hover:bg-[#d14b1d]"
                    }`}
                  >
                    1
                  </button>
                </div>
              </div>
            )}

            {/* time and x multiplier */}
            {timeMultiplier > 0 && (
              <div className="flex items-center justify-around bg-gray-800 text-white w-[231px] h-[69px] rounded-lg p-2 space-x-4 font-passion">
                <div className="text-3xl font-bold">00:{timeLeft}</div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[#FFF4BC]">Play Now!</span>
                  <span className="text-yellow-400 font-bold">
                    To Earn{" "}
                    <span className="text-2xl text-red-500 animate-pulse mx-1">
                      {multiplier}X
                    </span>{" "}
                    EYES!
                  </span>
                </div>
              </div>
            )}

            {/* loading */}
            {isLoading && <RandomizerOverlay userChoice={uchoice} />}

            {/* Action Button */}
            {logedIn ? (
              <>
                <div className="flex gap-6 lg:gap-10 items-baseline">
                  <button
                    {...bind(1)}
                    disabled={btnDisabled}
                    className={`text-center ${
                      bigButton === 1 ? "scale-125 -translate-y-6" : ""
                    } transition-transform duration-300 ${
                      btnDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {bigButton === 1 && (
                      <div className="absolute border-gray-300 h-24 w-24 animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />
                    )}
                    <img
                      src={handImage.Rock}
                      alt="Rock"
                      className="w-24 lg:w-32"
                    />
                    <span className="font-passion text-3xl text-white lg:text-4xl">
                      Rock
                    </span>
                  </button>
                  <button
                    {...bind(2)}
                    disabled={btnDisabled}
                    className={`text-center ${
                      bigButton === 2 ? "scale-125 -translate-y-6" : ""
                    } transition-transform duration-300 ${
                      btnDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {bigButton === 2 && (
                      <div className="absolute border-gray-300 h-24 w-24 animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />
                    )}
                    <img
                      src={handImage.Paper}
                      alt="Paper"
                      className="w-24 lg:w-32"
                    />
                    <span className="font-passion text-3xl text-white lg:text-4xl">
                      Paper
                    </span>
                  </button>
                  <button
                    {...bind(3)}
                    disabled={btnDisabled}
                    className={`text-center ${
                      bigButton === 3 ? "scale-125 -translate-y-6" : ""
                    } transition-transform duration-300 ${
                      btnDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {bigButton === 3 && (
                      <div className="absolute border-gray-300 h-24 w-24 animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />
                    )}
                    <img
                      src={handImage.Scissors}
                      alt="Scissor"
                      className="w-24 lg:w-32"
                    />
                    <span className="font-passion text-[1.6rem] text-white lg:text-4xl">
                      Scissor
                    </span>
                  </button>
                </div>
                {logedIn && (
                  <div className="justify-center items-center text center font-passion text-[#FFF4BC] text-2xl drop-shadow-md">
                    Hold To Shoot
                  </div>
                )}
              </>
            ) : (
              <div className="flex gap-6 lg:gap-10 items-baseline">
                <button className="text-center">
                  <img
                    src={handImage.Rock}
                    alt="Rock"
                    className="w-24 lg:w-32"
                  />
                  <span className="font-passion text-3xl text-white lg:text-4xl">
                    Rock
                  </span>
                </button>
                <button className="text-center">
                  <img
                    src={handImage.Paper}
                    alt="Paper"
                    className="w-24 lg:w-32"
                  />
                  <span className="font-passion text-3xl text-white lg:text-4xl">
                    Paper
                  </span>
                </button>
                <button className="text-center">
                  <img
                    src={handImage.Scissors}
                    alt="Scissor"
                    className="w-24 lg:w-32"
                  />
                  <span className="font-passion text-[1.6rem] text-white lg:text-4xl">
                    Scissor
                  </span>
                </button>
              </div>
            )}
            {/* Hold To Shot */}

            {/* CTA */}
            <div
              className={`flex flex-col justify-center items-center gap-5 w-80 h-36 lg:w-96 lg:h-48 ${
                !logedIn ? "block" : "hidden"
              }`}
            >
              <div className="font-passion text-center text-white font-normal text-lg lg:text-xl">
                <p>
                  Welcome to Roshambo! <br /> Choose rock, paper, or scissor and
                  see if you can beat me and double your money!
                </p>
              </div>
              <div>
                <button
                  onClick={() => setConnectOpen(true)}
                  className="bg-[#006823] px-6 py-2 border-[#AE9F99] border-[3px] rounded-2xl w-64 h-16 font-passion text-2xl text-white hover:cursor-pointer lg:w-72 lg:h-20 lg:text-3xl"
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Game Result Overlay */}

      {gameState.outcome && (
        <ResultOverlay
          userChoice={gameState.userChoice}
          cpuChoice={gameState.cpuChoice}
          icpWon={icpWon.toString()}
          onClose={() => setGameState({ ...gameState, outcome: "" })}
        />
      )}

      {/* Connect Wallet Modal Popup */}
      <ConnectModal />
      {/* Wallet Modal Popup */}
      <Wallet />
    </section>
  );
};

export default ArenaMobile;
