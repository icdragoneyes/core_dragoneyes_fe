import { useAtom } from "jotai";
import EyeRoll from "../components/eyeroll/EyeRoll";
import { isConnectedAtom, isAuthenticatedAtom } from "../store/Atoms";
import EyeRollConnectModal from "../components/eyeroll/EyeRollConnectModal";
import { useEffect } from "react";
import useTelegramWebApp from "../hooks/useTelegramWebApp";

const EyeeRollLanding = () => {
  const [isConnected, setIsConnected] = useAtom(isConnectedAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const { authenticateUser } = useTelegramWebApp();

  useEffect(() => {
    const storedIsConnected = localStorage.getItem("isConnected");
    if (storedIsConnected === "true") {
      setIsConnected(true);
    }
  }, [setIsConnected]);

  return (
    <div>
      {!isConnected && <EyeRollConnectModal />}
      {isConnected && isAuthenticated && <EyeRoll />}
      {isConnected && !isAuthenticated && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <p>Please authenticate with Telegram to play EyeRoll</p>
          <button onClick={() => authenticateUser()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
            Authenticate with Telegram
          </button>
        </div>
      )}
    </div>
  );
};

export default EyeeRollLanding;
