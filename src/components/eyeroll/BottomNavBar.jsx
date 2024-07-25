import { FaDice, FaUserFriends, FaTasks } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const BottomNavBar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white flex justify-around items-center py-2">
      <Link to="/eyeroll" className={`flex flex-col items-center ${location.pathname === "/eyeroll" ? "text-blue-500" : ""}`}>
        <FaDice size={24} />
        <span className="text-sm">Eye Roll</span>
      </Link>
      <Link to="/eyeroll/friend" className={`flex flex-col items-center ${location.pathname === "/eyeroll/friend" ? "text-blue-500" : ""}`}>
        <FaUserFriends size={24} />
        <span className="text-sm">Friend</span>
      </Link>
      <Link to="/eyeroll/earn" className={`flex flex-col items-center ${location.pathname === "/eyeroll/earn" ? "text-blue-500" : ""}`}>
        <FaTasks size={24} />
        <span className="text-sm">Earn</span>
      </Link>
    </div>
  );
};

export default BottomNavBar;