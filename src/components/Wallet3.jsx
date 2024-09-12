import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode.react";
const { PublicKey } = require("@solana/web3.js");
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import HowToPlay from "./Roshambo/HowToPlay";
// import eyes from "../assets/img/dragon.png";
import icp from "../assets/img/icp.png";
import copy from "../assets/copy.png";
import solLogo from "../assets/img/solana.png";
// import icpLogo from "../assets/wallet/icp.png";
import user_img from "../assets/wallet/user-img.jpg";
import share_logo from "../assets/wallet/share.png";
import shut from "../assets/wallet/shut.png";
import { toast } from "react-toastify";
import {
  eyesBalanceAtom,
  // eyesModeAtom,
  eyesLedgerAtom,
  icpAgentAtom,
  icpBalanceAtom,
  isLoggedInAtom,
  isModalWalletOpenAtom,
  // logosModeAtom,
  // isSwitchingAtom,
  userDataAtom,
  walletAddressAtom,
  isAuthenticatedAtom,
  telegramWebAppAtom,
  loginInstanceAtom,
  telegramUserDataAtom,
  chainNameAtom,
  currencyDecimalAtom,
  selectedChainAtom,
  dragonSOLMinterAtom,
  userAtom,
  //selectedWalletAtom
} from "../store/Atoms";
// import walletlogo from "../assets/wallet/wallet-blue.png";
import star from "../assets/wallet/star.png";
import analytics from "../utils/segment";

const Wallet3 = () => {
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
  const [isModalWaletOpen, setIsModalWalletOpen] = useAtom(isModalWalletOpenAtom);
  const [icpBalance, setIcpBalance] = useAtom(icpBalanceAtom);
  const [eyesBalance, setEyesBalance] = useAtom(eyesBalanceAtom);
  const [eyesLedger] = useAtom(eyesLedgerAtom);
  const [currencyAgent] = useAtom(icpAgentAtom);
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);
  const setUserData = useSetAtom(userDataAtom);
  const [transferError, setTransferError] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [activeTab, setActiveTab] = useState("topup");
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [accountId, setAccountid] = useState("");
  const [level, setLevel] = useState(0);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegram] = useAtom(telegramWebAppAtom);
  const [loginInstance] = useAtom(loginInstanceAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);
  const [chainName] = useAtom(chainNameAtom);
  const [currencyDecimal] = useAtom(currencyDecimalAtom);
  const [chain] = useAtom(selectedChainAtom);
  const [dragonMinter] = useAtom(dragonSOLMinterAtom);
  const [user] = useAtom(userAtom);
  const [counter, setCounter] = useState(0);
  const [updatingBalance, setUpdatingBalance] = useState(false);
  const referralCode = "TH10DXM62";

  useEffect(() => {
    if (walletAddress) {
      const acc = {
        principal: Principal.fromText(walletAddress),
        subaccount: [],
      };
      const accid = AccountIdentifier.fromPrincipal(acc);
      setAccountid(accid.toHex());
    }
    if (chain.name == "sol") {
      //console.log("chain is sol");
      setAccountid(user.solMinter);
    }
  }, [walletAddress, chain.name, user.solMinter]);

  function isValidSolanaAddress(address) {
    try {
      const publicKey = new PublicKey(address);
      return PublicKey.isOnCurve(publicKey); // Returns true if the address is valid
    } catch (error) {
      return false; // Invalid address
    }
  }

  function copyToClipboard(text, type) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        let message = type + " copied";

        toast.success(message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch(() => {
        toast.error("Failed To Copy Text", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }

  const closeModal = useCallback(() => {
    setIsModalWalletOpen(false);
  }, [setIsModalWalletOpen]);

  const pasteFromClipboard = () => {
    navigator.clipboard
      .readText()
      .then((clipText) => {
        setTargetAddress(clipText);
        checkAddressType(clipText);
      })
      .catch((err) => {
        console.error("Failed to read clipboard contents: ", err);
      });
  };

  // async function handleSwitchMode(mode) {
  //   setIsSwitching(true);
  //   setEyesMode(mode);
  //   if (mode) {
  //     setLogos(eyes);
  //   } else {
  //     setLogos(icp);
  //   }

  //   closeModal();
  // }

  const handleLogout = async () => {
    analytics.track("User Logged Out");
    await loginInstance.logout();
    setIsLoggedIn(false);
    setUserData(null);
    setWalletAddress(null);
    setIsModalWalletOpen(false);
  };

  const getUserBalance = async () => {
    const account = {
      owner: Principal.fromText(walletAddress),
      subaccount: [],
    };
    const icpBalanceRaw = await currencyAgent.icrc1_balance_of(account);
    // console.log(icpBalanceRaw, "<<<< wallet3 bc");
    const eyesBalanceRaw = await eyesLedger.icrc1_balance_of(account);

    setEyesBalance(Number(eyesBalanceRaw) / 100000000);
    setIcpBalance(Number(icpBalanceRaw) / chain.decimal);
  };

  useEffect(() => {
    // Function to be called every 10 seconds
    const igetUserBalance = async () => {
      const account = {
        owner: Principal.fromText(walletAddress),
        subaccount: [],
      };
      const icpBalanceRaw = await currencyAgent.icrc1_balance_of(account);
      const eyesBalanceRaw = await eyesLedger.icrc1_balance_of(account);
      // console.log(icpBalanceRaw, "<<<<<<<<<iget");
      //const minterAddr = await dragonMinter.getMinterAddress();
      //console.log(minterAddr, "<<<<<<<< minteraddr");
      //console.log(icpBalanceRaw, "<<<< wallet3 bc2");
      setEyesBalance(Number(eyesBalanceRaw) / 100000000);
      setIcpBalance(Number(icpBalanceRaw) / chain.decimal);
    };
    const intervalId = setInterval(() => {
      if (counter > 0) {
        setCounter(0);
      } else {
        setCounter(1);
      }
      if (walletAddress) igetUserBalance();
      //console.log("count! " + walletAddress);
    }, 10000); // 10 seconds in milliseconds

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [walletAddress, chain.decimal, counter, currencyAgent, eyesLedger, setEyesBalance, setIcpBalance]);

  useEffect(() => {
    const getUserBalance = async () => {
      const account = {
        owner: Principal.fromText(walletAddress),
        subaccount: [],
      };
      const icpBalanceRaw = await currencyAgent.icrc1_balance_of(account);
      const eyesBalanceRaw = await eyesLedger.icrc1_balance_of(account);
      //const minterAddr = await dragonMinter.getMinterAddress();
      //console.log(minterAddr, "<<<<<<<< minteraddr");
      //console.log(icpBalanceRaw, "<<<< wallet3 bc2");
      setEyesBalance(Number(eyesBalanceRaw) / 100000000);
      setIcpBalance(Number(icpBalanceRaw) / chain.decimal);
    };

    if (walletAddress && currencyAgent && eyesLedger) {
      getUserBalance();
    }
  }, [walletAddress, currencyAgent, eyesLedger, setEyesBalance, setIcpBalance, transferError, chain.decimal]);

  const checkAddressType = (address_) => {
    //console.log("checking " + targetAddress);
    // Regular expressions for matching the two formats
    // Regular expression for Type 1 Address (64-character hexadecimal)
    if (chain.name == "sol") {
      return isValidSolanaAddress(address_);
    }
    const type1Regex = /^[a-f0-9]{64}$/i;

    // Regular expression for Type 2 Address
    // Adjust the group lengths as per the specific requirements of your address format
    const type2Regex = /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}$/i;

    const type3Regex = /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}$/i; // New Type: Example format like "s4bfy-iaaaa-aaaam-ab4qa-cai"
    if (type1Regex.test(address_)) {
      // console.log("address account");
      return 1;
    } else if (type2Regex.test(address_)) {
      //console.log("address principal");
      return 2;
    } else if (type3Regex.test(address_)) {
      //console.log("address principal contract");
      return 2;
    } else {
      return 0;
    }
  };

  async function updateBalance() {
    console.log("updating");
    if (updatingBalance) return;
    setUpdatingBalance(true);
    if (chain.name == "sol") {
      await dragonMinter.updateBalance();
      // console.log(d, " << update requested");
      await getUserBalance();
    }
    // await getUserBalance();
    setUpdatingBalance(false);
    toast.success("Balance updated", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const handletransfer = async () => {
    console.log(user.totalBet, "<<<<<<us");
    // if (user.totalBet) {
    if (user.totalBet < 3) {
      var times = 3 - user.totalBet;
      toast.error("Play " + times + " more times to be able to withdraw", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return 0;
    } else {
      //
    }
    setTransferError(false);
    let transferrableAmount = 0;
    //console.log("user balance ");
    if (chain.name == "sol") {
      if (Number(icpBalance) < chain.minWithdrawal + chain.transferFee / chain.decimal) {
        setTransferError("minimum withdrawal is " + chain.minWithdrawal + " " + chain.name.toUpperCase());
        return;
      }
      if (checkAddressType(targetAddress)) {
        //call withdraw
        setTransferError("transferring...");
        try {
          const dragonMinterAddress = {
            owner: Principal.fromText("65ga4-5yaaa-aaaam-ade6a-cai"),
            subaccount: [],
          };
          var transferrableSOL = parseInt((Number(icpBalance) * chain.decimal + chain.transferFee).toFixed(0));

          var burnSOL = parseInt((Number(icpBalance) * chain.decimal).toFixed(0));
          await currencyAgent.icrc2_approve({
            fee: [],
            memo: [],
            from_subaccount: [],
            created_at_time: [],
            amount: transferrableSOL,
            expected_allowance: [],
            expires_at: [],
            spender: dragonMinterAddress,
          });

          var wdres = await dragonMinter.withdrawSOL(burnSOL, targetAddress);
          if (wdres.success) {
            toast.success("Withdrawal is currently being processed", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else if (wdres.no) {
            toast.error(wdres.no.toString(), {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else if (wdres.transferFailed) {
            toast.error(wdres.transferFailed.toString(), {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        } catch (e) {
          //
          toast.error(e.toString(), {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        // console.log(req, "<<<<<<<<<<req");
        setTransferError(false);
        getUserBalance();
        return true;
      } else {
        setTransferError("Invalid SOL address");
        return true;
      }
    } else if (chain.name == "icp") {
      if (Number(icpBalance) < 0.5 + 10000 / currencyDecimal) {
        setTransferError("minimum withdrawal is 0.5" + { chainName });
        return;
      }
      let oriUserBalance = Math.floor(Number(icpBalance) * currencyDecimal);

      //console.log("user balance " + oriUserBalance < 10);
      if (oriUserBalance < 10001) return false;
      transferrableAmount = oriUserBalance - 10000;
      setTransferring(true);
      let type_ = 0;
      try {
        type_ = checkAddressType(targetAddress);
      } catch {
        setTransferError("invalid " + { chainName } + " address");
        setTransferring(false);
        return false;
      }
      //console.log("result check type " + type_);
      let transferResult_ = null;
      if (type_ == 1) {
        setTransferError("initiate transfer using public address");
        const hexString = targetAddress;
        const to_ = hexString.match(/.{1,2}/g).map((hex) => parseInt(hex, 16));
        let transferArgs_ = {
          //to: hexStringToByteArray(targetAddress),
          to: to_,
          fee: { e8s: 10000 },
          memo: 1,
          from_subaccount: [],
          created_at_time: [],
          amount: { e8s: transferrableAmount },
        };
        try {
          setTransferError("transferring using public address");
          transferResult_ = await currencyAgent.transfer(transferArgs_);
          //console.log(JSON.stringify(currencyAgent.name), "<<<<<<<< icp agent");
          if (transferResult_.Err) {
            let jsonString = JSON.stringify(transferResult_.Err, (key, value) => {
              if (typeof value === "bigint") {
                return value.toString();
              }
              return value;
            });

            //console.log(jsonString);
            setTransferError(jsonString);
            // console.log(jsonString, "<<<<< obj");
            setTransferring(false);
            return false;
          } else {
            setTransferError("success - txid : " + Number(transferResult_.Ok));
          }
        } catch (err) {
          setTransferring(false);
          setTransferError(err.toString());
          //setTransferError(currencyAgent);
        }
      } else if (type_ == 2) {
        setTransferError("transfer using principal address");
        const acc = {
          owner: Principal.fromText(targetAddress),
          subaccount: [],
        };
        let transferArgs2_ = {
          to: acc,
          fee: [10000],
          memo: [],
          from_subaccount: [],
          created_at_time: [],
          amount: transferrableAmount,
        };
        try {
          setTransferError("initiate transfer using principal");
          transferResult_ = await currencyAgent.icrc1_transfer(transferArgs2_);

          //console.log(JSON.stringify(currencyAgent), "<<<<<<<< icp agent");
          if (transferResult_.Err) {
            let jsonString = JSON.stringify(transferResult_.Err, (key, value) => {
              if (typeof value === "bigint") {
                return value.toString();
              }
              return value;
            });

            //console.log(jsonString);
            setTransferError(jsonString);
            //console.log(jsonString, "<<<<< obj");
            setTransferring(false);
            return false;
          } else {
            setTransferError("success - txid : " + Number(transferResult_.Ok));
            //console.log(transferResult_, "<<<<<<<<res");
          }
        } catch (err) {
          setTransferring(false);
          setTransferError(err.toString());
          //setTransferError(currencyAgent);
        }
      } else {
        //console.log("address invalid");
        setTransferError("invalid " + { chainName } + " address");
        setTransferring(false);
      }
      setTransferring(false);
      getUserBalance();
    }
  };

  const handleAddressInputChange = (event) => {
    const newValue = event.target.value;
    //dispatch(changeInvestment(newValue));
    setTargetAddress(newValue);
    checkAddressType(newValue);
    console.log("changed!");
  };

  const levelNames = ["Squire", "Apprentice", "Journeyman", "Footman", "Shieldbearer", "Knight", "Dragonslayer", "Champion", "Warlord", "Dragonmaster", "High Templar", "Lord Commander", "Dragon Lord", "Elder Wyrm", "Dragon King"];
  const thresholds = useMemo(() => [0, 5000, 20000, 80000, 320000, 1280000, 5120000, 20480000, 81920000, 327680000, 1310720000, 5242880000, 20971520000, 83886080000, 335544320000], []);

  const calculateProgress = () => {
    const currentLevelThreshold = thresholds[level];
    const nextLevelThreshold = thresholds[level + 1];

    if (eyesBalance >= nextLevelThreshold) {
      return 100;
    }

    const progress = ((eyesBalance - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const shareReferralCode = () => {
    if (telegramUserData) {
      const { first_name, id } = telegramUserData;
      analytics.track("User Shared Referral Code", {
        label: "share",
        user: { first_name },
        user_id: id,
      });
    }
    const { first_name, id } = telegramUserData;
    analytics.track("User Shared Referral Code", {
      label: "share",
      user: { first_name },
      user_id: id,
    });
    if (telegram) {
      const message = encodeURIComponent(`Join Dragon Eyes using my referral code: ${referralCode}`);
      const url = `https://t.me/share/url?url=${message}`;
      telegram.openTelegramLink(url);
    } else {
      console.log("Telegram WebApp is not available or user is not authenticated");
    }
  };

  useEffect(() => {
    const updateLevel = () => {
      let newLevel = 0;
      while (newLevel < thresholds.length - 1 && eyesBalance.toFixed(0) >= thresholds[newLevel + 1]) {
        newLevel++;
      }
      setLevel(newLevel);
    };

    updateLevel();
  }, [eyesBalance, thresholds]);

  const startXRef = useRef(null);
  const isDraggingRef = useRef(false);

  const handleTouchStart = useCallback((e) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDraggingRef.current) return;
      const currentX = e.touches[0].clientX;
      const diff = startXRef.current - currentX;
      if (Math.abs(diff) > 50) {
        closeModal();
        isDraggingRef.current = false;
      }
    },
    [closeModal]
  );

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden font-passion transition-opacity duration-300 ${isModalWaletOpen ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md h-full max-h-screen overflow-hidden bg-[#F5F5EF] shadow-xl rounded-2xl flex flex-col" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          {/* Swipe indicator */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gray-500 rounded-r-full flex items-center justify-center"></div>
          <div className="px-6 pb-0 pt-4 mb-3 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src={user_img} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
                <div className="flex flex-col items-start justify-center">
                  <span className="text-[10px]">Good Morning</span>
                  <span className="text-sm text-[#EA8101]">
                    Fluffy Dragon{" "}
                    <button className="bg-[#BE6332] ml-2 text-white px-2 py-1 rounded-lg flex items-center" onClick={() => copyToClipboard(walletAddress, "principal id")}>
                      {typeof walletAddress === "string" ? `${walletAddress.slice(0, 5)}...${walletAddress.slice(-5)}` : ""}
                      <img src={copy} alt="Copy" className="ml-2 w-4 h-4" />
                    </button>
                  </span>
                </div>
              </div>
              <button onClick={closeModal} className="text-red-500 border-[3px] border-red-500 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* New Level System */}
          <div className="px-6 mb-4">
            <h3 className="text-md font-bold text-gray-700 mb-1">Airdrop Level</h3>
            <div className="bg-transparent flex flex-col justify-center gap-4 border-2 rounded-lg p-4 pb-6 ">
              <div className="flex justify-between items-center">
                <div className="flex justify-center items-center relative">
                  <div className="bg-[#FFC90B] text-sm rounded-l-md py-1 px-2 pr-5 absolute left-0">
                    <span className="text-black font-bold">{level}</span>
                  </div>
                  <div className="bg-[#E35721] p-1 ml-5 rounded-md flex justify-center items-center gap-1 z-10">
                    <span className="text-white text-sm">{levelNames[level]}</span>
                    <img src={star} alt="star logo" />
                  </div>
                </div>
                <div className="flex justify-between items-center h-full text-2xl text-center ">
                  <div className="flex items-center">
                    <span className="text-[#E35721] text-xl ">{Number(eyesBalance.toFixed(2)).toLocaleString()}</span>
                    <span
                      className="ml-2 text-base"
                      style={{
                        background: "linear-gradient(to right, #5100A3, #F76537)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      EYES
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${calculateProgress()}%`,
                    background: "linear-gradient(to right, #F76537, #5100A3)",
                  }}
                ></div>
                <div className="text-[10px] text-gray-600 mt-1">{`${(thresholds[level + 1] - eyesBalance).toFixed(2)} EYES to level ${levelNames[level + 1]}`}</div>
              </div>
            </div>
          </div>

          {/* Referral card section */}
          <div className="px-6">
            <h3 className="text-md font-bold text-gray-700 mb-1">Referral Code</h3>
            <div className="flex w-full">
              {/* referral info  */}
              <div className="bg-[#F3E6D3] rounded-l-lg p-2 border-2 border-dashed border-[#EA8101] flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-[#EA8101] text-2xl">{referralCode}</span>
                  <button onClick={() => copyToClipboard(referralCode, "Referral code")} className="text-[#EA8101]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </div>
                <p className="text-[8px] leading-3 font-inter">
                  Level up your airdrop allocation. <br /> Invite your friend and <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F76537] to-[#5100A3]">get 10,000 $EYES</span> each sign up!
                </p>
              </div>
              {/* share referral button */}
              <button onClick={shareReferralCode} className="bg-[#D57500] px-3 text-white rounded-r-lg flex flex-col items-center justify-center">
                <img src={share_logo} alt="share icon" className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Balance Section */}
          <div className={`flex-grow overflow-y-auto px-6 ${!isAuthenticated || telegram.initData == "" ? "" : "pb-6"}`}>
            <div className="flex flex-col justify-between mt-4 divide-y-2 divide-[#979087] bg-[#F3E6D3] p-6 h-[93px] rounded-lg border ">
              <div className="flex flex-col items-center h-full justify-center text-3xl text-[#454545]">
                <p className="text-xs">Balance</p>
                <div className="flex justify-center items-center gap-3">
                  <span>{Number(icpBalance).toFixed(6).toLocaleString()}</span>
                  <img src={chain.name == "sol" ? solLogo : icp} alt="ICP Logo" className="w-7 h-7" />
                </div>
                <div className="flex justify-center items-center gap-3 text-sm">
                  <button className="bg-green-700 px-2 text-white rounded-md" onClick={() => updateBalance()}>
                    {updatingBalance ? "processing.." : "update balance"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex mt-5">
              <button className={`px-4 py-2 rounded-lg ${activeTab === "topup" ? "bg-[#D5D9EB]" : "text-[#7E7E7E]"}`} onClick={() => setActiveTab("topup")}>
                Top Up
              </button>
              <button className={`px-4 py-2 rounded-lg ${activeTab === "withdraw" ? "bg-[#D5D9EB]" : "text-[#7E7E7E]"}`} onClick={() => setActiveTab("withdraw")}>
                Withdraw {chainName}
              </button>
            </div>
            <div className="mt-4 p-4 bg-[#D5D9EB] rounded-lg">
              {activeTab === "topup" ? (
                <>
                  <div className="flex justify-between items-center">
                    <div className="text-[#454545]">
                      <p>
                        Deposit {chainName} to this <br />
                        address to top up{" "}
                        <button className="bg-[#BE6332] text-white px-2 py-1 rounded-lg flex items-center" onClick={() => copyToClipboard(accountId, "Wallet address")}>
                          {typeof accountId === "string" ? `${accountId.slice(0, 5)}...${accountId.slice(-5)}` : ""}
                          <img src={copy} alt="Copy" className="ml-2 w-4 h-4" />
                        </button>
                      </p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <QRCode value={accountId} size={103} />
                      <p>{typeof walletAddress === "string" ? `${accountId.slice(0, 5)}...${accountId.slice(-5)}` : ""}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-[15px] text-center">Withdraw or transfer {chainName} to your other wallet</p>
                  <p className="text-[12px] text-center text-gray-700">
                    minimum withdraw is {chain.minWithdrawal} {chain.name.toUpperCase()}
                  </p>
                  <div className="flex">
                    <input className="w-[90%] mt-2 p-2 border rounded" type="text" value={targetAddress} onChange={handleAddressInputChange} />
                    <button className=" mx-1 mt-1 px-2 border-2 border-[#454545] text-[#454545] rounded-md bg-white" onClick={pasteFromClipboard}>
                      PASTE
                    </button>
                  </div>
                  {transferring ? (
                    <button className="bg-[#1C368F] text-white px-4 py-2 mt-2 w-full rounded-lg">{"Transfer in Progress.."}</button>
                  ) : (
                    <button onClick={handletransfer} className="bg-[#1C368F] text-white px-4 py-2 mt-2 w-full rounded-lg">
                      {"Transfer"}
                    </button>
                  )}
                  {transferError ? <div className=" text-sm lg:text-lg w-full text-center items-center justify-center   px-6 py-3 leading-none font-passion text-green-800 ">{transferError}</div> : <></>}
                </div>
              )}
            </div>
          </div>
          {(!isAuthenticated || telegram.initData == "") && (
            <div className="p-6 flex-shrink-0">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center" onClick={handleLogout}>
                Disconnect <img src={shut} alt="shut icon" className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
      <HowToPlay isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
    </div>
  );
};

export default Wallet3;
