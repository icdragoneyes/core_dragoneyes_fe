import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaHandRock, FaHandPaper, FaHandScissors, FaGoogle, FaWallet, FaPlay, FaQuestionCircle } from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import { useAtom } from "jotai";
import { modalHowToPlaySectionAtom, selectedChainAtom } from "../../store/Atoms";

const HowToPlay = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [chain] = useAtom(selectedChainAtom);
  const [modalSection] = useAtom(modalHowToPlaySectionAtom);

  useEffect(() => {
    if (modalSection === "streak") {
      setActiveSection(3); // Index of the "STREAK MODE 20x" section
    }
  }, [modalSection]);

  if (!isOpen) return null;

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sectionVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  };

  const sections = [
    {
      title: "Game Rules",
      icon: <FaPlay />,
      content: (
        <>
          <p className="mb-2">Play against an onchain randomizer with provably fair 50:50 chance to win in this classic game.</p>
          <ul className="list-none pl-5 mb-2">
            <li>
              <FaHandRock className="inline mr-2" /> Rock beats Scissors
            </li>
            <li>
              <FaHandScissors className="inline mr-2" /> Scissors beat Paper
            </li>
            <li>
              <FaHandPaper className="inline mr-2" /> Paper beats Rock
            </li>
          </ul>
          <p>If you win, you double your money. If you lose, well-- you lose your money.</p>
        </>
      ),
    },
    {
      title: chain.name === "icp" ? "Connect & Top Up" : "Top Up & Withdraw",
      icon: <FaWallet />,
      content:
        chain.name === "icp" ? (
          <ol className="list-decimal pl-5">
            <li>
              Connect wallet: Login using <FaGoogle className="inline text-red-500" /> Google. If this is the first time, a new ICP wallet will be generated for you and will be paired with your google account.
            </li>
            <li>Top up ICP to this wallet: Transfer ICP from your existing wallet or use your favorite CEX to withdraw some ICP to this wallet address.</li>
            <li>Now you&apos;re ready to play!</li>
          </ol>
        ) : (
          <ol className="list-decimal pl-5">
            <li>Each wallet has their own Solana top up address you can access by tapping wallet tab on the lower right of the app.</li>
            <li>Top up SOL to this wallet: Transfer SOL from your existing wallet or use your favorite CEX to withdraw some SOL to this wallet address.</li>
            <li>Wait for 2-3 mins and tap the &quot;refresh balance&quot; button on your wallet. Now you&apos;re ready to play!</li>
            <li>To withdraw: Paste your Solana wallet destination address, put the amount and tap &quot;Transfer&quot;.</li>
            <p className="mt-2">*) There&apos;s a small fee of 0.0001 SOL for each top up and withdrawal to cover our gas cost.</p>
          </ol>
        ),
    },
    {
      title: "Play",
      icon: <FaPlay />,
      content: (
        <ol className="list-decimal pl-5">
          <li>Choose the size of your bet; {chain.name === "icp" ? "0.1, 1 or 5 ICP" : "0.01, 0.1 or 0.5 SOL"}</li>
          <li>Hold to shoot [Rock], [Paper], or [Scissor]</li>
          <li>
            Onchain randomizer will choose its stance
            <ul className="list-disc pl-5 mt-2">
              <li>If you win, you&apos;ll double your bet money</li>
              <li>If you lose, your money goes to the house</li>
              <li>If it&apos;s a {chain.name === "icp" ? "tie" : "draw"}, your money stays and you need to shoot again</li>
            </ul>
          </li>
        </ol>
      ),
    },
    {
      title: "STREAK MODE 20x",
      icon: <AiFillThunderbolt />,
      content: (
        <ul className="list-disc pl-5">
          <li>Choose your bet size and keep playing, you won&apos;t be charged for the next round as long as you win.</li>
          <li>Win 3 rounds = you get 20x your bet!</li>
          <li>But beware: if you lose or draw on any round, the streak ends!</li>
        </ul>
      ),
    },
    {
      title: "$EYES Reward and Rush Period",
      icon: <FaPlay />,
      content: (
        <>
          <p className="mb-2">
            Keep playing to multiply your $EYES reward in the next round during a &quot;rush&quot; period. Each time you finish a round, the amount of $EYES you receive increases as long as you start the next round within 60 seconds, before
            the timer expires.
          </p>
          <ul className="list-disc pl-5">
            <li>First round will get 1x multiplier, kickstarting the rush period.</li>
            <li>Second round in the rush period, you will get 2x multiplier of $EYES</li>
            <li>...after 5th round the multiplier is 5x and kept at 5x as long as you play before the timer expires and triggering end of the rush period.</li>
          </ul>
          <p className="mt-2">In STREAK MODE, you&apos;ll have automatically 3x multiplier of $EYES reward each time you play!</p>
        </>
      ),
    },
    {
      title: "FAQ",
      icon: <FaQuestionCircle />,
      content: (
        <>
          <p className="font-bold">Q: Is it truly random and the game is not rigged?</p>
          <p>
            A: We&apos;re using{" "}
            <a href="https://internetcomputer.org/docs/current/developer-docs/smart-contracts/advanced-features/randomness" target="_blank" rel="noopener noreferrer" className="text-blue-300 font-bold underline">
              {chain.name === "icp" ? "ICP's" : "Internet Computer's"} Verifiable Random Function (VRF)
            </a>{" "}
            {chain.name === "icp" ? "chain-key cryptography technology" : "and chain-key cryptography technology"}. It is a provably fair mechanism to generate random result on the house stance.{" "}
            <a href="https://dashboard.internetcomputer.org/canister/seu4o-daaaa-aaaam-acuaq-cai" target="_blank" rel="noopener noreferrer" className="text-blue-300 font-bold underline">
              Roshambo canister id is : seu4o-daaaa-aaaam-acuaq-cai
            </a>
          </p>
          <p className="font-bold mt-2">Q: Do you charge fees?</p>
          <p>A: We charge 2.5% fees on each winning/draw bet and that makes the RTP (Return to Player) of this game is 97.5% -- a very high number on the casino standard.</p>
        </>
      ),
    },
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gradient-to-br from-[#e35721] to-[#e35721] flex justify-center items-center z-50 p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#e35721] bg-opacity-90 backdrop-blur-md rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white font-['Passion One']"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white">How to Play</h2>

          {sections.map((section, index) => (
            <div key={index} className="mb-4">
              <button className="flex items-center w-full text-left p-2 rounded-lg bg-opacity-50 hover:bg-opacity-75 transition-all duration-200 ease-in-out" onClick={() => toggleSection(index)}>
                <span className="mr-2">{section.icon}</span>
                <span className="text-xl">{section.title}</span>
              </button>
              <motion.div variants={sectionVariants} initial="closed" animate={activeSection === index ? "open" : "closed"} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="p-2">{section.content}</div>
              </motion.div>
            </div>
          ))}

          <button onClick={onClose} className="mt-6 w-full bg-white text-[#e35721] py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 ease-in-out">
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

HowToPlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HowToPlay;
