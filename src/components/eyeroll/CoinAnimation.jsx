import { motion } from "framer-motion";
import { random } from "lodash";
const CoinAnimation = () => {
  const coinCount = 30;
  const duration = 1;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(coinCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold"
          initial={{
            bottom: `${random(-10, -5)}%`,
            left: `${random(0, 100)}%`,
            rotate: random(-180, 180),
            scale: random(0.5, 1.5),
          }}
          animate={{
            bottom: ["0%", "50%", "100%"],
            left: [null, "50%"],
            rotate: [null, 0],
            scale: [null, 1, 0],
          }}
          transition={{
            duration: duration,
            ease: "easeOut",
            times: [0, 0.7, 1],
          }}
        >
          🪙
        </motion.div>
      ))}
    </div>
  );
};

export default CoinAnimation;
