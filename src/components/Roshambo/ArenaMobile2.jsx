import handImage from "../../assets/img/hands/hands";
import live from "../../assets/img/live.png";
import ConnectModal from "../ConnectModal";
import ResultOverlay from "./ResultOverlay";
import solLogo from "../../assets/img/solana.png";
import RandomizerOverlay from "./RandomizerOverlay";
import { useLongPress } from "use-long-press";
import { useCallback, useEffect, useState, useRef } from "react";
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
  isAuthenticatedAtom,
  chainNameAtom,
  liveNotificationAtom,
  isModalWalletOpenAtom,
  userAtom,
} from "../../store/Atoms";
import { useAtom, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { Principal } from "@dfinity/principal";
import StreakModeModal from "./StreakModeModal";
import { motion, AnimatePresence } from "framer-motion";
import analytics from "../../utils/segment";
import Wallet3 from "../Wallet3";
import BetHistoryPopup from "./BetHistoryPopup";
import EyesTokenModal from "./EyesTokenModal";

const ArenaMobile2 = () => {
  const [roshamboEyes] = useAtom(roshamboEyesAtom);
  const [eyesAgent] = useAtom(eyesLedgerAtom);
  const [eyesMode] = useAtom(eyesModeAtom);
  const [logos] = useAtom(logosModeAtom);
  const setConnectOpen = useSetAtom(isModalOpenAtom);
  const [eyesWon, setEyesWon] = useAtom(eyesWonAtom);
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
  const [isWalletOpen] = useAtom(isModalWalletOpenAtom);

  const [gameState, setGameState] = useState({
    userChoice: "",
    cpuChoice: "",
    outcome: "",
  });
  const [streakMultiplier, setStreakMultiplier] = useAtom(streakMultiplierAtom);
  const [currentStreak, setCurrentStreak] = useAtom(currentStreakAtom);
  const [streakReward, setStreakReward] = useAtom(streakRewardAtom);
  const [betAmounts, setBetAmounts] = useState([]);
  const [lastBets] = useAtom(roshamboLastBetAtom);
  const [newbet] = useAtom(roshamboNewBetAtom);
  const [startCountdown, setStartCountdown] = useState(false);
  const [count, setCount] = useState(10);
  const [initData] = useAtom(telegramInitDataAtom);
  const [telegram] = useAtom(telegramWebAppAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [chainName] = useAtom(chainNameAtom);
  const [chain] = useAtom(selectedChainAtom);
  const [liveNotification, setLiveNotification] = useAtom(liveNotificationAtom);
  const [currentBetByUser, setCurrentBetByUser] = useState([]);
  const [userData, setUser] = useAtom(userAtom);
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [showEyesTokenModal, setShowEyesTokenModal] = useState(false);
  const [chosenBet, setChosenBet] = useState(1);
  const [user] = useAtom(userAtom);
  const [showStreakButton, setShowStreakButton] = useState(false);
  const timeMultiplierRef = useRef(timeMultiplier);
  const [isLoadingBar, setIsLoadingBar] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    timeMultiplierRef.current = timeMultiplier;
  }, [timeMultiplier]);

  // Tambahkan useEffect untuk mengatur animasi loading
  useEffect(() => {
    let animationFrame;
    if (isLoadingBar) {
      const startTime = Date.now();
      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / 3000, 1);
        setLoadingProgress(progress);
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      animationFrame = requestAnimationFrame(animate);
    } else {
      setLoadingProgress(0);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isLoadingBar]);

  useEffect(() => {
    const checkTimeMultiplier = () => {
      const currentTimeMultiplier = timeMultiplierRef.current;
      if (currentTimeMultiplier > 0 && !streakMode) {
        setShowStreakButton(false);
      } else {
        setShowStreakButton(true);
      }
    };

    const timer = setInterval(checkTimeMultiplier, 1000); // Check every second

    return () => clearInterval(timer);
  }, [streakMode]);

  // Function to refresh user data (balance, game state, etc.)
  const refreshBalance = useCallback(async () => {
    if (!icpAgent || !walletAddress) return;
    const acc = { owner: Principal?.fromText(walletAddress), subaccount: [] };
    let balanceICP = await icpAgent.icrc1_balance_of(acc);
    //console.log(balanceICP, "<<<< ba");
    setIcpBalance(Number(balanceICP) / chain.decimal);
    let beyes = await eyesAgent.icrc1_balance_of(acc);
    setEyesBalance(Number(beyes) / 1e8);
  }, [icpAgent, walletAddress, setIcpBalance, eyesAgent, setEyesBalance, chain.decimal]);

  useEffect(() => {
    setStartCountdown(true);
    setCount(2);
  }, [lastBets]);

  function timeElapsedSinceTimestamp(pastTimestamp) {
    const now = Date.now();
    const differenceInMillis = now - pastTimestamp;
    const differenceInMinutes = Math.floor(differenceInMillis / 60000);

    if (differenceInMinutes < 1) {
      return "Just now";
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes}m ago`;
    } else if (differenceInMinutes < 1440) {
      const hours = Math.floor(differenceInMinutes / 60);
      return `${hours}h ago`;
    } else if (differenceInMinutes < 10080) {
      const days = Math.floor(differenceInMinutes / 1440);
      return `${days}d ago`;
    } else if (differenceInMinutes < 525600) {
      const months = Math.floor(differenceInMinutes / 43200);
      return months > 0 ? `${months}mo ago` : "1mo ago";
    } else {
      const years = Math.floor(differenceInMinutes / 525600);
      return `${years}y ago`;
    }
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
      var u = userData;
      if (currentGameData.ok) u.totalBet = currentGameData.ok.betHistory.length;
      setUser(u);
      //console.log(u, "<<<<<<<<< refhu");
      setStreakMultiplier(Number(streakDatas.streakMultiplier));
      setCurrentStreak(Number(streakDatas.currentStreak));
      let amountlist = eyesMode ? [10, 100, 500] : [0.1, 1, 5];
      setStreakReward(Number(streakDatas.streakMultiplier) * amountlist[bet]);
      setIcpBalance(Number(currentGameData.ok.icpbalance) / chain.decimal);
      let betHistory = currentGameData.ok.betHistory;
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
    chain.decimal,
    setUser,
    userData,
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
      //var choice = chosenBet;

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
      if (betAmount > icpBalance * chain.decimal) {
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
        return;
      }
      setIsLoading(true);
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
            analytics.track("Player Playing", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.first_name,
              game_name: user?.userName,
              bet_size: betICP[bet],
              user_choice: handList[Number(choice)],
              cpu_choice: handList[Number(cpuChoice)],
              outcome: outcome,
              chain_name: chain.name,
              category: "User Engagement",
              label: "User Playing",
              mode: "Normal Mode",
            });

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * 2));

            setEyesWon(Number(eyes) / 1e8);
            if (Number(userData.multiplierTimerEnd) == 0) setTimeMultiplier(0);
            else setTimeMultiplier(Number(userData.multiplierTimerEnd) / 1e6);
            setMultiplier(Number(userData.currentMultiplier));

            setShowResultOverlay(true);

            refreshUserData();
            // refreshBalance();
          } else {
            refreshUserData();
            // refreshBalance();
            analytics.track("User Insufficient funds", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.first_name,
              game_name: user?.userName,
              chain_name: chain.name,
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
            analytics.track("Player Playing", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.frist_name,
              game_name: user?.userName,
              betSize: betICP[bet],
              userChoice: handList[Number(choice)],
              cpuChoice: handList[Number(cpuChoice)],
              outcome: outcome,
              chain_name: chain.name,
              category: "User Engagement",
              label: "User Playing",
              mode: "Normal Mode",
            });

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * 2));

            setEyesWon(Number(eyes) / 1e8);
            if (Number(userData.multiplierTimerEnd) == 0) setTimeMultiplier(0);
            else setTimeMultiplier(Number(userData.multiplierTimerEnd) / 1e6);
            setMultiplier(Number(userData.currentMultiplier));

            setShowResultOverlay(true);
            refreshUserData();
            // refreshBalance();
          } else {
            refreshUserData();
            // refreshBalance();
            analytics.track("User Insufficient funds", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.first_name,
              game_name: user?.userName,
              chain_name: chain.name,
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
            analytics.track("Player Playing", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.first_name,
              game_name: user?.userName,
              bet_size: betICP[bet],
              user_choice: handList[Number(choice)],
              cpu_choice: handList[Number(cpuChoice)],
              outcome: outcome,
              chain_name: "EYES",
              category: "User Engagement",
              label: "User Playing",
              mode: "Normal Mode",
            });

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * 2));

            setEyesWon(Number(eyes) / 1e8);
            setShowResultOverlay(true);

            // refreshBalance();
            refreshUserData();
          } else {
            refreshUserData();
            // refreshBalance();
            analytics.track("User Insufficient funds", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.first_name,
              game_name: user?.userName,
              chain_name: "EYES",
              mode: "Normal Mode",
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
    [roshamboActor, eyesAgent, roshamboEyes, bet, setEyesWon, setTimeMultiplier, setMultiplier, setGameState, eyesMode, setIcpWon, icpAgent, chain.bets, chain.decimal, chain.transferFee, chainName, refreshUserData, chain.name, icpBalance]
  );

  const handleStreakAction = useCallback(
    async (choice) => {
      // var choice = chosenBet;

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
      if (betAmount > icpBalance * chain.decimal) {
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
        return;
      }
      setIsLoading(true);
      let theactor = eyesMode ? roshamboEyes : roshamboActor;
      if (!eyesMode && chain.name.toUpperCase() == "ICP") {
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
            analytics.track("Player Playing", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.frist_name,
              game_name: user?.userName,
              betSize: betICP[bet],
              userChoice: handList[Number(choice)],
              cpuChoice: handList[Number(cpuChoice)],
              outcome: outcome,
              chain_name: chain.name,
              category: "User Engagement",
              label: "User Playing",
              mode: "Streak Mode",
            });

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * streakMultiplier));
            setCurrentStreak(Number(streak));
            setEyesWon(Number(eyes) / 1e8);

            setShowResultOverlay(true);
            refreshUserData();
            // refreshBalance();
          } else {
            refreshUserData();
            // refreshBalance();
            analytics.track("User Insufficient funds", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.first_name,
              game_name: user?.userName,
              chain_name: chain.name,
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
      } else if (!eyesMode && chain.name.toUpperCase() == "SOL") {
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

          const placeBetResult = await theactor.place_bet_rush(Number(bet), Number(choice));
          if (placeBetResult.success) {
            const { userChoice, cpuChoice, outcome, eyes, icp, streak } = placeBetResult.success;
            analytics.track("Player Playing", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.frist_name,
              game_name: user?.userName,
              betSize: betICP[bet],
              userChoice: handList[Number(choice)],
              cpuChoice: handList[Number(cpuChoice)],
              outcome: outcome,
              chain_name: chain.name,
              category: "User Engagement",
              label: "User Playing",
              mode: "Streak Mode",
            });

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * streakMultiplier));
            setCurrentStreak(Number(streak));
            setEyesWon(Number(eyes) / 1e8);

            setShowResultOverlay(true);
            refreshUserData();
            // refreshBalance();
          } else {
            refreshUserData();
            // refreshBalance();
            analytics.track("User Insufficient funds", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.first_name,
              game_name: user?.userName,
              chain_name: chain.name,
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
            analytics.track("Player Playing", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.frist_name,
              game_name: user?.userName,
              betSize: betICP[bet],
              userChoice: handList[Number(choice)],
              cpuChoice: handList[Number(cpuChoice)],
              outcome: outcome,
              chain_name: "EYES",
              category: "User Engagement",
              label: "User Playing",
              mode: "Streak Mode",
            });

            setGameState({ userChoice, cpuChoice, outcome });
            if (Number(icp) > 0) setIcpWon(Number(betICP[bet] * streakMultiplier));
            setCurrentStreak(Number(streak));
            setEyesWon(Number(eyes) / 1e8);

            setShowResultOverlay(true);
            // refreshBalance();
            refreshUserData();
          } else {
            refreshUserData();
            // refreshBalance();
            analytics.track("User Insufficient funds", {
              user_id: telegram?.initDataUnsafe?.user?.id,
              name: telegram?.initDataUnsafe?.user?.first_name,
              game_name: user?.userName,
              chain_name: "EYES",
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
    [roshamboActor, eyesAgent, roshamboEyes, bet, setEyesWon, setGameState, eyesMode, setCurrentStreak, icpAgent, streakMultiplier, refreshUserData, chain.name, chain.bets, chain.decimal, chain.transferFee, icpBalance]
  );

  const handleResultOverlayClose = () => {
    setShowResultOverlay(false);
    setShowEyesTokenModal(true);
  };

  const handleEyesTokenModalClose = () => {
    setShowEyesTokenModal(false);
    // Any additional logic after closing EyesTokenModal
  };

  async function switchStreak() {
    if (streakMode) {
      analytics.track("Switch Normal Button Clicked", {
        user_id: telegram?.initDataUnsafe?.user?.id,
        name: telegram?.initDataUnsafe?.user?.first_name,
        game_name: user?.userName,
        label: "Normal Mode Button", // Additional info about the button
        category: "User Engagement", // Categorize the event
      });
    }
    if (!streakMode) {
      setIsStreakModalOpen(true);
      analytics.track("Switch Streak Button Clicked", {
        user_id: telegram?.initDataUnsafe?.user?.id,
        name: telegram?.initDataUnsafe?.user?.first_name,
        game_name: user?.userName,
        label: "Streak Mode Button", // Additional info about the button
        category: "User Engagement", // Categorize the event
      });
    }
    setStreakMode(!streakMode);
    let amountlist = [];
    if (!eyesMode) {
      amountlist = chain.bets;
    } else {
      amountlist = [10, 100, 500];
    }
    setStreakReward(streakMultiplier * amountlist[bet]);
  }

  // Callback for long press action
  const longPressCallback = useCallback(
    (event, meta) => {
      event.preventDefault();
      if (chosenBet) {
        //
      }
      if (!streakMode) {
        handleAction(meta.context);
      } else {
        handleStreakAction(meta.context);
      }
      setBigButton(null);
      setBtnDisabled(true);
      setIsLoadingBar(false);
    },
    [handleAction, handleStreakAction, streakMode, chosenBet]
  );

  // Configuration for long press hook
  const longPressConfig = {
    onStart: (event, meta) => (setBigButton(meta.context), setChosenBet(meta.context), setIsLoadingBar(true)),
    onFinish: () => {
      setIsLoadingBar(false);
    },
    onCancel: () => (setBigButton(null), setIsLoadingBar(false)),
    threshold: 3000, // 3 seconds
    captureEvent: true,
    cancelOnMovement: false,
    cancelOutsideElement: true,
  };

  // Hook for handling long press
  const bind = useLongPress(longPressCallback, longPressConfig);

  // Effect to add and remove context menu event listener
  useEffect(() => {
    refreshUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshUserData]);

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
    //console.log(betAmounts, "<<<<<<<<be");
    //console.log(,"<<<<<<<<be")
  }, [eyesMode, refreshUserData, setTimeMultiplier, setMultiplier, isSwitching, setIsSwitching, chain.bets, chain.name]);

  const timeRef = useRef(null);

  const handleTouchStart = (event) => {
    // Set a timer to detect a long press (e.g., 500ms)
    timeRef.current = setTimeout(() => {
      // Long press detected, prevent default behavior
      event.preventDefault();
      console.log("Long press detected, default action prevented.");
    }, 500); // 500ms threshold for long press
  };

  // Function to handle touch end (when the user releases the touch)
  const handleTouchEnd = () => {
    // Clear the timeout if the user releases the touch before 500ms
    clearTimeout(timeRef.current);
  };
  // Handle context menu click (right-click)
  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the right-click context menu
    console.log("Right-click is disabled on this element");
  };
  // Use effect to add the event listener for right-click globally
  useEffect(() => {
    /* */
  }, [isWalletOpen]); // Emptya

  return (
    <section
      className="relative w-screen h-screen flex flex-col overflow-hidden select-none bg-[#131313ED]"
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      {/* time and x multiplier & streak mode button */}
      {!streakMode && !eyesMode ? (
        timeMultiplier > 0 ? (
          <motion.div className="absolute top-0 left-0 right-0" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <div className="flex justify-center items-center pt-3">
              <div className="flex items-center justify-around bg-[#221C15] border border-[#D57500] text-white w-[231px] h-[69px] rounded-lg p-2 space-x-4 font-passion">
                <div className="text-3xl font-bold">00:{timeLeft}</div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[#FFF4BC]">Play Now!</span>
                  <span className="text-yellow-400 font-bold">
                    To Earn <span className="text-2xl text-red-500 animate-pulse mx-1">{multiplier}X</span> EYES!
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : logedIn && showStreakButton ? (
          <motion.div className="absolute top-0 left-0 right-0" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <div className="flex justify-center items-center pt-8">
              <button onClick={switchStreak} className="bg-[#DFAE00] animate-pulse-outline text-[#282828] font-semibold text-base py-3 px-10 rounded-full hover:bg-[#C09000] transition duration-300">
                Win 20x on streak mode {">>>"}
              </button>
            </div>
          </motion.div>
        ) : null
      ) : null}

      {/* Live notification */}
      <div className="absolute left-0 right-0 flex justify-center items-center" style={{ top: "calc(4rem + 30px)" }}>
        {lastBets && lastBets.length > 0 && logedIn && liveNotification && (
          <AnimatePresence>
            <motion.div
              className="w-2/3 max-w-md"
              initial={{ opacity: 0, y: -20, scale: 1.1 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.5 },
              }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
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
                    setLiveNotification(false);
                  }, 500);
                }}
              >
                <div className="text-[10px] text-white font-passion flex justify-center items-center gap-1">
                  <img src={live} alt="Live" className="w-4 h-4 mr-1" />
                  {isAuthenticated && lastBets[0][1]?.username ? lastBets[0][1].username : `${lastBets[0][1]?.caller?.__principal__?.slice(0, 4)}...${lastBets[0][1]?.caller?.__principal__?.slice(-4)}`} bet {lastBets[0][1]?.betAmount / 1e8},
                  threw <span className="text-[#FFF4BC]">{["Rock", "Paper", "Scissors"][lastBets[0][1].guess - 1]}</span> and
                  <span className={`${lastBets[0][1]?.result === "draw" ? "text-yellow-500" : lastBets[0][1]?.result === "win" ? "text-green-500" : "text-red-500"}`}>
                    {lastBets[0][1]?.result === "draw" ? "draw" : lastBets[0][1]?.result === "win" ? "doubled" : "rekt"}.
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Bet History */}
      <BetHistoryPopup currentBetByUser={currentBetByUser} />

      {/* Content */}
      <div className={`flex flex-col justify-center min-h-screen ${logedIn ? "pt-36" : "pt-32"}`}>
        <div className={`grid justify-center items-center text-center px-8 ${!logedIn ? "block mb-2" : "hidden"}`}>
          <div className="flex text-[#FAAC52] font-normal font-passero text-6xl  drop-shadow-md">ROSHAMBO</div>
        </div>

        <div className={`flex-grow flex flex-col ${logedIn ? "bg-[#2F281FDE] border-t-4 border-[#E8A70096]" : ""} rounded-t-2xl`}>
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onContextMenu={handleContextMenu} className={`flex flex-col justify-between items-center ${timeMultiplier ? "gap-5" : "gap-2"} w-full p-4`}>
            {/* Bet Card */}
            {logedIn &&
              (streakMode ? (
                <div className="w-52 flex flex-col self-center items-center bg-[#AE9F99] rounded-lg p-1 font-passion text-2xl">
                  <div className="flex flex-col items-center mb-1">
                    <div className="flex gap-1 items-center text-black text-lg">
                      {currentStreak === 0 ? (
                        <>
                          Pick Your Bet <img src={chain.name == "sol" ? solLogo : logos} alt="icp" className="w-5" />
                        </>
                      ) : (
                        <>Win {3 - currentStreak}x more!</>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-white text-sm">
                      <span>Balance:</span>

                      <span>
                        {(eyesMode ? Number(eyesBalance?.toFixed(2)) : Number(icpBalance?.toFixed(2))).toLocaleString()} {chain.name.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {currentStreak === 0 ? (
                    <div className="flex justify-center items-center text-center gap-1 text-white">
                      {[0, 1, 2].map((index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (streakReward) {
                              //
                            }
                            setBet(index);

                            setStreakReward(betAmounts[index] * streakMultiplier);
                          }}
                          className={`w-[64px] h-[50px] ${index === 0 ? "rounded-bl-lg" : index === 2 ? "rounded-br-lg" : ""} flex items-center justify-center transition duration-300 ease-in-out ${
                            bet === index ? "bg-[#006823]" : "bg-[#E35721] hover:bg-[#d14b1d]"
                          }`}
                        >
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
                <div className="flex flex-col self-center items-center rounded-lg font-passion text-2xl pt-5">
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1 items-center text-white text-lg">
                      <span>Choose your bet size!</span>
                      <img src={chain.name == "sol" ? solLogo : logos} alt="icp" className="w-5" />
                    </div>
                  </div>
                  <div className="flex justify-center items-center text-center gap-4 text-white mt-5 mb-4">
                    {[0, 1, 2].map((index) => {
                      const betAmount = eyesMode ? [10, 100, 500][index] : chain.bets[index];
                      const isDisabled = (eyesMode ? eyesBalance : icpBalance) < betAmount;

                      return (
                        <button
                          key={index}
                          onClick={() => !isDisabled && setBet(index)}
                          disabled={isDisabled}
                          className={`w-20 h-[40px] rounded-full flex items-center justify-center transition duration-300 ease-in-out 
                            ${
                              bet === index && !isDisabled
                                ? "bg-[#D57500] text-white shadow-[0_1px_3px_#FFDB9236]"
                                : isDisabled
                                ? "bg-[#2F281F] text-[#42372A] border border-[#42372A] cursor-not-allowed"
                                : "bg-[#2F281F] text-white border border-[#D57500]"
                            }`}
                          style={
                            bet === index && !isDisabled
                              ? {
                                  filter: "drop-shadow(0 1px 10.1px #FFDB9236)",
                                }
                              : {}
                          }
                        >
                          <span className={`font-passion text-lg ${isDisabled ? "text-[#42372A]" : ""}`}>{betAmount}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-1 text-[#D9CCB8] text-sm">
                    <span>My balance:</span>

                    <span>
                      {Number((eyesMode ? eyesBalance : icpBalance)?.toFixed(2)).toLocaleString()} {chain.name.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}

            {/* loading */}
            {isLoading && <RandomizerOverlay userChoice={uchoice} />}

            {/* Action Button Card */}
            {logedIn && (
              <div className="relative bg-[#221C15] p-6 rounded-lg flex flex-col justify-center items-center font-passion">
                {/* Overlay jika bet belum dipilih */}
                {bet.length === 0 && (
                  <div className="absolute inset-0 bg-[#2E281FF2] rounded-lg flex items-center justify-center z-10">
                    <p className="text-white text-xl">Choose your bet size first!</p>
                  </div>
                )}

                <div className={`${bet.length === 0 ? "opacity-50" : ""} flex flex-col justify-center items-center`}>
                  <p className="font-normal text-sm text-white mb-2">
                    Win <span className="text-orange-500">{bet.length === 0 ? "2x" : eyesMode ? ((bet === 0 ? 10 : bet === 1 ? 100 : 500) * 2).toString() : (chain.bets[bet] * 2).toString().replace(/\.?0+$/, "")}</span>{" "}
                    {chain.name.toUpperCase()} by shooting your bet!
                  </p>
                  <p className="font-normal text-xl text-white mb-4">Hold Rock, Paper or Scissors to shoot</p>

                  {/* New Loading Bar - only visible when isLoadingBar is true */}
                  <div className={`w-full h-2 bg-[#D9D9D9] rounded-full mb-5 overflow-hidden ${isLoadingBar ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
                    <motion.div
                      className="h-full bg-[#D57500]"
                      style={{
                        width: `${loadingProgress * 100}%`,
                        boxShadow: "0 0 10px #D57500",
                      }}
                    />
                  </div>

                  <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onContextMenu={handleContextMenu}
                    className="flex gap-4 lg:gap-8 items-baseline"
                    style={{
                      WebkitTouchCallout: "none",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                    }}
                  >
                    {["Rock", "Paper", "Scissors"].map((item, index) => (
                      <button
                        key={item}
                        {...bind(index + 1)}
                        disabled={btnDisabled || bet === undefined}
                        className={`
              text-center transition-all duration-300
              ${bigButton === index + 1 ? "scale-115 -translate-y-4" : ""}
              ${btnDisabled || bet === undefined ? "opacity-50 cursor-not-allowed" : ""}
              rounded-lg
            `}
                      >
                        <div
                          className={`
                relative inline-block
                ${bigButton === index + 1 ? "border-4 border-[#D57500]" : "border-4 border-transparent"}
                rounded-full
              `}
                          style={{
                            boxShadow: bigButton === index + 1 ? "0 0 15px #D57500" : "none",
                          }}
                        >
                          <img src={handImage[item]} alt={item} className="w-20" />
                        </div>
                        <span className="font-passion text-base text-white block">{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            {telegram.initData == "" && (
              <div className={`flex flex-col justify-center items-center w-80 mb-5 ${!logedIn ? "block" : "hidden"}`}>
                <button onClick={() => setConnectOpen(true)} className="bg-[#006823] px-6 py-2 border-[#AE9F99] border-[3px] rounded-2xl w-64 h-16 font-passion text-2xl text-white hover:cursor-pointer lg:w-72 lg:h-20 lg:text-3xl">
                  Connect Wallet
                </button>
              </div>
            )}

            {/* Spacer untuk mendorong konten ke bawah */}
            <div className="flex-grow"></div>

            {!logedIn && false && (
              <div className="bg-[#282828] bg-opacity-80 rounded-lg overflow-hidden no-scrollbar border-[1px] pb-3 z-10">
                <div className="bg-white text-xs text-black overflow-y-auto no-scrollbar h-[210px] w-full min-w-[200px]">
                  <div className="grid gap-2 divide-y-[1px] w-full ">{initData != "" ? "Hash " + JSON.parse(initData) : "n"} </div>
                </div>
              </div>
            )}

            {/* lastbets history before user logged in section */}
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
                          <span>{timeElapsedSinceTimestamp(Number(bet[1].time_created))}</span>
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
      {showResultOverlay && (
        <ResultOverlay
          userChoice={gameState.userChoice}
          cpuChoice={gameState.cpuChoice}
          icpWon={icpWon.toString()}
          onClose={() => {
            setGameState({ ...gameState, outcome: "" }), handleResultOverlayClose();
          }} /*winAmount={winAmount}*/
        />
      )}

      {/* Eyes Token Modal */}
      <AnimatePresence>{showEyesTokenModal && Number(eyesWon) > 0 && <EyesTokenModal isOpen={showEyesTokenModal} onClose={handleEyesTokenModalClose} eyesWon={eyesWon} />}</AnimatePresence>

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

export default ArenaMobile2;
