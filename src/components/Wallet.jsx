import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import copy from "../assets/copy.png";
import icpLogo from "../assets/wallet/icp.png";
import shut from "../assets/wallet/shut.png";
import { toast } from "react-toastify";
import {
  eyesBalanceAtom,
  eyesLedgerAtom,
  icpAgentAtom,
  icpBalanceAtom,
  isLoggedInAtom,
  isModalWalletOpenAtom,
  loginInstanceAtom,
  userDataAtom,
  walletAddressAtom,
} from "../store/Atoms";

const Wallet = () => {
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
  const [isModalWaletOpen, setIsModalWalletOpen] = useAtom(
    isModalWalletOpenAtom
  );
  const [icpBalance, setIcpBalance] = useAtom(icpBalanceAtom);
  const [eyesBalance, setEyesBalance] = useAtom(eyesBalanceAtom);
  const [loginInstance] = useAtom(loginInstanceAtom);
  const [eyesLedger] = useAtom(eyesLedgerAtom);
  const [icpAgent] = useAtom(icpAgentAtom);
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);
  const setUserData = useSetAtom(userDataAtom);
  const [transferError, setTransferError] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [principalAddress, setPrincipalAddress] = useState("");
  const [activeTab, setActiveTab] = useState("topup");

  function copyToClipboard(walletType) {
    navigator.clipboard
      .writeText(walletType)
      .then(() => {
        toast.success("Text Copied to Clipboard ", {
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

  const handleLogout = async () => {
    await loginInstance.logout();
    setIsLoggedIn(false);
    setUserData(null);
    setWalletAddress(null);
    setIsModalWalletOpen(false);
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

      const acc = {
        principal: Principal.fromText(walletAddress),
        subaccount: [],
      };
      const accid = AccountIdentifier.fromPrincipal(acc);
      setPrincipalAddress(accid.toHex());
    }
  }, [
    walletAddress,
    icpAgent,
    eyesLedger,
    setEyesBalance,
    setIcpBalance,
    transferError,
  ]);

  const checkAddressType = (address_) => {
    //console.log("checking " + targetAddress);
    // Regular expressions for matching the two formats
    // Regular expression for Type 1 Address (64-character hexadecimal)
    const type1Regex = /^[a-f0-9]{64}$/i;

    // Regular expression for Type 2 Address
    // Adjust the group lengths as per the specific requirements of your address format
    const type2Regex =
      /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}$/i;

    const type3Regex =
      /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}$/i; // New Type: Example format like "s4bfy-iaaaa-aaaam-ab4qa-cai"
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
    var transferrableAmount = 0;
    //console.log("user balance ");
    let oriUserBalance = Math.floor(Number(icpBalance) * 100000000);
    console.log("user balance " + oriUserBalance < 10000);
    if (oriUserBalance < 10000) return false;
    transferrableAmount = oriUserBalance - 10000;
    setTransferring(true);
    var type_ = 0;
    try {
      type_ = checkAddressType(targetAddress);
    } catch {
      setTransferError("invalid ICP address");
      setTransferring(false);
      return false;
    }
    //console.log("result check type " + type_);
    var transferResult_ = null;
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
        setTransferError("transfer using public address");
        transferResult_ = await icpAgent.transfer(transferArgs_);
        //console.log(JSON.stringify(icpAgent.name), "<<<<<<<< icp agent");
        if (transferResult_.Err) {
          let jsonString = JSON.stringify(transferResult_.Err, (key, value) => {
            if (typeof value === "bigint") {
              return value.toString();
            }
            return value;
          });

          console.log(jsonString);
          setTransferError(jsonString);
          // console.log(jsonString, "<<<<< obj");
          setTransferring(false);
          return false;
        }
      } catch (err) {
        setTransferring(false);
        setTransferError(err.toString());
        //setTransferError(icpAgent);
      }
    } else if (type_ == 2) {
      setTransferError("transfer using principal address");
      var acc = {
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
  };

  const handleAddressInputChange = (event) => {
    const newValue = event.target.value;
    //dispatch(changeInvestment(newValue));
    setTargetAddress(newValue);
    checkAddressType(newValue);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden font-passion transition-opacity duration-300 ${
        isModalWaletOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md h-full max-h-screen overflow-hidden bg-[#F5F5EF] shadow-xl rounded-2xl flex flex-col">
          <div className="p-6 flex-shrink-0">
            <div className="flex justify-between items-center">
              <h3 className="text-5xl font-bold leading-[52.85px] text-black">
                Wallet
              </h3>
              <button onClick={closeModal} className="text-black">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto px-6 pb-6">
            <div className="flex items-center justify-between">
              <span className="text-[#006823]">Public</span>
              <button
                className="bg-[#006823] text-white px-2 py-1 rounded-lg flex items-center"
                onClick={() => copyToClipboard(walletAddress)}
              >
                {typeof walletAddress === "string"
                  ? `${walletAddress.slice(0, 5)}...${walletAddress.slice(-5)}`
                  : ""}
                <img src={copy} alt="Copy" className="ml-2 w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[#BE6332]">Principal</span>
              <button
                className="bg-[#BE6332] text-white px-2 py-1 rounded-lg flex items-center"
                onClick={() => copyToClipboard(principalAddress)}
              >
                {typeof principalAddress === "string"
                  ? `${principalAddress.slice(0, 5)}...${principalAddress.slice(
                      -5
                    )}`
                  : ""}
                <img src={copy} alt="Copy" className="ml-2 w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col justify-between mt-4 divide-y-2 divide-[#979087] bg-[#D9CCB8] p-6 h-[295px] rounded-lg border ">
              <div className="flex items-center h-full justify-between text-3xl text-justify">
                <img src={icpLogo} alt="ICP Logo" className="w-10" />
                <span>{Number(icpBalance.toFixed(2)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center h-full text-3xl text-center ">
                <span className="text-black">EYES</span>
                <span>{Number(eyesBalance.toFixed(2)).toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center h-full pt-3 text-xl gap-4">
                <div className="flex justify-between w-full">
                  <div>
                    Available <br />
                    SPIN
                  </div>
                  <div className="text-3xl">{0}</div>
                </div>
                {/* <button className="bg-[#4D4389] text-white px-2 py-1 rounded-lg w-full" disabled>
                  Play SPIN to get more EYES
                </button> */}
              </div>
            </div>
            <div className="flex mt-5">
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "topup" ? "bg-[#D5D9EB]" : "text-[#7E7E7E]"
                }`}
                onClick={() => setActiveTab("topup")}
              >
                Top Up
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "withdraw" ? "bg-[#D5D9EB]" : "text-[#7E7E7E]"
                }`}
                onClick={() => setActiveTab("withdraw")}
              >
                Withdraw
              </button>
            </div>
            <div className="mt-4 p-4 bg-[#D5D9EB] rounded-lg">
              {activeTab === "topup" ? (
                <div className="flex justify-between items-center">
                  <div className="">
                    <p>
                      Deposit ICP to this <br />
                      address to top up
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <QRCode value={walletAddress} size={103} />
                    <p>
                      {typeof walletAddress === "string"
                        ? `${walletAddress.slice(0, 5)}...${walletAddress.slice(
                            -5
                          )}`
                        : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[15px] text-center">
                    Withdraw or transfer ICP to your other wallet:
                  </p>
                  <input
                    className="w-full mt-2 p-2 border rounded"
                    type="text"
                    value={targetAddress}
                    onChange={handleAddressInputChange}
                  />
                  {transferring ? (
                    <button className="bg-[#1C368F] text-white px-4 py-2 mt-2 w-full rounded-lg">
                      {"Transfer in Progress.."}
                    </button>
                  ) : (
                    <button
                      onClick={handletransfer}
                      className="bg-[#1C368F] text-white px-4 py-2 mt-2 w-full rounded-lg"
                    >
                      {"Transfer"}
                    </button>
                  )}
                  {transferError ? (
                    <div className=" text-sm lg:text-lg w-full text-center items-center justify-center   px-6 py-3 leading-none font-passion text-green-800 ">
                      {transferError}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="p-6 flex-shrink-0">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              Disconnect <img src={shut} alt="shut icon" className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
