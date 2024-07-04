import maincar from "../../assets/img/maincar.png";
import handImage from "../../assets/img/hands/hands";
import icp from "../../assets/img/icp.png";
import bubble from "../../assets/img/bubble.png";
import ConnectModal from "../ConnectModal";
import Wallet from "../Wallet";
import { useCallback, useEffect, useState } from "react";
import { useLongPress } from "use-long-press";
// import { determineOutcome, getRandomInt } from "../../utils/gameLogic";
// import ResultOverlay from "./ResultOverlay";
import { icpAgentAtom, icpBalanceAtom, isLoggedInAtom, isModalOpenAtom, roshamboActorAtom, walletAddressAtom } from "../../store/Atoms";
import { useAtom, useSetAtom } from "jotai";
import { Principal } from "@dfinity/principal";

const ArenaDesktop = () => {
  const setConnectOpen = useSetAtom(isModalOpenAtom);
  const [logedIn] = useAtom(isLoggedInAtom);
  const [icpAgent] = useAtom(icpAgentAtom);
  const [walletAddress] = useAtom(walletAddressAtom);
  const [roshamboActor] = useAtom(roshamboActorAtom);
  // this icp balance is retrieved from store getUserBalance function run on Wallet
  const [icpBalance, setIcpBalance] = useAtom(icpBalanceAtom);
  const [bigButton, setBigButton] = useState("");
  const [bet, setBet] = useState(0);

  const handleLogin = () => {
    console.log("login");
    setConnectOpen(true);
  };

  // handle Action when user press button
  const handleAction = useCallback(
    async (choice) => {
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
      console.log(placeBetResult);
      if (placeBetResult) {
        console.log("Bet placed successfully");
      } else {
        console.error(placeBetResult.transferFailed);
      }

      const acc = {
        owner: Principal.fromText(walletAddress),
        subaccount: [],
      };

      const balanceICP = await icpAgent.icrc1_balance_of(acc);
      setIcpBalance(Number(balanceICP) / 100000000);
      const data = await roshamboActor.getCurrentGame();

      console.log(data.ok);
    },
    [icpAgent, roshamboActor, bet, walletAddress, setIcpBalance]
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
  }, []);

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
              <div className="text-white font-normal font-passion text-3xl leading-9 drop-shadow-md">
                Welcome to Roshambo! <br /> Choose rock, paper, or scissor <br /> and see if you can beat me!
              </div>
            </>
          )}
          {/* Bet Card */}
          {logedIn && (
            <div className="h-36 w-60 flex flex-col self-center justify-between items-center bg-[#AE9F99] rounded-lg p-1 font-passion text-3xl  z-20">
              <div className="flex flex-col items-center">
                <div className="flex gap-2 items-center h-full text-black">
                  <span>Pick Your Bet</span>
                  <img src={icp} alt="icp" className="w-7" />
                </div>

                <div className="flex items-center gap-2 text-white text-base font-passion">
                  <span>Balance:</span>
                  <img src={icp} alt="icp" className="w-6" />
                  <span>{icpBalance}</span>
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
          {/* Action Button */}
          {!logedIn ? (
            <div className={`flex gap-14 items-baseline mt-5 z-20`}>
              <button className="text-center">
                <img src={handImage.Rock} alt="Rock" className="w-40" />
                <span className="font-passion  text-white text-4xl">Rock</span>
              </button>
              <button className="text-center">
                <img src={handImage.Paper} alt="Paper" className="w-40" />
                <span className="font-passion  text-white text-4xl">Paper</span>
              </button>
              <button className="text-center">
                <img src={handImage.Scissors} alt="Scissor" className="w-40" />
                <span className="font-passion  text-white text-4xl">Scissor</span>
              </button>
            </div>
          ) : (
            <>
              <div className={`flex gap-6 translate-y-20 items-baseline mt-5 z-20`}>
                <button {...bind(1)} className={`text-center ${bigButton === 1 ? "scale-125 -translate-y-6" : ""} transition-transform duration-300`}>
                  {bigButton === 1 && <div className="absolute border-gray-300 h-[115px] w-[115px] animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />}
                  <img src={handImage.Rock} alt="Rock" className="w-40" />
                  <span className="font-passion text-3xl text-white lg:text-4xl">Rock</span>
                </button>
                <button {...bind(2)} className={`text-center ${bigButton === 2 ? "scale-125 -translate-y-6" : ""} transition-transform duration-300`}>
                  {bigButton === 2 && <div className="absolute border-gray-300 h-[115px] w-[115px] animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />}
                  <img src={handImage.Paper} alt="Paper" className="w-40" />
                  <span className="font-passion text-3xl text-white lg:text-4xl">Paper</span>
                </button>
                <button {...bind(3)} className={`text-center ${bigButton === 3 ? "scale-125 -translate-y-6" : ""} transition-transform duration-300`}>
                  {bigButton === 3 && <div className="absolute border-gray-300 h-[115px] w-[115px] animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />}
                  <img src={handImage.Scissors} alt="Scissor" className="w-40" />
                  <span className="font-passion text-[1.6rem] text-white lg:text-4xl">Scissor</span>
                </button>
              </div>
              <div className="justify-center items-center translate-y-20 text-center font-passion text-[#FFF4BC] text-2xl drop-shadow-md">Hold To Shoot</div>
            </>
          )}
          {!logedIn && (
            <div className="relative mt-5 z-30">
              <button onClick={handleLogin} className="bg-[#006823] px-6 py-2 border-[#AE9F99] border-[3px] rounded-2xl w-64 h-16 font-passion text-2xl text-white hover:cursor-pointer z-30">
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
      {/* {gameState.outcome && <ResultOverlay userChoice={gameState.selected} cpuChoice={gameState.cpuSelected} onClose={() => setGameState({ ...gameState, outcome: "" })} />} */}
      {/* Connect Wallet Modal Popup */}
      <ConnectModal />
      {/* Wallet Modal Popup */}
      <Wallet />
    </section>
  );
};

export default ArenaDesktop;
