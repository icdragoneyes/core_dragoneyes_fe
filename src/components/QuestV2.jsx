/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import bgImage from "../assets/img/bg.png";
import Wallet3 from "./Wallet3";
import share_logo from "../assets/wallet/share.png";
import { FaXTwitter, FaTelegram } from "react-icons/fa6";
import { SiSolana } from "react-icons/si";
import { toast } from "react-toastify";
import ShareReferralModal from "./ShareReferralModal";
import { useAtom } from "jotai";
import {
  invitesLeftAtom,
  isAuthenticatedAtom,
  telegramUserDataAtom,
  telegramWebAppAtom,
  userAtom,
} from "../store/Atoms";
import analytics from "../utils/segment";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const QuestV2 = () => {
  const [telegramUserData] = useAtom(telegramUserDataAtom);
  const [telegram] = useAtom(telegramWebAppAtom);
  const [user] = useAtom(userAtom);
  const [invitesLeft] = useAtom(invitesLeftAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // mocking data
  const [friendsPlaying, setFriendsPlaying] = useState(16);
  const [roundPlayed, setRoundPlayed] = useState(146);
  const [totalEarnedEyes, setTotalEarnedEyes] = useState(1500);
  const [totalEarnedSol, setTotalEarnedSol] = useState(0.069589);
  const [joinedTelegramGrup, setJoinedTelegramGrup] = useState(false);
  const [subscribeTelegramAnnouncement, setSubscribeTelegramAnnouncement] =
    useState(false);
  const [followX, setfollowX] = useState(false);
  const [addIconToUsername, setAddIconToUsername] = useState(false);
  const [play25xWeekly, setplay25xWeekly] = useState(false);
  const [play5xstreakMode, setPlay5xstreakMode] = useState(false);
  const [topUpMin1Sol, setTopUpMin1Sol] = useState(false);
  const [dailyCheckin, setDailyCheckin] = useState(false);

  // mock function

  const handleAction = (key) => {
    console.log(`action ${key} trigered"`);
  };

  const referralCode = user.referralCode;
  const navigate = useNavigate();

  const BOT_TOKEN = "7454958165:AAEZY04lOIKr67_Cq9j23pWntXBApePPjqM";
  const CHAT_ID = "@your_group_username"; // Ganti dengan chat_id yang benar

  const checkTelegramMembership = async () => {
    if (telegram?.initDataUnsafe?.user?.id) {
      try {
        const response = await axios.get(
          `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember`,
          {
            params: {
              chat_id: CHAT_ID,
              user_id: telegram.initDataUnsafe.user.id,
            },
          }
        );

        if (response.data.ok && response.data.result.status !== "left") {
          setJoinedTelegramGrup(true);
        }
      } catch (error) {
        console.error("Error checking Telegram membership:", error);
      }
    }
  };

  const handleShareClose = () => {
    setIsShareModalOpen(false);
  };

  const shareReferralCode = () => {
    if (telegramUserData) {
      const { first_name, id } = telegramUserData;
      analytics.track("User Shared Referral Code", {
        user_id: id,
        name: first_name,
        game_name: user?.userName,
        user_referral_code: referralCode,
        label: "share",
      });
    }
    if (telegram) {
      const tgAppLink = `t.me/dragoneyesxyz_bot/roshambo?startapp=${referralCode}`;
      const message = encodeURIComponent(
        `Claim your 0.03 SOL airdrop NOW by opening this Roshambo Telegram App ${tgAppLink} before expired!`
      );
      const url = `https://t.me/share/url?url=${message}`;
      telegram.openTelegramLink(url);
      handleShareClose();
    } else {
      console.log(
        "Telegram WebApp is not available or user is not authenticated"
      );
    }
  };

  useEffect(() => {
    checkTelegramMembership();
  }, []);

  // mock data

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#2A2A2A] bg-cover bg-center">
      <div className="overflow-y-scroll max-h-full text-white p-6 no-scrollbar ">
        {/* Invite Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <p className="font-passion text-white text-[20px]">Invite</p>
          <div className="bg-[#221C15] px-6 py-5 rounded-3xl mb-6">
            <div className="flex justify-between items-center">
              {invitesLeft ? (
                <div className="flex flex-col w-1/2">
                  <div className="bg-[#103975] px-2 py-1 rounded-t">
                    <p className="text-white font-semibold text-[14px]">
                      {invitesLeft} Airdrop invites left
                    </p>
                  </div>
                  <div className="bg-[#474747] px-2 py-1 rounded-b">
                    <p className="text-white text-[9px]">
                      Your friend will get 0.03 SOL
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white text-[11px]">Invite Friends</p>
              )}

              <button
                className="bg-[#22C31F] text-black w-[57px] rounded-full"
                onClick={() => handleAction("inviteFriends")}
              >
                Go
              </button>
            </div>
            <div className="text-[11px] mt-2 text-[#22C31F] font-semibold">
              <p>+10,000 EYES</p>
              <p>+20% fee commission</p>
            </div>

            <div className="border-t-2 border-[#392F24] mt-2 mb-2"></div>

            <div className="flex justify-around items-center w-full">
              <div className="flex gap-1.5 items-end">
                <svg
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 13V5.5M6 13V1M1.5 13V8.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-white text-xs font-bold">This week</p>
              </div>

              <div className="flex gap-1.5 items-center font-bold">
                <p className="text-[#E8A700] text-[18px]">{friendsPlaying}</p>
                <p className="text-white text-[9px] w-12 break-words">
                  Fiends playing
                </p>
              </div>

              <div className="flex gap-1.5 items-center font-bold">
                <p className="text-[#E8A700] text-[18px]">{roundPlayed}</p>
                <p className="text-white text-[9px]  w-12 break-words">
                  Rounds played
                </p>
              </div>
            </div>
            <div className="border-t-2 border-[#392F24] mt-2 mb-2"></div>

            <div className="flex justify-between items-center">
              <p className="text-[#FEE489] font-passion text-[15px]">
                Total Earned
              </p>
              <p className="text-[#FEE489] font-passion text-[15px]">
                {totalEarnedEyes} EYES
              </p>
              <p className="text-[#FEE489] font-passion text-[15px]">
                {totalEarnedSol} SOL
              </p>
            </div>
          </div>
        </motion.div>

        {/* Socials Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <p className="font-passion text-white text-[20px]">Socials</p>
          <div className="bg-[#221C15] rounded-3xl mb-6 py-5">
            {/* join telegram group */}
            <div className="flex justify-between items-center px-6">
              <div>
                <p
                  className={`${
                    joinedTelegramGrup ? "text-[#727272]" : "text-white"
                  } text-[11px]`}
                >
                  Join Telegram Group
                </p>
                <p
                  className={`${
                    joinedTelegramGrup ? "text-[#727272]" : "text-[#22C31F]"
                  } text-[11px]`}
                >
                  +2000 EYES
                </p>
              </div>

              {joinedTelegramGrup ? (
                <svg
                  width="20"
                  height="15"
                  viewBox="0 0 20 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2L7 13L2 8"
                    stroke="#22C31F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <button
                  className="bg-[#22C31F] text-black w-[57px] rounded-full"
                  onClick={() => handleAction("joineTelegramGroup")}
                >
                  Go
                </button>
              )}
            </div>

            <div className="border-t-2 border-[#392F24] mt-2 mb-2"></div>

            {/* subscribe telegram announcement */}
            <div className="flex justify-between items-center px-6 ">
              <div>
                <p
                  className={`${
                    subscribeTelegramAnnouncement
                      ? "text-[#727272]"
                      : "text-white"
                  } text-[11px]`}
                >
                  Subscribe Telegram Announcement
                </p>
                <p
                  className={`${
                    subscribeTelegramAnnouncement
                      ? "text-[#727272]"
                      : "text-[#22C31F]"
                  } text-[11px]`}
                >
                  +2000 EYES
                </p>
              </div>

              {subscribeTelegramAnnouncement ? (
                <svg
                  width="20"
                  height="15"
                  viewBox="0 0 20 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2L7 13L2 8"
                    stroke="#22C31F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <button
                  className="bg-[#22C31F] text-black w-[57px] rounded-full"
                  onClick={() => handleAction("subscribeTelegramAnnouncement")}
                >
                  Go
                </button>
              )}
            </div>

            <div className="border-t-2 border-[#392F24] mt-2 mb-2"></div>

            {/* follow x*/}
            <div className="flex justify-between items-center px-6 ">
              <div>
                <p
                  className={`${
                    followX ? "text-[#727272]" : "text-white"
                  } text-[11px]`}
                >
                  Follow us on X
                </p>
                <p
                  className={`${
                    followX ? "text-[#727272]" : "text-[#22C31F]"
                  } text-[11px]`}
                >
                  +3000 EYES
                </p>
              </div>

              {followX ? (
                <svg
                  width="20"
                  height="15"
                  viewBox="0 0 20 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2L7 13L2 8"
                    stroke="#22C31F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <button
                  className="bg-[#22C31F] text-black w-[57px] rounded-full"
                  onClick={() => handleAction("followX")}
                >
                  Go
                </button>
              )}
            </div>

            <div className="border-t-2 border-[#392F24] mt-2 mb-2"></div>

            {/* add icon to username x*/}
            <div className="flex justify-between items-center px-6 ">
              <div>
                <p
                  className={`${
                    addIconToUsername ? "text-[#727272]" : "text-white"
                  } text-[11px]`}
                >
                  Add ✊🖐️✌️ to your username
                </p>
                <p
                  className={`${
                    addIconToUsername ? "text-[#727272]" : "text-[#22C31F]"
                  } text-[11px]`}
                >
                  +5000 EYES
                </p>
              </div>

              {addIconToUsername ? (
                <svg
                  width="20"
                  height="15"
                  viewBox="0 0 20 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2L7 13L2 8"
                    stroke="#22C31F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <button
                  className="bg-[#22C31F] text-black w-[57px] rounded-full"
                  onClick={() => handleAction("addIconOnUsername")}
                >
                  Go
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* weekly Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <p className="font-passion text-white text-[20px]">Weekly</p>
          <div className="bg-[#221C15] rounded-3xl mb-6 py-5">
            {/* play 25x */}
            <div className="flex justify-between items-center px-6">
              <div>
                <p
                  className={`${
                    play25xWeekly ? "text-[#727272]" : "text-white"
                  } text-[11px]`}
                >
                  Play 25x
                </p>
                <p
                  className={`${
                    play25xWeekly ? "text-[#727272]" : "text-[#22C31F]"
                  } text-[11px]`}
                >
                  +5,000 EYES + 3 airdrop invites
                </p>
              </div>

              {play25xWeekly ? (
                <svg
                  width="20"
                  height="15"
                  viewBox="0 0 20 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2L7 13L2 8"
                    stroke="#22C31F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <button
                  className="bg-[#22C31F] text-black w-[57px] rounded-full"
                  onClick={() => handleAction("play25xWeekly")}
                >
                  Go
                </button>
              )}
            </div>

            <div className="border-t-2 border-[#392F24] mt-2 mb-2"></div>

            {/* play 5x streak mode */}
            <div className="flex justify-between items-center px-6 ">
              <div>
                <p
                  className={`${
                    play5xstreakMode ? "text-[#727272]" : "text-white"
                  } text-[11px]`}
                >
                  Play 5x on STREAK MODE
                </p>
                <p
                  className={`${
                    play5xstreakMode ? "text-[#727272]" : "text-[#22C31F]"
                  } text-[11px]`}
                >
                  +5000 EYES
                </p>
              </div>

              {play5xstreakMode ? (
                <svg
                  width="20"
                  height="15"
                  viewBox="0 0 20 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2L7 13L2 8"
                    stroke="#22C31F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <button
                  className="bg-[#22C31F] text-black w-[57px] rounded-full"
                  onClick={() => handleAction("play5xStreak")}
                >
                  Go
                </button>
              )}
            </div>

            <div className="border-t-2 border-[#392F24] mt-2 mb-2"></div>

            {/* topup minimum 1 sol x*/}
            <div className="flex justify-between items-center px-6 ">
              <div>
                <p
                  className={`${
                    topUpMin1Sol ? "text-[#727272]" : "text-white"
                  } text-[11px]`}
                >
                  Top up wallet min 1 SOL
                </p>
                <p
                  className={`${
                    topUpMin1Sol ? "text-[#727272]" : "text-[#22C31F]"
                  } text-[11px]`}
                >
                  +5000 EYES
                </p>
              </div>

              {topUpMin1Sol ? (
                <svg
                  width="20"
                  height="15"
                  viewBox="0 0 20 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2L7 13L2 8"
                    stroke="#22C31F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <button
                  className="bg-[#22C31F] text-black w-[57px] rounded-full"
                  onClick={() => handleAction("topUpMin1Sol")}
                >
                  Go
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* daily Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <p className="font-passion text-white text-[20px]">Daily</p>
          <div className="bg-[#221C15] rounded-3xl mb-6 py-5 mb-36">
            {/* daily check in */}
            <div className="flex justify-between items-center px-6">
              <div>
                <p
                  className={`${
                    dailyCheckin ? "text-[#727272]" : "text-white"
                  } text-[11px]`}
                >
                  Daily check-in
                </p>
                <p
                  className={`${
                    dailyCheckin ? "text-[#727272]" : "text-[#22C31F]"
                  } text-[11px]`}
                >
                  +100 EYES
                </p>
              </div>

              {dailyCheckin ? (
                <svg
                  width="20"
                  height="15"
                  viewBox="0 0 20 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2L7 13L2 8"
                    stroke="#22C31F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <button
                  className="bg-[#22C31F] text-black w-[57px] rounded-full"
                  onClick={() => handleAction("dailyCheckin")}
                >
                  Go
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Wallet3 />
      <ShareReferralModal
        isOpen={isShareModalOpen}
        onShare={shareReferralCode}
        invitesLeft={invitesLeft}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};

export default QuestV2;
