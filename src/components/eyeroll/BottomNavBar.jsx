import { FaDice, FaUserFriends, FaTasks } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const BottomNavBar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white flex justify-around items-center py-2 z-20">
      <Link to="/eyeroll" className={`flex flex-col items-center ${location.pathname === "/eyeroll" ? "text-blue-500" : ""}`}>
        <FaDice size={24} />
        <span className="text-xs">Eye Roll</span>
      </Link>
      <Link to="/eyeroll/friend" className={`flex flex-col items-center ${location.pathname === "/eyeroll/friend" ? "text-blue-500" : ""}`}>
        <FaUserFriends size={24} />
        <span className="text-xs">Friend</span>
      </Link>
      <Link to="/eyeroll/quest" className={`flex flex-col items-center ${location.pathname === "/eyeroll/earn" ? "text-blue-500" : ""}`}>
        <FaTasks size={24} />
        <span className="text-xs">Quest</span>
      </Link>
      <Link to="/eyeroll/leaderboard" className={`flex flex-col items-center ${location.pathname === "/eyeroll/leaderboard" ? "text-blue-500" : ""}`}>
        <FaTasks size={24} />
        <span className="text-xs">Leaderboard</span>
      </Link>
    </div>
  );
};

export default BottomNavBar;
