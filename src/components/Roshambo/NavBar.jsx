import logo from "../../assets/img/logo.png";
//import menu from "../../assets/img/menu.png";
import close from "../../assets/img/close.png";
import HowToPlay from "./HowToPlay";
import { useState } from "react";
import icp from "../../assets/img/icp.png";

import eyes from "../../assets/img/dragon.png";
import walletlogo from "../../assets/img/walletlogo.png";
import rockimg from "../../assets/img/hands/rock.png";
import paperimg from "../../assets/img/hands/paper.png";
import scissorsimg from "../../assets/img/hands/scissors.png";

import { Link } from "react-router-dom";
import {
  betAtom,
  eyesModeAtom,
  isLoggedInAtom,
  isModalOpenAtom,
  isModalWalletOpenAtom,
  isStreakModalOpenAtom,
  isSwitchingAtom,
  logosModeAtom,
  streakModeAtom,
  streakMultiplierAtom,
  streakRewardAtom,
  roshamboLastBetAtom,
} from "../../store/Atoms";
import { useAtom, useSetAtom } from "jotai";

const NavBar = () => {
  // const [selectedWallet, setSelectedWallet] = useAtom(selectedWalletAtom);
  const [logos, setLogos] = useAtom(logosModeAtom);
  const [eyesMode, setEyesMode] = useAtom(eyesModeAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [streakMode, setStreakMode] = useAtom(streakModeAtom);
  const setIsWalletModalOpen = useSetAtom(isModalWalletOpenAtom);
  const setConnectOpen = useSetAtom(isModalOpenAtom);
  const setStreakReward = useSetAtom(streakRewardAtom);
  const setIsStreakModalOpen = useSetAtom(isStreakModalOpenAtom);
  const [streakMultiplier] = useAtom(streakMultiplierAtom);
  const [bet] = useAtom(betAtom);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useAtom(isSwitchingAtom);
  const [lastBets] = useAtom(roshamboLastBetAtom);
  const img = [rockimg, rockimg, paperimg, scissorsimg];

  const toggleMenu = (open) => {
    setIsMenuOpen(!isMenuOpen);
    if (open === "open" && isLoggedIn) {
      setIsWalletModalOpen(true);
    }
    if (open === "open" && !isLoggedIn) {
      setConnectOpen(true);
    }
  };

  async function handleSwitchMode(mode) {
    setIsSwitching(true);
    setEyesMode(mode);
    if (mode) {
      setLogos(eyes);
    } else {
      setLogos(icp);
    }
  }

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

  return (
    <>
      <nav className="bg-[#e35721] flex justify-between items-center px-4 md:px-8 lg:px-16 h-20 shadow-md sticky top-0 z-10">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Roshambo Logo" className="h-14 md:h-16" />
        </Link>
        {/* toggle switch to streak mode small screen */}
        {isLoggedIn && (
          <div className="flex justify-center items-center pb-1 md:hidden">
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <div className="font-passion text-white">{streakMode ? "Streak" : "Normal"} mode</div>
              <div className="relative">
                <input type="checkbox" className="hidden" checked={streakMode} onChange={switchStreak} disabled={isSwitching} />
                <div className={`w-14 h-8 rounded-full shadow-inner ${streakMode ? "bg-[#5C3001]" : "bg-slate-200"}`}>
                  <div className={`absolute w-6 h-6 rounded-full shadow transition ${streakMode ? "right-1 bg-white" : "left-1 bg-[#5C3001]"} top-1 flex items-center justify-center`}>
                    {streakMode && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </label>
          </div>
        )}
        <div className="md:hidden">
          <div className="text-white" onClick={() => toggleMenu("open")}>
            {!isLoggedIn ? (
              <></>
            ) : (
              <button className="hover:bg-[#004d1a] bg-[#006823] flex justify-center items-center text-white w-12 h-12 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105">
                <img src={walletlogo} className="w-7" />
              </button>
            )}
          </div>
        </div>
        <div className={`hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:relative md:bg-transparent md:flex md:items-center`}>
          <div className="bg-[#e35721] w-64 h-full p-4 md:p-0 md:w-auto md:h-auto md:bg-transparent md:flex md:items-center fixed right-0 md:relative">
            <div className="flex justify-between items-center mb-4 md:hidden">
              <Link to="/">
                <img src={logo} alt="Roshambo Logo" className="h-10" />
              </Link>
              <img src={close} alt="Close Icon" className="h-8 cursor-pointer" onClick={() => toggleMenu()} />
            </div>
            <ul className="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-6 font-bold font-passion text-center">
              <li>
                <button className="text-white hover:text-[#e35721] hover:bg-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105" onClick={() => setIsHowToPlayOpen(true)}>
                  How To Play?
                </button>
              </li>
              <li>
                <a href="https://t.me/HouseOfXDragon" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#e35721] hover:bg-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
                  Telegrama
                </a>
              </li>
              <li>
                <button className="text-white bg-[#006823] hover:bg-[#004d1a] px-4 py-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105" onClick={() => toggleMenu("open")}>
                  {!isLoggedIn ? "Connect Wallet" : "Wallet"}
                </button>
              </li>
              <li>
                {/* toggle switch eyes/btc mode big screen */}
                {isLoggedIn && (
                  <div className="flex justify-center items-center pb-3 md:block">
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <div className={`text-sm font-passion text-white`}>{eyesMode ? "EYES" : "ICP"} mode</div>
                      <div className="relative">
                        <input type="checkbox" className="hidden" checked={eyesMode} onChange={() => handleSwitchMode(!eyesMode)} />
                        <div className={`w-14 h-8 rounded-full shadow-inner ${eyesMode ? "bg-[#006823]" : "bg-slate-200"}`}></div>
                        <div className={`absolute w-6 h-6 rounded-full shadow transition ${eyesMode ? "right-1 bg-white" : "left-1 bg-gray-200"} top-1`}>
                          <img src={logos} alt="" className="w-full h-full" />
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {isLoggedIn && (
        <div className="sticky top-20 z-10 bg-gradient-to-r from-orange-500 to-red-600 py-3 w-full flex md:px-6 p-2 items-center justify-center shadow-md">
          <div className="text-white w-[20%] md:text-2xl text-xs font-bold font-passion">LAST SHOTS</div>
          <div className="md:w-[80%] w-full flex items-center gap-2 md: overflow-hidden overflow-x-auto no-scrollbar">
            {lastBets && lastBets.length > 0 ? (
              <div className="flex">
                {lastBets.slice(0, 10).map((index) => (
                  <div key={index[0]} className="w-10 h-10 bg-white rounded-full p-1 shadow-lg transform hover:scale-110 transition-transform duration-200 mx-1">
                    <img src={img[Number(index[1].houseGuess)]} className="w-full h-full object-contain" alt={`House chose ${["", "Rock", "Paper", "Scissors"][Number(index[1].houseGuess)]}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white text-lg italic">Loading...</div>
            )}
          </div>
        </div>
      )}
      <HowToPlay isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
    </>
  );
};
export default NavBar;
