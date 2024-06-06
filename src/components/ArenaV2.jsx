import PropTypes from "prop-types";
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

const ArenaV2 = ({ outcome, cpuSelected }) => (
  <div className="flex items-center justify-center relative text-center h-screen">
    <div className="relative w-3/4 md:w-1/2">
      <img src={oldman} alt="Old Man" className="w-full" />
      {cpuSelected && <img src={getHandImage(cpuSelected)} alt={cpuSelected} className="absolute -right-[6%] top-[5%] w-[40%] scale-x-[-1] rotate-[-130deg]" />}
      {outcome && (
        <div className="absolute bg-white border-2 border-[#ee5151] rounded-lg shadow-lg p-3 md:-top-[13%] -top-[14%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-black relative">{getTauntingMessage(outcome)}</p>
        </div>
      )}
    </div>
  </div>
);

ArenaV2.propTypes = {
  outcome: PropTypes.string.isRequired,
  cpuSelected: PropTypes.string.isRequired,
};

export default ArenaV2;
