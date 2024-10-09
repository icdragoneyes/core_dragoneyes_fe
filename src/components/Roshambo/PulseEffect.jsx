import PropTypes from "prop-types";

const PulseEffect = ({ show }) => {
  if (!show) return null;

  return (
    <>
      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-black bg-opacity-50"></div>

      {/* Left pulse */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 w-12 h-48 z-50 overflow-hidden">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-transparent opacity-50 animate-pulse2"></div>
      </div>

      {/* Right pulse */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 w-12 h-48 z-50 overflow-hidden">
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-l from-green-500 to-transparent opacity-50 animate-pulse2"></div>
      </div>
    </>
  );
};

PulseEffect.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default PulseEffect;
