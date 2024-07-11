import PropTypes from "prop-types";
const DragonEye = ({ eyeState }) => {
  const pupilPosition = {
    center: { top: "50%", left: "50%" },
    side: { top: "50%", left: "75%" },
    spinning: { top: "50%", left: "75%", animation: "spin 0.5s linear infinite" },
  };

  return (
    <div className="w-full h-full relative rounded-full overflow-hidden">
      {/* sclera */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle, #ff9900 0%, #ff6600 100%)",
        }}
      ></div>
      {/* pupil */}
      <div
        className="absolute w-1/5 h-1/5 bg-black rounded-full transition-all duration-300"
        style={{
          top: pupilPosition[eyeState].top,
          left: pupilPosition[eyeState].left,
          transform: "translate(-50%, -50%)",
          animation: pupilPosition[eyeState].animation,
        }}
      >
        {/* highlight pupil */}
        <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

DragonEye.propTypes = {
  eyeState: PropTypes.oneOf(["center", "side", "spinning"]),
};

export default DragonEye;
