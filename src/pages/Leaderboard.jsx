import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { Helmet } from "react-helmet-async";

import BottomNavBar from "../components/BottomNavbar";
import LastHouseShot from "../components/LastHouseShot";
import LeaderboardMobile from "../components/Leaderboard/LeaderBoardMobile";
import Wallet3 from "../components/Wallet3";
import useInitializeOpenlogin from "../hooks/useInitializeOpenLogin";
import useTelegramWebApp from "../hooks/useTelegramWebApp";
import { isAuthenticatedAtom, telegramUserDataAtom } from "../store/Atoms";

const LeaderBoard = () => {
  const { authenticateUser } = useTelegramWebApp();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);

  // Hook to initialize OpenLogin from torus
  useInitializeOpenlogin();

  useEffect(() => {
    const handleAuthenticate = async () => {
      if (!isAuthenticated) await authenticateUser();
    };

    if (telegramUserData && !isAuthenticated) {
      handleAuthenticate();
    } else {
      console.log("Telegram user data not available");
    }
  }, [telegramUserData, authenticateUser, isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main
      className={`${
        window.innerWidth < 768
          ? "overflow-hidden h-screen"
          : "h-screen w-screen"
      }`}
    >
      <Helmet>
        <title>Dragon Eyes | Leaderboard</title>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        <meta
          name="description"
          content="Roshambo -- Rock Paper Scissor \nDouble your money if you can beat me!"
        />

        <meta
          property="og:title"
          key="og:title"
          content="Dragon Eyes | Roshambo -- Rock Paper Scissor"
        />
        <meta property="og:locale" key="og:locale" content="id-ID" />
        <meta property="og:type" key="og:type" content="website" />
        <meta
          property="og:url"
          key="og:url"
          content="https://dragoneyes.xyz/roshambo"
        />
        <meta
          property="og:description"
          content="Roshambo -- Rock Paper Scissor \nDouble your money if you can beat me!"
        />

        <meta
          property="og:image"
          key="og:image"
          content="https://i.ibb.co/xXBSwvh/dragon-icon-small.png"
        />

        <meta
          name="twitter:card"
          key="twitter:card"
          content="https://i.ibb.co/xXBSwvh/dragon-icon-small.png"
        />
        <meta
          name="twitter:site"
          key="twitter:site"
          content="https://dragoneyes.xyz/roshambo"
        />
        <meta name="twitter:title" key="twitter:title" content="Dragon Eyes" />
        <meta
          name="twitter:description"
          key="twitter:description"
          content="Roshambo -- Rock Paper Scissor \nDouble your money if you can beat me!"
        />
        <meta
          name="twitter:image"
          key="twitter:image"
          content="https://i.ibb.co/xXBSwvh/dragon-icon-small.png"
        />
        <link rel="manifest" href="/manifest.json" />
      </Helmet>
      <LastHouseShot hideHowToPlay />
      {isMobile ? <LeaderboardMobile /> : <div />}
      <Wallet3 />
      <BottomNavBar />
    </main>
  );
};

export default LeaderBoard;
