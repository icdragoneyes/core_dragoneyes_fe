/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  walletAddressAtom,
  isAuthenticatedAtom,
  telegramUserDataAtom,
  telegramWebAppAtom,
  telegramInitDataAtom,
  userAtom,
  coreAtom,
  roshamboActorAtom,
  questAtom,
  commissionAtom,
} from "../store/Atoms";
import analytics from "../utils/segment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EyesTokenModal from "./Roshambo/EyesTokenModal";

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
  const [coreAgent] = useAtom(coreAtom);
  const [roshamboAgent] = useAtom(roshamboActorAtom);
  const [initData] = useAtom(telegramInitDataAtom);
  const [walletAddress] = useAtom(walletAddressAtom);

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
  const [questData, setQuestData] = useAtom(questAtom);
  const [commissiondata, setCommissionData] = useAtom(commissionAtom);
  const [buttons, setButton] = useState({
    jointelegram: "Claim",
    useUniqueName: "Claim",
    play25x: "Claim",
    play5streak: "Claim",
    dailyCheckin: "Claim",
  });
  const [showEyesTokenModal, setShowEyesTokenModal] = useState(false);
  const [eyesGet, setEyesGet] = useState(0);

  // mock function

  const handleAction = async (key) => {
    console.log(`action ${key} trigered"`);
    var n = await checkTelegramMembership();
  };
  const [checkGroupButton, setCheckGroupButton] = useState("Claim");
  const handleCheckUsernameAndGroup = async (eyesReward) => {
    //console.log("Click h");
    var st = buttons;
    st.jointelegram = "Claiming..";
    setCheckGroupButton("Claiming...");
    setButton(st);
    var n = await checkTelegramMembership();
    //console.log("Click h2");
    st.jointelegram = "Claim";
    setButton(st);
    setCheckGroupButton("Claim");
    setEyesGet(eyesReward);
    setShowEyesTokenModal(true);
  };

  const [dailyButton, setDailyButton] = useState("Claim");
  const handleDailyCheckin = async (eyesReward) => {
    //console.log("Click h");
    var st = buttons;
    st.dailyCheckin = "Claiming..";
    setDailyButton("Claiming...");
    setButton(st);
    var n = await coreAgent.completeDailyCheckinTask();
    if (n.success) {
      setDailyCheckin(true);
      setEyesGet(eyesReward);
      setShowEyesTokenModal(true);
    } else if (n.failed) {
      toast.error(n.failed, {
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
    //console.log("Click h2");
    st.dailyCheckin = "Claim";
    setDailyButton("Claim");
    setButton(st);
  };

  async function questFetch() {
    //
  }

  const [weeklyPlayButton, setWPButton] = useState("Claim");
  const handleWeeklyPlay = async (eyesReward) => {
    //console.log("Click h");
    var st = buttons;
    st.play25x = "Claiming..";
    setWPButton("Claiming...");
    setButton(st);
    var n = await coreAgent.completeWeeklyRoshamboPlayTask();
    if (n.success) {
      setplay25xWeekly(true);
      setEyesGet(eyesReward);
      setShowEyesTokenModal(true);
    } else if (n.failed) {
      toast.error(n.failed, {
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
    //console.log("Click h2");
    st.play25x = "Claim";
    setWPButton("Claim");
    setButton(st);
  };
  const [weeklyStreakButton, setWSButton] = useState("Claim");
  const handleWeeklyStreakPlay = async (eyesReward) => {
    //console.log("Click h");
    var st = buttons;
    st.play5streak = "Claiming..";
    setWSButton("Claiming...");
    setButton(st);
    var n = await coreAgent.completeWeeklyStreakPlayTask();
    if (n.success) {
      setPlay5xstreakMode(true);
      setEyesGet(eyesReward);
      setShowEyesTokenModal(true);
    } else if (n.failed) {
      toast.error(n.failed, {
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
    //console.log("Click h2");
    st.play5streak = "Claim";
    setWSButton("Claim");
    setButton(st);
  };
  const [unameButton, setUnameButton] = useState("Claim");
  const handleUname = async (eyesReward) => {
    var st = buttons;
    st.useUniqueName = "Claiming..";
    setUnameButton("Claiming...");
    setButton(st);
    var n = await checkTelegramMembership();
    st.useUniqueName = "Claim";
    setUnameButton("Claim");
    setButton(st);
    setEyesGet(eyesReward);
    setShowEyesTokenModal(true);
  };

  const [topupButtom, setTopupButton] = useState("Claim");
  const handleTopup = async (eyesReward) => {
    setTopupButton("Claiming...");

    var n = await coreAgent.completeSOLTopUpTask();
    if (n.success) {
      setTopUpMin1Sol(true);
      setEyesGet(eyesReward);
      setShowEyesTokenModal(true);
    } else if (n.failed) {
      toast.error(n.failed, {
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

    setTopupButton("Claim");

    setEyesGet(eyesReward);
    setShowEyesTokenModal(true);
  };

  const [followButton, setFollow] = useState("Claim");
  const handleFollowX = async (eyesReward) => {
    setFollow("Claiming...");

    var n = await coreAgent.completeFollowX();
    if (n.success) {
      setfollowX(true);
      setEyesGet(eyesReward);
      setShowEyesTokenModal(true);
    } else if (n.failed) {
      toast.error(n.failed, {
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

    setFollow("Claim");

    setEyesGet(eyesReward);
    setShowEyesTokenModal(true);
  };

  const referralCode = user.referralCode;
  const navigate = useNavigate();

  const BOT_TOKEN = "7454958165:AAEZY04lOIKr67_Cq9j23pWntXBApePPjqM";
  const CHAT_ID = "@your_group_username"; // Ganti dengan chat_id yang benar

  const checkTelegramMembership = async () => {
    if (isAuthenticated) {
      let url = "https://api.dragoneyes.xyz/dragontelegram/api/groupCheck";
      if (initData) {
        var param = Object.fromEntries(new URLSearchParams(initData));
        param.principal = walletAddress;
        param.initData = Object.fromEntries(new URLSearchParams(initData));
        param.first_name = telegram.initDataUnsafe.user.first_name;
        if (param.first_name == "" || param.first_name === undefined)
          param.first_name = "none";
        param.user_id = telegram.initDataUnsafe.user.id;
        param.last_name = telegram.initDataUnsafe.user.last_name;
        if (param.last_name == "" || param.last_name === undefined)
          param.last_name = "none";
        param.username = telegram.initDataUnsafe.user.username;
        var additionalParam = { principal: walletAddress };
        var allparam = { ...param, ...additionalParam };
        try {
          const response = await axios.post(url, param, {
            headers: {
              "Content-Type": "application/json", // Optional headers
            },
          });

          console.log(response, "<<<< group check");
          if (response.data.isMember == "yes") {
            setJoinedTelegramGrup(true);
          }
          if (response.data.isUsernameUnique == "yes") {
            setAddIconToUsername(true);
          }

          // Handle success
        } catch (error) {
          console.log("check telegram error");
          //
        }
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
    //checkTelegramMembership();

    async function questFetch() {
      // console.log(questData, "<<<<<<asdsad");
      var taskList = questData.taskHash;
      var completedTask = questData.completedTaskHash;
      var dtaskList = questData.dailyTaskHash;
      var dcompletedTask = questData.completedDailyTaskHash;

      var wtaskList = questData.weeklyTaskHash;
      var wcompletedTask = questData.completedWeeklyTaskHash;
      // console.log(wcompletedTask, "<<<<<<asdsad");
      taskList.forEach((task) => {
        var name = task[0];
        //console.log(name, "<<<<<<<<<< taskname");
        //if (task[0][0] == "telegramgroup") {
        completedTask.forEach((completed) => {
          if (completed == "telegramgroup" && completed == name) {
            setJoinedTelegramGrup(true);
          }
          if (completed == "uniqueUsername" && completed == name) {
            setAddIconToUsername(true);
          }
          if (completed == "topup" && completed == name) {
            setTopUpMin1Sol(true);
          }
          if (completed == "followX" && completed == name) {
            setfollowX(true);
          }
        });
      });
      if (wcompletedTask.length)
        wtaskList.forEach((task) => {
          var name = task[0];

          wcompletedTask.forEach((completed) => {
            if (completed == "play25x" && completed == name) {
              setplay25xWeekly(true);
            }
            if (completed == "play5streak" && completed == name) {
              setPlay5xstreakMode(true);
            }
          });
        });
      if (dcompletedTask.length)
        dtaskList.forEach((task) => {
          var name = task[0];
          console.log(name, "<<<<<<<<<< taskname daily");
          //if (task[0][0] == "telegramgroup") {
          dcompletedTask.forEach((completed) => {
            if (completed == "dailyCheckin" && completed == name) {
              setDailyCheckin(true);
            }
          });
        });
    }
    if (questData && isAuthenticated) {
      questFetch();
    }
  }, [questData, commissiondata, isAuthenticated]);

  const handleLinkClick = (e) => {
    e.preventDefault();
    window.Telegram.WebApp.openLink(
      "https://x.com/intent/follow?screen_name=dragoneyesxyz"
    );
  };

  // mock data

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#2A2A2A] bg-cover bg-center">
      {isAuthenticated ? (
        questData && commissiondata ? (
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
                    className="bg-[#22C31F] text-black w-[70px] rounded-full"
                    onClick={() => setIsShareModalOpen(true)}
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
                    <p className="text-[#E8A700] text-[18px]">
                      {Number(commissiondata.totalRoshamboFriendPlayed)}
                    </p>
                    <p className="text-white text-[9px] w-12 break-words">
                      Friends playing
                    </p>
                  </div>

                  <div className="flex gap-1.5 items-center font-bold">
                    <p className="text-[#E8A700] text-[18px]">
                      {Number(commissiondata.totalRoshamboPlayed)}
                    </p>
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
                    {Number(questData.eyesReferralRewardTotal) / 1e8} EYES
                  </p>
                  <p className="text-[#FEE489] font-passion text-[15px]">
                    {Number(commissiondata.solRoshamboCommissionTotal) / 1e9}{" "}
                    SOL
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
                      className="bg-[#22C31F] text-black text-sm w-[70px] rounded-full"
                      onClick={() => handleCheckUsernameAndGroup(2000)}
                    >
                      {checkGroupButton}
                    </button>
                  )}
                </div>

                <div className="border-t-2 border-[#392F24] mt-2 mb-2"></div>

                {/* subscribe telegram announcement */}
                {/*
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
                    className="bg-[#22C31F] text-black w-[70px] rounded-full"
                    onClick={() =>
                      handleAction("subscribeTelegramAnnouncement")
                    }
                  >
                    Go
                  </button>
                )}
              </div>

              <div className="border-t-2 border-[#392F24] mt-2 mb-2"></div>
*/}
                {/* follow x*/}

                <div className="flex justify-between items-center px-6 ">
                  <div>
                    <p
                      className={`${
                        followX ? "text-[#727272]" : "text-white"
                      } text-[11px]`}
                    >
                      Follow us on X{" "}
                      <a
                        href="https://x.com/intent/follow?screen_name=dragoneyesxyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                      >
                        [click here]
                      </a>
                      , then claim afterwards
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
                      className="bg-[#22C31F] text-black w-[70px] rounded-full"
                      onClick={() => handleFollowX(3000)}
                    >
                      {followButton}
                    </button>
                  )}
                </div>
                <div className="border-t-2 border-[#392F24] mt-2 mb-2"></div>
                {/*  */}

                {/* add icon to username x*/}
                <div className="flex justify-between items-center px-6 ">
                  <div>
                    <p
                      className={`${
                        addIconToUsername ? "text-[#727272]" : "text-white"
                      } text-[11px]`}
                    >
                      Add all three rock-paper-scissors emoji ✊🖐️✌️ to your
                      username
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
                      className="bg-[#22C31F] text-black text-sm w-[70px] rounded-full"
                      onClick={() => handleUname(5000)}
                    >
                      {unameButton}
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
                      className="bg-[#22C31F] text-black text-sm w-[70px] rounded-full"
                      onClick={() => handleWeeklyPlay(5000)}
                    >
                      {weeklyPlayButton}
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
                      className="bg-[#22C31F] text-sm text-black w-[70px] rounded-full"
                      onClick={() => handleWeeklyStreakPlay(5000)}
                    >
                      {weeklyStreakButton}
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
                      className="bg-[#22C31F] text-sm text-black w-[70px] rounded-full"
                      onClick={() => handleTopup(5000)}
                    >
                      {topupButtom}
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
                      className="bg-[#22C31F] text-black text-sm w-[70px] rounded-full"
                      onClick={() => handleDailyCheckin(100)}
                    >
                      {dailyButton}
                    </button>
                  )}
                </div>
              </div>
              <div className="h-[80px]"></div>
            </motion.div>
          </div>
        ) : (
          <div className="w-full text-center">
            <p className="font-passion text-white text-[20px] w-full text-center mt-[200px]">
              Loading Quest Data...
            </p>
          </div>
        )
      ) : (
        <div className="overflow-y-scroll max-h-full text-white p-6 no-scrollbar ">
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
            <p className="font-passion text-white text-[20px] w-full text-center">
              Play Roshambo Telegram Version to Access Quest
            </p>
            <div className="bg-[#221C15] px-6 py-5 rounded-3xl mb-6 w-full text-center">
              <div className="grid  items-center w-full text-center">
                <p className="text-white text-[11px] w-full text-center">
                  Invite Friends to get 20% referral commission and EYES
                </p>
                <p className="text-white text-[11px] w-full text-center">
                  Access quests to get weekly and daily rewards!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <Wallet3 />
      <ShareReferralModal
        isOpen={isShareModalOpen}
        onShare={shareReferralCode}
        invitesLeft={invitesLeft}
        onClose={() => setIsShareModalOpen(false)}
      />
      <AnimatePresence>
        {showEyesTokenModal && (
          <EyesTokenModal
            isOpen={showEyesTokenModal}
            onClose={() => setShowEyesTokenModal(false)}
            eyesWon={eyesGet}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestV2;
