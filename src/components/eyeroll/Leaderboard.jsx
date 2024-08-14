import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavBar from "./BottomNavBar";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data based on activeTab
    // This is a placeholder, replace with actual API call
    const fetchData = async () => {
      const data =
        activeTab === "global"
          ? [
              { rank: 1, name: "DragonMaster", score: 100000 },
              { rank: 2, name: "EyeRoller", score: 95000 },
              { rank: 3, name: "TokenChamp", score: 90000 },
            ]
          : [
              { rank: 1, name: "Friend1", score: 85000 },
              { rank: 2, name: "Friend2", score: 80000 },
              { rank: 3, name: "Friend3", score: 75000 },
            ];
      setLeaderboardData(data);
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-start p-4 bg-gray-900 overflow-hidden">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Leaderboard</h2>

        <div className="flex mb-4">
          <button className={`flex-1 py-2 ${activeTab === "global" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"} rounded-l-lg`} onClick={() => setActiveTab("global")}>
            Global
          </button>
          <button className={`flex-1 py-2 ${activeTab === "friends" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"} rounded-r-lg`} onClick={() => setActiveTab("friends")}>
            Friends
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {leaderboardData.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg mb-2">
                <div className="flex items-center">
                  <span className="text-white font-bold mr-3">{item.rank}</span>
                  <span className="text-white">{item.name}</span>
                </div>
                <span className="text-blue-400 font-bold">{item.score.toLocaleString()} EYES</span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default Leaderboard;
