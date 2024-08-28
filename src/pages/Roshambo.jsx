import Arena from "../components/Roshambo/Arena";
import NavBar from "../components/Roshambo/NavBar";
import { Helmet } from "react-helmet-async";

const Roshambo = () => {
  return (
    <main
      className={`${
        window.innerWidth < 768
          ? "overflow-hidden h-screen"
          : "h-screen w-screen"
      }`}
    >
      <Helmet>
        <title>Dragon Eyes | Roshambo -- Rock Paper Scissor</title>
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
          content="https://icp.dragoneyes.xyz"
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
      <NavBar />
      <Arena />
    </main>
  );
};

export default Roshambo;
