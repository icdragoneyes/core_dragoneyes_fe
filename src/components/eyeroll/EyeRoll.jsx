import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSpring, animated } from "@react-spring/web";
import { random } from "lodash";
import ChartDataLabels from "chartjs-plugin-datalabels";
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
  const spinRef = useRef(null);
  const spinningRef = useRef(false);

  // eslint-disable-next-line no-unused-vars
  const [chartData, setChartData] = useState({
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    datasets: [
      {
        data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
        hoverOffset: 4,
      },
    ],
  });
  const chartRef = useRef(null);

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

    if (isSwipeDown && !spinning && canSpin) {
      setCanSpin(false);
      startSpin();

      setTimeout(() => {
        setCanSpin(true);
      }, 1000);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const startSpin = () => {
    if (spinningRef.current) return;

    setCanSpin(false);
    setEyeState("side");

    const randomRotation = random(720, 1440);
    const duration = 5000;

    console.log("Starting rotation:", randomRotation);

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
        setEyeState("spinning");
      },
      onRest: () => {
        setSpinning(false);
        spinningRef.current = false;
        const finalAngle = newTotalRotation % 360;

        const segmentIndex = Math.floor(finalAngle / 30);
        const pointedValue = ((parseInt(chartData.labels[segmentIndex]) - 1 + 3) % 12) + 1;

        setResult(pointedValue);
        setEyeState("center");
        blink();
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

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [result]);

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="w-80 h-80 relative" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <motion.div ref={spinRef} className="w-full h-full  rounded-full flex items-center justify-center overflow-hidden transition-transform duration-150">
          <animated.div style={{ rotate }} className="w-full h-full absolute">
            <DragonEye eyeState={eyeState} />
          </animated.div>
        </motion.div>
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
              rotation: 0,
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
                    size: 16,
                  },
                  anchor: "center",
                  align: "center",
                  offset: 0,
                },
              },
            }}
          />
        </div>
      </div>

      <AnimatePresence>{showCoins && <CoinAnimation />}</AnimatePresence>

      <div className="mt-8 text-white text-2xl font-bold">Result: {result}</div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const DragonEye = ({ eyeState }) => {
  const pupilPosition = {
    center: { top: "50%", left: "50%" },
    side: { top: "50%", left: "75%" },
    spinning: { top: "50%", left: "75%", animation: "spin 0.5s linear infinite" },
  };

  return (
    <div className="w-full h-full relative rounded-full overflow-hidden">
      {/* sclera */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle, #ff9900 0%, #ff6600 100%)",
        }}
      ></div>
      {/* pupil */}
      <div
        className="absolute w-1/5 h-1/5 bg-black rounded-full transition-all duration-300"
        style={{
          top: pupilPosition[eyeState].top,
          left: pupilPosition[eyeState].left,
          transform: "translate(-50%, -50%)",
          animation: pupilPosition[eyeState].animation,
        }}
      >
        {/* highlight pupil */}
        <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

const CoinAnimation = () => {
  const coinCount = 30;
  const duration = 1;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(coinCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold"
          initial={{
            bottom: `${random(-10, -5)}%`,
            left: `${random(0, 100)}%`,
            rotate: random(-180, 180),
            scale: random(0.5, 1.5),
          }}
          animate={{
            bottom: ["0%", "50%", "100%"],
            left: [null, "50%"],
            rotate: [null, 0],
            scale: [null, 1, 0],
          }}
          transition={{
            duration: duration,
            ease: "easeOut",
            times: [0, 0.7, 1],
          }}
        >
          $
        </motion.div>
      ))}
    </div>
  );
};

export default EyeRoll;
