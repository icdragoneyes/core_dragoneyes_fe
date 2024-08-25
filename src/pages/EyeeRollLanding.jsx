import { useAtom } from "jotai";
import EyeRoll from "../components/eyeroll/EyeRoll";
import { isAuthenticatedAtom, isConnectedAtom } from "../store/Atoms";
import EyeRollConnectModal from "../components/eyeroll/EyeRollConnectModal";

const EyeeRollLanding = () => {
  const [isConnected] = useAtom(isConnectedAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  return (
    <div>
      {!isConnected && !isAuthenticated && <EyeRollConnectModal />}

      {isConnected && isAuthenticated && <EyeRoll />}
    </div>
  );
};

export default EyeeRollLanding;
