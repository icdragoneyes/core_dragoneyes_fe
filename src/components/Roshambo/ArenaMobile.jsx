import maincar from "../../assets/img/maincar.png";
import handImage from "../../assets/img/hands/hands";
import icp from "../../assets/img/icp.png";
import bubble from "../../assets/img/bubble.png";
import ConnectModal from "../ConnectModal";
import Wallet from "../Wallet";
import ResultOverlay from "./ResultOverlay";
import { useLongPress } from "use-long-press";
import { useCallback, useEffect, useState } from "react";
import { eyesWonAtom, icpAgentAtom, icpBalanceAtom, isLoggedInAtom, isModalOpenAtom, roshamboActorAtom, timeMultiplierAtom, walletAddressAtom } from "../../store/Atoms";
import { useAtom, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { Principal } from "@dfinity/principal";

const ArenaMobile = () => {
  const setConnectOpen = useSetAtom(isModalOpenAtom);
  const setEyesWon = useSetAtom(eyesWonAtom);
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
  const [gameState, setGameState] = useState({
    userChoice: "",
    cpuChoice: "",
    outcome: "",
  });

  // handle Action when user press button
  const handleAction = useCallback(
    async (choice) => {
      setIsLoading(true);
      const roshamboCanisterAddress = {
        owner: Principal.fromText(process.env.REACT_APP_ROSHAMBO_LEDGER_ID),
        subaccount: [],
      };

      const betValue = [0.01, 0.1, 1];
      const approve_ = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: betValue[bet] * 100000000 + 10000,
        expected_allowance: [],
        expires_at: [],
        spender: roshamboCanisterAddress,
      };

      await icpAgent.icrc2_approve(approve_);

      let placeBetResult = await roshamboActor.place_bet(Number(bet), Number(choice));
      if (placeBetResult.success) {
        const { userChoice, cpuChoice, outcome, eyes } = placeBetResult.success;

        setGameState({
          userChoice,
          cpuChoice,
          outcome,
        });

        setIsLoading(false);
        setEyesWon(Number(eyes) / 10000000000);

        const acc = {
          owner: Principal.fromText(walletAddress),
          subaccount: [],
        };

        const balanceICP = await icpAgent.icrc1_balance_of(acc);
        setIcpBalance(Number(balanceICP) / 100000000);
        const currentGameData = await roshamboActor.getCurrentGame();

        setTimeMultiplier(Math.floor((Number(currentGameData.ok.multiplierTimerEnd) / 1000000000) % 60));
        setMultiplier(Number(currentGameData.ok.currentMultiplier));
        setBtnDisabled(false);
      } else {
        setIsLoading(false);
        setBtnDisabled(false);
        console.error(placeBetResult, "<<<<< placeBetResult.transferFailed");
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
    },
    [icpAgent, roshamboActor, bet, walletAddress, setIcpBalance, setTimeMultiplier, setEyesWon]
  );

  // function to handle long press
  const callback = useCallback(
    (event, meta) => {
      handleAction(meta.context);
      setBigButton(null);
      setBtnDisabled(true);
    },
    [handleAction]
  );

  const bind = useLongPress(callback, {
    onStart: (event, meta) => {
      setBigButton(meta.context);
      console.log("long press started");
    },
    onFinish: () => {
      console.log("Finished");
    },
    onCancel: () => {
      setBigButton(null);
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

  // Log the result of the balance promise
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeMultiplier((prevTime) => (prevTime > 1 ? prevTime - 1 : null));
    }, 1000);

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      clearInterval(timer);
    };
  }, [timeMultiplier, setTimeMultiplier]);

  return (
    <section className="relative w-screen h-screen overflow-hidden" onContextMenu={handleContextMenu}>
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/src/assets/img/bg.png')] bg-cover bg-center"></div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Content */}
      <div className="relative flex flex-col justify-center items-center pt-12">
        <div className={`flex justify-center items-center text-center px-8 ${!logedIn ? "block" : "hidden"}`}>
          <h1 className="text-[#FAAC52] font-normal font-passero text-6xl leading-5 drop-shadow-md">ROSHAMBO</h1>
        </div>
        <div className="flex justify-center items-center mt-10 relative h-full w-full">
          <img src={maincar} alt="Main Character" className={`${logedIn ? "w-9/12 translate-y-[-12%]" : ""}`} />
          {/* bubble */}
          {logedIn && <img src={bubble} alt="Bubble Chat" className="absolute -translate-y-56 translate-x-32" />}

          <div className={`absolute ${logedIn ? "-bottom-12" : "bottom-3"} flex flex-col justify-center items-center ${timeMultiplier ? "gap-5" : "gap-16"}`}>
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
                    <span>{icpBalance?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-center items-center text-center gap-1 text-white">
                  <button onClick={() => setBet(0)} className={`w-[76px] h-[61px] rounded-bl-lg flex items-center justify-center transition duration-300 ease-in-out ${bet === 0 ? "bg-[#006823]" : "bg-[#E35721] hover:bg-[#d14b1d]"}`}>
                    0.01
                  </button>
                  <button onClick={() => setBet(1)} className={`w-[76px] h-[61px] text-center flex items-center justify-center transition duration-300 ease-in-out ${bet === 1 ? "bg-[#006823]" : "bg-[#E35721] hover:bg-[#d14b1d]"}`}>
                    0.1
                  </button>
                  <button
                    onClick={() => setBet(2)}
                    className={`w-[76px] h-[61px] text-center rounded-br-lg flex items-center justify-center transition duration-300 ease-in-out ${bet === 2 ? "bg-[#006823]" : "bg-[#E35721] hover:bg-[#d14b1d]"}`}
                  >
                    1
                  </button>
                </div>
              </div>
            )}

            {/* time and x multiplier */}
            {timeMultiplier && (
              <div className="flex items-center justify-around bg-gray-800 text-white w-[231px] h-[69px] rounded-lg p-2 space-x-4 font-passion">
                <div className="text-3xl font-bold ">00:{timeMultiplier?.toString().padStart(2, "0") || "00"}</div>
                <div className="flex flex-col leading-tight text-[#FFF4BC]">
                  Next bet
                  <br />
                  multiplier
                </div>
                <div className="text-5xl font-bold text-[#EE5151]">{multiplier}X</div>
              </div>
            )}

            {/* loading */}
            {isLoading && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                <div className="bg-gray-900 bg-opacity-90 rounded-lg p-8 flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="animate-spin rounded-full h-32 w-32 border-4 border-[#E35721] border-t-transparent"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg className="w-16 h-16 text-[#E35721]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-white font-passion text-2xl text-center max-w-xs">Accessing Dragon On-Chain Randomizer</div>
                </div>
              </div>
            )}

            {/* Action Button */}
            {logedIn ? (
              <>
                <div className="flex gap-6 lg:gap-10 items-baseline">
                  <button {...bind(1)} disabled={btnDisabled} className={`text-center ${bigButton === 1 ? "scale-125 -translate-y-6" : ""} transition-transform duration-300 ${btnDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {bigButton === 1 && <div className="absolute border-gray-300 h-24 w-24 animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />}
                    <img src={handImage.Rock} alt="Rock" className="w-24 lg:w-32" />
                    <span className="font-passion text-3xl text-white lg:text-4xl">Rock</span>
                  </button>
                  <button {...bind(2)} disabled={btnDisabled} className={`text-center ${bigButton === 2 ? "scale-125 -translate-y-6" : ""} transition-transform duration-300 ${btnDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {bigButton === 2 && <div className="absolute border-gray-300 h-24 w-24 animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />}
                    <img src={handImage.Paper} alt="Paper" className="w-24 lg:w-32" />
                    <span className="font-passion text-3xl text-white lg:text-4xl">Paper</span>
                  </button>
                  <button {...bind(3)} disabled={btnDisabled} className={`text-center ${bigButton === 3 ? "scale-125 -translate-y-6" : ""} transition-transform duration-300 ${btnDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {bigButton === 3 && <div className="absolute border-gray-300 h-24 w-24 animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />}
                    <img src={handImage.Scissors} alt="Scissor" className="w-24 lg:w-32" />
                    <span className="font-passion text-[1.6rem] text-white lg:text-4xl">Scissor</span>
                  </button>
                </div>
                {logedIn && <div className="justify-center items-center text center font-passion text-[#FFF4BC] text-2xl drop-shadow-md">Hold To Shoot</div>}
              </>
            ) : (
              <div className="flex gap-6 lg:gap-10 items-baseline">
                <button className="text-center">
                  <img src={handImage.Rock} alt="Rock" className="w-24 lg:w-32" />
                  <span className="font-passion text-3xl text-white lg:text-4xl">Rock</span>
                </button>
                <button className="text-center">
                  <img src={handImage.Paper} alt="Paper" className="w-24 lg:w-32" />
                  <span className="font-passion text-3xl text-white lg:text-4xl">Paper</span>
                </button>
                <button className="text-center">
                  <img src={handImage.Scissors} alt="Scissor" className="w-24 lg:w-32" />
                  <span className="font-passion text-[1.6rem] text-white lg:text-4xl">Scissor</span>
                </button>
              </div>
            )}
            {/* Hold To Shot */}

            {/* CTA */}
            <div className={`flex flex-col justify-center items-center gap-5 w-80 h-36 lg:w-96 lg:h-48 ${!logedIn ? "block" : "hidden"}`}>
              <div className="font-passion text-center text-white font-normal text-lg lg:text-xl">
                <p>
                  Welcome to Roshambo! <br /> Choose rock, paper, or scissor and see if you can beat me and double your money!
                </p>
              </div>
              <div>
                <button onClick={() => setConnectOpen(true)} className="bg-[#006823] px-6 py-2 border-[#AE9F99] border-[3px] rounded-2xl w-64 h-16 font-passion text-2xl text-white hover:cursor-pointer lg:w-72 lg:h-20 lg:text-3xl">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Game Result Overlay */}
      {gameState.outcome && <ResultOverlay userChoice={gameState.userChoice} cpuChoice={gameState.cpuChoice} onClose={() => setGameState({ ...gameState, outcome: "" })} />}
      {/* Connect Wallet Modal Popup */}
      <ConnectModal />
      {/* Wallet Modal Popup */}
      <Wallet />
    </section>
  );
};

export default ArenaMobile;
