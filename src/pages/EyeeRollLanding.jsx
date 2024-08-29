import { useAtom } from "jotai";
import EyeRoll from "../components/eyeroll/EyeRoll";
import { isConnectedAtom } from "../store/Atoms";
import EyeRollConnectModal from "../components/eyeroll/EyeRollConnectModal";
import BottomNavbar from "../components/BottomNavbar";

const EyeeRollLanding = () => {
  const [isConnected] = useAtom(isConnectedAtom);
  // const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  return (
    <div>
      {!isConnected ? <EyeRollConnectModal /> : <EyeRoll />}
      <BottomNavbar />
    </div>
  );
};

export default EyeeRollLanding;
