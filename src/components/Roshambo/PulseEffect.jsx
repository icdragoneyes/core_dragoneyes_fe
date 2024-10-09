import PropTypes from "prop-types";

const PulseEffect = ({ show }) => {
  if (!show) return null;

  return (
    <>
      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-gradient-radial from-transparent to-black opacity-50"></div>

      {/* Left pulse */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 w-16 h-64 z-50 overflow-hidden">
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-radial from-green-500 to-transparent opacity-50 animate-pulse2"></div>
      </div>

      {/* Right pulse */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 w-16 h-64 z-50 overflow-hidden">
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-radial from-green-500 to-transparent opacity-50 animate-pulse2"></div>
      </div>
    </>
  );
};

PulseEffect.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default PulseEffect;
