import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRandomAnimation } from "../hooks/useRandomAnimation";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import roshamboIcn from "../assets/landing/roshambo-icn.png";
import spinIcn from "../assets/landing/spin-icn.png";
import diceIcn from "../assets/landing/dice-icn.png";
import spin from "../assets/landing/spin.jpeg";
import dice from "../assets/landing/dice.png";
import roshambo from "../assets/landing/roshambo.jpeg";
import GameNode from "./GameNode";

const NodeMenu = () => {
  const [isMobile, setIsMobile] = useState(false);
  const animationValues = useRandomAnimation();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 425);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nodes = [
    {
      id: "dice",
      name: "Dice",
      Icon: diceIcn,
      image: dice,
      description:
        "A dice game with a twist. Win rewards starting from 10x your bet, and increasing to infinity!",
      navi: "https://dice.dragoneyes.xyz/",
      navi2: "https://minidice.dragoneyes.xyz/",
    },
    {
      id: "spin",
      name: "FAP",
      Icon: spinIcn,
      image: spin,
      description: "(coming soon!)",
      navi: "#",
    },
    {
      id: "roshambo",
      name: "Roshambo",
      Icon: roshamboIcn,
      image: roshambo,
      description:
        "Double your money if you win in this classic Rock, Paper, Scissors game!",
      navi: "/roshambo",
    },
  ];

  if (isMobile) {
    return (
      <div className="h-screen pb-52 overflow-y-auto">
        <div className="flex flex-col items-center justify-start space-y-4 mb-16">
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className="bg-[#1E3557] bg-opacity-85 rounded-lg overflow-hidden shadow-lg w-full max-w-sm flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-1/3 relative">
                <LazyLoadImage
                  src={node.image}
                  alt={node.name}
                  className="w-full h-full object-cover"
                  effect="blur"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-[#F8B22A] bg-opacity-85 py-2 px-3">
                  <h3 className="text-white text-lg text-center font-bold font-passero">
                    {node.name}
                  </h3>
                </div>
              </div>
              <div className="w-2/3 p-4">
                <p className="text-white text-sm mb-4">{node.description}</p>
                {node.id === "dice" ? (
                  <>
                    <a href={node.navi}>
                      <button className="bg-[#EE5151] text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200 mb-2">
                        Play Dice Now
                      </button>
                    </a>
                    <a href={node.navi2}>
                      <button className="bg-[#EE5151] text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200">
                        Play Mini Dice Now
                      </button>
                    </a>
                  </>
                ) : (
                  <Link to={node.navi}>
                    <button className="bg-[#EE5151] text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200">
                      Play Now
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start pt-10 h-screen">
      <div className="flex space-x-8">
        {nodes.map((node) => (
          <GameNode
            key={node.id}
            node={node}
            animationValues={animationValues}
          />
        ))}
      </div>
    </div>
  );
};

export default NodeMenu;
