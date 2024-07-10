import logo from "../../assets/img/logo.png";
import menu from "../../assets/img/menu.png";
import close from "../../assets/img/close.png";
import HowToPlay from "./HowToPlay";
import { useState } from "react";
import { Link } from "react-router-dom";
import { isLoggedInAtom, isModalOpenAtom, isModalWalletOpenAtom } from "../../store/Atoms";
import { useAtom, useSetAtom } from "jotai";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const setIsWalletModalOpen = useSetAtom(isModalWalletOpenAtom);
  const setConnectOpen = useSetAtom(isModalOpenAtom);

  const toggleMenu = (open) => {
    setIsMenuOpen(!isMenuOpen);
    if (open === "open" && isLoggedIn) {
      setIsWalletModalOpen(true);
    }
    if (open === "open" && !isLoggedIn) {
      setConnectOpen(true);
    }
  };

  return (
    <>
      <nav className="bg-[#e35721] flex justify-between items-center px-4 md:px-8 lg:px-16 h-20 shadow-md sticky top-0 z-10">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Roshambo Logo" className="h-14 md:h-16" />
        </Link>
        <div className="md:hidden">
          <img src={menu} alt="Menu Icon" className="h-8 cursor-pointer" onClick={() => toggleMenu()} />
        </div>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:relative md:bg-transparent md:flex md:items-center`}>
          <div className="bg-[#e35721] w-64 h-full p-4 md:p-0 md:w-auto md:h-auto md:bg-transparent md:flex md:items-center fixed right-0 md:relative">
            <div className="flex justify-between items-center mb-4 md:hidden">
              <Link to="/">
                <img src={logo} alt="Roshambo Logo" className="h-10" />
              </Link>
              <img src={close} alt="Close Icon" className="h-8 cursor-pointer" onClick={() => toggleMenu()} />
            </div>
            <ul className="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-6 font-bold font-passion text-center">
              <li>
                <button className="text-white hover:text-[#e35721] hover:bg-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105" onClick={() => setIsHowToPlayOpen(true)}>
                  How To Play?
                </button>
              </li>
              <li>
                <a href="https://t.me/HouseOfXDragon/1" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#e35721] hover:bg-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
                  Telegram
                </a>
              </li>
              <li>
                <button className="text-white bg-[#006823] hover:bg-[#004d1a] px-4 py-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105" onClick={() => toggleMenu("open")}>
                  {!isLoggedIn ? "Connect Wallet" : "Wallet"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <HowToPlay isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
    </>
  );
};
export default NavBar;
