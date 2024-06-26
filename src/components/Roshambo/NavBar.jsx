import { useState } from "react";
import logo from "../../assets/img/logo.png";
import menu from "../../assets/img/menu.png";
import close from "../../assets/img/close.png"; // Add a close icon for the side menu
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#e35721] flex justify-between items-center p-4 h-20 shadow-md sticky top-0 z-20">
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
          <ul className="space-y-4 md:space-y-0 md:flex items-center md:space-x-4 md:text-base font-bold font-mono md:text-center whitespace-nowrap">
            <li>
              <button className="text-white hover:text-[#e35721] hover:bg-white h-11 w-28 py-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105" onClick={toggleMenu}>
                Game Rules
              </button>
            </li>
            <li>
              <button className="text-white hover:text-[#e35721] hover:bg-white h-11 w-32 py-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105" onClick={toggleMenu}>
                How To Play?
              </button>
            </li>
            <li>
              <button className="text-white bg-[#006823] hover:bg-[#004d1a] p-2 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105" onClick={toggleMenu}>
                Connect Wallet
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </nav>
  );
};

export default NavBar;
