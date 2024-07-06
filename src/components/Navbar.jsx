import { Link } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { isLoggedInAtom, isModalOpenAtom, isModalWalletOpenAtom } from "../store/Atoms";
import { useState } from "react";
import menu from "../assets/img/menu-black.png";
import close from "../assets/img/close.png";

const Navbar = () => {
  const setConnectOpen = useSetAtom(isModalOpenAtom);
  const [isloggedIn] = useAtom(isLoggedInAtom);
  const setIsModalWalletOpen = useSetAtom(isModalWalletOpenAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const setIsWalletModalOpen = useSetAtom(isModalWalletOpenAtom);

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
    <nav className="bg-primary-gray shadow-md sticky top-0 z-20">
      <div className="px-4 py-2 flex justify-between items-center">
        <div className="h-8"></div>
        <div className="md:hidden">
          <img src={menu} alt="Menu Icon" className="h-4 cursor-pointer" onClick={toggleMenu} />
        </div>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:relative md:bg-transparent md:flex md:items-center`}>
          <aside className="bg-primary-gray w-64 h-full p-4 md:p-0 md:bg-transparent md:flex md:items-center md:ml-auto fixed right-0 md:right-40">
            <div className="flex justify-between items-center mb-4 md:hidden">
              <div className="w-4 h-4"></div>
              <img src={close} alt="Close Icon" className="h-4 cursor-pointer" onClick={toggleMenu} />
            </div>
            <ul className="space-y-4 md:space-y-0 md:flex items-center md:space-x-4 md:text-base md:text-center whitespace-nowrap">
              <li>
                <Link to="/" className="text-dark-blue hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-dark-blue hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/spin" className="text-dark-blue hover:underline">
                  Spin
                </Link>
              </li>
              <li>
                {!isloggedIn ? (
                  <button
                    onClick={() => {
                      setConnectOpen(true);
                    }}
                    className="w-full max-w-xs mx-auto text-md px-3 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-200"
                  >
                    Connect Wallet to Play
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsModalWalletOpen(true);
                    }}
                    className="w-full max-w-xs mx-auto text-md px-3 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-200"
                  >
                    Wallet
                  </button>
                )}
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
