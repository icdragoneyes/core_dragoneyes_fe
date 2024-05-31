import PropTypes from "prop-types";

const Options = ({ selected, img, name, onClick, disabled }) => (
  <button
    type="button"
    onClick={() => onClick(selected)}
    className={`lg:p-6 sm:p-2 mx-2 basis-1/3 bg-white border border-gray-200 rounded-lg shadow focus:outline-none dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 ${
      disabled ? "cursor-not-allowed opacity-50" : ""
    }`}
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
};

Options.defaultProps = {
  disabled: false,
};

export default Options;
