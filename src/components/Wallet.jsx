import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode.react";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import HowToPlay from "./Roshambo/HowToPlay";
import eyes from "../assets/img/dragon.png";
import icp from "../assets/img/icp.png";
import copy from "../assets/copy.png";
import icpLogo from "../assets/wallet/icp.png";
import shut from "../assets/wallet/shut.png";
import { toast } from "react-toastify";
import {
  eyesBalanceAtom,
  eyesModeAtom,
  eyesLedgerAtom,
  icpAgentAtom,
  icpBalanceAtom,
  isLoggedInAtom,
  isModalWalletOpenAtom,
  logosModeAtom,
  isSwitchingAtom,
  userDataAtom,
  walletAddressAtom,
  isAuthenticatedAtom,
  telegramWebAppAtom,
  loginInstanceAtom,
} from "../store/Atoms";
import walletlogo from "../assets/wallet/wallet-blue.png";
import star from "../assets/wallet/star.png";

const Wallet2 = () => {
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
  const [isModalWaletOpen, setIsModalWalletOpen] = useAtom(isModalWalletOpenAtom);
  const [icpBalance, setIcpBalance] = useAtom(icpBalanceAtom);
  const [eyesBalance, setEyesBalance] = useAtom(eyesBalanceAtom);
  const [eyesLedger] = useAtom(eyesLedgerAtom);
  const [icpAgent] = useAtom(icpAgentAtom);
  const setEyesMode = useSetAtom(eyesModeAtom);
  const setIsSwitching = useSetAtom(isSwitchingAtom);
  const setLogos = useSetAtom(logosModeAtom);
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);
  const setUserData = useSetAtom(userDataAtom);
  const [transferError, setTransferError] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [activeTab, setActiveTab] = useState("topup");
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [accountId, setAccountid] = useState("");
  const [selectedChain, setSelectedChain] = useState("ICP");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [level, setLevel] = useState(0);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegram] = useAtom(telegramWebAppAtom);
  const [loginInstance] = useAtom(loginInstanceAtom);

  useEffect(() => {
    if (walletAddress) {
      const acc = {
        principal: Principal.fromText(walletAddress),
        subaccount: [],
      };
      const accid = AccountIdentifier.fromPrincipal(acc);
      setAccountid(accid.toHex());
    }
  }, [walletAddress]);

  function copyToClipboard(walletType) {
    navigator.clipboard
      .writeText(walletType)
      .then(() => {
        toast.success("Wallet address copied", {
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

  const closeModal = () => {
    setIsModalWalletOpen(false);
  };

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

  async function handleSwitchMode(mode) {
    setIsSwitching(true);
    setEyesMode(mode);
    if (mode) {
      setLogos(eyes);
    } else {
      setLogos(icp);
    }

    closeModal();
  }

  const handleLogout = async () => {
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
    const icpBalanceRaw = await icpAgent.icrc1_balance_of(account);
    const eyesBalanceRaw = await eyesLedger.icrc1_balance_of(account);

    setEyesBalance(Number(eyesBalanceRaw) / 100000000);
    setIcpBalance(Number(icpBalanceRaw) / 100000000);
  };

  useEffect(() => {
    const getUserBalance = async () => {
      const account = {
        owner: Principal.fromText(walletAddress),
        subaccount: [],
      };
      const icpBalanceRaw = await icpAgent.icrc1_balance_of(account);
      const eyesBalanceRaw = await eyesLedger.icrc1_balance_of(account);

      setEyesBalance(Number(eyesBalanceRaw) / 100000000);
      setIcpBalance(Number(icpBalanceRaw) / 100000000);
    };

    if (walletAddress && icpAgent && eyesLedger) {
      getUserBalance();
    }
  }, [walletAddress, icpAgent, eyesLedger, setEyesBalance, setIcpBalance, transferError]);

  const checkAddressType = (address_) => {
    //console.log("checking " + targetAddress);
    // Regular expressions for matching the two formats
    // Regular expression for Type 1 Address (64-character hexadecimal)
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

  const handletransfer = async () => {
    setTransferError(false);
    let transferrableAmount = 0;
    //console.log("user balance ");
    if (Number(icpBalance) < 0.5 + 10000 / 1e8) {
      setTransferError("minimum withdrawal is 0.5 ICP");
      return;
    }
    let oriUserBalance = Math.floor(Number(icpBalance) * 100000000);

    //console.log("user balance " + oriUserBalance < 10);
    if (oriUserBalance < 10001) return false;
    transferrableAmount = oriUserBalance - 10000;
    setTransferring(true);
    let type_ = 0;
    try {
      type_ = checkAddressType(targetAddress);
    } catch {
      setTransferError("invalid ICP address");
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
        transferResult_ = await icpAgent.transfer(transferArgs_);
        //console.log(JSON.stringify(icpAgent.name), "<<<<<<<< icp agent");
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
        //setTransferError(icpAgent);
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
        transferResult_ = await icpAgent.icrc1_transfer(transferArgs2_);

        //console.log(JSON.stringify(icpAgent), "<<<<<<<< icp agent");
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
        //setTransferError(icpAgent);
      }
    } else {
      //console.log("address invalid");
      setTransferError("invalid ICP address");
      setTransferring(false);
    }
    setTransferring(false);
    getUserBalance();
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
          <div className="p-6 pb-0 mb-3 flex-shrink-0">
            <div className="flex justify-between items-center gap-3">
              <div className="flex justify-center items-center gap-[1px] text-[#046DF0]">
                <img src={walletlogo} className="w-6 h-6" />
                <h3 className="text-lg font-bold leading-[52.85px]">Wallet</h3>
              </div>
              <div className="flex divide-x-2 text-[10px] item-center justify-center text-[#428510] py-2 border-2 rounded-lg">
                <div className="px-1">
                  <button onClick={() => setIsHowToPlayOpen(true)}>How To Play</button>
                </div>
                <div className="px-1 ">
                  <button>
                    <a href="https://t.me/HouseOfXDragon" target="_blank" rel="noopener noreferrer">
                      Telegram
                    </a>
                  </button>
                </div>
              </div>
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm p-2 bg-[#D4D4D4] text-xs font-medium text-gray-700"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedChain === "ICP" ? (
                      <>
                        <img src={icpLogo} alt="ICP" className="w-4 h-4 mr-1" />
                        ICP
                      </>
                    ) : (
                      <>
                        <img src={eyes} alt="EYES" className="w-4 h-4 mr-1" />
                        EYES
                      </>
                    )}
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="origin-top-right p-2 w-full absolute right-0 mt-2 rounded-md shadow-lg bg-[#D4D4D4] ring-1 ring-black ring-opacity-5">
                    <div className="flex flex-col items-center justify-center gap-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={() => {
                          setSelectedChain("ICP");
                          handleSwitchMode(false);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full px-1 text-left"
                        role="menuitem"
                      >
                        <img src={icpLogo} alt="ICP" className="w-3 h-3 mr-1" />
                        ICP
                      </button>
                      <button
                        onClick={() => {
                          setSelectedChain("EYES");
                          handleSwitchMode(true);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center  text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full px-1 text-left"
                        role="menuitem"
                      >
                        <img src={eyes} alt="EYES" className="w-3 h-3 mr-1" />
                        EYES
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={closeModal} className="text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* New Level System */}
          <div className="px-6 h-24">
            <div className="bg-transparent flex flex-col justify-center gap-4 border-2 rounded-lg p-4 pb-6 ">
              <div className="flex justify-between items-center">
                <div className="flex justify-center items-center">
                  <div className="bg-[#FFC90B] text-sm rounded-md py-1 px-2">
                    <span className="text-black font-bold">{level}</span>
                  </div>
                  <div className="bg-[#E35721] p-1 rounded-md flex justify-center items-center gap-1">
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
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${calculateProgress()}%`,
                    background: "linear-gradient(to right, #F76537, #5100A3)",
                  }}
                ></div>
                <div className="text-[10px] text-gray-600 mt-1">{`${(thresholds[level + 1] - eyesBalance).toFixed(2)} EYES to level ${levelNames[level + 1]}`}</div>
              </div>
            </div>
          </div>

          {/* Balance Section */}
          <div className="flex-grow overflow-y-auto px-6">
            <div className="flex flex-col justify-between mt-4 divide-y-2 divide-[#979087] bg-[#F3E6D3] p-6 h-[93px] rounded-lg border ">
              <div className="flex flex-col items-center h-full justify-center text-3xl text-[#454545]">
                <p className="text-xs">Balance</p>
                <div className="flex justify-center items-center gap-3">
                  <span>{icpBalance.toFixed(6).toLocaleString()}</span>
                  <img src={icp} alt="ICP Logo" className="w-7 h-7" />
                </div>
              </div>
            </div>

            <div className="flex mt-5">
              <button className={`px-4 py-2 rounded-lg ${activeTab === "topup" ? "bg-[#D5D9EB]" : "text-[#7E7E7E]"}`} onClick={() => setActiveTab("topup")}>
                Top Up
              </button>
              <button className={`px-4 py-2 rounded-lg ${activeTab === "withdraw" ? "bg-[#D5D9EB]" : "text-[#7E7E7E]"}`} onClick={() => setActiveTab("withdraw")}>
                Withdraw ICP
              </button>
            </div>
            <div className="mt-4 p-4 bg-[#D5D9EB] rounded-lg">
              {activeTab === "topup" ? (
                <>
                  <div className="flex justify-between items-center">
                    <div className="text-[#454545]">
                      <p>
                        Deposit ICP to this <br />
                        address to top up{" "}
                        <button className="bg-[#BE6332] text-white px-2 py-1 rounded-lg flex items-center" onClick={() => copyToClipboard(accountId)}>
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
                  <p className="text-[15px] text-center">Withdraw or transfer ICP to your other wallet</p>
                  <p className="text-[12px] text-center text-gray-700">minimum withdraw is 0.5 ICP</p>
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

export default Wallet2;
