import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSpring, animated } from "@react-spring/web";
import { random } from "lodash";
import ChartDataLabels from "chartjs-plugin-datalabels";
import CoinAnimation from "./CoinAnimation";
import DragonEye from "./DragonEye";
import BottomNavBar from "./BottomNavBar";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const EyeRoll = () => {
  const [spinning, setSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [result, setResult] = useState(null);
  const [showCoins, setShowCoins] = useState(false);
  const [totalRotation, setTotalRotation] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [eyeState, setEyeState] = useState("center");
  const [freeSpin, setFreeSpin] = useState(5);
  const [eyesBalance, setEyesBalance] = useState(0);
  const [level, setLevel] = useState(0);
  const spinRef = useRef(null);
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

  // eslint-disable-next-line no-unused-vars
  const [{ rotate }, api] = useSpring(() => ({ rotate: 0 }));

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

    setCanSpin(false);
    setEyeState("side");

    // Adjust this to ensure rotation always ends in the middle of a segment
    const randomRotation = random(720, 1440);
    const duration = 5000;
    const newTotalRotation = totalRotation + randomRotation;
    setTotalRotation(newTotalRotation);

    api.start({
      from: { rotate: totalRotation },
      to: { rotate: newTotalRotation },
      config: {
        duration: duration,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      },
      onStart: () => {
        setSpinning(true);
        spinningRef.current = true;
        setEyeState("spinning");
      },
      onRest: () => {
        setSpinning(false);
        spinningRef.current = false;
        const finalAngle = newTotalRotation % 360;
        console.log("Final Angle:", finalAngle);

        const segmentIndex = Math.floor(finalAngle / 18) % 20;
        console.log("Segment Index:", segmentIndex);

        const prize = prizes[segmentIndex];
        console.log("Prize:", prize);

        setResult(prize);
        setEyeState("center");
        blink();

        // Update balance based on the prize
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
        setCanSpin(true);
      },
    });
  };

  const blink = () => {
    setShowCoins(false);
    setTimeout(() => {
      if (spinRef.current) {
        spinRef.current.style.transform = "scaleY(0.1)";
        setTimeout(() => {
          if (spinRef.current) {
            spinRef.current.style.transform = "scaleY(1)";
            setShowCoins(true);
          }
        }, 150);
      }
    }, 500);
  };

  const updateLevel = (balance) => {
    const basePoints = 5000;
    let newLevel = 0;
    while (balance > basePoints * Math.pow(4, newLevel) && newLevel < 9) {
      newLevel++;
    }
    setLevel(newLevel);
  };

  const calculateProgress = () => {
    const thresholds = [0, 5000, 20000, 80000, 320000, 1280000, 5120000, 20480000, 81920000, 327680000, 1310720000];

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
  }, [result, eyesBalance]);

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-start p-4">
      {/* stat card */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Dragon Eyes Roll</h2>
            <p className="text-sm text-gray-400">Spin to win EYES tokens!</p>
          </div>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full">
            <span className="font-bold">Level {level}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-white">
            <p className="text-sm">Balance</p>
            <p className="text-2xl font-bold">{eyesBalance} EYES</p>
          </div>
          <div className="text-white text-center">
            <p className="text-sm">Free Spins</p>
            <p className="text-2xl font-bold">{freeSpin}</p>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
          <motion.div className="bg-blue-600 h-2.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${calculateProgress()}%` }} transition={{ duration: 0.5 }} />
        </div>
        <p className="text-white text-xs mt-1">Progress to next level: {calculateProgress().toFixed(2)}%</p>
      </div>
      {/* eye roll */}
      <div className="w-80 h-80 relative" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {/* eye component */}
        <motion.div ref={spinRef} className="w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-transform duration-150">
          <animated.div style={{ rotate }} className="w-full h-full absolute">
            <DragonEye eyeState={eyeState} rotation={rotate} />
          </animated.div>
        </motion.div>
        {/* pie chart component */}
        <div className="w-full h-full absolute top-0 left-0 pointer-events-none">
          <Doughnut
            ref={chartRef}
            data={chartData}
            options={{
              cutout: "70%",
              elements: {
                arc: {
                  borderWidth: 0,
                },
              },
              animation: false,
              rotation: +135, // Adjust this to align segments properly
              circumference: 360,
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: { enabled: false },
                datalabels: {
                  color: "#FFFFFF",
                  formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                  font: {
                    weight: "bold",
                    size: 10,
                  },
                  anchor: "center",
                  align: "center",
                  offset: 10,
                  rotation: (context) => {
                    const angle = (context.dataIndex * 18 * Math.PI) / 180;
                    return angle * (180 / Math.PI) - 125;
                  },
                  textAlign: "center",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Coin Animation */}
      <AnimatePresence>{showCoins && <CoinAnimation />}</AnimatePresence>

      {/* Result */}
      <div className="mt-8 text-white text-2xl font-bold">
        {result !== null && (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            Result: {typeof result === "number" ? `${result} EYES` : result}
          </motion.div>
        )}
      </div>

      {/* Spin Button */}
      <button
        className={`mt-6 px-8 py-3 rounded-full text-white font-bold text-lg transition-all duration-300 ${
          (freeSpin > 0 || eyesBalance >= 10) && canSpin ? "bg-blue-500 hover:bg-blue-600 transform hover:scale-105" : "bg-gray-500 cursor-not-allowed"
        }`}
        onClick={startSpin}
        disabled={!(freeSpin > 0 || eyesBalance >= 10) || !canSpin}
      >
        {freeSpin > 0 ? "Use Free Spin" : "Spin (10 EYES)"}
      </button>
      <small className="mt-4 text-gray-400 text-xs">or you can swipe down the wheel</small>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default EyeRoll;
