import logo from "../../assets/img/logo.png";
//import menu from "../../assets/img/menu.png";
import close from "../../assets/img/close.png";
import HowToPlay from "./HowToPlay";
import { useEffect, useState } from "react";
import icp from "../../assets/img/icp.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import eyes from "../../assets/img/dragon.png";
import walletlogo from "../../assets/img/walletlogo.png";

import useWebSocket from "react-use-websocket";

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
  roshamboNewBetAtom,
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
  const [lastBets, setLastBet] = useAtom(roshamboLastBetAtom);
  const [count, setCount] = useState(10);
  const [startCountdown, setStartCountdown] = useState(false);
  const [newbet, setNewbet] = useAtom(roshamboNewBetAtom);
  const [percent, setPercent] = useState([0, 0, 0]);
  //const img = [rockimg, rockimg, paperimg, scissorsimg];

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

  useWebSocket("wss://api.dragoneyes.xyz:7878/roshambo", {
    onMessage: async (event) => {
      const eventData = JSON.parse(event.data);
      let sorted = eventData.icpLastBets.sort((a, b) => {
        const numA = Number(a[0]);
        const numB = Number(b[0]);

        // Handle cases where the conversion to number fails (e.g., non-numeric strings)
        if (isNaN(numA) && isNaN(numB)) return 0; // Both are non-numeric
        if (isNaN(numA)) return 1; // Treat non-numeric strings as smaller
        if (isNaN(numB)) return -1;

        return numB - numA; // Default descending sort
      });
      // console.log(eventData, "<<<< ev");
      setLastBet(sorted);
      setStartCountdown(true);
      setCount(2);
      setPercent([eventData.rock, eventData.paper, eventData.scissors]);
      setNewbet(Number(eventData.newbets));
    },
    shouldReconnect: () => true,
  });

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
              <div className="font-passion text-white">
                {streakMode ? "Streak" : "Normal"} mode
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={streakMode}
                  onChange={switchStreak}
                  disabled={isSwitching}
                />
                <div
                  className={`w-14 h-8 rounded-full shadow-inner ${
                    streakMode ? "bg-[#5C3001]" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`absolute w-6 h-6 rounded-full shadow transition ${
                      streakMode ? "right-1 bg-white" : "left-1 bg-[#5C3001]"
                    } top-1 flex items-center justify-center`}
                  >
                    {streakMode && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
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
        <div
          className={`hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:translate-x-0 md:relative md:bg-transparent md:flex md:items-center`}
        >
          <div className="bg-[#e35721] w-64 h-full p-4 md:p-0 md:w-auto md:h-auto md:bg-transparent md:flex md:items-center fixed right-0 md:relative">
            <div className="flex justify-between items-center mb-4 md:hidden">
              <Link to="/">
                <img src={logo} alt="Roshambo Logo" className="h-10" />
              </Link>
              <img
                src={close}
                alt="Close Icon"
                className="h-8 cursor-pointer"
                onClick={() => toggleMenu()}
              />
            </div>
            <ul className="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-6 font-bold font-passion text-center">
              <li>
                <button
                  className="text-white hover:text-[#e35721] hover:bg-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => setIsHowToPlayOpen(true)}
                >
                  How To Play?
                </button>
              </li>
              <li>
                <a
                  href="https://x.com/dragoneyesxyz"
                  className="text-white hover:text-[#F8B22A] transition-colors duration-200 text-base"
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faXTwitter} size="1x" />
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/HouseOfXDragon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#e35721] flex hover:bg-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.26-2.05-.48-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.05-.78 4.12-1.79 6.86-2.98 8.19-3.55 3.9-1.67 4.71-1.96 5.24-1.97.12 0 .37.03.54.18.14.12.18.28.2.46-.01.06.01.24-.01.34z" />
                  </svg>
                  Telegram
                </a>
              </li>
              <li>
                <button
                  className="text-white bg-[#006823] hover:bg-[#004d1a] px-4 py-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => toggleMenu("open")}
                >
                  {!isLoggedIn ? "Connect Wallet" : "Wallet"}
                </button>
              </li>
              <li>
                {/* toggle switch eyes/btc mode big screen */}
                {isLoggedIn && (
                  <div className="flex justify-center items-center pb-3 md:block">
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <div className={`text-sm font-passion text-white`}>
                        {eyesMode ? "EYES" : "ICP"} mode
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={eyesMode}
                          onChange={() => handleSwitchMode(!eyesMode)}
                        />
                        <div
                          className={`w-14 h-8 rounded-full shadow-inner ${
                            eyesMode ? "bg-[#006823]" : "bg-slate-200"
                          }`}
                        ></div>
                        <div
                          className={`absolute w-6 h-6 rounded-full shadow transition ${
                            eyesMode ? "right-1 bg-white" : "left-1 bg-gray-200"
                          } top-1`}
                        >
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

      <div className="sticky top-20 z-10 bg-[#282828] py-1 w-full flex md:px-6 p-2 items-center justify-center shadow-md">
        <div className="text-white w-[25%] md:text-md text-[10px] text-center font-bold font-passion flex justify-center items-center">
          LAST HOUSE SHOTS
          {lastBets && lastBets.length > 0 ? (
            <div className="w-[70%]  ml-2 text-base text-black hidden md:flex">
              <div
                className={`bg-[#b4b4b4] flex items-center justify-center text-center rounded-l-lg px-2 `}
                style={{ width: `${percent[0]}%` }}
              >
                R({percent[0]})%
              </div>{" "}
              <div
                className={`bg-[#24c31e] flex items-center justify-center text-center px-2`}
                style={{ width: `${percent[0]}%` }}
              >
                P({percent[1]}%)
              </div>{" "}
              <div
                className={`bg-[#ffc905] flex items-center justify-center text-center rounded-r-lg px-2 `}
                style={{ width: `${percent[0]}%` }}
              >
                S({percent[2]}%)
              </div>{" "}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="md:w-[75%] w-full flex items-center gap-2 md: overflow-hidden pl-3 ">
          {lastBets && lastBets.length > 0 ? (
            <div className="grid w-[100%]">
              <div className="flex max-w-full ">
                {lastBets.slice(0, 100).map((index, id) => (
                  <div
                    key={index[0]}
                    className={`flex w-[20px] h-[20px] ${
                      ["", "bg-[#b4b4b4]", "bg-[#24c31e]", "bg-[#ffc905]"][
                        Number(index[1].houseGuess)
                      ]
                    } ${
                      startCountdown && id < newbet
                        ? "shadow-lg animate-spin mt-3 border-white border-2"
                        : ""
                    } ${
                      id < newbet
                        ? "animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                        : ""
                    } ${
                      id === newbet ? "animate-pulse" : ""
                    } rounded-full p-1 shadow-lg transform hover:scale-110 transition-transform duration-200 mx-1 items-center justify-center text-center`}
                  >
                    <div className="text-black font-passion text-base items-center justify-center text-center flex">
                      {["", "R", "P", "S"][Number(index[1].houseGuess)]}
                    </div>
                  </div>
                ))}
              </div>{" "}
              <div className="w-full max-w-[16.25rem] flex mt-2 md:hidden">
                <div
                  className="bg-[#b4b4b4] h-[6px]"
                  style={{ width: `${percent[0]}%` }}
                ></div>
                <div
                  className="bg-[#24c31e] h-[6px]"
                  style={{ width: `${percent[1]}%` }}
                ></div>
                <div
                  className="bg-[#ffc905] h-[6px]"
                  style={{ width: `${percent[2]}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-white text-lg italic">
              Loading last shots data
            </div>
          )}
        </div>
      </div>

      <HowToPlay
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </>
  );
};
export default NavBar;
