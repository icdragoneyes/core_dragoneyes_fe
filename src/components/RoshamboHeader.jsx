import { useAtom, useSetAtom } from "jotai";
import useWebSocket from "react-use-websocket";
import PropTypes from "prop-types";
import {
  betHistoryCardAtom,
  isAuthenticatedAtom,
  isLoggedInAtom,
  isModalHowToPlayOpenAtom,
  liveNotificationAtom,
  roshamboLastBetAtom,
  roshamboNewBetAtom,
  telegramUserDataAtom,
  roshamboActorAtom,
  coreAtom,
  questAtom,
  commissionAtom,
  userAtom,
} from "../store/Atoms";
import { useCallback, useEffect, useState } from "react";
import logo from "../assets/img/logo.png";
import HowToPlay from "./Roshambo/HowToPlay";
import analytics from "../utils/segment";
import axios from "axios";
import { IoRefresh } from "react-icons/io5";
import { useLocation } from "react-router-dom";

const RoshamboHeader = ({ hideHowToPlay }) => {
  const [lastBets, setLastBet] = useAtom(roshamboLastBetAtom);
  const setNewbet = useSetAtom(roshamboNewBetAtom);
  const [startCountdown, setStartCountdown] = useState(false);
  const [count, setCount] = useState(10);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useAtom(
    isModalHowToPlayOpenAtom
  );
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const setLiveNotification = useSetAtom(liveNotificationAtom);
  const [betHistoryCard, setBetHistoryCard] = useAtom(betHistoryCardAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);
  const [user] = useAtom(userAtom);
  const [roshamboAgent] = useAtom(roshamboActorAtom);
  const [coreAgent] = useAtom(coreAtom);
  const setQuestData = useSetAtom(questAtom);
  const setCommissionData = useSetAtom(commissionAtom);
  const [refreshLabel, setRL] = useState("Refresh");
  const location = useLocation();

  const handleRefresh = async () => {
    setRL("Refreshing...");
    console.log("fetching quest...");
    var a = await coreAgent.getQuestData();
    //console.log(a, "<<<<<<< q");
    setQuestData(a);
    try {
      var b = await roshamboAgent.getCommissionData();
      setCommissionData(b);
    } catch (e) {
      //
    }
    setRL("Refresh");
  };

  const updateGameData = useCallback(
    (data) => {
      const sorted = sortLastBets(data.lastbets);
      setLastBet(sorted);
      setNewbet(Number(data.newbets));
      if (JSON.stringify(sorted) !== JSON.stringify(lastBets)) {
        setLiveNotification(true);
      }
    },
    [lastBets, setLastBet, setNewbet, setLiveNotification]
  );

  const sortLastBets = (lastbets) => {
    return lastbets.sort((a, b) => {
      const numA = Number(a[0]);
      const numB = Number(b[0]);
      if (isNaN(numA) && isNaN(numB)) return 0;
      if (isNaN(numA)) return 1;
      if (isNaN(numB)) return -1;
      return numB - numA;
    });
  };

  useWebSocket("wss://api.dragoneyes.xyz:7788/roshamboLastBet", {
    onMessage: async (event) => {
      const eventData = JSON.parse(event.data);
      const data = isAuthenticated ? eventData.SOL : eventData.ICP;
      updateGameData(data);
      setStartCountdown(true);
      setCount(2);
    },
    shouldReconnect: () => true,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(
          "https://api.dragoneyes.xyz/roshambo/lastbet"
        );
        const data = isAuthenticated
          ? response.data.data.SOL
          : response.data.data.ICP;
        updateGameData(data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        analytics.track("Error Fetching Initial Data", {
          user_id: telegramUserData?.id,
          name: telegramUserData?.first_name,
          game_name: user?.userName,
          category: "Error",
          label: "Error Fetching Initial Data",
          error: error,
        });
      }
    };

    fetchInitialData();
  }, []);

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
      <div className="sticky top-0 z-20 bg-[#131313ED] h-[76px] w-full flex items-center justify-between px-3">
        <img src={logo} alt="Roshambo Logo" className="h-14" />
        {isLoggedIn && !hideHowToPlay && (
          <div className="flex items-center justify-center divide-x-2 font-passion w-48 z-10 bg-[#E35721] text-white py-2 rounded-full text-xs">
            <button
              onClick={() => {
                setIsHowToPlayOpen(true);
                analytics.track("User Click How To Play", {
                  userId: telegramUserData?.id,
                  name: telegramUserData?.first_name,
                  game_name: user?.userName || "user is from desktop",
                });
              }}
              className="px-3 pr-5"
            >
              How to Play
            </button>
            <button
              onClick={() => {
                setBetHistoryCard(!betHistoryCard);
                analytics.track("User Click History", {
                  userId: telegramUserData?.id,
                  name: telegramUserData?.first_name,
                  game_name: user?.userName || "user is from desktop",
                });
              }}
              className="px-3 pl-5"
            >
              Bet History
            </button>
          </div>
        )}
        {/* Refresh Button */}
        {location.pathname === "/eyeroll/quest" && (
          <button
            to="/eyeroll/quest"
            className="bg-[#1C368F] font-passion text-xs flex justify-center items-center gap-1 text-white p-2 px-3 rounded-full hover:bg-[#152a6d] transition-colors duration-200"
            onClick={handleRefresh}
          >
            {refreshLabel}
            <IoRefresh className="w-3 h-3" />
          </button>
        )}
      </div>

      <HowToPlay
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </>
  );
};

export default RoshamboHeader;

RoshamboHeader.defaultProps = {
  hideHowToPlay: false,
};

RoshamboHeader.propTypes = {
  hideHowToPlay: PropTypes.bool,
};
