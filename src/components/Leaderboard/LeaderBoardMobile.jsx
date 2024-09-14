/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { motion } from "framer-motion";

import {
  isLoggedInAtom,
  telegramUserDataAtom,
  telegramWebAppAtom,
} from "../../store/Atoms";

import { determineLevelName } from "../../utils/level";

import firstPosition from "../../assets/img/firstPosition.png";
import secondPosition from "../../assets/img/secondPosition.png";
import thirdPosition from "../../assets/img/thirdPosition.png";
import share_logo from "../../assets/wallet/share.png";

import ConnectModal from "../ConnectModal";

const referralCode = "TH10DXM62";

const topThreeObjTemplate = {
  second: {
    image: secondPosition,
    animateDelay: 0.5,
  },
  first: {
    image: firstPosition,
    animateDelay: 0.8,
  },
  third: {
    image: thirdPosition,
    animateDelay: 0.2,
  },
};

const globalLeaderBoardMock = [
  { username: "HawkEye", principal: "", eyes: 25000 },
  { username: "EagleView", principal: "", eyes: 5000000 },
  { username: "FalconSight", principal: "", eyes: 8500000 },
  { username: "Rambo", principal: "", eyes: 120000 },
  { username: "SharpShooter", principal: "", eyes: 2000000 },
  { username: "NightVision", principal: "", eyes: 10000 },
  { username: "ZoomMaster", principal: "", eyes: 18000000 },
  { username: "EagleEye", principal: "", eyes: 750000 },
  { username: "SpyGlass", principal: "", eyes: 1250000 },
  { username: "SkyWatcher", principal: "", eyes: 100000 },
];

const friendLeaderBoardMock = [
  { username: "SkyRanger", principal: "", eyes: 6000000 },
  { username: "HorizonHunter", principal: "", eyes: 300000 },
  { username: "CloudPiercer", principal: "", eyes: 9500000 },
  { username: "StormChaser", principal: "", eyes: 20000000 },
  { username: "WindWalker", principal: "", eyes: 450000 },
  { username: "ThunderBolt", principal: "", eyes: 7500000 },
  { username: "LightningFlash", principal: "", eyes: 220000 },
  { username: "TornadoTwist", principal: "", eyes: 10500000 },
  { username: "SunSeeker", principal: "", eyes: 3200000 },
  { username: "SkyBreaker", principal: "", eyes: 25000000 },
];

const variants = {
  hidden: { opacity: 0, y: -50 }, // Start position for the animation
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1, // Delay each row based on its index
      duration: 0.5, // Duration of the animation
      type: "spring", // Use a spring type animation for a bounce effect
      stiffness: 100, // Spring stiffness, adjust for more/less bounce
      damping: 10, // Spring damping, adjust to change how the bounce behaves
    },
  }),
};

const LeaderBoardMobile = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [globalLeaderBoard, setGlobalLeaderBoard] = useState([]);
  const [friendLeaderBoard, setFriendLeaderBoard] = useState([]);
  const [renderList, setRenderList] = useState([]);
  const [logedIn] = useAtom(isLoggedInAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);
  const [telegram] = useAtom(telegramWebAppAtom);
  console.log(logedIn, "<<<<< logedIn");
  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        let message = "Referral code copied";
        toast.success(message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch(() => {
        toast.error("Failed To Copy Text", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }

  const shareReferralCode = () => {
    const { first_name, id } = telegramUserData;
    // eventBuilder.track("User Shared Referral Code", {
    //   label: "share",
    //   user: { first_name },
    //   user_id: id,
    // });
    if (telegram) {
      const message = encodeURIComponent(
        `Join Dragon Eyes using my referral code: ${referralCode}`
      );
      const url = `https://t.me/share/url?url=${message}`;
      telegram.openTelegramLink(url);
    } else {
      console.log(
        "Telegram WebApp is not available or user is not authenticated"
      );
    }
  };

  function sortUserByEyesAmount(board) {
    const sortedBoard = board.sort((a, b) => b.eyes - a.eyes);

    return sortedBoard.map((player, index) => ({
      ...player,
      level: determineLevelName(player.eyes),
      rank: index + 1,
    }));
  }

  useEffect(() => {
    const currentLenderList = sortUserByEyesAmount(
      activeTab === "global" ? globalLeaderBoardMock : friendLeaderBoardMock
    );

    setRenderList(currentLenderList);

    // fill top three template
    topThreeObjTemplate.first = {
      ...topThreeObjTemplate.first,
      ...currentLenderList[0],
    };
    topThreeObjTemplate.second = {
      ...topThreeObjTemplate.second,
      ...currentLenderList[1],
    };
    topThreeObjTemplate.third = {
      ...topThreeObjTemplate.third,
      ...currentLenderList[2],
    };
  }, [activeTab]);

  return (
    <section
      className="relative w-screen h-screen overflow-hidden"
      key={activeTab}
    >
      {/* Background Image */}
      <div className="fixed inset-0 bg-[url('/src/assets/img/bg.png')] bg-cover bg-center"></div>

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="flex justify-center relative h-full w-full pt-8 ">
        {/* box */}
        <div className="relative w-11/12 bg-[#343433E5] rounded-lg p-6">
          <div className="flex text-white font-normal font-passion text-[26px]">
            Leaderboard
          </div>

          {/* switch tab section */}
          <div className="flex gap-4 w-7/12 mt-5">
            <button
              onClick={() => setActiveTab("global")}
              className={`flex items-center justify-around px-3 py-2 gap-1 h-[36px] rounded-lg font-normal font-passion ${
                activeTab === "global"
                  ? "text-white bg-[#04B0BBF2]"
                  : "text-[#BDBDBD] bg-[#515151]"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.99998 1.3335C9.6675 3.15906 10.6151 5.52819 10.6666 8.00016C10.6151 10.4721 9.6675 12.8413 7.99998 14.6668M7.99998 1.3335C6.33246 3.15906 5.38481 5.52819 5.33331 8.00016C5.38481 10.4721 6.33246 12.8413 7.99998 14.6668M7.99998 1.3335C4.31808 1.3335 1.33331 4.31826 1.33331 8.00016C1.33331 11.6821 4.31808 14.6668 7.99998 14.6668M7.99998 1.3335C11.6819 1.3335 14.6666 4.31826 14.6666 8.00016C14.6666 11.6821 11.6819 14.6668 7.99998 14.6668M1.66666 6.00016H14.3333M1.66665 10.0002H14.3333"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Global
            </button>

            <button
              onClick={() => setActiveTab("friends")}
              className={`flex items-center justify-around px-3 py-2 gap-1 h-[36px] rounded-lg font-normal font-passion ${
                activeTab === "friends"
                  ? "text-white bg-[#04B0BBF2]"
                  : "text-[#BDBDBD] bg-[#515151]"
              }`}
              disabled={!logedIn}
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.6666 13V11.6667C14.6666 10.4241 13.8168 9.38004 12.6666 9.08401M10.3333 1.19384C11.3106 1.58943 12 2.54754 12 3.66667C12 4.78579 11.3106 5.7439 10.3333 6.13949M11.3333 13C11.3333 11.7575 11.3333 11.1362 11.1303 10.6462C10.8597 9.99277 10.3405 9.47364 9.68714 9.20299C9.19708 9 8.57582 9 7.33331 9H5.33331C4.0908 9 3.46955 9 2.97949 9.20299C2.32608 9.47364 1.80695 9.99277 1.5363 10.6462C1.33331 11.1362 1.33331 11.7575 1.33331 13M8.99998 3.66667C8.99998 5.13943 7.80607 6.33333 6.33331 6.33333C4.86055 6.33333 3.66665 5.13943 3.66665 3.66667C3.66665 2.19391 4.86055 1 6.33331 1C7.80607 1 8.99998 2.19391 8.99998 3.66667Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Friends
            </button>
          </div>

          {/* top three dragon section */}
          <div className="flex items-end w-full justify-between mt-5">
            {Object.values(topThreeObjTemplate).map((player, idx) => {
              return (
                <div
                  key={idx}
                  className="flex justify-center flex-col items-center gap-y-1"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: player.animateDelay,
                      duration: 0.3 + player.animateDelay,
                      ease: [0, 0.71, 0.2, 1.01],
                      scale: {
                        type: "spring",
                        damping: 5,
                        stiffness: 100,
                        restDelta: 0.001,
                      },
                    }}
                  >
                    <img src={player.image} alt={player.username} />

                    {/* username */}
                    <div className="flex justify-center w-full text-sm text-white font-normal font-passion">
                      {player.username}
                    </div>

                    {/* level */}
                    <div className="flex justify-center items-center gap-1.5 px-1.5 py-1 bg-[#E35721] rounded text-[10px] text-white font-passion">
                      {player.level}
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 9 9"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 0.75L5.25448 2.71166C5.36024 2.98662 5.41312 3.1241 5.49534 3.23974C5.56822 3.34223 5.65777 3.43178 5.76026 3.50466C5.8759 3.58689 6.01338 3.63976 6.28834 3.74552L8.25 4.5L6.28834 5.25448C6.01338 5.36024 5.8759 5.41312 5.76026 5.49534C5.65777 5.56822 5.56822 5.65777 5.49534 5.76026C5.41312 5.8759 5.36024 6.01338 5.25448 6.28834L4.5 8.25L3.74552 6.28834C3.63976 6.01338 3.58689 5.8759 3.50466 5.76026C3.43178 5.65777 3.34223 5.56822 3.23974 5.49534C3.1241 5.41312 2.98662 5.36024 2.71166 5.25448L0.75 4.5L2.71166 3.74552C2.98662 3.63976 3.1241 3.58689 3.23974 3.50466C3.34223 3.43178 3.43178 3.34223 3.50466 3.23974C3.58688 3.1241 3.63976 2.98662 3.74552 2.71166L4.5 0.75Z"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* eyes amount */}
                    <div className="flex justify-center items-center gap-1 w-full text-[10px] text-white font-normal font-passion">
                      {(player.eyes || 0).toLocaleString("en-US")}
                      <svg
                        width="17"
                        height="8"
                        viewBox="0 0 17 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.8 7H0.44V0.789999H3.9L3.8 2.32H2.15V3.25H3.58V4.57H2.15V5.6H3.9L3.8 7ZM8.68297 0.789999L7.20297 5.08V7H5.50297V5.08L4.04297 0.789999H5.92297L6.37297 2.81H6.45297L6.88297 0.789999H8.68297ZM12.4816 7H9.12164V0.789999H12.5816L12.4816 2.32H10.8316V3.25H12.2616V4.57H10.8316V5.6H12.5816L12.4816 7ZM12.8846 2.66C12.8846 2.06667 13.0579 1.59 13.4046 1.23C13.7513 0.87 14.2246 0.69 14.8246 0.69C15.4313 0.69 16.0513 0.75 16.6846 0.87L16.4846 2.47C15.8246 2.31667 15.3713 2.24 15.1246 2.24C14.8113 2.24 14.6546 2.36667 14.6546 2.62C14.6546 2.72 14.7279 2.81667 14.8746 2.91C15.0279 3.00333 15.2113 3.10333 15.4246 3.21C15.6379 3.31 15.8513 3.43333 16.0646 3.58C16.2779 3.72 16.4579 3.92333 16.6046 4.19C16.7579 4.45667 16.8346 4.76333 16.8346 5.11C16.8346 5.74333 16.6646 6.23333 16.3246 6.58C15.9846 6.92667 15.5013 7.1 14.8746 7.1C14.2546 7.1 13.6479 7.00333 13.0546 6.81L13.1646 5.32C13.8779 5.52667 14.3746 5.63 14.6546 5.63C14.9346 5.63 15.0746 5.50667 15.0746 5.26C15.0746 5.13333 14.9979 5.01667 14.8446 4.91C14.6979 4.80333 14.5179 4.69667 14.3046 4.59C14.0913 4.48333 13.8746 4.36 13.6546 4.22C13.4413 4.08 13.2579 3.87667 13.1046 3.61C12.9579 3.34333 12.8846 3.02667 12.8846 2.66Z"
                          fill="url(#paint0_linear_439_714)"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_439_714"
                            x1="-11.6875"
                            y1="-3.2"
                            x2="25.9207"
                            y2="13.0603"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#F76537" />
                            <stop offset="1" stopColor="#5100A3" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* my global rank section  */}
          {logedIn && (
            <div className="mt-4">
              <div className="text-xs text-white font-normal font-passion">
                My Global Rank
              </div>

              {/* global rank banner */}
              <div className="mt-2 w-full flex justify-between items-center rounded-lg bg-[#7338EA5C] p-3 text-xs text-[#FFF4BC] font-normal font-passion">
                <span>135</span>
                <span>FluffyCat</span>
                <span>Apprentice</span>
                <span>7,000,000</span>
              </div>

              {/* sahre info */}
              <div className="w-full flex gap-1 items-center mt-4">
                <div className="text-white text-[8px] ">
                  Increase your rank and airdrop allocation by sharing your
                  referral code!
                </div>
                <div className="flex ">
                  <div className="bg-[#F3E6D3] rounded-l-lg p-2 border-2 border-dashed border-[#EA8101]">
                    <div className="flex justify-between items-center gap-1">
                      <span className="text-[#EA8101] text-xs font-passion">
                        {referralCode}
                      </span>
                      <button
                        onClick={() => copyToClipboard(referralCode)}
                        className="text-[#EA8101]"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* share referral button */}
                  <button
                    onClick={shareReferralCode}
                    className="bg-[#D57500] px-3 text-white rounded-r-lg flex gap-1 items-center justify-center text-xs font-passion"
                  >
                    Share
                    <img
                      src={share_logo}
                      alt="share icon"
                      className="w-2 h-2"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* table  */}
          <div className="mt-4">
            <table className="min-w-full bg-transparent font-passion">
              <thead>
                <tr className="text-left">
                  <th
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom right, #22C31F, #FFE70E)",
                    }}
                  >
                    Rank
                  </th>
                  <th
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom right, #22C31F, #FFE70E)",
                    }}
                  >
                    Username
                  </th>
                  <th
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom right, #22C31F, #FFE70E)",
                    }}
                  >
                    Level
                  </th>
                  <th
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom right, #22C31F, #FFE70E)",
                    }}
                  >
                    EYES
                  </th>
                </tr>
              </thead>
              <tbody className="text-[#FFF4BC]">
                {renderList.slice(3).map((row, index) => (
                  <motion.tr
                    key={row.index}
                    variants={variants}
                    initial="hidden"
                    custom={index}
                    animate="visible"
                  >
                    <td className="py-1">{row.rank}</td>
                    <td className="py-1">{row.username}</td>
                    <td className="py-1">{row.level}</td>
                    <td className="py-1">
                      {(row.eyes || 0).toLocaleString("en-US")}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Connect Wallet Modal Popup */}
      <ConnectModal />
    </section>
  );
};

export default LeaderBoardMobile;