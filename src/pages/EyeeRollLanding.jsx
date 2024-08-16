import { useAtom } from "jotai";
import EyeRoll from "../components/eyeroll/EyeRoll";
import { isConnectedAtom } from "../store/Atoms";
import EyeRollConnectModal from "../components/eyeroll/EyeRollConnectModal";
import { useEffect } from "react";
import useTelegramWebApp from "../hooks/useTelegramWebApp";
import { toast } from "react-toastify";

const EyeeRollLanding = () => {
  const [isConnected, setIsConnected] = useAtom(isConnectedAtom);

  const webApp = useTelegramWebApp();

  useEffect(() => {
    if (webApp && webApp.initialDataUnsafe && webApp.initialDataUnsafe.user) {
      const { user } = webApp.initialDataUnsafe;
      toast.success(`Hello ${user.first_name}!`);
    } else {
      console.log("Telegram user data not available");
    }

    const storedIsConnected = localStorage.getItem("isConnected");
    if (storedIsConnected === "true") {
      setIsConnected(true);
    }
  }, [setIsConnected, webApp]);

  if (!webApp) {
    return <div>Loading Telegram Web App...</div>;
  }

  return (
    <main className="w-full h-screen">
      <div>{!isConnected ? <EyeRollConnectModal isOpen={!isConnected} /> : <EyeRoll />}</div>
    </main>
  );
};

export default EyeeRollLanding;
