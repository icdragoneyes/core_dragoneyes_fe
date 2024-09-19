import games from "../assets/img/navbar/games.svg";
import friends from "../assets/img/navbar/friends.svg";
import quest from "../assets/img/navbar/quest.svg";
import wallet from "../assets/img/navbar/wallet.svg";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import {
  isAuthenticatedAtom,
  isLoggedInAtom,
  isModalOpenAtom,
  isModalWalletOpenAtom,
  telegramWebAppAtom,
} from "../store/Atoms";
import analytics from "../utils/segment";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";

const BottomNavbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const setIsWalletModalOpen = useSetAtom(isModalWalletOpenAtom);
  const setConnectOpen = useSetAtom(isModalOpenAtom);
  const [telegram] = useAtom(telegramWebAppAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  const location = useLocation();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleWalletClick = () => {
    analytics.track("Wallet Button Clicked", {
      label: "Wallet Button", // Additional info about the button
      category: "User Engagement", // Categorize the event
    });
    if (isLoggedIn) {
      setIsWalletModalOpen(true);
    } else {
      if (telegram.initData == "") {
        setConnectOpen(true);
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  const navbarItems = [
    {
      to: isAuthenticated === false ? "/roshambo" : "/roshambo_telegram",
      icon: games,
      label: "Play",
    },
    {
      to: "/leaderboard",
      icon: friends,
      label: "Leaderboard",
      disabled: false,
    },
    { to: "/eyeroll/quest", icon: quest, label: "Quest", disabled: true },
    { to: "/wallet", icon: wallet, label: "Wallet" },
  ];

  return (
    <>
      <button
        onClick={toggleCollapse}
        className={`fixed ${
          !isCollapsed ? "bottom-[55px]" : "bottom-0"
        } left-1/2 transform -translate-x-1/2 w-8 h-4 bg-slate-300 rounded-t-lg flex items-center justify-center transition-all duration-300`}
      >
        {isCollapsed ? (
          <MdOutlineKeyboardArrowUp className="text-white h-4 w-4" />
        ) : (
          <MdOutlineKeyboardArrowDown className="text-white h-4 w-4" />
        )}
      </button>
      <nav
        className={`fixed bottom-0 w-full bg-[#282828] text-center z-10 font-passero transition-all duration-300 ${
          isCollapsed ? "transform translate-y-full" : "transform translate-y-0"
        }`}
      >
        <ul className="flex justify-around items-center py-2">
          {navbarItems.map(({ to, icon, label, disabled }) => (
            <li key={to}>
              {label === "Wallet" ? (
                <button
                  onClick={handleWalletClick}
                  className={`flex flex-col items-center ${
                    isActive(to) ? "text-[#E8A700]" : "text-white"
                  }`}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`h-6 w-6 ${
                      isActive(to) ? "filter brightness-0 invert" : ""
                    }`}
                  />
                  <span className="text-xs">{label}</span>
                </button>
              ) : (
                <div
                  className={`flex flex-col items-center ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : isActive(to)
                      ? "text-[#E8A700]"
                      : "text-white"
                  }`}
                >
                  {disabled ? (
                    <>
                      <img src={icon} alt={label} className="h-6 w-6" />
                      <span className="text-xs text-slate-200">{label}</span>
                    </>
                  ) : (
                    <Link to={to} className="flex flex-col items-center">
                      <img
                        src={icon}
                        alt={label}
                        className={`h-6 w-6 ${
                          isActive(to) ? "filter brightness-0 invert" : ""
                        }`}
                      />
                      <span className="text-xs">{label}</span>
                    </Link>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default BottomNavbar;
