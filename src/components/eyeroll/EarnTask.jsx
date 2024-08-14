import { useCallback, useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import BottomNavBar from "./BottomNavBar";
import { FaTwitter, FaUserPlus, FaHandRock, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const EarnTask = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimedDays, setClaimedDays] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const modalTransition = useTransition(isModalOpen, {
    from: { transform: "translateY(100%)", opacity: 0 },
    enter: { transform: "translateY(0%)", opacity: 1 },
    leave: { transform: "translateY(100%)", opacity: 0 },
    config: { tension: 300, friction: 30 },
  });

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isDownSwipe = distance < -50;
    if (isDownSwipe) {
      closeModal();
    }
  };

  const handleQuestClick = (quest) => {
    console.log(`Clicked on quest: ${quest.title}`);
  };

  const handleClaim = (day) => {
    if (!claimedDays.includes(day)) {
      setClaimedDays([...claimedDays, day]);
      // Logic to add reward to user's account
    }
  };

  const rewards = Array.from({ length: 10 }, (_, i) => ({
    day: i + 1,
    reward: (i + 1) * 10, // Example reward calculation
  }));

  const quests = [
    { icon: <FaUserPlus />, title: "Refer a Friend", reward: "50 EYES", action: "Invite" },
    { icon: <FaTwitter />, title: "Follow Us on X", reward: "30 EYES", action: "Follow" },
    { icon: <FaHandRock />, title: "Challenge Friends to Roshambo", reward: "20 EYES", action: "Challange" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-start p-4 pb-16 text-white overflow-y-auto">
      <h1 className="text-3xl font-bold mb-4 mt-6">Quest</h1>
      <p className="text-lg mb-8">Complete tasks and earn more EYES!</p>

      <AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Daily Tasks</h2>

          <div className="mb-4">
            <h3 className="text-xl font-semibold">Daily Check-in</h3>
            <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center mt-4">
              <span className="text-lg font-semibold mb-2">Check-in to earn rewards</span>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 transition duration-300 ease-in-out transform hover:scale-105" onClick={() => setIsModalOpen(true)}>
                Check-in
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: 0.1 }} className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">Quests</h2>
          {quests.map((quest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-700 p-4 rounded-lg shadow-md flex items-center justify-between mb-4 cursor-pointer hover:bg-gray-600 transition-colors duration-300"
              onClick={() => handleQuestClick(quest)}
            >
              <div className="flex items-center">
                <div className="text-xl mr-2">{quest.icon}</div>
                <div>
                  <h3 className="text-md font-semibold">{quest.title}</h3>
                  <p className="text-sm text-gray-300">Reward: {quest.reward}</p>
                </div>
              </div>
              <FaChevronRight className="text-gray-400" />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <BottomNavBar />

      {modalTransition(
        (styles, item) =>
          item && (
            <div className="fixed inset-0 flex items-end justify-center text-white bg-black bg-opacity-50">
              <animated.div style={styles} className="w-full max-w-md bg-gray-800 p-6 pt-0 rounded-t-lg shadow-md max-h-[65%] overflow-y-auto" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <div className="sticky top-0 z-10 bg-gray-800">
                  <div className="flex justify-center items-center h-10">
                    <div className="w-1/3 h-1 bg-white cursor-pointer" onClick={closeModal}></div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-4 text-center py-6">Daily Check-in Rewards</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {rewards.map(({ day, reward }) => (
                    <div key={day} className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
                      <span className="text-lg font-semibold mb-2">Day {day}</span>
                      <span className="text-sm mb-4">{reward} EYES</span>
                      <button
                        className={`py-2 px-4 rounded w-24 h-10 ${
                          claimedDays.includes(day) ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
                        } text-white font-bold transition duration-300 ease-in-out transform hover:scale-105`}
                        onClick={() => handleClaim(day)}
                        disabled={claimedDays.includes(day)}
                      >
                        {claimedDays.includes(day) ? "Claimed" : "Claim"}
                      </button>
                    </div>
                  ))}
                </div>
              </animated.div>
            </div>
          )
      )}
    </div>
  );
};

export default EarnTask;
