import { atom } from "jotai";
import icp from "../assets/img/icp.png";

//general
export const userAtom = atom(false);
export const chainsAtom = atom({
  sol: {
    name: "sol",
    decimal: 1e9,
    minWithdrawal: 0.05,
    bets: [0.01, 0.1, 0.5],
    transferFee: 100000,
  },
  icp: {
    name: "icp",
    decimal: 1e8,
    minWithdrawal: 0.5,
    bets: [0.1, 1, 5],
    transferFee: 10000,
  },
  btc: {
    name: "btc",
    decimal: 1e8,
    minWithdrawal: 0.005,
    bets: [0.00001, 0.0001, 0.0005],
    transferFee: 10,
  },
});
export const selectedChainAtom = atom({
  name: "icp",
  decimal: 1e8,
  minWithdrawal: 0.5,
  bets: [0.1, 1, 5],
  transferFee: 10000,
});
export const identifierAtom = atom(null);
export const preConnectRoshamboAtom = atom(null);
export const chainNameAtom = atom("ICP");
export const currencyDecimalAtom = atom(1e8);
export const openloginAtom = atom(null);
export const isLoggedInAtom = atom(null);
export const canisterActorAtom = atom(null);
export const userDataAtom = atom(null);
export const gameDataAtom = atom(null);
export const ticketPriceAtom = atom(null);
export const walletAddressAtom = atom(null);
export const icpAgentAtom = atom(null);
export const solAgentAtom = atom(false);
export const eyesLedgerAtom = atom(null);
export const isModalOpenAtom = atom(false);
export const isModalWalletOpenAtom = atom(false);
export const loginInstanceAtom = atom(null);
export const setToggleMobileMenuAtom = atom(false);
export const setCurrentEmailAtom = atom(null);
export const setWalletAliasAtom = atom(null);
export const spinActorAtom = atom(null);
export const isModalHowToPlayOpenAtom = atom(false);
export const spinGameDataAtom = atom(false);
export const spinTimeAtom = atom(null);
export const isSpinningAtom = atom(null);
export const coreAtom = atom(null);
export const minterAtom = atom(null);
export const selectedWalletAtom = atom(9);
export const eyesModeAtom = atom(false);

// Wallet
export const icpBalanceAtom = atom(0);
export const eyesBalanceAtom = atom(0);
export const walletAliasAtom = atom("");
export const logosModeAtom = atom(icp);

// Roshambo Atoms Related
export const roshamboActorAtom = atom(null);
export const timeMultiplierAtom = atom(null);
export const eyesWonAtom = atom(null);
export const roshamboEyesAtom = atom(false);
export const roshamboLastBetAtom = atom(false);
export const roshamboNewBetAtom = atom(false);
export const roshamboSOLAtom = atom(false);
export const liveNotificationAtom = atom(false);
export const betHistoryCardAtom = atom(false);

// streak mode atoms
export const streakModeAtom = atom(false);
export const streakRewardAtom = atom(0);
export const currentStreakAtom = atom(0);
export const streakMultiplierAtom = atom(0);
export const isStreakModalOpenAtom = atom(false);
export const betAtom = atom([]);
export const isSwitchingAtom = atom(false);

// EyeeRoll atoms
export const isConnectedAtom = atom(false);
export const telegramWebAppAtom = atom(false);
export const telegramUserDataAtom = atom(null);
export const telegramInitDataAtom = atom(null);
export const isAuthenticatedAtom = atom(false);
export const telegramAuthAtom = atom(false);

//minter atoms
export const dragonSOLMinterAtom = atom(false);
