import PropTypes from "prop-types";

const Options = ({ selected, img, name, onClick, disabled, isSelected }) => (
  <button
    type="button"
    onClick={() => onClick(selected)}
    className={`lg:p-6 sm:p-2 md:mx-4 mx-2 basis-1/3 rounded-lg shadow focus:outline-none bg-[#1e3557] border-gray-700 ${
      disabled ? "cursor-not-allowed opacity-50" : "hover:scale-105 hover:shadow-lg hover:ring-4 hover:ring-[#ee5151] hover:bg-slate-800 hover:translate-y-[-10px]"
    } ${isSelected ? "scale-105 shadow-lg ring-4 ring-[#ee5151] translate-y-[-10px]" : ""}`}
    disabled={disabled}
  >
    <h5 className="mb-2 lg:text-2xl sm:text-sm font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
    <img src={img} className="lg:w-20 sm:w-10 mx-auto transform -scale-x-100" alt="imgBtn" />
  </button>
);
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
