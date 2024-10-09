import PropTypes from "prop-types";

const PulseEffect = ({ show }) => {
  if (!show) return null;

  return (
    <>
      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-gradient-radial from-transparent to-black opacity-50"></div>

      {/* Left pulse */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 w-32 h-64 z-50">
        <div className="absolute inset-0 bg-gradient-radial from-green-500 to-transparent opacity-50 animate-pulse2 animate-radial-pulse"></div>
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-green-500 to-transparent opacity-50 animate-pulse2"></div>
      </div>

      {/* Right pulse */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 w-32 h-64 z-50">
        <div className="absolute inset-0 bg-gradient-radial from-green-500 to-transparent opacity-50 animate-pulse2 animate-radial-pulse"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-green-500 to-transparent opacity-50 animate-pulse2"></div>
      </div>
    </>
  );
};

PulseEffect.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default PulseEffect;
