import { Link } from "react-router-dom";
import bg from "../assets/landing/bg.jpg";
import logo from "../assets/landing/logo.png";
import NodeMenu from "../components/NodeMenu";
import { useState, useEffect } from "react";
import { FaDice, FaHandRock, FaSpinner } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import useWebSocket from "react-use-websocket";
import axios from "axios";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [totalUSDICP, setTotalUSDICP] = useState(false);
  const [totalICP, setTotalICP] = useState(false);
  const games = [
    {
      id: "dice",
      name: "Dice",
      icon: <FaDice />,
      navi: "https://dice.dragoneyes.xyz/",
    },
    { id: "spin", name: "FAP", icon: <FaSpinner />, navi: "/spin" },
    {
      id: "roshambo",
      name: "Roshambo",
      icon: <FaHandRock />,
      navi: "/roshambo",
    },
  ];

  async function getLastCoreData() {
    var aax = await axios.get("https://api.dragoneyes.xyz/fetchLastCoreData");
    var aa = aax.data;
    setTotalUSDICP(aa.usd);
    setTotalICP(aa.icp);
    //console.log(aa, "<<<<<<<<<");
  }

  useEffect(() => {
    getLastCoreData();
  }, []);

  useWebSocket("wss://api.dragoneyes.xyz:7878/core", {
    onMessage: async () => {
      await getLastCoreData();
    },
    shouldReconnect: () => true,
  });

  return (
    <div
      className="h-screen w-full bg-cover bg-center relative font-passion overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPosition: "center center",
      }}
    >
      {/* Header */}
      <header className="bg-[#EE5151] w-full p-4 sm:px-28 flex justify-between items-center font-inter text-base font-bold">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-12 mr-2" />
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="https://x.com/dragoneyesxyz"
            className="text-[#1E3557] hover:text-[#F8B22A] transition-colors duration-200 text-lg"
            target="_blank"
          >
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </a>
          <a
            href="https://docs.dragoneyes.xyz/"
            className="text-[#1E3557] hover:text-[#F8B22A] transition-colors duration-200 text-lg"
            target="_blank"
          >
            Docs
          </a>
          <div className="relative group">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center text-[#1E3557] hover:text-[#F8B22A] transition-colors duration-200 text-lg"
            >
              Play
              <svg
                className="w-4 h-4 ml-1 fill-current transition-transform duration-200 group-hover:rotate-180"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1E3557] rounded-md shadow-lg py-1 z-10">
                {games.map((game) => (
                  <Link
                    key={game.id}
                    to={game.navi}
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#F8B22A] hover:text-[#1E3557] transition-colors duration-200"
                  >
                    <span className="mr-2">{game.icon}</span>
                    {game.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <a
            href="https://t.me/HouseOfXDragon"
            className="text-[#1E3557] hover:text-[#F8B22A] transition-colors duration-200 flex items-center text-lg"
            target="_blank"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.26-2.05-.48-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.05-.78 4.12-1.79 6.86-2.98 8.19-3.55 3.9-1.67 4.71-1.96 5.24-1.97.12 0 .37.03.54.18.14.12.18.28.2.46-.01.06.01.24-.01.34z" />
            </svg>
            Telegram
          </a>
        </nav>
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </header>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs h-full bg-[#1E3557] text-white z-20 transition-all duration-300 ease-in-out transform shadow-lg ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 pt-16 space-y-4">
          <Link
            to="https://x.com/dragoneyesxyz"
            className="block py-2 text-lg hover:text-[#F8B22A] transition-colors duration-200"
            target="_blank"
          >
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </Link>
          <Link
            to="https://docs.dragoneyes.xyz/"
            className="block py-2 text-lg hover:text-[#F8B22A] transition-colors duration-200"
            target="_blank"
          >
            Docs
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center w-full text-left py-2 text-lg hover:text-[#F8B22A] transition-colors duration-200"
            >
              Play
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="mt-2 bg-[#2A4A7A] rounded-md shadow-lg py-1 space-y-2">
                {games.map((game) => (
                  <Link
                    key={game.id}
                    to={game.navi}
                    className="flex items-center px-4 py-3 text-sm text-white hover:bg-[#F8B22A] hover:text-[#1E3557] transition-all duration-200 rounded-md"
                  >
                    <span className="mr-3 text-lg">{game.icon}</span>
                    {game.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <a
            href="https://t.me/HouseOfXDragon"
            className="block py-2 text-lg hover:text-[#F8B22A] transition-colors duration-200"
            target="_blank"
          >
            Telegram
          </a>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 text-white hover:text-[#F8B22A] transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <main className="w-full h-full md:px-4 md:py-8 relative px-5 py-4">
        {/* Reward Box */}
        <div className="flex justify-center w-full mb-8 md:mb-0">
          <div className="bg-[#1E3557] bg-opacity-75 text-center text-white p-4 rounded-lg w-full max-w-xs">
            <h2 className="text-xl font-bold">Reward distributed:</h2>
            <p className="text-4xl font-bold text-[#D0B182]">
              $ {Number(parseFloat(totalUSDICP).toFixed(2)).toLocaleString()}
            </p>
            <p className="text-2xl font-bold text-[#EE5151]">
              {(Number(totalICP) / 1e8).toFixed(2).toString()} ICP
            </p>
          </div>
        </div>
        {/* Node Menu */}
        <div className="">
          <NodeMenu />
        </div>
      </main>
    </div>
  );
};

export default Home;
