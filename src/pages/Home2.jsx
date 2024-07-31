import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useWebSocket from "react-use-websocket";
import logo from "../assets/landing/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import dicePics from "../assets/landing/new/dice.jpg";
import fapPics from "../assets/landing/new/fap.jpg";
import miniPics from "../assets/landing/new/mini-dice.jpg";
import Roshambo from "../assets/landing/new/roshambo.jpg";
import carousel from "../assets/landing/new/carousel.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { AnimatePresence, motion } from "framer-motion";

const Home2 = () => {
  const [totalUSDICP, setTotalUSDICP] = useState("195,482.65");
  const [totalICP, setTotalICP] = useState("9774.13");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const games = [
    { id: "roshambo", name: "Roshambo", description: "Choose rock, paper, or scissor and see if you can beat me and double your money!", image: Roshambo, links: "/roshambo" },
    { id: "dice", name: "Dice", description: "Win increasing prize starting from 10x to infinity with only ~$5 ticket", image: dicePics, links: "/dice" },
    { id: "minidice", name: "Mini Dice", description: "Dice for beginners. Same rule, cheaper ticket only ~50cents", image: miniPics, links: "/minidice" },
    { id: "fap", name: "FAP", description: "Bet a higher amount of money or $EYES, and increase your chance of winning", image: fapPics, links: "/fap" },
  ];

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.dragoneyes.xyz/fetchLastCoreData");
        const data = response.data;
        setTotalUSDICP(parseFloat(data.usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setTotalICP(data.icp);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useWebSocket("wss://api.dragoneyes.xyz:7878/core", {
    onMessage: async () => {
      const response = await axios.get("https://api.dragoneyes.xyz/fetchLastCoreData");
      const data = response.data;
      setTotalUSDICP(parseFloat(data.usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setTotalICP(data.icp);
    },
    shouldReconnect: () => true,
  });

  return (
    <div className="bg-black text-white min-h-screen font-kanit">
      {/* navbar */}
      <header className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            <img src={logo} alt="DragonEyes Logo" className="h-8 w-8 mr-2" />
          </div>
          <div className="md:hidden text-center">
            <p className="text-xs font-light">Reward Distributed</p>
            <p className="text-xl font-medium text-green-500">$ {totalUSDICP}</p>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link to="/xdragon" className="hover:text-gray-300">
              XDRAGON
            </Link>
            <Link to="/docs" className="hover:text-gray-300">
              Docs
            </Link>
          </nav>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </button>
        </div>
      </header>

      {/* side nav mobile version */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial="closed" animate="open" exit="closed" variants={menuVariants} className="fixed top-0 right-0 h-full w-64 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg z-50 shadow-lg">
            <div className="flex flex-col h-full p-6">
              <button className="self-end text-2xl mb-8 focus:outline-none" onClick={() => setIsMobileMenuOpen(false)}>
                x
              </button>
              <nav className="flex flex-col space-y-4">
                <Link to="/xdragon" className="text-xl hover:text-gray-300 transition duration-300">
                  XDRAGON
                </Link>
                <Link to="/docs" className="text-xl hover:text-gray-300 transition duration-300">
                  Docs
                </Link>
              </nav>
              <div className="mt-auto">
                <div className="flex justify-center space-x-4 mb-4">
                  <a href="#" className="text-2xl hover:text-gray-300 transition duration-300" aria-label="Telegram">
                    <FontAwesomeIcon icon={faTelegram} />
                  </a>
                  <a href="#" className="text-2xl hover:text-gray-300 transition duration-300" aria-label="Twitter">
                    <FontAwesomeIcon icon={faXTwitter} />
                  </a>
                </div>
                <p className="text-sm text-center text-gray-400">@dragoneyes 2024</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8 pt-20">
        {/* top carousel */}
        <div className="mb-8">
          <Carousel autoPlay infiniteLoop interval={5000} showStatus={false} showThumbs={false}>
            {[1, 2, 3].map((item) => (
              <div key={item}>
                <img src={carousel} alt={`Carousel ${item}`} className="rounded-lg" />
                {item === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="md:text-4xl font-bold mb-4">WELCOME TO</h2>
                      <h1 className="md:text-6xl font-bold mb-4">
                        DRAGON<span className="text-red-500">EYES</span>
                      </h1>
                      <p className="md:text-xl">A provably fair and fun gaming platform using secured onchain VRF</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </Carousel>
        </div>

        {/* reward distribution desktop */}
        <div className="hidden md:block backdrop-blur-md bg-white/10 p-4 rounded-lg mb-8">
          <h2 className="text-green-400 text-lg">Reward Distributed</h2>
          <p className="text-2xl font-bold">${totalUSDICP}</p>
          <p className="text-xl text-yellow-400">{totalICP} ICP</p>
        </div>

        {/* game list */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={containerVariants} initial="hidden" animate="visible">
          {games.map((game) => (
            <motion.div key={game.id} className="relative overflow-hidden rounded-lg shadow-lg" variants={itemVariants}>
              <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 flex">
                <div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#0FFF27] via-yellow-500 to-[#A8CE10] text-transparent bg-clip-text">{game.name}</h3>
                  <p className=" text-xs text-white">{game.description}</p>
                </div>
                <div className="self-end flex-grow">
                  <button className="bg-gradient-to-r from-[#EE5151] to-[#751C41] text-white px-8 py-3 rounded-lg hover:opacity-90 transition duration-300">
                    <Link to={game.links}>Play</Link>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* footer */}
      <footer className="mt-8 text-center pb-4">
        <div className="flex justify-center space-x-4 mb-2">
          <a href="#" className="text-2xl" aria-label="Telegram">
            <span role="img" aria-label="Telegram icon">
              <FontAwesomeIcon icon={faTelegram} />
            </span>
          </a>
          <a href="#" className="text-2xl" aria-label="Twitter">
            <span role="img" aria-label="Twitter icon">
              <FontAwesomeIcon icon={faXTwitter} />
            </span>
          </a>
        </div>
        <p className="text-sm text-gray-500">@dragoneyes 2024</p>
      </footer>
    </div>
  );
};

export default Home2;
