import PropTypes from "prop-types";
import rock from "../assets/img/rock.png";
import paper from "../assets/img/paper.png";
import scissors from "../assets/img/scissors.png";
import loading from "../assets/img/loading.gif";

const renderImg = (selected, flip) => {
  const images = { Rock: rock, Paper: paper, Scissors: scissors, loading };
  return <img src={images[selected] || loading} className={`w-40 mx-auto ${flip ? "transform -scale-x-100" : ""}`} alt={selected} loading="lazy" />;
};

const Arena = ({ selected, cpuSelected }) => (
  <div className="text-center flex justify-center basis-1/2 mx-auto">
    <div>
      {renderImg(selected, true)}
      <h1 className="text-center border border-green-400 text-green-400 rounded-md">You</h1>
    </div>
    <h1 className="text-2xl font-bold flex items-center">VS</h1>
    <div>
      {renderImg(cpuSelected, false)}
      <h1 className="text-center border border-red-600 text-red-600 rounded-md">CPU</h1>
    </div>
  </div>
);

Arena.propTypes = {
  selected: PropTypes.string.isRequired,
  cpuSelected: PropTypes.string.isRequired,
  animate: PropTypes.bool.isRequired,
};

export default Arena;
