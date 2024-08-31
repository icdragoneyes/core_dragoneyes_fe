import maincar from "../../assets/img/maincar.png";
import handImage from "../../assets/img/hands/hands";
import bubble from "../../assets/img/bubble.png";
import ConnectModal from "../ConnectModal";
import Wallet from "../Wallet";
import ResultOverlay from "./ResultOverlay";
import RandomizerOverlay from "./RandomizerOverlay";
import { useLongPress } from "use-long-press";
import { useCallback, useEffect, useState } from "react";
import {
  eyesWonAtom,
  roshamboEyesAtom,
  eyesModeAtom,
  icpAgentAtom,
  icpBalanceAtom,
  isLoggedInAtom,
  isModalOpenAtom,
  roshamboActorAtom,
  timeMultiplierAtom,
  walletAddressAtom,
  streakMultiplierAtom,
  eyesBalanceAtom,
  //selectedWalletAtom,
  eyesLedgerAtom,
  logosModeAtom,
  streakModeAtom,
  streakRewardAtom,
  betAtom,
  isStreakModalOpenAtom,
  isSwitchingAtom,
  currentStreakAtom,
  roshamboNewBetAtom,
  roshamboLastBetAtom,
  telegramInitDataAtom,
} from "../../store/Atoms";
import { useAtom, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { Principal } from "@dfinity/principal";
import StreakModeModal from "./StreakModeModal";
// import Wallet2 from "../Wallet2";

const ArenaMobile = () => {
  // const [selectedWallet, setSelectedWallet] = useAtom(selectedWalletAtom);
  const [roshamboEyes] = useAtom(roshamboEyesAtom);
  const [eyesAgent] = useAtom(eyesLedgerAtom);
  const [eyesMode] = useAtom(eyesModeAtom);
  const [logos] = useAtom(logosModeAtom);
  const setConnectOpen = useSetAtom(isModalOpenAtom);
  const setEyesWon = useSetAtom(eyesWonAtom);
  const [eyesBalance, setEyesBalance] = useAtom(eyesBalanceAtom);
  const [logedIn] = useAtom(isLoggedInAtom);
  const [icpAgent] = useAtom(icpAgentAtom);
  const [walletAddress] = useAtom(walletAddressAtom);
  const [roshamboActor] = useAtom(roshamboActorAtom);
  const [timeMultiplier, setTimeMultiplier] = useAtom(timeMultiplierAtom);
  const [isSwitching, setIsSwitching] = useAtom(isSwitchingAtom);
  const [streakMode, setStreakMode] = useAtom(streakModeAtom);
  // this icp balance is retrieved from store getUserBalance function run on Wallet
  const [icpBalance, setIcpBalance] = useAtom(icpBalanceAtom);
  const [isStreakModalOpen, setIsStreakModalOpen] = useAtom(
    isStreakModalOpenAtom
  );
  const [bet, setBet] = useAtom(betAtom);
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
  const [streakMultiplier, setStreakMultiplier] = useAtom(streakMultiplierAtom);
  const [currentStreak, setCurrentStreak] = useAtom(currentStreakAtom);
  const setStreakReward = useSetAtom(streakRewardAtom);
  const [betAmounts, setBetAmounts] = useState([]);
  const [lastBets] = useAtom(roshamboLastBetAtom);
  const [newbet] = useAtom(roshamboNewBetAtom);
  const [startCountdown, setStartCountdown] = useState(false);
  const [count, setCount] = useState(10);
  const [hideStreakbtn, setHideStreakbtn] = useState(false);
  const [initData] = useAtom(telegramInitDataAtom);
  // Function to refresh user data (balance, game state, etc.)
  const refreshBalance = useCallback(async () => {
    if (!icpAgent || !walletAddress) return;
    const acc = { owner: Principal?.fromText(walletAddress), subaccount: [] };
    let balanceICP = await icpAgent.icrc1_balance_of(acc);
    setIcpBalance(Number(balanceICP) / 1e8);
    let beyes = await eyesAgent.icrc1_balance_of(acc);
    setEyesBalance(Number(beyes) / 1e8);
  }, [icpAgent, walletAddress, setIcpBalance, eyesAgent, setEyesBalance]);

  useEffect(() => {
    setStartCountdown(true);
    setCount(2);
    //console.log(lastBets, "<<<<<<<<<lb");
  }, [lastBets]);

  function minutesFromNowToPastTimestamp(pastTimestamp) {
    // Get the current time in milliseconds
    const now = Date.now();

    // Calculate the difference in milliseconds
    const differenceInMillis = now - pastTimestamp;

    // Convert milliseconds to minutes
    const differenceInMinutes = Math.floor(differenceInMillis / 60000);

    return differenceInMinutes;
  }

  useEffect(() => {
    let timer;
    if (startCountdown && count > 0) {
      timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000); // Decrement every 1 second
    } else if (count === 0) {
      setStartCountdown(false); // Stop the countdown when it hits 0
      clearInterval(timer); // Clear the interval
    }

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, [startCountdown, count]);

  // Function to refresh user data (balance, game state, etc.)
  const refreshUserData = useCallback(async () => {
    if (walletAddress && roshamboActor && icpAgent && roshamboEyes) {
      let theactor = eyesMode ? roshamboEyes : roshamboActor;
      const currentGameData = await theactor.getCurrentGame();
      const streakDatas = await theactor.getStreakData();
      setStreakMultiplier(Number(streakDatas.streakMultiplier));
      setCurrentStreak(Number(streakDatas.currentStreak));
      let amountlist = eyesMode ? [10, 100, 500] : [0.1, 1, 5];
      setStreakReward(Number(streakDatas.streakMultiplier) * amountlist[bet]);
      setIcpBalance(Number(currentGameData.ok.icpbalance) / 1e8);
      //setLastBet(sortLastBet(lastbets_));
      setEyesBalance((prevBalance) => {
        if (
          prevBalance === 0 ||
          Number(currentGameData.ok.eyesbalance) !== prevBalance
        ) {
          return Number(currentGameData.ok.eyesbalance) / 1e8;
        }
        return prevBalance;
      });
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
    setStreakReward,
    refreshBalance,
    bet,
    eyesMode,
    roshamboEyes,
    setEyesBalance,
    setCurrentStreak,
    setStreakMultiplier,
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
      if (newTimeLeft <= 0) setTimeMultiplier(0);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeMultiplier, refreshUserData, setTimeMultiplier]);

  // Function to handle user action (placing a bet)
  const handleAction = useCallback(
    async (choice) => {
      setIsLoading(true);
      const roshamboCanisterAddress = {
        owner: Principal.fromText(process.env.REACT_APP_ROSHAMBO_LEDGER_ID),
        subaccount: [],
      };
      const roshamboEyesCanisterAddress = {
        owner: Principal.fromText("gb6er-oqaaa-aaaam-ac4ha-cai"),
        subaccount: [],
      };
      let betICP = [0.1, 1, 5];
      let betAmount = Number((betICP[bet] * 1e8 + 10000).toFixed(0));
      const handList = ["none", "ROCK", "PAPER", "SCISSORS"];
      let theactor = eyesMode ? roshamboEyes : roshamboActor;
      if (!eyesMode) {
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

          const placeBetResult = await theactor.place_bet(
            Number(bet),
            Number(choice)
          );

          if (placeBetResult.success) {
            const { userChoice, cpuChoice, outcome, eyes, icp, userData } =
              placeBetResult.success;

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * 2));

            setEyesWon(Number(eyes) / 1e8);
            if (Number(userData.multiplierTimerEnd) == 0) setTimeMultiplier(0);
            else setTimeMultiplier(Number(userData.multiplierTimerEnd) / 1e6);
            setMultiplier(Number(userData.currentMultiplier));

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
      } else {
        betICP = [10, 100, 500];
        betAmount = Number((betICP[bet] * 1e8 + 10000).toFixed(0));
        setuChoice(handList[Number(choice)]);
        try {
          await eyesAgent.icrc2_approve({
            fee: [],
            memo: [],
            from_subaccount: [],
            created_at_time: [],
            amount: betAmount,
            expected_allowance: [],
            expires_at: [],
            spender: roshamboEyesCanisterAddress,
          });

          const placeBetResult = await roshamboEyes.place_bet(
            Number(bet),
            Number(choice)
          );
          if (placeBetResult.success) {
            const { userChoice, cpuChoice, outcome, eyes, icp, userData } =
              placeBetResult.success;

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * 2));

            setEyesWon(Number(eyes) / 1e8);
            if (Number(userData.multiplierTimerEnd) == 0) setTimeMultiplier(0);
            else setTimeMultiplier(Number(userData.multiplierTimerEnd) / 1e6);
            setMultiplier(Number(userData.currentMultiplier));

            refreshBalance();
          } else {
            refreshBalance();
            toast.error("Insufficient EYES, get more EYES", {
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
      }
    },
    [
      roshamboActor,
      eyesAgent,
      roshamboEyes,
      bet,
      setEyesWon,
      setTimeMultiplier,
      setMultiplier,
      setGameState,
      eyesMode,
      refreshBalance,
      setIcpWon,
      icpAgent,
    ]
  );

  const handleStreakAction = useCallback(
    async (choice) => {
      setIsLoading(true);
      const roshamboCanisterAddress = {
        owner: Principal.fromText(process.env.REACT_APP_ROSHAMBO_LEDGER_ID),
        subaccount: [],
      };

      const roshamboEyesCanisterAddress = {
        owner: Principal.fromText("gb6er-oqaaa-aaaam-ac4ha-cai"),
        subaccount: [],
      };
      let betICP = [0.1, 1, 5];
      let betAmount = Number((betICP[bet] * 1e8 + 10000).toFixed(0));
      const handList = ["none", "ROCK", "PAPER", "SCISSORS"];
      let theactor = eyesMode ? roshamboEyes : roshamboActor;
      if (!eyesMode) {
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

          const placeBetResult = await theactor.place_bet_rush(
            Number(bet),
            Number(choice)
          );
          if (placeBetResult.success) {
            const {
              userChoice,
              cpuChoice,
              outcome,
              eyes,
              icp,
              userData,
              streak,
            } = placeBetResult.success;

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0)
              setIcpWon(Number(betICP[bet] * streakMultiplier));
            setCurrentStreak(Number(streak));
            setEyesWon(Number(eyes) / 1e8);
            if (Number(userData.multiplierTimerEnd) == 0) setTimeMultiplier(0);
            else setTimeMultiplier(Number(userData.multiplierTimerEnd) / 1e6);
            setMultiplier(Number(userData.currentMultiplier));

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
      } else {
        betICP = [10, 100, 500];
        betAmount = Number((betICP[bet] * 1e8 + 10000).toFixed(0));
        setuChoice(handList[Number(choice)]);
        try {
          await eyesAgent.icrc2_approve({
            fee: [],
            memo: [],
            from_subaccount: [],
            created_at_time: [],
            amount: betAmount,
            expected_allowance: [],
            expires_at: [],
            spender: roshamboEyesCanisterAddress,
          });

          const placeBetResult = await roshamboEyes.place_bet_rush(
            Number(bet),
            Number(choice)
          );
          if (placeBetResult.success) {
            const {
              userChoice,
              cpuChoice,
              outcome,
              eyes,
              icp,
              userData,
              streak,
            } = placeBetResult.success;

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0)
              setIcpWon(Number(betICP[bet] * streakMultiplier));
            setCurrentStreak(Number(streak));
            setEyesWon(Number(eyes) / 1e8);
            if (Number(userData.multiplierTimerEnd) == 0) setTimeMultiplier(0);
            else setTimeMultiplier(Number(userData.multiplierTimerEnd) / 1e6);
            setMultiplier(Number(userData.currentMultiplier));

            refreshBalance();
          } else {
            refreshBalance();
            toast.error("Insufficient EYES, get more EYES", {
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
      }
    },
    [
      roshamboActor,
      eyesAgent,
      roshamboEyes,
      bet,
      setEyesWon,
      setTimeMultiplier,
      setMultiplier,
      setGameState,
      eyesMode,
      refreshBalance,
      setCurrentStreak,
      icpAgent,
      streakMultiplier,
    ]
  );

  async function switchStreak() {
    setIsStreakModalOpen(true);
    setStreakMode(!streakMode);
    let amountlist = [];
    if (!eyesMode) {
      amountlist = [0.1, 1, 5];
    } else {
      amountlist = [10, 100, 500];
    }
    setStreakReward(streakMultiplier * amountlist[bet]);
  }

  // Callback for long press action
  const longPressCallback = useCallback(
    (event, meta) => {
      if (!streakMode) {
        handleAction(meta.context);
      } else {
        handleStreakAction(meta.context);
      }
      setBigButton(null);
      setBtnDisabled(true);
    },
    [handleAction, handleStreakAction, streakMode]
  );

  // Configuration for long press hook
  const longPressConfig = {
    onStart: (event, meta) => (
      setBigButton(meta.context), setHideStreakbtn(true)
    ),
    onFinish: () => {
      setHideStreakbtn(false);
    },
    onCancel: () => (setBigButton(null), setHideStreakbtn(false)),
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
    refreshUserData();

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, roshamboActor, roshamboEyes]);

  useEffect(() => {
    setTimeMultiplier(0);
    setMultiplier(0);
    if (isSwitching) {
      refreshUserData().then(() => {
        setIsSwitching(false);
      });
    }
    if (!eyesMode) {
      setBetAmounts([0.1, 1, 5]);
    } else {
      setBetAmounts([10, 100, 500]);
    }

    console.log(eyesMode);
  }, [
    eyesMode,
    refreshUserData,
    setTimeMultiplier,
    setMultiplier,
    isSwitching,
    setIsSwitching,
  ]);

  return (
    <section
      className="relative w-screen h-screen flex flex-col justify-between overflow-y-auto pb-32"
      onContextMenu={handleContextMenu}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/src/assets/img/bg.png')] bg-cover bg-center h-screen"></div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Content */}
      <div className="relative flex flex-col justify-center items-center pt-4">
        <div
          className={`grid justify-center items-center text-center px-8 ${
            !logedIn ? "block" : "hidden"
          }`}
        >
          <div className="flex text-[#FAAC52] font-normal font-passero text-6xl  drop-shadow-md">
            ROSHAMBO {initData != "" ? " Telegram" : ""}{" "}
          </div>
        </div>

        <div className="flex justify-center items-center relative h-full w-full">
          <img
            src={maincar}
            alt="Main Character"
            className={`${logedIn ? "w-9/12" : ""}`}
          />
          {/* bubble */}
          {logedIn &&
            (streakMode ? (
              <div className="absolute -translate-y-32 translate-x-32 bg-slate-50 rounded-xl p-3 max-w-[130px] text-center">
                <p className="font-passion text-[#006823] text-sm">
                  Streak mode: <br /> Win 3x <br /> = <br />
                  Prize {streakMultiplier}x!
                  <br />
                  {eyesMode
                    ? `${(betAmounts[bet] * streakMultiplier).toFixed(0)} EYES`
                    : `${(betAmounts[bet] * streakMultiplier).toFixed(0)} ICP`}
                </p>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-6 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white border-r-[10px] border-r-transparent"></div>
              </div>
            ) : (
              <img
                src={bubble}
                alt="Bubble Chat"
                className="absolute -translate-y-32 translate-x-32"
              />
            ))}

          <div
            className={`absolute ${
              logedIn ? "-bottom-20" : "bottom-10"
            } flex flex-col justify-center items-center ${
              timeMultiplier ? "gap-5" : "gap-2"
            }`}
          >
            {/* Bet Card */}
            {logedIn &&
              (streakMode ? (
                <>
                  <div className="h-66 w-60 flex flex-col self-center justify-between items-center bg-[#AE9F99] rounded-lg p-1 font-passion text-3xl">
                    <div className="flex flex-col items-center">
                      <div className="flex gap-2 items-center h-full text-black">
                        {currentStreak === 0 ? (
                          <>
                            <span>Pick Your Bet</span>
                            <img src={logos} alt="icp" className="w-7" />
                          </>
                        ) : (
                          <span>Win {3 - currentStreak}x more to win!</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-white text-base font-passion mb-2">
                        <span>Balance:</span>
                        <img src={logos} alt="icp" className="w-6" />
                        {eyesMode ? (
                          <>
                            {Number(eyesBalance?.toFixed(2)).toLocaleString()}
                          </>
                        ) : (
                          <>{Number(icpBalance?.toFixed(2)).toLocaleString()}</>
                        )}
                      </div>
                    </div>
                    {currentStreak == 0 ? (
                      <div className="flex justify-center items-center text-center gap-1 text-white">
                        <button
                          onClick={() => {
                            setBet(0);
                            setStreakReward(betAmounts[0] * streakMultiplier);
                          }}
                          className={`w-[76px] h-[61px] rounded-bl-lg flex items-center justify-center transition duration-300 ease-in-out ${
                            bet === 0
                              ? "bg-[#006823]"
                              : "bg-[#E35721] hover:bg-[#d14b1d]"
                          }`}
                        >
                          {eyesMode ? 10 : <>0.1</>}
                        </button>
                        <button
                          onClick={() => {
                            setBet(1);
                            setStreakReward(betAmounts[1] * streakMultiplier);
                          }}
                          className={`w-[76px] h-[61px] text-center flex items-center justify-center transition duration-300 ease-in-out ${
                            bet === 1
                              ? "bg-[#006823]"
                              : "bg-[#E35721] hover:bg-[#d14b1d]"
                          }`}
                        >
                          {eyesMode ? 100 : <>1</>}
                        </button>
                        <button
                          onClick={() => {
                            setBet(2);
                            setStreakReward(betAmounts[2] * streakMultiplier);
                          }}
                          className={`w-[76px] h-[61px] text-center rounded-br-lg flex items-center justify-center transition duration-300 ease-in-out ${
                            bet === 2
                              ? "bg-[#006823]"
                              : "bg-[#E35721] hover:bg-[#d14b1d]"
                          }`}
                        >
                          {eyesMode ? 500 : <>5</>}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center text-center gap-2 text-white text-base w-full h-full pb-2 p-3 bg-[#E35721] rounded-md">
                        <div className="text-lg">Win 3 times in a row!</div>
                        <div className="flex items-center gap-3">
                          {[1, 2, 3].map((index) => (
                            <div
                              key={index}
                              className={`w-7 h-7 border-2 rounded-full mx-1 ${
                                index <= currentStreak
                                  ? "bg-green-500 animate-pulse"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <StreakModeModal
                    isOpen={isStreakModalOpen}
                    onClose={() => setIsStreakModalOpen(false)}
                    streakMultiplier={streakMultiplier}
                  />
                </>
              ) : (
                <div className="h-36 w-60 flex flex-col self-center justify-between items-center bg-[#AE9F99] rounded-lg p-1 font-passion text-3xl ">
                  <div className="flex flex-col items-center">
                    <div className="flex gap-2 items-center h-full text-black">
                      <span>Pick Your Bet</span>
                      <img src={logos} alt="icp" className="w-7" />
                    </div>

                    <div className="flex items-center gap-2 text-white text-base font-passion">
                      <span>Balance:</span>
                      <img src={logos} alt="icp" className="w-6" />
                      {eyesMode ? (
                        <>{Number(eyesBalance?.toFixed(2)).toLocaleString()}</>
                      ) : (
                        <>{Number(icpBalance?.toFixed(2)).toLocaleString()}</>
                      )}
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
                      {eyesMode ? 10 : <>0.1</>}
                    </button>
                    <button
                      onClick={() => setBet(1)}
                      className={`w-[76px] h-[61px] text-center flex items-center justify-center transition duration-300 ease-in-out ${
                        bet === 1
                          ? "bg-[#006823]"
                          : "bg-[#E35721] hover:bg-[#d14b1d]"
                      }`}
                    >
                      {eyesMode ? 100 : <>1</>}
                    </button>
                    <button
                      onClick={() => setBet(2)}
                      className={`w-[76px] h-[61px] text-center rounded-br-lg flex items-center justify-center transition duration-300 ease-in-out ${
                        bet === 2
                          ? "bg-[#006823]"
                          : "bg-[#E35721] hover:bg-[#d14b1d]"
                      }`}
                    >
                      {eyesMode ? 500 : <>5</>}
                    </button>
                  </div>
                </div>
              ))}
            {/* time and x multiplier */}
            {!streakMode && !eyesMode && timeMultiplier > 0 && (
              <div className="flex items-center mb-9 justify-around bg-gray-800 text-white w-[231px] h-[69px] rounded-lg p-2 space-x-4 font-passion">
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

            {logedIn && !timeMultiplier && (
              <div
                className={`h-10 w-60 flex flex-col self-center justify-between items-center ${
                  !streakMode ? "bg-yellow-400" : "bg-[#AE9F99]"
                } rounded-lg p-1 font-passion text-xl transition-colors duration-300 ${
                  hideStreakbtn ? "opacity-0 invisible" : "opacity-100 visible"
                }`}
              >
                <div className="flex flex-col items-center w-full h-full">
                  <button
                    onClick={switchStreak}
                    className={`flex items-center justify-center gap-2 w-full h-full ${
                      !streakMode ? "text-black" : "text-white"
                    } hover:opacity-80 transition-opacity duration-300`}
                  >
                    {!streakMode && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {streakMode
                      ? "Switch to regular mode"
                      : "Switch to Streak Mode!"}
                  </button>
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
              <></>
            )}
            {/* Hold To Shot */}

            {/* CTA */}
            <div
              className={`flex flex-col justify-center items-center w-80 mb-5 ${
                !logedIn ? "block" : "hidden"
              }`}
            >
              <button
                onClick={() => setConnectOpen(true)}
                className="bg-[#006823] px-6 py-2 border-[#AE9F99] border-[3px] rounded-2xl w-64 h-16 font-passion text-2xl text-white hover:cursor-pointer lg:w-72 lg:h-20 lg:text-3xl"
              >
                Connect Wallet
              </button>
            </div>
            {!logedIn && lastBets && (
              <div className="bg-[#282828] bg-opacity-80 rounded-lg overflow-hidden no-scrollbar border-[1px] pb-3 z-10">
                <div className="overflow-y-auto no-scrollbar h-[210px] w-full">
                  <div className="bg-white text-black">
                    {initData != "" ? initData.hash : "n"}{" "}
                  </div>
                  <div className="grid gap-2 divide-y-[1px] ">
                    {lastBets.slice(0, 200).map((bet, id) => (
                      <div
                        key={bet[0]}
                        className={`flex items-center justify-between bg-opacity-80 pt-2 px-3 text-[10px] text-white font-passion ${[
                          Number(bet[1].houseGuess),
                        ]} ${id === newbet ? "animate-dim" : ""}`}
                      >
                        <div className="flex gap-2">
                          <span>
                            {bet[1].caller["__principal__"].slice(0, 5)}...
                            {bet[1].caller["__principal__"].slice(-5)}
                          </span>
                          <span>
                            bet {(bet[1].betAmount / 1e8).toFixed(2)} ICP,
                          </span>
                          <span>
                            threw{" "}
                            {bet[1].guess == 1
                              ? "Rock"
                              : bet[1].guess == 2
                              ? "Paper"
                              : "Scissors"}
                          </span>
                          <span> and</span>
                          <span
                            className={
                              bet[1].result === "draw"
                                ? "text-yellow-300"
                                : bet[1].result === "win"
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {" "}
                            {bet[1].result === "draw"
                              ? "draw"
                              : bet[1].result === "win"
                              ? "doubled"
                              : "rekt"}
                          </span>
                        </div>
                        <div>
                          <span>
                            {minutesFromNowToPastTimestamp(
                              Number(bet[1].time_created)
                            )}
                            m ago
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Game Result Overlay */}
      {gameState.outcome && (
        <ResultOverlay
          userChoice={gameState.userChoice}
          cpuChoice={gameState.cpuChoice}
          icpWon={icpWon.toString()}
          onClose={() =>
            setGameState({ ...gameState, outcome: "" })
          } /*winAmount={winAmount}*/
        />
      )}

      {/* Connect Wallet Modal Popup */}
      <ConnectModal />

      {/* modal pop up switching eyes or btc mode */}
      {isSwitching && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#AE9F99] p-6 rounded-lg shadow-lg flex flex-col gap-3 items-center justify-center">
            <h2 className="font-passion text-2xl text-[#E35721] mb-4 text-center">
              Switching Mode
            </h2>
            <p className="font-passion text-xl text-white mb-4">
              {!eyesMode ? "Switching to ICP mode" : "Switching to EYES mode"}
              <span className="dots">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Wallet Modal Popup */}
      <Wallet />
    </section>
  );
};

export default ArenaMobile;
