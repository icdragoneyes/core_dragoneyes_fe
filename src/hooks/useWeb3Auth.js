import { useState, useEffect } from "react";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState(null);

  useEffect(() => {
    const init = async () => {
      const clientId = "BCcBHTN7E6L12h2cF429JFoUAifqjf71mNMlrlX4JFVtOMxkCjmts-_2hrtBe6vL9iEjLx3geQcTjdUNOzumW7E";

      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: "0x3", // Devnet chainId
        rpcTarget: "https://api.devnet.solana.com",
        displayName: "Solana Devnet",
        blockExplorerUrl: "https://explorer.solana.com/?cluster=devnet",
        ticker: "SOL",
        tickerName: "Solana",
      };
      const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

      const web3authInstance = new Web3Auth({
        clientId,
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
        chainConfig,
        privateKeyProvider,
      });

      await web3authInstance.initModal();

      setWeb3auth(web3authInstance);
    };

    init();
  }, []);

  return web3auth;
};

export default useWeb3Auth;

// this below how to use it in your component

// const web3auth = useWeb3Auth();

// const handleWeb3AuthConnect = async () => {
//   if (web3auth) {
//     try {
//       await web3auth.connect();
//     } catch (error) {
//       console.error("Error connecting with Web3Auth:", error);
//     }
//   } else {
//     console.error("Web3Auth is not initialized");
//   }
// }
