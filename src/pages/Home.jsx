import { Link } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { gameDataAtom, isLoggedInAtom, isModalOpenAtom, isModalWalletOpenAtom, walletAddressAtom } from "../store/Atoms";
import ConnectModal from "../components/ConnectModal";
import useInitializeOpenlogin from "../hooks/useInitializeOpenLogin";
import ChatButton from "../components/ChatButton";
import Wallet from "../components/Wallet";

function Home() {
  const setConnectOpen = useSetAtom(isModalOpenAtom);
  // const setUserData = useSetAtom(userDataAtom);
  const setIsModalWalletOpen = useSetAtom(isModalWalletOpenAtom);
  const [isloggedIn] = useAtom(isLoggedInAtom);
  const [walletAddress] = useAtom(walletAddressAtom);
  const [gameData] = useAtom(gameDataAtom);
  // const [loginInstance] = useAtom(loginInstanceAtom);

  useInitializeOpenlogin();

  // const handleLogout = async () => {
  //   await loginInstance.logout();
  //   setIsLoggedIn(false);
  //   setUserData(null);
  //   setWalletAddress(null);
  // };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Home Page</h1>
      <nav className="mb-6">
        <ul className="flex justify-center space-x-4">
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
          <li>
            <Link to="/roshambo" className="text-blue-500 hover:underline">
              Roshambo
            </Link>
          </li>
        </ul>
      </nav>
      <div className="text-center mb-6">
        {!isloggedIn ? (
          <button
            onClick={() => {
              setConnectOpen(true);
            }}
            className="w-full max-w-xs mx-auto text-2xl px-6 py-3 font-passion text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-200"
          >
            Connect Wallet to Play
          </button>
        ) : (
          <button
            onClick={() => {
              setIsModalWalletOpen(true);
            }}
            className="w-full max-w-xs mx-auto text-2xl px-6 py-3 font-passion text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-200"
          >
            Wallet
          </button>
        )}
      </div>
      {walletAddress && (
        <div className="text-center mb-6">
          <p className="text-lg">
            Wallet Address: <span className="font-mono">{walletAddress}</span>
          </p>
          <p className="text-lg">
            Game Data: <span className="font-mono">{gameData.toString()}</span>
          </p>
        </div>
      )}
      <ConnectModal />
      <Wallet />
      <ChatButton groupUrl={"HouseOfXDragon/935"} />
    </div>
  );
}

export default Home;
