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
import { invitesLeftAtom, isAuthenticatedAtom, telegramUserDataAtom, telegramWebAppAtom, userAtom, userNameAtom } from "../store/Atoms";
import analytics from "../utils/segment";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Quest = () => {
  const [telegramUserData] = useAtom(telegramUserDataAtom);
  const [telegram] = useAtom(telegramWebAppAtom);
  const [user] = useAtom(userAtom);
  const [invitesLeft] = useAtom(invitesLeftAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [userName] = useAtom(userNameAtom);

  const [quests, setQuests] = useState([
    { id: 1, title: "Join Telegram Group", reward: 2000, completed: false, claimed: false, color: "#C2D7D9", buttonColor: "#2DB0F2", action: "Join", logo: <FaTelegram /> },
    { id: 2, title: "Follow us on X", reward: 2000, completed: false, claimed: false, color: "#F9F9F9", buttonColor: "black", action: "Follow", logo: <FaXTwitter /> },
    { id: 3, title: "Top Up Wallet", reward: 5000, completed: false, claimed: false, color: "#DBD5FF", buttonColor: "#624FD0", action: "Top Up", logo: <SiSolana /> },
    { id: 4, title: "Play Roshambo 10x", reward: 5000, completed: false, claimed: false, color: "#CAC1B0", buttonColor: "#E35721", action: "Play Now!", logo: null },
    // Add more quests here to test scrolling
  ]);

  const referralCode = user.referralCode;
  const navigate = useNavigate();

  const BOT_TOKEN = "7454958165:AAEZY04lOIKr67_Cq9j23pWntXBApePPjqM";
  const CHAT_ID = "@your_group_username"; // Ganti dengan chat_id yang benar

  const checkTelegramMembership = async () => {
    if (telegram?.initDataUnsafe?.user?.id) {
      try {
        const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember`, {
          params: {
            chat_id: CHAT_ID,
            user_id: telegram.initDataUnsafe.user.id,
          },
        });

        if (response.data.ok && response.data.result.status !== "left") {
          console.log(response.data);
          setQuests(quests.map((quest) => (quest.id === 1 ? { ...quest, completed: true } : quest)));
        }
      } catch (error) {
        console.error("Error checking Telegram membership:", error);
      }
    }
  };

  const toggleQuestCompletion = async (id) => {
    if (id === 1) {
      // Join Telegram Group
      await checkTelegramMembership();
    } else if (id === 2) {
      // Follow on X
      window.open("https://x.com/intent/follow?screen_name=dragoneyesxyz", "_blank");
      setQuests(quests.map((quest) => (quest.id === id ? { ...quest, completed: true } : quest)));
    } else if (id === 4) {
      // Play Now! button
      if (isAuthenticated) {
        navigate("/roshambo_telegram");
      } else {
        navigate("/roshambo");
      }
    } else {
      setQuests(quests.map((quest) => (quest.id === id ? { ...quest, completed: true } : quest)));
    }
  };

  const claimReward = (id) => {
    const quest = quests.find((q) => q.id === id);
    if (quest && quest.completed && !quest.claimed) {
      setQuests(quests.map((quest) => (quest.id === id ? { ...quest, claimed: true } : quest)));
      // Here you would typically call an API to actually claim the reward
      toast.success("Reward claimed successfully!");
    } else {
      toast.error("Cannot claim reward. Make sure the quest is completed and not already claimed.");
    }
  };

  function copyToClipboard(text, type) {
    const copyText = type === "referral" ? `Claim your 0.03 SOL airdrop NOW by opening this Roshambo Telegram App t.me/dragoneyesxyz_bot/roshambo?startapp=${referralCode} before expired!` : text;

    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        const message = type === "referral" ? "Referral message" : `${type} copied`;
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

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleShareClose = () => {
    setIsShareModalOpen(false);
  };

  const shareReferralCode = () => {
    if (telegramUserData) {
      const { first_name, id } = telegramUserData;
      analytics.track("User Shared Referral Code", {
        user_id: id,
        userTG: userName,
        user: { first_name },
        label: "share",
      });
    }
    if (telegram) {
      const tgAppLink = `t.me/dragoneyesxyz_bot/roshambo?startapp=${referralCode}`;
      const message = encodeURIComponent(`Claim your 0.03 SOL airdrop NOW by opening this Roshambo Telegram App ${tgAppLink} before expired!`);
      const url = `https://t.me/share/url?url=${message}`;
      telegram.openTelegramLink(url);
      handleShareClose();
    } else {
      console.log("Telegram WebApp is not available or user is not authenticated");
    }
  };

  // animation related
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

  const itemVariants = (index) => ({
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? -50 : 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  });

  useEffect(() => {
    checkTelegramMembership();
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 "></div>
      <div className="flex justify-center h-full relative z-10 font-passion pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 15 }}
          className="bg-[#282828] rounded-lg shadow-lg p-6 w-full h-full max-w-md flex flex-col"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Quest</h2>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3 overflow-y-auto no-scrollbar flex-grow">
            {/* card invite friends */}
            <motion.div variants={itemVariants(0)} className="bg-[#EFDECA] rounded-lg p-4 flex flex-col justify-between gap-1">
              <div className="flex justify-between items-start">
                <h3 className="text-black text-base font-bold">Invite Friends</h3>
                <div className="flex gap-1">
                  <span className="text-[#E35721]">{Number(10000).toLocaleString()}</span>
                  <span className="bg-gradient-to-r from-[#5100A3] to-[#F76537] text-transparent bg-clip-text font-bold">EYES</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[6px] text-gray-700 font-semibold font-inter">Your friend will get 0.3 SOL airdrop, and you&apos;ll get 10K EYES when they play the game.</p>
                <div className="flex justify-between items-center">
                  <div className="bg-[#FDF8F0] rounded-l-lg p-1 border-2 border-dashed border-[#EA8101] flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="text-[#EA8101] text-sm">{referralCode}</span>
                      <button onClick={() => copyToClipboard(referralCode, "referral")} className="text-[#EA8101]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button onClick={handleShareClick} className="bg-[#D57500] px-3 py-2 text-white text-xs rounded-r-lg flex items-center justify-center gap-1">
                    Share
                    <img src={share_logo} alt="share icon" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
            {/* any other card */}
            {quests.map((quest, index) => (
              <motion.div
                key={quest.id}
                variants={itemVariants(index + 1)}
                style={{
                  backgroundColor: quest.claimed ? "#A1A1A1" : quest.color,
                }}
                className="rounded-lg p-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <h3 className={`${quest.claimed ? "text-[#7c7c7c]" : "text-black text-base font-bold"}`}>{quest.title}</h3>
                  <div className="flex gap-1">
                    <span className={`${quest.claimed ? "text-[#7c7c7c]" : "text-[#E35721]"}`}>{quest.reward.toLocaleString()}</span>
                    <span className={`${quest.claimed ? "text-[#7c7c7c]" : "bg-gradient-to-r from-[#5100A3] to-[#F76537] text-transparent bg-clip-text font-bold"}`}>EYES</span>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => (quest.completed ? claimReward(quest.id) : toggleQuestCompletion(quest.id))}
                    className={`px-3 py-2 text-white text-xs w-[136px] rounded-lg flex items-center justify-center gap-1 ${quest.claimed ? "cursor-not-allowed" : ""}`}
                    style={{
                      backgroundColor: quest.claimed ? "#7C7C7C" : quest.completed ? "#4CAF50" : quest.buttonColor || "#3B82F6",
                    }}
                    disabled={quest.claimed}
                  >
                    {quest.claimed ? "Completed" : quest.completed ? "Claim" : quest.action}
                    {quest.logo && (typeof quest.logo === "string" ? <img src={quest.logo} alt={`${quest.title} icon`} className="w-4 h-4" /> : quest.logo)}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <Wallet3 />
      <ShareReferralModal isOpen={isShareModalOpen} onShare={shareReferralCode} invitesLeft={invitesLeft} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
};

export default Quest;
