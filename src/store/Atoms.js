import { atom } from "jotai";

export const openloginAtom = atom(null);
export const isLoggedInAtom = atom(null);
export const canisterActorAtom = atom(null);
export const userDataAtom = atom(null);
export const gameDataAtom = atom(null);
export const ticketPriceAtom = atom(null);
export const walletAddressAtom = atom(null);
export const icpAgentAtom = atom(null);
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

// Wallet
export const icpBalanceAtom = atom(null);
export const eyesBalanceAtom = atom(null);

// Roshambo Atoms Related
export const roshamboActorAtom = atom(null);
export const timeMultiplierAtom = atom(null);
export const eyesWonAtom = atom(null);
