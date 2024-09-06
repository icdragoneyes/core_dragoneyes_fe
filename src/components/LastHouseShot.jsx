import { useAtom } from "jotai";
import useWebSocket from "react-use-websocket";
import { isAuthenticatedAtom, roshamboLastBetAtom, roshamboNewBetAtom, telegramUserDataAtom } from "../store/Atoms";
import { useEffect, useState } from "react";
import logo from "../assets/img/logo.png";
import HowToPlay from "./Roshambo/HowToPlay";

const LastHouseShot = () => {
  const [lastBets, setLastBet] = useAtom(roshamboLastBetAtom);
  const [newbet, setNewbet] = useAtom(roshamboNewBetAtom);
  const [startCountdown, setStartCountdown] = useState(false);
  const [count, setCount] = useState(10);
  const [percent, setPercent] = useState([0, 0, 0]);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);

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
      <div className="sticky top-0 z-20 bg-[#282828] h-[76px] py-1 w-full flex md:px-6 p-2 items-center justify-center shadow-md">
        <div className="text-white w-[25%] md:text-md text-[10px] text-center font-bold font-passion flex justify-center items-center">
          <img src={logo} alt="Roshambo Logo" className="h-10 md:h-16" />
          LAST HOUSE SHOTS
          {lastBets && lastBets.length > 0 ? (
            <div className="w-[70%]  ml-2 text-base text-black hidden md:flex">
              <div className={`bg-[#b4b4b4] flex items-center justify-center text-center rounded-l-lg px-2 `} style={{ width: `${percent[0]}%` }}>
                R({percent[0]})%
              </div>{" "}
              <div className={`bg-[#24c31e] flex items-center justify-center text-center px-2`} style={{ width: `${percent[0]}%` }}>
                P({percent[1]}%)
              </div>{" "}
              <div className={`bg-[#ffc905] flex items-center justify-center text-center rounded-r-lg px-2 `} style={{ width: `${percent[0]}%` }}>
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
                    className={`flex w-[20px] h-[20px] ${["", "bg-[#b4b4b4]", "bg-[#24c31e]", "bg-[#ffc905]"][Number(index[1].houseGuess)]} ${startCountdown && id < newbet ? "shadow-lg animate-spin mt-3 border-white border-2" : ""} ${
                      id < newbet ? "animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.7)]" : ""
                    } ${id === newbet ? "animate-pulse" : ""} rounded-full p-1 shadow-lg transform hover:scale-110 transition-transform duration-200 mx-1 items-center justify-center text-center`}
                  >
                    <div className="text-black font-passion text-base items-center justify-center text-center flex">{["", "R", "P", "S"][Number(index[1].houseGuess)]}</div>
                  </div>
                ))}
              </div>{" "}
              <div className="w-full max-w-[16.25rem] flex mt-2 md:hidden">
                <div className="bg-[#b4b4b4] h-[6px]" style={{ width: `${percent[0]}%` }}></div>
                <div className="bg-[#24c31e] h-[6px]" style={{ width: `${percent[1]}%` }}></div>
                <div className="bg-[#ffc905] h-[6px]" style={{ width: `${percent[2]}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="text-white text-lg italic">Loading last shots data</div>
          )}
        </div>
      </div>
      {telegramUserData && !isAuthenticated && (
        <button onClick={() => setIsHowToPlayOpen(true)} className="w-32 absolute left-1/2 transform -translate-x-1/2 top-[70px] z-10 bg-orange-500 text-white py-2 rounded-b-md font-bold text-sm">
          How to Play
        </button>
      )}

      <HowToPlay isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
    </>
  );
};

export default LastHouseShot;
