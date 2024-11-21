import WalletAsPage from "../components/WalletAsPage";
import RoshamboHeader from "../components/RoshamboHeader";
import BottomNavbar from "../components/BottomNavbar";
import { useEffect } from "react";

const WalletPage = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
    document.getElementsByTagName("head")[0].appendChild(meta);

    return () => {
      document.getElementsByTagName("head")[0].removeChild(meta);
    };
  }, []);
  return (
    <main className="overflow-hidden h-screen">
      <RoshamboHeader isWalletPage={true} />
      <WalletAsPage />
      <BottomNavbar />
    </main>
  );
};

export default WalletPage;
