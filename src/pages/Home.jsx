import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import carousel from "../assets/landing/new/carousel.jpg";
import carousel2 from "../assets/landing/new/carousel2.jpg";
import carousel3 from "../assets/landing/new/carousel3.jpg";
import deskCarl from "../assets/landing/new/1.jpg";
import deskCarl2 from "../assets/landing/new/2.jpg";
import deskCarl3 from "../assets/landing/new/3.jpg";
import icpLogo from "../assets/landing/new/icp.png";
import btcLogo from "../assets/landing/new/btc.png";
import { Carousel } from "react-responsive-carousel";
import { AnimatePresence, motion } from "framer-motion";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Helmet } from "react-helmet-async";
import useInitializeOpenlogin from "../hooks/useInitializeOpenLogin";
import BottomNavbar from "../components/BottomNavbar";
import ConnectModal from "../components/ConnectModal";
import Wallet from "../components/Wallet";
//import { isAuthenticatedAtom } from "../store/Atoms";

const Home = () => {
  const [totalUSDICP, setTotalUSDICP] = useState(null);
  const [totalICP, setTotalICP] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const navigate = useNavigate();

  useInitializeOpenlogin();

  const games = [
    {
      id: "roshambo",
      name: "Roshambo",
      description:
        "Choose rock, paper, or scissor and see if you can beat me and double your money!",
      image: Roshambo,
      navi: "/roshambo",
    },
    {
      id: "dice",
      name: "Dice",
      description:
        "Win increasing prize starting from 10x to infinity with only ~$5 ticket",
      image: dicePics,
      navi: "https://dice.dragoneyes.xyz",
    },
    {
      id: "minidice",
      name: "Mini Dice",
      description:
        "Dice for beginners. Same rule, cheaper ticket only ~50cents",
      image: miniPics,
      navi: "https://minidice.dragoneyes.xyz",
    },
    {
      id: "fap",
      name: "FAP",
      description:
        "Bet a higher amount of money or $EYES, and increase your chance of winning",
      image: fapPics,
      navi: "/fap",
    },
  ];

  const carouselItems = [
    {
      img: carousel,
      deskImg: deskCarl,
    },
    {
      img: carousel2,
      deskImg: deskCarl2,
    },
    {
      img: carousel3,
      deskImg: deskCarl3,
    },
  ];

  const handlePlayClick = (game) => {
    if (game.id === "roshambo") {
      setSelectedGame(game);
      setShowModal(true);
    } else if (game.id === "dice" || game.id === "minidice") {
      // Direct navigation for other games
      window.location.href = game.navi;
    } else {
      navigate(game.navi);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGame(null);
  };

  // all animation related variables
  const carouselVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.dragoneyes.xyz/fetchLastCoreData"
      );
      const data = response.data;
      setTotalUSDICP(
        parseFloat(data.usd).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
      setTotalICP((Number(data.icp) / 1e8).toFixed(2).toString());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(selectedMode);
  }, [selectedMode]);

  useWebSocket("wss://api.dragoneyes.xyz:7878/core", {
    onMessage: async () => {
      await fetchData();
    },
    shouldReconnect: () => true,
  });

  return (
    <div className="bg-black min-h-screen font-kanit pb-16">
      <Helmet>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        <meta
          name="description"
          content="Fair & Fun Onchain Games | Play Dice, Spin, or Rock Paper Scissor and win massive rewards!"
        />

        <meta property="og:title" key="og:title" content="Dragon Eyes" />
        <meta property="og:locale" key="og:locale" content="id-ID" />
        <meta property="og:type" key="og:type" content="website" />
        <meta
          property="og:url"
          key="og:url"
          content="https://icp.dragoneyes.xyz/"
        />
        <meta
          property="og:description"
          content="Fair & Fun Onchain Games | Play Dice, Spin, or Rock Paper Scissor and win massive rewards!"
        />

        <meta
          property="og:image"
          key="og:image"
          content="https://i.ibb.co/xXBSwvh/dragon-icon-small.png"
        />

        <meta
          name="twitter:card"
          key="twitter:card"
          content="https://i.ibb.co/xXBSwvh/dragon-icon-small.png"
        />
        <meta
          name="twitter:site"
          key="twitter:site"
          content="https://icp.dragoneyes.xyz"
        />
        <meta name="twitter:title" key="twitter:title" content="Dragon Eyes" />
        <meta
          name="twitter:description"
          key="twitter:description"
          content="Fair & Fun Onchain Games | Play Dice, Spin, or Rock Paper Scissor and win massive rewards!"
        />
        <meta
          name="twitter:image"
          key="twitter:image"
          content="https://i.ibb.co/xXBSwvh/dragon-icon-small.png"
        />
        <script src="https://telegram.org/js/telegram-web-app.js"></script>

        <link rel="manifest" href="/manifest.json" />

        <title>Dragon Eyes</title>
      </Helmet>
      {/* navbar */}
      <header className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="DragonEyes Logo" className="h-8 w-8" />
            </Link>
          </div>
          <div className="md:hidden text-center">
            <p className="text-xs font-light text-green-400">
              Reward Distributed
            </p>
            <p className="text-xl font-medium text-white">$ {totalUSDICP}</p>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link
              to="https://t.me/HouseOfXDragon"
              target="_blank"
              className="text-2xl"
              aria-label="Telegram"
            >
              <span role="img" aria-label="Telegram icon">
                <FontAwesomeIcon icon={faTelegram} />
              </span>
            </Link>
            <Link
              to="https://x.com/dragoneyesxyz"
              target="_blank"
              className="text-2xl"
              aria-label="Twitter"
            >
              <span role="img" aria-label="Twitter icon">
                <FontAwesomeIcon icon={faXTwitter} />
              </span>
            </Link>
            <Link
              to="https://docs.dragoneyes.xyz/"
              target="_blank"
              className="hover:text-gray-300"
            >
              Docs
            </Link>
          </nav>
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* side nav mobile version */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 right-0 h-full w-64 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg z-50 shadow-lg"
          >
            <div className="flex flex-col h-full p-6">
              <button
                className="self-end text-2xl mb-8 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                x
              </button>
              <nav className="flex flex-col space-y-4">
                <Link
                  to="https://t.me/HouseOfXDragon"
                  target="_blank"
                  className="text-2xl flex items-center gap-2"
                  aria-label="Telegram"
                >
                  <span role="img" aria-label="Telegram icon">
                    <FontAwesomeIcon icon={faTelegram} />
                  </span>
                  <span className="text-base font-medium">Telegram</span>
                </Link>
                <Link
                  to="https://x.com/dragoneyesxyz"
                  className="text-2xl flex items-center gap-2"
                  aria-label="Twitter"
                >
                  <span role="img" aria-label="Twitter icon">
                    <FontAwesomeIcon icon={faXTwitter} />
                  </span>
                  <span className="text-base font-medium">Twitter / X</span>
                </Link>
                <Link
                  to="https://docs.dragoneyes.xyz/"
                  target="_blank"
                  className="hover:text-gray-300 text-xl"
                >
                  Docs
                </Link>
              </nav>
              <div className="mt-auto">
                <div className="flex justify-center space-x-4 mb-4">
                  <Link
                    to="https://t.me/HouseOfXDragon"
                    target="_blank"
                    className="text-2xl"
                    aria-label="Telegram"
                  >
                    <span role="img" aria-label="Telegram icon">
                      <FontAwesomeIcon icon={faTelegram} />
                    </span>
                  </Link>
                  <Link
                    to="https://x.com/dragoneyesxyz"
                    className="text-2xl"
                    aria-label="Twitter"
                  >
                    <span role="img" aria-label="Twitter icon">
                      <FontAwesomeIcon icon={faXTwitter} />
                    </span>
                  </Link>
                </div>
                <p className="text-sm text-center text-gray-400">
                  @dragoneyes 2024
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8 pt-20 text-white">
        {/* top carousel */}
        <motion.div
          className="mb-8"
          variants={carouselVariants}
          initial="hidden"
          animate="visible"
        >
          <Carousel
            autoPlay
            infiniteLoop
            interval={5000}
            showStatus={false}
            showThumbs={false}
          >
            {carouselItems.map((item, index) => (
              <div key={index} className="relative">
                {index === 0 && (
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(127, 29, 29, 0) 0%, rgba(80, 27, 27, 0.47) 47%, rgba(100, 28, 28, 0.63) 63%)",
                    }}
                  ></div>
                )}

                <picture className="block w-full">
                  <source media="(min-width: 768px)" srcSet={item.deskImg} />
                  <img
                    src={item.img}
                    alt={`Carousel ${index + 1}`}
                    className="rounded-lg w-full h-auto object-cover"
                  />
                </picture>

                {index === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center flex flex-col font-chillax">
                      <h2 className="lg:text-4xl font-bold mb-4">WELCOME TO</h2>
                      <h1 className="lg:text-6xl text-3xl font-bold mb-4">
                        DRAGON<span className="text-red-500">EYES</span>
                      </h1>
                      <p className="lg:text-xl text-xs font-semibold">
                        A provably fair and fun gaming platform <br /> using
                        secured onchain VRF
                      </p>
                    </div>
                  </div>
                )}

                {index === 1 && (
                  <div className="absolute inset-0 flex items-center justify-start">
                    <div className="text-left flex flex-col gap-6 font-chillax lg:pl-36 px-9">
                      <h2 className="lg:text-4xl text-xl font-semibold">
                        Sign in with <br />{" "}
                        <span className="text-[#F7931A]">Bitcoin.</span> <br />{" "}
                        Chain fusion.
                      </h2>
                      <p className="font-semibold lg:text-xl text-xs">
                        Playing Roshambo using <br /> BTC in your Xverse mobile{" "}
                        <br /> wallet.
                      </p>
                    </div>
                  </div>
                )}
                {index === 2 && (
                  <div className="absolute inset-0 flex items-center justify-start">
                    <div className="text-left flex flex-col gap-6 font-chillax lg:pl-36 px-8">
                      <h2 className="lg:text-5xl text-2xl font-semibold">
                        Instant
                        <br /> <span className="text-[#F7931A]">TOP-UP </span>
                      </h2>

                      <p className="font-normal lg:text-xl text-[10px]">
                        Right after player hit <br /> transfer, we will disburse{" "}
                        <br />
                        ckBTC in the playing wallet <br /> with the same amount.{" "}
                        <br />
                        <span className="font-bold">No more waiting.</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </Carousel>
        </motion.div>

        {/* reward distribution desktop */}
        <div className="hidden md:block backdrop-blur-md bg-white/10 p-4 rounded-lg mb-8">
          <h2 className="text-green-400 text-lg">Reward Distributed</h2>
          <p className="text-2xl font-bold">${totalUSDICP}</p>
          <p className="text-xl text-yellow-400">
            {Number(totalICP).toLocaleString()} ICP
          </p>
        </div>

        {/* game list */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {games.map((game) => (
            <motion.div
              key={game.id}
              className="relative overflow-hidden rounded-lg shadow-lg"
              variants={itemVariants}
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between md:gap-10 gap-3">
                <div className="self-start">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-[#0FFF27] via-yellow-300 to-[#A8CE10] text-transparent bg-clip-text">
                    {game.name}
                  </h3>
                  <p className="md:text-lg text-xs text-white">
                    {game.description}
                  </p>
                </div>
                <div className="self-end">
                  <button
                    className="font-semibold text-xl text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right top, #751C41, #EE5151)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundImage =
                        "linear-gradient(to right top, #541932, #B63939)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundImage =
                        "linear-gradient(to right top, #751C41, #EE5151)";
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.backgroundImage = "none";
                      e.currentTarget.style.backgroundColor = "#2B2D2F";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.backgroundImage =
                        "linear-gradient(to right top, #751C41, #EE5151)";
                    }}
                    onClick={() => handlePlayClick(game)}
                  >
                    Play
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal for game mode switch */}
        {showModal && selectedGame && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black opacity-50"
                onClick={closeModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
              ></motion.div>
              <motion.div
                className="relative md:w-96 w-80 rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url(${selectedGame.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative p-6 flex flex-col">
                  <h2 className="text-3xl text-center font-medium mb-4 bg-gradient-to-r from-[#0FFF27] to-[#A8CE10] text-transparent bg-clip-text">
                    {selectedGame.name}
                  </h2>
                  <div className=" flex gap-3">
                    <button
                      className="w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 ease-in-out"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right top, #162D49, #29ABE2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundImage =
                          "linear-gradient(to right top, #012755, #186C90)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundImage =
                          "linear-gradient(to right top, #162D49, #29ABE2)";
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.backgroundImage = "none";
                        e.currentTarget.style.backgroundColor = "#001720";
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.backgroundImage =
                          "linear-gradient(to right top, #162D49, #29ABE2)";
                      }}
                      onClick={() => {
                        setSelectedMode("ICP");
                        navigate("/roshambo");
                      }}
                    >
                      <span className="text-sm font-semibold">Play in ICP</span>
                      <img src={icpLogo} alt="ICP" className="w-4 h-4" />
                    </button>
                    <button
                      className="w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 ease-in-out"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right top, #553004, #F7931A)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundImage =
                          "linear-gradient(to right top, #371F02, #844800)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundImage =
                          "linear-gradient(to right top, #553004, #F7931A)";
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.backgroundImage = "none";
                        e.currentTarget.style.backgroundColor = "#1F1101";
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.backgroundImage =
                          "linear-gradient(to right top, #553004, #F7931A)";
                      }}
                      onClick={() => {
                        setSelectedMode("BTC");
                        window.location.href =
                          "https://btc.dragoneyes.xyz/roshambo";
                      }}
                    >
                      <span className="text-sm font-semibold">Play in BTC</span>
                      <img src={btcLogo} alt="BTC" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* footer */}
      <footer className="mt-8 text-center pb-4 text-white">
        <div className="flex justify-center space-x-4 mb-2">
          <Link
            to="https://t.me/HouseOfXDragon"
            target="_blank"
            className="text-2xl"
            aria-label="Telegram"
          >
            <span role="img" aria-label="Telegram icon">
              <FontAwesomeIcon icon={faTelegram} />
            </span>
          </Link>
          <Link
            to="https://x.com/dragoneyesxyz"
            className="text-2xl"
            aria-label="Twitter"
          >
            <span role="img" aria-label="Twitter icon">
              <FontAwesomeIcon icon={faXTwitter} />
            </span>
          </Link>
        </div>
        <p className="text-sm text-gray-500">@dragoneyes 2024</p>
      </footer>
      {/* Bottom Nav Bar */}
      <BottomNavbar />
      {/* Connect Wallet Modal Popup */}
      <ConnectModal />
      {/* Wallet  */}
      <Wallet />
    </div>
  );
};

export default Home;
