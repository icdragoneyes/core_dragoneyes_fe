import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { spinTimeAtom } from "../../store/Atoms";

const CountdownTimer = () => {
  const [spinTime] = useAtom(spinTimeAtom);

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

  return <div>{timerComponents.length ? timerComponents : <span className="text-dark-blue text-sm">Wait for next round...</span>}</div>;
};

export default CountdownTimer;
