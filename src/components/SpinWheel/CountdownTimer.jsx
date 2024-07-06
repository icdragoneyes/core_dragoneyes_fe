import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { isSpinningAtom, spinTimeAtom } from "../../store/Atoms";

const CountdownTimer = () => {
  const [spinTime] = useAtom(spinTimeAtom);
  const [isSpinning] = useAtom(isSpinningAtom);

  const calculateTimeLeft = () => {
    const difference = Number(spinTime) - new Date().getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 100);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval} className="mr-1 text-dark-blue text-sm">
        {timeLeft[interval]} {interval}
        {""}
      </span>
    );
  });

  if (isSpinning) {
    return <div className="text-dark-blue text-sm">Wait for next round...</div>
  }

  if (timerComponents.length) {
    return <div>{timerComponents}</div>
  } else {
    return <div className="text-dark-blue text-sm">Spinning the wheel...</div>
  }
};

export default CountdownTimer;
