import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { betHistoryCardAtom, roshamboLastBetAtom, roshamboNewBetAtom, selectedChainAtom } from "../../store/Atoms";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    console.log(lastBets, "debug last bets global");
  }, [lastBets]);

  const renderBetHistory = (bets, isUserHistory = false) => {
    if (!bets || bets.length === 0) {
      return (
        <div className="grid gap-2 divide-y-[1px] animate-pulse pb-2">
          {[...Array(20)].map((_, index) => (
            <div key={index} className="pt-2 px-3">
              <Skeleton height={20} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="bg-[#282828] bg-opacity-80 rounded-lg overflow-hidden no-scrollbar border-[1px] pb-3 z-10">
        <div className="overflow-y-auto no-scrollbar h-full w-full">
          <div className="grid gap-2 divide-y-[1px]">
            {bets.slice(0, 200).map((bet, id) => (
              <div
                key={isUserHistory ? id : bet[0]}
                className={`flex items-center justify-between bg-opacity-80 pt-2 px-3 text-[10px] text-white font-passion ${isUserHistory ? "" : [Number(bet[1].houseGuess)]} ${!isUserHistory && id === newBet ? "animate-dim" : ""}`}
              >
                <div className="flex gap-1">
                  <span>{isUserHistory ? "You" : `${bet[1]?.caller["__principal__"]?.slice(0, 5)}...${bet[1]?.caller["__principal__"]?.slice(-5)}`}</span>
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
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {betHistoryCard && (
        <motion.div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute w-full h-full bg-black bg-opacity-50" onClick={() => setBetHistoryCard(false)}></div>
          <div className="relative bg-[#282828] rounded-lg overflow-hidden z-10 max-w-md w-[85%] h-[90vh] flex flex-col px-2 pb-3">
            <div className="p-3 flex justify-between items-center">
              <h2 className="text-2xl font-passion text-white">Bet History</h2>
              <button onClick={() => setBetHistoryCard(false)} className="text-red-500 border-[3px] border-red-500 rounded-full">
                <svg className="w-5 h-w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="flex justify-start gap-4 p-2 mb-6 font-passion">
              <button
                onClick={() => setActiveTab("global")}
                className={`flex items-center justify-around px-3 py-2 gap-1 h-[36px] rounded-lg font-normal font-passion ${activeTab === "global" ? "text-white bg-[#9A6220]" : "text-[#BDBDBD] bg-[#515151]"}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                onClick={() => setActiveTab("user")}
                className={`flex items-center justify-around px-3 py-2 gap-1 h-[36px] rounded-lg font-normal font-passion ${activeTab === "user" ? "text-white bg-[#9A6220]" : "text-[#BDBDBD] bg-[#515151]"}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.3333 14V12.6667C13.3333 11.9594 13.0523 11.2811 12.5522 10.781C12.0521 10.281 11.3739 10 10.6667 10H5.33333C4.62609 10 3.94781 10.281 3.44771 10.781C2.94762 11.2811 2.66666 11.9594 2.66666 12.6667V14M10.6667 4.66667C10.6667 6.13943 9.47276 7.33333 8 7.33333C6.52724 7.33333 5.33333 6.13943 5.33333 4.66667C5.33333 3.19391 6.52724 2 8 2C9.47276 2 10.6667 3.19391 10.6667 4.66667Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
                Your History
              </button>
            </div>
            <div className="overflow-y-auto no-scrollbar flex-grow w-full z-10">{activeTab === "global" ? renderBetHistory(lastBets) : renderBetHistory(currentBetsByUserReversed, true)}</div>
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
