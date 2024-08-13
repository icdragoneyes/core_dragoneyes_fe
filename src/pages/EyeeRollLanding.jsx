import { useAtom } from "jotai";
import EyeRoll from "../components/eyeroll/EyeRoll";
import { isConnectedAtom } from "../store/Atoms";
import EyeRollConnectModal from "../components/eyeroll/EyeRollConnectModal";
import { useEffect } from "react";

const EyeeRollLanding = () => {
  const [isConnected, setIsConnected] = useAtom(isConnectedAtom);

  useEffect(() => {
    const storedIsConnected = localStorage.getItem("isConnected");
    if (storedIsConnected === "true") {
      setIsConnected(true);
    }
  }, [setIsConnected]);

  return <main>{!isConnected ? <EyeRollConnectModal isOpen={!isConnected} /> : <EyeRoll />}</main>;
};

export default EyeeRollLanding;
