import PropTypes from "prop-types";
import { useState } from "react";
import { motion } from "framer-motion";

const Options = ({ selected, img, name, onClick, disabled, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => onClick(selected)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setIsTouched(false)}
      className={`lg:p-6 sm:p-2 md:mx-4 mx-2 basis-1/3 rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-blue-500 bg-[#1e3557] border-gray-700 ${
        disabled ? "cursor-not-allowed opacity-50" : "hover:scale-105 hover:shadow-lg hover:ring-4 hover:ring-[#ee5151] hover:bg-slate-800"
      } ${isSelected ? "scale-105 shadow-lg ring-4 ring-[#ee5151]" : ""} ${isHovered || isTouched ? "animate-bounce" : ""}`}
      disabled={disabled}
      animate={{
        scale: isSelected || isHovered || isTouched ? 1.1 : 1,
        opacity: isSelected ? 0.7 : isHovered || isTouched ? 1 : 0.9,
        boxShadow: isSelected || isHovered || isTouched ? "0 0 20px 5px #ee5151" : "none",
      }}
      transition={{ type: "spring", stiffness: 300 }}
      aria-pressed={isSelected}
      aria-label={`Option ${name}`}
    >
      <h5 className="mb-2 lg:text-2xl sm:text-sm font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
      <img src={img} className="lg:w-20 sm:w-10 mx-auto transform -scale-x-100" alt={`Image for ${name}`} />
    </motion.button>
  );
};

Options.propTypes = {
  selected: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
};

Options.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default Options;
