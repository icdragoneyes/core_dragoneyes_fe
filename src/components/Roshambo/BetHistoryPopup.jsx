import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { betHistoryCardAtom, roshamboLastBetAtom, roshamboNewBetAtom, selectedChainAtom } from "../../store/Atoms";
import { useState } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// eslint-disable-next-line no-unused-vars
const BetHistoryPopup = ({ currentBetByUser }) => {
  const [betHistoryCard, setBetHistoryCard] = useAtom(betHistoryCardAtom);
  const [lastBets] = useAtom(roshamboLastBetAtom);
  const [newBet] = useAtom(roshamboNewBetAtom);
  const [activeTab, setActiveTab] = useState("global");
  const [chain] = useAtom(selectedChainAtom);

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

  // function to reverse array of currentBetByUser
  const currentBetsByUserReversed = currentBetByUser.slice().reverse();

  const renderBetHistory = (bets, isUserHistory = false) => {
    if (!bets || bets.length === 0) {
      return (
        <div className="grid gap-2 divide-y-[1px] divide-[#FFF4BC] animate-pulse pb-2">
          {[...Array(20)].map((_, index) => (
            <div key={index} className="pt-2 px-3">
              <Skeleton height={20} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="grid gap-2 divide-y-[1px] divide-[#FFF4BC] pb-2">
        {bets.slice(0, 200).map((bet, id) => (
          <div
            key={isUserHistory ? id : bet[0]}
            className={`flex items-center justify-between bg-opacity-80 pt-2 px-3 text-[10px] text-white font-passion ${isUserHistory ? "" : [Number(bet[1].houseGuess)]} ${!isUserHistory && id === newBet ? "animate-dim" : ""}`}
          >
            <div className="flex gap-1">
              <span>
                {isUserHistory
                  ? "You"
                  : `${isUserHistory ? bet?.caller?.toText()?.slice(0, 5) : bet[1]?.caller["__principal__"]?.slice(0, 5)}...${isUserHistory ? bet?.caller?.toText()?.slice(-5) : bet[1]?.caller["__principal__"]?.slice(-5)}`}
              </span>
              <span>
                bet {((isUserHistory ? Number(bet?.betAmount) : bet[1]?.betAmount) / 1e8)?.toFixed(2)} {chain?.name?.toUpperCase()},
              </span>
              <span>threw {isUserHistory ? (Number(bet?.guess) === 1 ? "Rock" : Number(bet?.guess) === 2 ? "Paper" : "Scissors") : bet[1]?.guess == 1 ? "Rock" : bet[1]?.guess == 2 ? "Paper" : "Scissors"}</span>
              <span> and</span>
              <span className={(isUserHistory ? bet?.result : bet[1]?.result) === "draw" ? "text-yellow-300" : (isUserHistory ? bet?.result : bet[1]?.result) === "win" ? "text-green-500" : "text-red-500"}>
                {(isUserHistory ? bet?.result : bet[1]?.result) === "draw" ? "draw" : (isUserHistory ? bet?.result : bet[1]?.result) === "win" ? "doubled" : "rekt"}
              </span>
            </div>
            <div>
              <span>{timeElapsedSinceTimestamp(Number(isUserHistory ? bet?.time_created : bet[1]?.time_created))}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {betHistoryCard && (
        <motion.div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute w-full h-full bg-black bg-opacity-50" onClick={() => setBetHistoryCard(false)}></div>
          <div className="relative bg-[#282828] rounded-lg overflow-hidden border-[1px] border-[#FFF4BC] z-10 max-w-md w-[85%] h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[#FFF4BC] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Bet History</h2>
              <button className="text-white hover:text-gray-300" onClick={() => setBetHistoryCard(false)}>
                &#x2715;
              </button>
            </div>
            <div className="flex justify-around border-b border-[#FFF4BC]">
              <button className={`py-2 px-4 ${activeTab === "global" ? "bg-[#FFF4BC] text-black" : "text-white"}`} onClick={() => setActiveTab("global")}>
                Global History
              </button>
              <button className={`py-2 px-4 ${activeTab === "user" ? "bg-[#FFF4BC] text-black" : "text-white"}`} onClick={() => setActiveTab("user")}>
                Your History
              </button>
            </div>
            <div className="overflow-y-auto no-scrollbar flex-grow w-full">{activeTab === "global" ? renderBetHistory(lastBets) : renderBetHistory(currentBetsByUserReversed, true)}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

BetHistoryPopup.propTypes = {
  currentBetByUser: PropTypes.object,
};

export default BetHistoryPopup;
