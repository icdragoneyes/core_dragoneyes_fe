import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAtom, useSetAtom } from "jotai";
import { isModalHowToPlayOpenAtom, spinGameDataAtom } from "../../store/Atoms";
import CountdownTimer from "./CountdownTimer";
import ModalWinner from "./ModalWinner";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartDonut = React.memo(({ data, chartRef, plugins, options }) => {
  return <Doughnut ref={chartRef} data={data} plugins={plugins} options={options} className="max-h-[400px] max-w-[400px] flex justify-center items-center bg-background-wheel bg-cover" style={{ padding: "22px 20px 20px 20px" }} />;
});

ChartDonut.propTypes = {
  data: PropTypes.object.isRequired,
  chartRef: PropTypes.object.isRequired,
  plugins: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
};
ChartDonut.displayName = 'ChartDonut';

function getMid(min, max) {
  return Math.floor((min + max) / 2);
}

const SpinWheel = ({ players }) => {
  const [spinGameData] = useAtom(spinGameDataAtom);
  const [isModalWinnerVisible, setModalWinnerVisible] = useState(false);
  const [winnerAddress, setWinnerAddress] = useState("");
  const [prizePool, setPrizePool] = useState(0);
  const [weaponPath, setWeaponPath] = useState(`weapon_${1}_${1}.png`);
  const setModalHowToPlayVisible = useSetAtom(isModalHowToPlayOpenAtom);

  const openModalHowToPlay = () => {
    setModalHowToPlayVisible(true);
  };

  const openWinnerModal = () => {
    setModalWinnerVisible(true);
  };

  const closeWinnerModal = () => {
    setModalWinnerVisible(false);
  };

  const chartRef = useRef(null);
  const [chartData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [0],
        hoverOffset: 0,
        rotation: 0,
        backgroundColor: [],
      },
    ],
  });

  const spinPointer = {
    id: "spinPointer",
    // eslint-disable-next-line no-unused-vars
    afterDatasetsDraw(chart, args, plugins) {
      const {
        ctx,
        chartArea: { top },
      } = chart;
      const xCenter = chart.getDatasetMeta(0).data[0].x;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.moveTo(xCenter, top + 30);
      ctx.lineTo(xCenter - 15, top);
      ctx.lineTo(xCenter + 15, top);
      ctx.fill();
    },
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    chart.config.data.datasets[0].cutout = 82;
    chart.config.data.datasets[0].borderWidth = 0;
    chart.config.data.datasets[0].data = [0];
    chart.config.data.datasets[0].backgroundColor = [];
    chart.config.data.datasets[0].rotation = 0;
    chart.clear();

    if (players.length !== 0) {
      chart.config.labels = players.map((player) => player.walletAddress);
      chart.config.data.labels = players.map((player) => {
        let address = player.name;
        return address.length > 30 ? address.slice(0, 30) + "..." : address;
      });

      chart.config.data.datasets[0].label = "Bet Value";
      chart.config.data.datasets[0].data = players.map((player) => player.points);
      chart.config.data.datasets[0].backgroundColor = players.map((player) => player.bg);
    }

    chart.update();
  }, [players]);

  useEffect(() => {
    if (spinGameData && spinGameData.is_spinning && spinGameData.winner !== "") {
      spinWheel(spinGameData.winner);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinGameData]);

  const spinWheel = (winnerAddress) => {
    const chart = chartRef.current;
    const data = chart.config.data.datasets[0].data;
    let winnerIndex = chart.config.labels.indexOf(winnerAddress);
    const valueWinner = data[winnerIndex];
    console.log("valueWinner", valueWinner, "index", chart.config.labels[winnerIndex]);

    let winnerAngle = 0;
    var total = 0;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      total += element;
    }

    let dataNew = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const minAngle = index > 0 ? Math.abs(dataNew[index - 1].maxAngle) : 0;
      const maxAngle = index > 0 ? (element / total) * 360 + Math.abs(dataNew[index - 1].maxAngle) : (element / total) * 360;

      dataNew.push({
        value: element,
        minAngle: minAngle,
        maxAngle: maxAngle,
      });

      if (winnerIndex === index) {
        // eslint-disable-next-line no-undef
        winnerAngle = getMid(dataNew[index].minAngle, dataNew[index].maxAngle);
        console.log("winnerAngle " + winnerAngle);
      }
    }

    let currentRotation = chart.config.data.datasets[0].rotation || 0;
    let finalAngle = 360 - winnerAngle;
    let finalRotation = Math.floor(2 * 3600) + finalAngle; // Simulate multiple rotations
    let rotationSpeed = 20;

    const animateSpin = () => {
      if (finalRotation - currentRotation <= 50) {
        rotationSpeed = 0.1;
      } else if (finalRotation - currentRotation <= 100) {
        rotationSpeed = 0.5;
      } else if (finalRotation - currentRotation <= 400) {
        rotationSpeed = 2;
      } else if (finalRotation - currentRotation <= 900) {
        rotationSpeed = 5;
      }

      currentRotation += rotationSpeed;
      if (currentRotation < finalRotation) {
        chart.config.data.datasets[0].rotation = currentRotation;
        chart.update();
        requestAnimationFrame(animateSpin);
      } else {
        setWinnerAddress(players[winnerIndex].name);
        setPrizePool(total);
        setWeaponPath(players[winnerIndex].weaponPath);
        openWinnerModal();
      }
    };

    animateSpin();
  };


  return (
    <div className="h-full w-full xl:w-1/3 flex flex-col justify-center items-center order-1 xl:order-2 p-4 xl:p-0">
      <div className="xl:hidden bg-primary-gray rounded-lg p-4 mb-2">
        <CountdownTimer />
      </div>
      {chartData ? <ChartDonut data={chartData} chartRef={chartRef} plugins={[spinPointer]} options={options} /> : null}
      <button className="bg-dark-blue p-4 rounded-lg text-white mt-4 text-sm" onClick={openModalHowToPlay}>
        How To Play
      </button>
      {/* <div className='flex items-center justify-center gap-6 my-4 flex-col md:flex-row'>
          <button className='bg-dark-blue py-1.5 px-4 lg:py-2.5 lg:px-4 rounded-lg text-white' onClick={spinWheel}>Spin</button>
          <button className='bg-dark-blue py-1.5 px-4 lg:py-2.5 lg:px-4 rounded-lg text-white' onClick={reset}>RESET</button>
          <button className='bg-dark-blue py-1.5 px-4 lg:py-2.5 lg:px-4 rounded-lg text-white' onClick={openWinnerModal}>Winner Modal</button>
          <button className='bg-dark-blue py-1.5 px-4 lg:py-2.5 lg:px-4 rounded-lg text-white' onClick={handleClick}>History</button>
        </div> */}

      <ModalWinner isVisible={isModalWinnerVisible} onClose={closeWinnerModal} winnerUsername={winnerAddress} prizePool={prizePool} weaponPath={weaponPath} />
    </div>
  );
};

SpinWheel.propTypes = {
  players: PropTypes.array.isRequired,
};

export default SpinWheel;
