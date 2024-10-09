import PropTypes from "prop-types";
const PulseEffect = ({ show }) => {
  if (!show) return null;

  return (
    <>
      <div className="fixed left-0 top-0 bottom-0 w-4 bg-green-500 opacity-50 animate-pulse2 z-50"></div>
      <div className="fixed right-0 top-0 bottom-0 w-4 bg-green-500 opacity-50 animate-pulse2 z-50"></div>
    </>
  );
};

PulseEffect.propTypes = {
  show: PropTypes.bool.isRequired,
};
export default PulseEffect;
