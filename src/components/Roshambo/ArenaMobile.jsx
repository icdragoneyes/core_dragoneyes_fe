import maincar from "../../assets/img/maincar.png";
import handImage from "../../assets/img/hands/hands";
import bubble from "../../assets/img/bubble.png";
import live from "../../assets/img/live.png";
import ConnectModal from "../ConnectModal";
// import Wallet from "../Wallet";
import ResultOverlay from "./ResultOverlay";
import solLogo from "../../assets/img/solana.png";
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
  telegramWebAppAtom,
  selectedChainAtom,
  //isAuthenticatedAtom,
  chainNameAtom,
  liveNotificationAtom,
  betHistoryCardAtom,
} from "../../store/Atoms";
import { useAtom, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { Principal } from "@dfinity/principal";
import StreakModeModal from "./StreakModeModal";
import { useTWAEvent } from "@tonsolutions/telemetree-react";
import { motion, AnimatePresence } from "framer-motion";
// import Wallet3 from "../Wallet3";
import Wallet3 from "../Wallet3";

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
  const [isStreakModalOpen, setIsStreakModalOpen] = useAtom(isStreakModalOpenAtom);
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
  const [telegram] = useAtom(telegramWebAppAtom);
  // const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [chainName] = useAtom(chainNameAtom);
  const [chain] = useAtom(selectedChainAtom);
  const [liveNotification, setLiveNotification] = useAtom(liveNotificationAtom);
  const [betHistoryCard] = useAtom(betHistoryCardAtom);
  // eslint-disable-next-line no-unused-vars
  const [currentBetByUser, setCurrentBetByUser] = useState({});

  // Telemetree functionality related
  const eventBuilder = useTWAEvent();

  // eventBuilder.track("Roshambo Page Visit");

  // Function to refresh user data (balance, game state, etc.)
  const refreshBalance = useCallback(async () => {
    if (!icpAgent || !walletAddress) return;
    const acc = { owner: Principal?.fromText(walletAddress), subaccount: [] };
    let balanceICP = await icpAgent.icrc1_balance_of(acc);
    console.log(balanceICP, "<<<< ba");
    setIcpBalance(Number(balanceICP) / chain.decimal);
    let beyes = await eyesAgent.icrc1_balance_of(acc);
    setEyesBalance(Number(beyes) / 1e8);
  }, [icpAgent, walletAddress, setIcpBalance, eyesAgent, setEyesBalance]);

  useEffect(() => {
    setStartCountdown(true);
    setCount(2);
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
      setIcpBalance(Number(currentGameData.ok.icpbalance) / chain.decimal);
      let betHistory = currentGameData.ok.betHistory[currentGameData.ok.betHistory.length - 1];
      setCurrentBetByUser(betHistory);
      //setLastBet(sortLastBet(lastbets_));
      setEyesBalance((prevBalance) => {
        if (prevBalance === 0 || Number(currentGameData.ok.eyesbalance) !== prevBalance) {
          return Number(currentGameData.ok.eyesbalance) / 1e8;
        }
        return prevBalance;
      });
      setTimeMultiplier(Number(currentGameData.ok.multiplierTimerEnd) / 1e6);
      setMultiplier(Number(currentGameData.ok.currentMultiplier));
      refreshBalance();
    }
  }, [icpAgent, roshamboActor, walletAddress, setIcpBalance, setTimeMultiplier, setMultiplier, setStreakReward, refreshBalance, bet, eyesMode, roshamboEyes, setEyesBalance, setCurrentStreak, setStreakMultiplier]);

  useEffect(() => {
    console.log(currentBetByUser);
  }, [currentBetByUser]);
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
      console.log("betting...");
      setIsLoading(true);
      const roshamboCanisterAddress = {
        owner: Principal.fromText(process.env.REACT_APP_ROSHAMBO_LEDGER_ID),
        subaccount: [],
      };
      const roshamboEyesCanisterAddress = {
        owner: Principal.fromText("gb6er-oqaaa-aaaam-ac4ha-cai"),
        subaccount: [],
      };
      const roshamboSOLCanisterAddress = {
        owner: Principal.fromText("qeouc-xaaaa-aaaam-adf4q-cai"),
        subaccount: [],
      };
      var betICP = chain.bets;
      var betAmount = Number((betICP[bet] * chain.decimal + chain.transferFee).toFixed(0));
      const handList = ["none", "ROCK", "PAPER", "SCISSORS"];
      let theactor = eyesMode ? roshamboEyes : roshamboActor;
      if (!eyesMode && chainName == "ICP") {
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

          const placeBetResult = await theactor.place_bet(Number(bet), Number(choice));

          if (placeBetResult.success) {
            const { userChoice, cpuChoice, outcome, eyes, icp, userData } = placeBetResult.success;
            eventBuilder.track("Player Playing", {
              betSize: betICP[bet],
              userChoice: handList[(Number(choice), outcome)],
              category: "User Engagement",
              label: "User Playing",
              mode: "Normal Mode",
              chain: "ICP",
            });

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * 2));

            setEyesWon(Number(eyes) / 1e8);
            if (Number(userData.multiplierTimerEnd) == 0) setTimeMultiplier(0);
            else setTimeMultiplier(Number(userData.multiplierTimerEnd) / 1e6);
            setMultiplier(Number(userData.currentMultiplier));

            refreshUserData();
            // refreshBalance();
          } else {
            refreshBalance();
            eventBuilder.track("User Insufficient funds", {
              chain: { chainName },
              mode: "Normal Mode",
              label: "Insufficient Balance",
            });
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
          if (bet.length === 0 || bet === undefined) {
            toast.info("Choose your bet size first");
          } else {
            console.error("Error in handleAction:", error);
            toast.error("An error occurred. Please try again.");
          }
        } finally {
          setIsLoading(false);
          setBtnDisabled(false);
        }
      } else if (!eyesMode && chainName == "SOL") {
        // betICP = [0.01, 0.1, 0.5];
        betAmount = Number((betICP[bet] * 1e9 + chain.transferFee).toFixed(0));
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
            spender: roshamboSOLCanisterAddress,
          });

          const placeBetResult = await theactor.place_bet(Number(bet), Number(choice));

          if (placeBetResult.success) {
            const { userChoice, cpuChoice, outcome, eyes, icp, userData } = placeBetResult.success;
            eventBuilder.track("Player Playing", {
              betSize: betICP[bet],
              userChoice: handList[(Number(choice), outcome)],
              category: "User Engagement",
              label: "User Playing",
              mode: "Normal Mode",
              chain: { chainName },
            });

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * 2));

            setEyesWon(Number(eyes) / chain.decimal);
            if (Number(userData.multiplierTimerEnd) == 0) setTimeMultiplier(0);
            else setTimeMultiplier(Number(userData.multiplierTimerEnd) / 1e6);
            setMultiplier(Number(userData.currentMultiplier));

            refreshBalance();
          } else {
            refreshBalance();
            eventBuilder.track("User Insufficient funds", {
              chain: { chainName },
              mode: "Normal Mode",
              label: "Insufficient Balance",
            });
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
          if (bet.length === 0 || bet === undefined) {
            toast.info("Choose your bet size first");
          } else {
            console.error("Error in handleAction:", error);
            toast.error("An error occurred. Please try again.");
          }
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

          const placeBetResult = await roshamboEyes.place_bet(Number(bet), Number(choice));
          if (placeBetResult.success) {
            const { userChoice, cpuChoice, outcome, eyes, icp } = placeBetResult.success;
            eventBuilder.track("Player Playing", {
              betSize: betICP[bet],
              userChoice: handList[(Number(choice), outcome)],
              category: "User Engagement",
              label: "User Playing",
              mode: "Normal Mode",
              chain: "EYES",
            });
            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * 2));

            setEyesWon(Number(eyes) / 1e8);

            refreshBalance();
          } else {
            refreshBalance();
            eventBuilder.track("User Insufficient funds", {
              chain: "EYES",
              mode: "Normal Mode",
              label: "Insufficient Balance",
            });
            console.log(eventBuilder);
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
          if (bet.length === 0 || bet === undefined) {
            toast.info("Choose your bet size first");
          } else {
            console.error("Error in handleAction:", error);
            toast.error("An error occurred. Please try again.");
          }
        } finally {
          setIsLoading(false);
          setBtnDisabled(false);
        }
      }
    },
    [roshamboActor, eyesAgent, roshamboEyes, bet, setEyesWon, setTimeMultiplier, setMultiplier, setGameState, eyesMode, refreshBalance, setIcpWon, icpAgent, eventBuilder]
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

          const placeBetResult = await theactor.place_bet_rush(Number(bet), Number(choice));
          if (placeBetResult.success) {
            const { userChoice, cpuChoice, outcome, eyes, icp, streak } = placeBetResult.success;
            eventBuilder.track("Player Playing", {
              betSize: betICP[bet],
              userChoice: handList[(Number(choice), outcome)],
              category: "User Engagement",
              label: "User Playing",
              mode: "Streak Mode",
              chain: "ICP",
            });
            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * streakMultiplier));
            setCurrentStreak(Number(streak));
            setEyesWon(Number(eyes) / 1e8);

            refreshBalance();
          } else {
            refreshBalance();
            eventBuilder.track("User Insufficient funds", {
              chain: "ICP",
              mode: "Streak Mode",
              label: "Insufficient Balance",
            });
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
          if (bet.length === 0 || bet === undefined) {
            toast.info("Choose your bet size first");
          } else {
            console.error("Error in handleAction:", error);
            toast.error("An error occurred. Please try again.");
          }
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

          const placeBetResult = await roshamboEyes.place_bet_rush(Number(bet), Number(choice));
          if (placeBetResult.success) {
            const { userChoice, cpuChoice, outcome, eyes, icp, streak } = placeBetResult.success;
            eventBuilder.track("Player Playing", {
              betSize: betICP[bet],
              userChoice: handList[(Number(choice), outcome)],
              category: "User Engagement",
              label: "User Playing",
              mode: "Streak Mode",
              chain: "EYES",
            });

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * streakMultiplier));
            setCurrentStreak(Number(streak));
            setEyesWon(Number(eyes) / 1e8);

            refreshBalance();
          } else {
            refreshBalance();
            eventBuilder.track("User Insufficient funds", {
              chain: "EYES",
              mode: "Streak Mode",
              label: "Insufficient Balance",
            });
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
          if (bet.length === 0 || bet === undefined) {
            toast.info("Choose your bet size first");
          } else {
            console.error("Error in handleAction:", error);
            toast.error("An error occurred. Please try again.");
          }
        } finally {
          setIsLoading(false);
          setBtnDisabled(false);
        }
      }
    },
    [roshamboActor, eyesAgent, roshamboEyes, bet, setEyesWon, setGameState, eyesMode, refreshBalance, setCurrentStreak, icpAgent, streakMultiplier, eventBuilder]
  );

  async function switchStreak() {
    eventBuilder.track("Switch Steak Button Clicked", {
      label: "Streak Mode Button", // Additional info about the button
      category: "User Engagement", // Categorize the event
    });
    if (!streakMode) {
      setIsStreakModalOpen(true);
    }
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
    onStart: (event, meta) => (setBigButton(meta.context), setHideStreakbtn(true)),
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
      setBetAmounts(chain.bets);
    } else {
      setBetAmounts([10, 100, 500]);
    }
  }, [eyesMode, refreshUserData, setTimeMultiplier, setMultiplier, isSwitching, setIsSwitching]);

  return (
    <section className="relative w-screen h-screen flex flex-col justify-between overflow-y-auto pb-32" onContextMenu={handleContextMenu}>
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/src/assets/img/bg.png')] bg-cover bg-center h-screen"></div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Content */}
      <div className="relative flex flex-col justify-center items-center pt-4">
        <div className={`grid justify-center items-center text-center px-8 ${!logedIn ? "block" : "hidden"}`}>
          <div className="flex text-[#FAAC52] font-normal font-passero text-6xl  drop-shadow-md">ROSHAMBO</div>
        </div>

        <div className="flex justify-center items-center relative h-full w-full">
          {/* live notification last user bet on logged in page */}
          {lastBets && lastBets.length > 0 && logedIn && liveNotification && (
            <AnimatePresence>
              <motion.div
                className="absolute top-5 transform -translate-x-1/2 z-20 w-2/3 max-w-md"
                style={{ transform: "translateX(-50%)" }}
                initial={{ opacity: 0, y: 50, scale: 1.1 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5 },
                }}
                exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
              >
                <motion.div
                  className="bg-[#282828] bg-opacity-80 rounded-lg border border-[#FFF4BC] p-2"
                  initial={{ boxShadow: "0 0 0 rgba(255, 244, 188, 0)" }}
                  animate={{
                    boxShadow: ["0 0 0 rgba(255, 244, 188, 0)", "0 0 15px rgba(255, 244, 188, 0.7)", "0 0 0 rgba(255, 244, 188, 0)"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: 2,
                    repeatType: "loop",
                    delay: 0.5,
                  }}
                  onAnimationComplete={() => {
                    setTimeout(() => {
                      const element = document.querySelector(".absolute.top-5");
                      if (element) {
                        element.classList.add("animate-fadeOut");
                      }
                    }, 500);
                    setLiveNotification(false);
                  }}
                >
                  <div className="text-[10px] text-white font-passion flex justify-center items-center gap-1">
                    <img src={live} alt="Live" className="w-4 h-4 mr-1" />
                    fluffy Cat bet {lastBets[0][1]?.betAmount / 1e8}, threw <span className="text-[#FFF4BC]">{["Rock", "Paper", "Scissors"][lastBets[0][1].guess - 1]}</span> and
                    <span className={`${lastBets[0][1]?.result === "draw" ? "text-yellow-500" : lastBets[0][1]?.result === "win" ? "text-green-500" : "text-red-500"}`}>
                      {lastBets[0][1]?.result === "draw" ? "draw" : lastBets[0][1]?.result === "win" ? "doubled" : "rekt"}.
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Bet History */}
          {lastBets && lastBets.length > 0 && logedIn && betHistoryCard && (
            <AnimatePresence>
              <motion.div
                className="absolute top-5 transform -translate-x-1/2 z-20 w-[64%] max-w-md"
                style={{ transform: "translateX(-50%)" }}
                initial={{ opacity: 0, y: 50, scale: 1.1 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5 },
                }}
                exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
              >
                <motion.div
                  className="bg-[#282828] bg-opacity-80 rounded-lg border border-[#FFF4BC] p-2"
                  initial={{ boxShadow: "0 0 0 rgba(255, 244, 188, 0)" }}
                  animate={{
                    boxShadow: ["0 0 0 rgba(255, 244, 188, 0)", "0 0 15px rgba(255, 244, 188, 0.7)", "0 0 0 rgba(255, 244, 188, 0)"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: 2,
                    repeatType: "loop",
                    delay: 0.5,
                  }}
                >
                  <div className="text-[10px] text-white font-passion flex flex-col justify-center items-start px-2 gap-2">
                    <div className="flex items-center justify-center w-full">
                      <img src={live} alt="Live" className="w-4 h-4 mr-1" />
                      <span className="flex-1 text-center gap-1">
                        fluffy Cat bet {Number(currentBetByUser?.betAmount) / 1e8}, threw <span className="text-[#FFF4BC]">{["Rock ", "Paper ", "Scissors "][Number(currentBetByUser.guess) - 1]}</span> and{" "}
                        <span className={currentBetByUser?.result === "draw" ? "text-yellow-500" : currentBetByUser?.result === "win" ? "text-green-500" : "text-red-500"}>
                          {currentBetByUser?.result === "draw" ? "drew " : currentBetByUser?.result === "win" ? "doubled " : "rekt "}.
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <img src={live} alt="Live" className="w-4 h-4 mr-1" />
                      <span className="flex-1 text-center gap-1">
                        White Tiger {lastBets[0][1]?.betAmount / 1e8}, threw <span className="text-[#FFF4BC]">{["Rock ", "Paper ", "Scissors "][lastBets[0][1].guess - 1]}</span> and{" "}
                        <span className={lastBets[0][1]?.result === "draw" ? "text-yellow-500" : lastBets[0][1]?.result === "win" ? "text-green-500" : "text-red-500"}>
                          {lastBets[0][1]?.result === "draw" ? "drew " : lastBets[0][1]?.result === "win" ? "doubled " : "rekt "}.
                        </span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
          {/* main character image */}
          <img src={maincar} alt="Main Character" className={`${logedIn ? "w-3/5 translate-y-16" : ""}`} />
          {/* bubble */}
          {logedIn &&
            (streakMode ? (
              <div className="absolute -translate-y-14 translate-x-28 bg-slate-50 rounded-xl p-3 max-w-[130px] text-center">
                <p className="font-passion text-[#006823] text-sm">
                  Streak mode: <br /> Win 3x <br /> = <br />
                  Prize {streakMultiplier}x!
                  <br />
                  {!isNaN(betAmounts[bet] * streakMultiplier) && (eyesMode ? `${(betAmounts[bet] * streakMultiplier).toFixed(0)} EYES` : `${(betAmounts[bet] * streakMultiplier).toFixed(0)} ICP`)}
                </p>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-6 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white border-r-[10px] border-r-transparent"></div>
              </div>
            ) : (
              <img src={bubble} alt="Bubble Chat" className="absolute -translate-y-14 translate-x-28" />
            ))}

          <div className={`absolute ${logedIn ? "-bottom-32" : "bottom-10"} flex flex-col justify-center items-center ${timeMultiplier ? "gap-5" : "gap-2"}`}>
            {/* Bet Card */}
            {logedIn &&
              (streakMode ? (
                <div className="w-52 flex flex-col self-center items-center bg-[#AE9F99] rounded-lg p-1 font-passion text-2xl">
                  <div className="flex flex-col items-center mb-1">
                    <div className="flex gap-1 items-center text-black text-lg">
                      {currentStreak === 0 ? (
                        <>
                          Pick Your Bet <img src={logos} alt="icp" className="w-5" />
                        </>
                      ) : (
                        <>Win {3 - currentStreak}x more!</>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-white text-sm">
                      <span>Balance:</span>
                      <img src={logos} alt="icp" className="w-4" />
                      <span>{(eyesMode ? Number(eyesBalance?.toFixed(2)) : Number(icpBalance?.toFixed(2))).toLocaleString()}</span>
                    </div>
                  </div>
                  {currentStreak === 0 ? (
                    <div className="flex justify-center items-center text-center gap-1 text-white">
                      {[0, 1, 2].map((index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setBet(index);
                            setStreakReward(betAmounts[index] * streakMultiplier);
                          }}
                          className={`w-[64px] h-[50px] ${index === 0 ? "rounded-bl-lg" : index === 2 ? "rounded-br-lg" : ""} flex items-center justify-center transition duration-300 ease-in-out ${
                            bet === index ? "bg-[#006823]" : "bg-[#E35721] hover:bg-[#d14b1d]"
                          }`}
                        >
                          {eyesMode ? [10, 100, 500][index] : [0.1, 1, 5][index]}
                          {eyesMode ? [10, 100, 500][index] : chain.bets[index]}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white text-sm bg-[#E35721] rounded-md p-2 w-full">
                      <div className="mb-1 text-center">Win 3 times in a row!</div>
                      <div className="flex justify-center">
                        {[1, 2, 3].map((index) => (
                          <div key={index} className={`w-5 h-5 border-2 rounded-full mx-1 ${index <= currentStreak ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-52 flex flex-col self-center items-center bg-[#AE9F99] rounded-lg p-1 font-passion text-2xl">
                  <div className="flex flex-col items-center mb-1">
                    <div className="flex gap-1 items-center text-black text-lg">
                      <span>Pick Your Bet</span>
                      <img src={chain.name == "sol" ? solLogo : logos} alt="icp" className="w-5" />
                    </div>
                    <div className="flex items-center gap-1 text-white text-sm">
                      <span>Balance:</span>
                      <img src={chain.name == "sol" ? solLogo : logos} alt="icp" className="w-4" />
                      <span>{Number((eyesMode ? eyesBalance : icpBalance)?.toFixed(2)).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center text-center gap-1 text-white">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        onClick={() => setBet(index)}
                        className={`w-[64px] h-[50px] ${index === 0 ? "rounded-bl-lg" : index === 2 ? "rounded-br-lg" : ""} flex items-center justify-center transition duration-300 ease-in-out ${
                          bet === index ? "bg-[#006823]" : "bg-[#E35721] hover:bg-[#d14b1d]"
                        }`}
                      >
                        {eyesMode ? [10, 100, 500][index] : chain.bets[index]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            {/* time and x multiplier */}
            {!streakMode && !eyesMode && timeMultiplier > 0 && (
              <div className="flex items-center justify-around bg-gray-800 text-white w-[231px] h-[69px] rounded-lg p-2 space-x-4 font-passion">
                <div className="text-3xl font-bold">00:{timeLeft}</div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[#FFF4BC]">Play Now!</span>
                  <span className="text-yellow-400 font-bold">
                    To Earn <span className="text-2xl text-red-500 animate-pulse mx-1">{multiplier}X</span> EYES!
                  </span>
                </div>
              </div>
            )}

            {/* swtich streak button */}
            {logedIn && !timeMultiplier && (
              <div
                className={`h-8 w-52 flex items-center justify-center ${!streakMode ? "bg-yellow-400 animate-pulse-outline" : "bg-[#AE9F99]"} rounded-lg font-passion text-lg transition-all duration-300 ${
                  hideStreakbtn || currentStreak !== 0 ? "opacity-0 invisible" : "opacity-100 visible"
                }`}
              >
                <button onClick={switchStreak} className={`flex items-center justify-around px-5 gap-1 w-full h-full ${!streakMode ? "text-black" : "text-white"} hover:opacity-80`}>
                  {!streakMode && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  )}
                  {streakMode ? (
                    "Switch to regular mode"
                  ) : (
                    <div className="text-sm">
                      Streak mode multiply to <span className="text-red-500">{streakMultiplier}x</span>
                    </div>
                  )}
                </button>
              </div>
            )}

            {/* loading */}
            {isLoading && <RandomizerOverlay userChoice={uchoice} />}

            {/* Action Button */}
            {logedIn && (
              <>
                <div className="flex gap-4 lg:gap-8 items-baseline">
                  {["Rock", "Paper", "Scissors"].map((item, index) => (
                    <button
                      key={item}
                      {...bind(index + 1)}
                      disabled={btnDisabled}
                      className={`text-center transition-transform duration-300 ${bigButton === index + 1 ? "scale-115 -translate-y-4" : ""} ${btnDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {bigButton === index + 1 && <div className="absolute border-gray-300 h-20 w-20 animate-spin2 rounded-full border-8 border-t-[#E35721] shadow-[0_0_15px_#E35721]" />}
                      <img src={handImage[item]} alt={item} className="w-20 lg:w-28" />
                      <span className="font-passion text-2xl text-white lg:text-3xl">{item}</span>
                    </button>
                  ))}
                </div>
                {logedIn && <div className="text-center font-passion text-[#FFF4BC] text-xl drop-shadow-md">Hold To Shoot</div>}
              </>
            )}

            {/* CTA */}
            {telegram.initData == "" && (
              <div className={`flex flex-col justify-center items-center w-80 mb-5 ${!logedIn ? "block" : "hidden"}`}>
                <button onClick={() => setConnectOpen(true)} className="bg-[#006823] px-6 py-2 border-[#AE9F99] border-[3px] rounded-2xl w-64 h-16 font-passion text-2xl text-white hover:cursor-pointer lg:w-72 lg:h-20 lg:text-3xl">
                  Connect Wallet
                </button>
              </div>
            )}

            {!logedIn && false && (
              <div className="bg-[#282828] bg-opacity-80 rounded-lg overflow-hidden no-scrollbar border-[1px] pb-3 z-10">
                <div className="bg-white text-xs text-black overflow-y-auto no-scrollbar h-[210px] w-full min-w-[200px]">
                  <div className="grid gap-2 divide-y-[1px] w-full ">{initData != "" ? "Hash " + JSON.parse(initData) : "n"} </div>
                </div>
              </div>
            )}

            {/* last bet from user before user logged in */}
            {!logedIn && lastBets && (
              <div className="bg-[#282828] bg-opacity-80 rounded-lg overflow-hidden no-scrollbar border-[1px] pb-3 z-10">
                <div className="overflow-y-auto no-scrollbar h-[210px] w-full">
                  <div className="grid gap-2 divide-y-[1px] ">
                    {lastBets.slice(0, 200).map((bet, id) => (
                      <div key={bet[0]} className={`flex items-center justify-between bg-opacity-80 pt-2 px-3 text-[10px] text-white font-passion ${[Number(bet[1].houseGuess)]} ${id === newbet ? "animate-dim" : ""}`}>
                        <div className="flex gap-2">
                          <span>
                            {bet[1].caller["__principal__"].slice(0, 5)}...
                            {bet[1].caller["__principal__"].slice(-5)}
                          </span>
                          <span>bet {(bet[1].betAmount / 1e8).toFixed(2)} ICP,</span>
                          <span>threw {bet[1].guess == 1 ? "Rock" : bet[1].guess == 2 ? "Paper" : "Scissors"}</span>
                          <span> and</span>
                          <span className={bet[1].result === "draw" ? "text-yellow-300" : bet[1].result === "win" ? "text-green-500" : "text-red-500"}>
                            {" "}
                            {bet[1].result === "draw" ? "draw" : bet[1].result === "win" ? "doubled" : "rekt"}
                          </span>
                        </div>
                        <div>
                          <span>{minutesFromNowToPastTimestamp(Number(bet[1].time_created))}m ago</span>
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
      {gameState.outcome && <ResultOverlay userChoice={gameState.userChoice} cpuChoice={gameState.cpuChoice} icpWon={icpWon.toString()} onClose={() => setGameState({ ...gameState, outcome: "" })} /*winAmount={winAmount}*/ />}

      {/* Connect Wallet Modal Popup */}
      <ConnectModal />

      {/* modal pop up switching eyes or btc mode */}
      {isSwitching && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#AE9F99] p-6 rounded-lg shadow-lg flex flex-col gap-3 items-center justify-center">
            <h2 className="font-passion text-2xl text-[#E35721] mb-4 text-center">Switching Mode</h2>
            <p className="font-passion text-xl text-white mb-4">
              {!eyesMode ? "Switching to " + { chainName } + " mode" : "Switching to EYES mode"}
              <span className="dots">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Streak Mode Modal */}
      <StreakModeModal isOpen={isStreakModalOpen} onClose={() => setIsStreakModalOpen(false)} streakMultiplier={streakMultiplier} />

      {/* Wallet Modal Popup */}
      <Wallet3 />
    </section>
  );
};

export default ArenaMobile;
