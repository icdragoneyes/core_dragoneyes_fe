import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import oldman from "../assets/img/oldmen.png";
import rock from "../assets/img/rock.png";
import paper from "../assets/img/paper.png";
import scissors from "../assets/img/scissors.png";

const messages = {
  win: ["Okay you can win right now.", "Hehe Lucky", "Hehe Boiii!", "Try harder!", "Pathetic!"],
  lose: ["You can do better!", "Is that your best?", "Come on, really?", "Too easy!", "Is this a joke?"],
  draw: ["You must be kidding!", "This can be happening!", "Not even close!", "Give up already!", "Naah i'm just back down!"],
};

const getTauntingMessage = (outcome) => {
  if (outcome === "You Win!") return messages.win[Math.floor(Math.random() * messages.win.length)];
  if (outcome === "LOSER!🤪") return messages.lose[Math.floor(Math.random() * messages.lose.length)];
  return messages.draw[Math.floor(Math.random() * messages.draw.length)];
};

const handImages = { Rock: rock, Paper: paper, Scissors: scissors };

const getHandImage = (outcome) => handImages[outcome] || null;

const ArenaV2 = ({ outcome, cpuSelected }) => {
  const [showTauntingMessage, setShowTauntingMessage] = useState(false);
  const [showBounce, setShowBounce] = useState(false);
  const [currentHandImage, setCurrentHandImage] = useState(rock);

  useEffect(() => {
    setShowTauntingMessage(false); // Reset the taunting message visibility
    setShowBounce(false); // Reset the bounce animation
    setCurrentHandImage(rock); // Set initial hand image to Rock

    if (outcome) {
      const timer = setTimeout(() => {
        setShowTauntingMessage(true);
      }, 2000); // Adjust the delay time as needed (2000ms = 2 seconds)

      const bounceTimer = setTimeout(() => {
        setShowBounce(true);
        setTimeout(() => {
          setShowBounce(false);
          setCurrentHandImage(getHandImage(cpuSelected)); // Change to CPU's choice after bounce
        }, 1200); // Duration of the bounce animation (3 bounces * 0.4s each)
      }, 0); // Start the bounce animation immediately

      return () => {
        clearTimeout(timer); // Cleanup the timer on component unmount or when outcome changes
        clearTimeout(bounceTimer); // Cleanup the bounce timer
      };
    }
  }, [outcome, cpuSelected]);

  return (
    <div className="flex items-center justify-center relative text-center h-screen">
      <div className="relative w-3/4 md:w-1/2">
        <img src={oldman} alt="Old Man" className="w-full" />
        {cpuSelected && <img src={currentHandImage} alt={cpuSelected} className={`absolute -right-[6%] top-[5%] w-[40%] transform scale-x-[-1] rotate-[-130deg] ${showBounce ? "animate-customBounce" : ""}`} />}
        {outcome && showTauntingMessage && (
          <div className="absolute bg-white border-2 border-[#ee5151] rounded-lg shadow-lg p-3 md:-top-[13%] -top-[14%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <p className="text-black relative">{getTauntingMessage(outcome)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

ArenaV2.propTypes = {
  outcome: PropTypes.string.isRequired,
  cpuSelected: PropTypes.string.isRequired,
};

export default ArenaV2;
