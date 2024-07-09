import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import roshamboIcn from "../assets/landing/roshambo-icn.png";
import spinIcn from "../assets/landing/spin-icn.png";
import diceIcn from "../assets/landing/dice-icn.png";
import eyesIcn from "../assets/landing/node.png";
import spin from "../assets/landing/spin.jpeg";
import dice from "../assets/landing/dice.png";
import roshambo from "../assets/landing/roshambo.jpeg";
import { Link } from "react-router-dom";

const NodeMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 425);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nodes = [
    { id: "dice", name: "Dice", Icon: diceIcn, image: dice, description: "Win 10x with only 0.5 ICP! You win when you got dragon eyes (1-1).", navi: "/dice" },
    { id: "spin", name: "FAP", Icon: spinIcn, image: spin, description: "Bet a higher amount of money or $EYES, and increase your chance of winning.", navi: "/spin" },
    { id: "roshambo", name: "Roshambo", Icon: roshamboIcn, image: roshambo, description: "Choose rock, paper, or scissor and see if you can beat me and double your money!", navi: "/roshambo" },
  ];

  const calculateNodePosition = (index, totalNodes) => {
    const spacing = 250;
    const x = (index - (totalNodes - 1) / 2) * spacing;
    const y = 250;
    return { x, y };
  };

  if (isMobile) {
    return (
      <div className="h-screen pb-52 overflow-y-auto">
        <div className="flex flex-col items-center justify-start space-y-4 mb-16">
          {nodes.map((node) => (
            <motion.div key={node.id} className="bg-[#1E3557] bg-opacity-85 rounded-lg overflow-hidden shadow-lg w-full max-w-sm flex" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="w-1/3 relative">
                <img src={node.image} alt={node.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-[#F8B22A] bg-opacity-85 py-2 px-3">
                  <h3 className="text-white text-lg text-center font-bold font-passero">{node.name}</h3>
                </div>
              </div>
              <div className="w-2/3 p-4">
                <p className="text-white text-sm mb-4">{node.description}</p>
                {node.id === "dice" ? (
                  <>
                    <Link to={node.navi}>
                      <button className="bg-[#EE5151] text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200 mb-2">Play Dice Now</button>
                    </Link>
                    <Link to={node.navi}>
                      <button className="bg-[#EE5151] text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200">Play Mini Dice Now</button>
                    </Link>
                  </>
                ) : (
                  <Link to={node.navi}>
                    <button className="bg-[#EE5151] text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200">Play Now</button>
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
    <div className="relative h-full flex items-center justify-center">
      {/* main node */}
      <motion.div
        className="absolute top-[2%] w-20 h-20 rounded-full bg-transparent flex items-center justify-center cursor-pointer z-10 shadow-lg"
        animate={{ scale: isExpanded ? 1.2 : 1, y: isExpanded ? -20 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          setSelectedNode(null), setIsExpanded(!isExpanded);
        }}
      >
        <img src={eyesIcn} className="text-6xl text-white" />
      </motion.div>

      {/* sub node */}
      <AnimatePresence>
        {nodes.map((node, index) => {
          const { x, y } = calculateNodePosition(index, nodes.length);
          return (
            <motion.div
              key={node.id}
              className="absolute"
              initial={{ y: 0, scale: 0, opacity: 0 }}
              animate={{
                x,
                y: isExpanded ? y : 0,
                scale: isExpanded ? 1 : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              exit={{ y: 0, scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <motion.div
                className={`w-20 h-20 rounded-full hover:bg-[#1E3557] bg-opacity-85 flex items-center justify-center cursor-pointer shadow-md hover:ring-4 hover:ring-[#F8B22A] hover:ring-opacity-78 ${
                  selectedNode && selectedNode.id === node.id ? "ring-4 ring-[#F8B22A] ring-opacity-78 bg-[#1E3557]" : ""
                }`}
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px 5px rgba(248, 178, 42, 0.78)" }}
                animate={{
                  boxShadow: selectedNode && selectedNode.id === node.id ? "0 0 15px 5px rgba(248, 178, 42, 0.78)" : "none",
                }}
                onClick={() => {
                  const newSelectedNode = selectedNode && selectedNode.id === node.id ? null : node;
                  setSelectedNode(newSelectedNode);
                }}
              >
                <img src={node.Icon} className="text-3xl text-white" />
              </motion.div>

              {/* popup info */}
              <AnimatePresence>
                {selectedNode && selectedNode.id === node.id && (
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-[#1E3557] bg-opacity-85 rounded-lg p-4 shadow-xl z-20 w-56"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative w-full h-32 mb-4">
                      <img src={node.image} alt={node.name} className="w-full h-full object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-[#F8B22A] bg-opacity-85 flex items-center justify-center rounded-t-lg h-14">
                        <h3 className="text-white text-4xl font-bold font-passero">{node.name}</h3>
                      </div>
                    </div>
                    <p className="text-base mb-4 text-white">{node.description}</p>
                    {node.id === "dice" ? (
                      <>
                        <Link to={node.navi}>
                          <button className="bg-[#EE5151] bg-opacity-85 text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200 shadow-md mb-2">Play Dice Now</button>
                        </Link>
                        <Link to={node.navi}>
                          <button className="bg-[#EE5151] bg-opacity-85 text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200 shadow-md">Play Mini Dice Now</button>
                        </Link>
                      </>
                    ) : (
                      <Link to={node.navi}>
                        <button className="bg-[#EE5151] bg-opacity-85 text-white px-4 py-2 rounded-full w-full hover:bg-orange-600 transition-colors duration-200 shadow-md">Play Now</button>
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NodeMenu;
