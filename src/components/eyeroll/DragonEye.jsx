import { useSpring, animated } from "@react-spring/web";
import PropTypes from "prop-types";
import { useEffect } from "react";

const DragonEye = ({ eyeState, rotation }) => {
  const pupilPosition = {
    center: { top: "45%", left: "45%" },
    side: { top: "65%", left: "65%" },
  };

  const [{ top, left }, api] = useSpring(() => ({
    top: pupilPosition.center.top,
    left: pupilPosition.center.left,
  }));

  useEffect(() => {
    if (eyeState === "spinning") {
      api.start({
        top: pupilPosition.side.top,
        left: pupilPosition.side.left,
        config: { duration: 500, easing: (t) => t * t },
      });
    } else {
      api.start({
        top: pupilPosition.center.top,
        left: pupilPosition.center.left,
        config: { duration: 500, easing: (t) => t * t },
      });
    }
  }, [eyeState, api, pupilPosition.center, pupilPosition.side]);

  return (
    <div className="w-full h-full relative rounded-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle, #ff9900 0%, #ff6600 100%)",
        }}
      >
        <animated.div className="absolute w-[10%] h-[10%] bg-black rounded-full" style={{ top, left, transform: `rotate(${rotation}deg)` }} />
      </div>
    </div>
  );
};

DragonEye.propTypes = {
  eyeState: PropTypes.oneOf(["center", "side", "spinning"]).isRequired,
  rotation: PropTypes.object.isRequired,
};

export default DragonEye;
