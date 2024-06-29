import { Link } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { isLoggedInAtom, isModalOpenAtom, loginInstanceAtom, userDataAtom, walletAddressAtom } from "../store/Atoms";

const Navbar = () => {

  const setConnectOpen = useSetAtom(isModalOpenAtom);
  const setUserData = useSetAtom(userDataAtom);
  const setWalletAddress = useSetAtom(walletAddressAtom);
  const [isloggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [loginInstance] = useAtom(loginInstanceAtom);

  const handleLogout = async () => {
    await loginInstance.logout();
    setIsLoggedIn(false);
    setUserData(null);
    setWalletAddress(null);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-blue-500 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-blue-500 hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link to="/spin" className="text-blue-500 hover:underline">
              Spin
            </Link>
          </li>
        </ul>
        <div>
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
                handleLogout();
              }}
              className="w-full max-w-xs mx-auto text-md px-3 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-200"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
