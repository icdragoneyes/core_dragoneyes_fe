import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const CountdownTimer = ({ spinTime, roundEnd }) => {
  const [isRoundEnd, setisRoundEnd] = useState(false);
  const calculateTimeLeft = () => {
    const difference = spinTime - new Date().getTime();
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
      if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        setisRoundEnd(true);
      }
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

  useEffect(() => {
    if (isRoundEnd) {
      var delayInMilliseconds = 3500; ///3.5 second for spinning
      setTimeout(function () {
        roundEnd();
        setisRoundEnd(false);
      }, delayInMilliseconds);
    }
  }, [isRoundEnd, roundEnd]);

  return <div>{timerComponents.length ? timerComponents : <span className="text-dark-blue text-sm">Wait for next round...</span>}</div>;
};

CountdownTimer.propTypes = {
  spinTime: PropTypes.number.isRequired,
  roundEnd: PropTypes.func.isRequired,
};

export default CountdownTimer;
