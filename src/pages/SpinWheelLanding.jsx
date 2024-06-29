import { useState, useEffect, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { userDataAtom, walletAddressAtom, icpAgentAtom, loginInstanceAtom, spinActorAtom, isModalHowToPlayOpenAtom, spinGameDataAtom, isLoggedInAtom, icpBalanceAtom } from "../store/Atoms";
import PlayerList from "../components/SpinWheel/PlayerList";
import SpinWheel from "../components/SpinWheel/SpinWheel";
import RoundInfo from "../components/SpinWheel/RoundInfo";
import MobileRoundInfo from "../components/SpinWheel/MobileRoundInfo";
import DragonBackground from "../assets/spin_wheel/dragon.webp";
import ModalHowToPlay from "../components/SpinWheel/ModalHowToPlay";
import { actorCreationSpin } from "../service/spincanister";
import { Principal } from "@dfinity/principal";
import useInitializeOpenlogin from "../hooks/useInitializeOpenLogin";
import ConnectModal from "../components/ConnectModal";
import Navbar from "../components/Navbar";

const colors = [
  "#f44336",
  "#4caf50",
  "#2196f3",
  "#ff9800",
  "#9c27b0",
  "#00bcd4",
  "#e91e63",
  "#8bc34a",
  "#3f51b5",
  "#ffc107",
  "#673ab7",
  "#cddc39",
  "#9e9e9e",
  "#ff5722",
  "#03a9f4",
  "#ffeb3b",
  "#607d8b",
  "#ff4081",
  "#4caf50",
  "#3f51b5",
  "#00bcd4",
  "#e91e63",
  "#f44336",
  "#ffc107",
  "#9e9e9e",
  "#673ab7",
  "#cddc39",
  "#03a9f4",
  "#8bc34a",
  "#ff9800",
  "#2196f3",
  "#ff5722",
  "#9c27b0",
  "#607d8b",
  "#ffeb3b",
  "#ff4081",
  "#4caf50",
  "#f44336",
  "#00bcd4",
  "#e91e63",
  "#ffc107",
  "#9c27b0",
  "#673ab7",
  "#03a9f4",
  "#9e9e9e",
  "#ff5722",
  "#cddc39",
  "#8bc34a",
  "#2196f3",
  "#607d8b",
  "#ffeb3b",
  "#ff4081",
  "#4caf50",
  "#f44336",
  "#00bcd4",
  "#e91e63",
  "#ffc107",
  "#9c27b0",
  "#673ab7",
  "#03a9f4",
  "#9e9e9e",
  "#ff5722",
  "#cddc39",
  "#8bc34a",
  "#2196f3",
  "#607d8b",
  "#ffeb3b",
  "#ff4081",
  "#4caf50",
  "#f44336",
  "#00bcd4",
  "#e91e63",
  "#ffc107",
  "#9c27b0",
  "#673ab7",
  "#03a9f4",
  "#9e9e9e",
  "#ff5722",
  "#cddc39",
  "#8bc34a",
  "#2196f3",
  "#607d8b",
  "#ffeb3b",
  "#ff4081",
  "#4caf50",
  "#f44336",
  "#00bcd4",
  "#e91e63",
  "#ffc107",
  "#9c27b0",
  "#673ab7",
  "#03a9f4",
  "#9e9e9e",
  "#ff5722",
  "#cddc39",
  "#8bc34a",
  "#2196f3",
  "#607d8b",
  "#ffeb3b",
  "#ff4081",
];

function calculateWinChance(totalBet, playerBet) {
  const winChance = (playerBet / totalBet) * 100;
  if (isNaN(winChance)) {
    return "-";
  }
  return `${winChance.toFixed(2)}%`;
}

function stringToNumber(inputStr) {
  /// Calculate a hash value from the input string
  let hash = 0;
  for (let i = 0; i < inputStr.length; i++) {
    hash = (hash << 5) - hash + inputStr.charCodeAt(i);
  }
  /// Convert hash to a positive number and limit it to range 1 to 18
  let number = (Math.abs(hash) % 18) + 1;
  return number;
}

const SpinWheelLanding = () => {
  const generalPrivKey = "0bc9866cbc181a4f5291476f7be00ca4f11cae6787e10ed9dc1d40db7943f643";
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [spinGameData, setSpinGameData] = useAtom(spinGameDataAtom);
  const [userData, setUserData] = useAtom(userDataAtom);
  const [spinActor] = useAtom(spinActorAtom);
  const [walletAddress] = useAtom(walletAddressAtom);
  const [icpAgent] = useAtom(icpAgentAtom);
  const [loginInstance] = useAtom(loginInstanceAtom);
  const [players, setPlayers] = useState([]);
  const [spinTime, setSpinTime] = useState(0);
  const [isModalHowToPlayVisible, setModalHowToPlayVisible] = useAtom(isModalHowToPlayOpenAtom);
  const setICPBalance = useSetAtom(icpBalanceAtom);

  const playerControllerRef = useRef(null);
  const guestControllerRef = useRef(null);
  const intervalMemberRef = useRef(null);

  useInitializeOpenlogin();

  const closeModalHowToPlay = () => {
    setModalHowToPlayVisible(false);
  };

  const getGameById = async () => {
    const actor = actorCreationSpin(generalPrivKey);
    let game_ = await actor.getGame(Number(spinGameData.id));

    if (game_.ok) {
      const isSpinning = game_.ok.game.is_spinning;
      const winner = game_.ok.game.winner;
      console.log(isSpinning, "is spinning", winner, "<<< winner");
      console.log(game_.ok.game, "data");

      if (isSpinning && winner === "") {
        getGameById();
        return;
      }

      if (isSpinning && winner !== "") {
        setSpinGameData(game_.ok.game);
      }

      setTimeout(() => {
        reloadData();
      }, 18000); /// wait 3+15 seconds to new round
    }
  };
  const abortGetGuestGame = () => {
    if (guestControllerRef.current) {
      guestControllerRef.current.abort(); /// Abort the getGuestGame call if it's running
    }
  };

  const abortGetPlayerGame = () => {
    if (playerControllerRef.current) {
      playerControllerRef.current.abort(); /// Abort the getPlayerGame call if it's running
    }
  };

  const getPlayerGame = async (signal) => {
    abortGetGuestGame();
    try {
      let game_ = await spinActor.getCurrentGame();
      console.log("Player game:", game_);
      if (game_.ok) {
        if (game_.ok.game.is_spinning && spinGameData) {
          clearInterval(intervalMemberRef.current);
          abortGetPlayerGame();
        } else {
          setSpinGameData(game_.ok.game);
          setUserData(game_.ok.userData);
        }
      }

      var acc = {
        owner: Principal.fromText(walletAddress),
        subaccount: [],
      };
      var balanceICP = await icpAgent.icrc1_balance_of(acc);
      setICPBalance(Number(balanceICP));

      if (!signal.aborted) {
        getPlayerGame(signal); /// Recursively call the function
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching player game:", error);
      }
    }
  };

  const getGuestGame = async (signal) => {
    abortGetPlayerGame();
    try {
      const actor = actorCreationSpin(generalPrivKey);
      let game_ = await actor.getCurrentGame();
      console.log("Guest game:", game_);
      if (game_.ok) {
        if (game_.ok.game.is_spinning && spinGameData) {
          clearInterval(intervalMemberRef.current);
          abortGetPlayerGame();
        } else {
          setSpinGameData(game_.ok.game);
          setUserData(game_.ok.userData);
        }
      }

      if (!signal.aborted) {
        getGuestGame(signal); /// Recursively call the function
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching guest game:", error);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reloadData = async () => {
    abortGetPlayerGame();
    abortGetGuestGame();
    if (loginInstance) {
      if (userData && isLoggedIn) {
        abortGetGuestGame();
        playerControllerRef.current = new AbortController();
        getPlayerGame(playerControllerRef.current.signal);
      } else {
        abortGetPlayerGame();
        guestControllerRef.current = new AbortController();
        getGuestGame(guestControllerRef.current.signal);
      }
    }
  };

  useEffect(() => {
    reloadData();

    return () => {
      abortGetPlayerGame();
      abortGetGuestGame();
    };
  }, [isLoggedIn, reloadData, walletAddress]);

  const roundEnd = () => {
    abortGetPlayerGame();
    abortGetGuestGame();
    getGameById();
  };

  useEffect(() => {
    if (spinGameData) {
      const newPlayers = [];

      for (let i = 0; i < spinGameData.totalBetsArray.length; i++) {
        let displayName = spinGameData.totalBetsArray[i][0];
        if (walletAddress === displayName) {
          displayName = "You";
        }
        const playerWallet = spinGameData.totalBetsArray[i][0];
        const weaponClass = stringToNumber(playerWallet);
        const weaponPath = `weapon_${weaponClass}_${1}.png`; ///TODO BY BASE EYES

        newPlayers.push({
          id: i,
          name: displayName,
          walletAddress: playerWallet,
          points: Number(spinGameData.totalBetsArray[i][1]) / 100000000,
          winChance: calculateWinChance(Number(spinGameData.totalReward), Number(spinGameData.totalBetsArray[i][1])),
          bg: colors[i],
          weaponPath: weaponPath,
        });
      }

      setPlayers(newPlayers);
      setSpinTime(spinGameData.spin_time);
    } else {
      setSpinTime(0);
    }
  }, [spinGameData, walletAddress]);

  return (
    <>
      <Navbar />
      <div className="bg-background-land bg-cover xl:h-screen relative">
        <div className="flex h-full xl:h-[860px] mx-auto max-w-7xl flex flex-col justify-center items-start gap-0 xl:gap-12 xl:flex-row">
          <ModalHowToPlay isVisible={isModalHowToPlayVisible} onClose={closeModalHowToPlay} />
          <ConnectModal />
          <PlayerList players={players} gameData={spinGameData || {}} roundEnd={roundEnd} spinTime={spinTime} />
          <SpinWheel players={players} gameData={spinGameData} spinTime={spinTime} roundEnd={roundEnd} />
          <RoundInfo players={players} walletAddress={walletAddress} spinGameData={spinGameData} winChance={calculateWinChance(Number(spinGameData.totalReward), Number(spinGameData.currentGameBet))} />
          <MobileRoundInfo players={players} walletAddress={walletAddress} spinGameData={spinGameData} winChance={calculateWinChance(Number(spinGameData.totalReward), Number(spinGameData.currentGameBet))} />
        </div>
        <img src={DragonBackground} className="z-0 rounded-lg w-full absolute bottom-0 right-0 hidden lg:block lg:w-4/12 2xl:w-2/6" alt="dragon-bg" />
      </div>
    </>
  );
};

export default SpinWheelLanding;
