import { motion } from "framer-motion";
import { memo } from "react";
import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";

const GameNode = memo(({ node }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 bg-opacity-85 flex items-center justify-center  "></div>
      {/* card info */}
      <motion.div
        className="mt-4 bg-[#1E3557] bg-opacity-85 rounded-lg p-4 shadow-xl z-20 w-56"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative w-full h-40 mb-4">
          <LazyLoadImage
            src={node.image}
            alt={node.name}
            className="w-full h-full object-cover rounded-lg"
            effect="blur"
            wrapperClassName="w-full h-full"
          />
          <div className="absolute inset-x-0 top-0 bg-[#F8B22A] bg-opacity-85 flex items-center justify-center rounded-t-lg h-14">
            <h3 className="text-white text-4xl font-bold font-passero">
              {node.name}
            </h3>
          </div>
        </div>
        <p className="text-base mb-4 text-white">{node.description}</p>
        {node.id === "dice" ? (
          <>
            <a href={node.navi}>
              <button className="bg-[#EE5151] bg-opacity-85 text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200 shadow-md mb-2">
                Play Dice Now
              </button>
            </a>
            <a href={node.navi2}>
              <button className="bg-[#EE5151] bg-opacity-85 text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200 shadow-md">
                Play Mini Dice Now
              </button>
            </a>
          </>
        ) : (
          <Link to={node.navi}>
            <button className="bg-[#EE5151] bg-opacity-85 text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200 shadow-md">
              Play Now
            </button>
          </Link>
        )}
      </motion.div>
    </div>
  );
});

GameNode.displayName = "GameNode";

GameNode.propTypes = {
  node: PropTypes.shape({
    name: PropTypes.string.isRequired,
    Icon: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    navi: PropTypes.string.isRequired,
    navi2: PropTypes.string,
  }).isRequired,
  animationValues: PropTypes.object.isRequired,
};

export default GameNode;
