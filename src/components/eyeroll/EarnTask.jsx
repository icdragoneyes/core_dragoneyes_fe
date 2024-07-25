import { useCallback, useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import BottomNavBar from "./BottomNavBar";

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
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart && touchEnd && touchStart - touchEnd < -50) {
      closeModal();
    }
    setTouchStart(null);
    setTouchEnd(null);
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

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-start p-4 text-white">
      <h1 className="text-3xl font-bold mb-4 mt-6">Earn</h1>
      <p className="text-lg mb-8">Complete tasks and earn rewards!</p>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
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
      </div>

      <BottomNavBar />

      {modalTransition(
        (styles, item) =>
          item && (
            <div className="fixed inset-0 flex items-end justify-center text-white bg-black bg-opacity-50">
              <animated.div style={styles} className="w-full max-w-md bg-gray-800 p-6 pt-0 rounded-t-lg shadow-md max-h-[65%] overflow-y-auto">
                <div className="sticky top-0 z-10 bg-gray-800">
                  <div className="flex justify-center items-center h-10">
                    <div className="w-1/3 h-1 bg-white cursor-pointer" onClick={closeModal} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}></div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-4 text-center py-6">Daily Check-in Rewards</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {rewards.map(({ day, reward }) => (
                    <div key={day} className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
                      <span className="text-lg font-semibold mb-2">Day {day}</span>
                      <span className="text-sm mb-4">{reward} EYES</span>
                      <button
                        className={`py-1 px-3 rounded ${claimedDays.includes(day) ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"} text-white font-bold transition duration-300 ease-in-out transform hover:scale-105`}
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
