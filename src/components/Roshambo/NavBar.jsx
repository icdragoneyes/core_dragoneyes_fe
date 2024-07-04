import { useState } from "react";
import logo from "../../assets/img/logo.png";
import menu from "../../assets/img/menu.png";
import close from "../../assets/img/close.png"; // Add a close icon for the side menu
import { Link } from "react-router-dom";
import { isLoggedInAtom, isModalWalletOpenAtom } from "../../store/Atoms";
import { useAtom, useSetAtom } from "jotai";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const setIsWalletModalOpen = useSetAtom(isModalWalletOpenAtom);

  const toggleMenu = (open) => {
    setIsMenuOpen(!isMenuOpen);
    if (open === "open") {
      setIsWalletModalOpen(true);
    }
  };

  return (
    <nav className="bg-[#e35721] flex justify-between items-center p-4 h-20 shadow-md sticky top-0 z-10">
      <Link to="/">
        <img src={logo} alt="Roshambo Logo" className="h-12" />
      </Link>
      <div className="md:hidden">
        <img src={menu} alt="Menu Icon" className="h-8 cursor-pointer" onClick={toggleMenu} />
      </div>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:relative md:bg-transparent md:flex md:items-center`}>
        <aside className="bg-[#e35721] w-64 h-full p-4 md:p-0 md:bg-transparent md:flex md:items-center md:ml-auto fixed right-0 md:right-40">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <Link to="/">
              <img src={logo} alt="Roshambo Logo" className="h-8" />
            </Link>
            <img src={close} alt="Close Icon" className="h-8 cursor-pointer" onClick={toggleMenu} />
          </div>
          <ul className="space-y-4 md:space-y-0 md:flex items-center md:space-x-4 md:text-base font-bold font-passion md:text-center whitespace-nowrap">
            <li>
              <button className="text-white hover:text-[#e35721] hover:bg-white h-11 md:w-28 w-20 py-3 md:px-0 px-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105" onClick={toggleMenu}>
                Game Rules
              </button>
            </li>
            <li>
              <button className="text-white hover:text-[#e35721] hover:bg-white h-11 md:w-28 w-24 py-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105" onClick={toggleMenu}>
                How To Play?
              </button>
            </li>
            <li>
              <button className="text-white bg-[#006823] hover:bg-[#004d1a] p-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105" onClick={() => toggleMenu("open")}>
                {!isLoggedIn ? "Connect Wallet" : "Wallet"}
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </nav>
  );
};

export default NavBar;
