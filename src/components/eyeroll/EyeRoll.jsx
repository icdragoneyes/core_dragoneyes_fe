import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
// import CoinAnimation from "./CoinAnimation";
import BottomNavBar from "./BottomNavBar";
import eye from "../../assets/eyeroll/eye-2.jpg";
import eyeWheel from "../../assets/eyeroll/eye-wheel-2.png";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const EyeRoll = () => {
  const [spinning, setSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [result, setResult] = useState(null);
  // const [showCoins, setShowCoins] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [freeSpin, setFreeSpin] = useState(5);
  const [eyesBalance, setEyesBalance] = useState(0);
  const [level, setLevel] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const spinningRef = useRef(false);
  const chartRef = useRef(null);

  const prizes = [1, 10, 50, 100, "Roll 1x", 1, 10, 50, "Roll 1x", 1, 10, 1, "Roll 3x", 1, 10, 1, 1, 10, "Roll 2x", 1];

  const chartData = {
    labels: prizes.map((prize) => (typeof prize === "number" ? `${prize} EYES` : prize)),
    datasets: [
      {
        data: new Array(20).fill(1),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipeDown = distance < -50;

    if (isSwipeDown && !spinning && canSpin && (freeSpin > 0 || eyesBalance >= 10)) {
      setCanSpin(false);
      startSpin();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const startSpin = () => {
    if (spinningRef.current) return;

    if (freeSpin > 0) {
      setFreeSpin(freeSpin - 1);
    } else {
      setEyesBalance(eyesBalance - 10);
    }
    // setShowCoins(false);
    setCanSpin(false);
    setSpinning(true);
    spinningRef.current = true;

    const spinDuration = 5000;
    const spinRotation = 360 * 5 + Math.floor(Math.random() * 360);

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < spinDuration) {
        const progress = elapsedTime / spinDuration;
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentRotation = easeOutCubic * spinRotation;
        setRotation(currentRotation);
        requestAnimationFrame(animate);
      } else {
        const finalRotation = spinRotation % 360;
        setRotation(finalRotation);
        setSpinning(false);
        spinningRef.current = false;

        const segmentIndex = Math.floor((360 - finalRotation) / 18) % 20;
        const prize = prizes[segmentIndex];
        setResult(prize);
        setTimeout(() => {
          setShowModal(true);
        }, 1000);

        if (typeof prize === "number") {
          setEyesBalance((prevBalance) => {
            const newBalance = prevBalance + prize;
            updateLevel(newBalance);
            return newBalance;
          });
        } else if (prize.startsWith("Roll")) {
          const freeSpins = parseInt(prize.split(" ")[1].replace("x", ""));
          setFreeSpin((prevFreeSpin) => prevFreeSpin + freeSpins);
        }
        // setShowCoins(true);
        setCanSpin(true);
      }
    };

    requestAnimationFrame(animate);
  };

  const levelNames = ["Squire", "Apprentice", "Journeyman", "Footman", "Shieldbearer", "Knight", "Dragonslayer", "Champion", "Warlord", "Dragonmaster", "High Templar", "Lord Commander", "Dragon Lord", "Elder Wyrm", "Dragon King"];

  const updateLevel = (balance) => {
    const basePoints = 5000;
    let newLevel = 0;
    while (balance > basePoints * Math.pow(2, newLevel) && newLevel < 14) {
      newLevel++;
    }
    setLevel(newLevel);
  };

  const calculateProgress = () => {
    const thresholds = [0, 5000, 20000, 80000, 320000, 1280000, 5120000, 20480000, 81920000, 327680000, 1310720000, 5242880000, 20971520000, 83886080000, 335544320000, 1342177280000];

    const currentLevelThreshold = thresholds[level];
    const nextLevelThreshold = thresholds[level + 1];

    if (eyesBalance >= nextLevelThreshold) {
      return 100;
    }

    const progress = ((eyesBalance - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
    updateLevel(eyesBalance);
  }, [result, eyesBalance, rotation]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col bg-gray-800 items-center justify-start p-4 overflow-y-auto">
      <img src={eye} alt="Eye background" className="absolute top-0 left-0 w-full h-full object-center" />
      {/* stat card */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 mb-8 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Dragon Eyes Roll</h2>
            <p className="text-sm text-gray-400">Spin to win EYES tokens!</p>
          </div>
          <div className="flex pt-4 flex-col justify-center items-center">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full">
              <span className="font-bold">Level {level + 1}</span>
            </div>
            <p className="text-white text-sm mt-1">{levelNames[level]}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-white">
            <p className="text-sm">Balance</p>
            <p className="text-xl font-bold">{eyesBalance.toLocaleString()} EYES</p>
          </div>
          <div className="text-white text-center">
            <p className="text-sm">Free Spins</p>
            <p className="text-2xl font-bold">{freeSpin}</p>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
          <motion.div className="bg-blue-600 h-2.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${calculateProgress()}%` }} transition={{ duration: 0.5 }} />
        </div>
        <p className="text-white text-xs mt-1">
          Progress to be {level < 14 ? levelNames[level + 1] : "Max Level"}: {calculateProgress().toFixed(2)}%
        </p>
      </div>
      {/* eye roll */}
      <div className="w-80 h-80 relative overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <img src={eyeWheel} style={{ backgroundImage: `url(${eyeWheel})`, backgroundPosition: "center" }} className="absolute top-0 left-0 w-full h-full object-cover bg-no-repeat" />
        <div className="w-full h-full flex items-center justify-center z-10" style={{ transform: `rotate(${rotation}deg)` }}>
          <Doughnut
            ref={chartRef}
            data={chartData}
            options={{
              cutout: "70%",
              rotation: 0,
              circumference: 360,
              responsive: true,
              maintainAspectRatio: true,
              animation: false,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                datalabels: {
                  color: "#FFFFFF",
                  formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                  font: { weight: "bold", size: 8 },
                  offset: -3,
                  rotation: (context) => {
                    const angle = (context.dataIndex * 18 * Math.PI) / 180;
                    return angle * (180 / Math.PI) + 98;
                  },
                },
              },
            }}
          />
        </div>
        {/* jarum penunjuk */}
        <div className="absolute top-0 left-1/2 w-1 h-8 bg-red-500 transform -translate-x-1/2"></div>
      </div>
      {/* Coin Animation
      <AnimatePresence>{showCoins && <CoinAnimation />}</AnimatePresence> */}
      {/* Result Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-2xl shadow-2xl p-6 text-center w-[90%] max-w-[350px]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.h2 className="text-4xl font-bold mb-6 text-white font-passion" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                You Won!
              </motion.h2>
              <motion.div className="bg-white rounded-full p-8 mb-6" initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 10, delay: 0.3 }}>
                {typeof result === "number" ? (
                  <p className="text-5xl font-bold text-slate-800">
                    {result} <span className="text-3xl">EYES</span>
                  </p>
                ) : (
                  <p className="text-4xl font-bold text-slate-800">{result}</p>
                )}
              </motion.div>
              <motion.p className="text-white text-xl mb-8 font-passion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {typeof result === "number" ? "Congratulations on your win!" : "Enjoy your free spins!"}
              </motion.p>
              <motion.button
                className="bg-blue-500 text-white text-xl font-semibold px-8 py-3 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-passion"
                onClick={() => setShowModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                CONTINUE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Spin Button */}
      <button
        className={`z-10 mt-6 px-8 py-3 rounded-full text-white font-bold text-lg transition-all duration-300 ${
          (freeSpin > 0 || eyesBalance >= 10) && canSpin ? "bg-blue-500 hover:bg-blue-600 transform hover:scale-105" : "bg-gray-500 cursor-not-allowed"
        }`}
        onClick={startSpin}
        disabled={!(freeSpin > 0 || eyesBalance >= 10) || !canSpin}
      >
        {freeSpin > 0 ? "Use Free Spin" : "Spin (10 EYES)"}
      </button>
      <small className="mt-4 text-slate-100 text-xs z-10">or you can swipe down the wheel</small>
      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default EyeRoll;
