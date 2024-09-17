/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import SolReceived from "../assets/img/solReceived.png";
import { useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { toast } from "react-toastify";

import {
  coreAtom,
  //telegramWebAppAtom,
  telegramInitDataAtom,
  isAuthenticatedAtom,
  userAtom,
  //selectedWalletAtom
} from "../store/Atoms";

const ClaimRererralRewardModal = () => {
  //const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [referrerUsername, setReferrerUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coreAgent] = useAtom(coreAtom);
  const [code, setCode] = useState(false);
  //const [quota, setQuota] = useState(false);
  const [initData] = useAtom(telegramInitDataAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [success, setSuccess] = useState(1);
  const [errmsg, setErrmsg] = useState("");
  const [user] = useAtom(userAtom);

  const handleSubmit = async () => {
    setIsLoading(true);
    var claimResult = await coreAgent.applyCode(code);
    if (claimResult.success) {
      setSuccess(2);
    } else if (claimResult.codeinvalid) {
      setSuccess(3);
      setErrmsg("You got invalid referral code, please try another code");
    } else if (claimResult.quotaexceeded) {
      setSuccess(3);
      setErrmsg(
        "Awww snap, you are too late, the quota for this referral code is exceeded. You can try again next Monday, or find another referral link"
      );
    } else if (claimResult.referred) {
      setSuccess(3);
      setErrmsg("Cannot claim, you have already been referred");
    }
    setIsLoading(false);
  };

  const closeAirdropModal = async () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const getRefferalCodeInfo = async (rcode) => {
      // mock respons success from endpoint
      if (isAuthenticated) {
        if (user.referalCode != rcode) {
          var referralData = await coreAgent.getCodeData(rcode);
          if (referralData.result) {
            setReferrerUsername(referralData.result.referrerUsername);
            var claimResult = referralData.result.data;
            if (claimResult.success) {
              setSuccess(1);
            } else if (claimResult.codeinvalid) {
              setSuccess(3);
              setErrmsg(
                "You got invalid referral code, please try another code"
              );
            } else if (claimResult.quotaexceeded) {
              setSuccess(3);
              setErrmsg(
                "Awww snap, you are too late, the quota for this referral code is exceeded. You can try again tomorrow, or find another referral link"
              );
            } else if (claimResult.referred) {
              setSuccess(3);
              setErrmsg(
                "Cannot claim using this code, as you have already been referred"
              );
            }
            setIsOpen(true);
          }
        } else {
          setIsOpen(false);
        }
      } else {
        setReferrerUsername("none");
        setIsOpen(true);
      }
    };

    var referralCodeValue = false;
    if (isAuthenticated && coreAgent && initData) {
      var initData_ = window.Telegram.WebApp.initData;
      initData_ = initData;
      var urlParams = new URLSearchParams(initData_);

      // Get the referralCode from the query parameters
      var rc = urlParams.get("start_param");

      if (rc) {
        console.log("Referral Code:", rc);
        referralCodeValue = rc;
        setCode(rc);
        // You can now use the referralCode in your app logic
      } else {
        console.log("No referral code found");
      }
    } else {
      var queryParams = new URLSearchParams(location.search);
      referralCodeValue = queryParams.get("startapp");
    }

    if (referralCodeValue && coreAgent) {
      getRefferalCodeInfo(referralCodeValue);
    }
  }, [initData, isAuthenticated, coreAgent]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      {success == 1 && (
        <div className="relative w-10/12 h-4/6 bg-[#343433FA] flex items-center justify-start flex-col gap-4 rounded-lg shadow-lg p-6 z-50">
          <p className="font-passion text-[40px] text-[#E8A700]">
            Congratulations!
          </p>
          <p className="font-passion text-[24px] text-white w-8/12 text-center">
            {`You got 0.03 SOL from ${referrerUsername}`}
          </p>
          <img src={SolReceived} className="mt-5 w-[150px]" />

          <button
            onClick={handleSubmit}
            className={`px-8 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center transition-all duration-300 font-passion ${
              isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            <span className="flex items-center">
              {isLoading ? "Loading..." : "Claim Now!"}
            </span>
          </button>
        </div>
      )}
      {success == 2 && (
        <div className="relative w-10/12 h-4/6 bg-[#343433FA] flex items-center justify-start flex-col gap-4 rounded-lg shadow-lg p-6 z-50">
          <p className="font-passion text-[40px] text-[#E8A700]">AWYISSS</p>
          <p className="font-passion text-[24px] text-white w-8/12 text-center"></p>
          Claim successful, 0.03 SOL is yours! Now lets go play some games!
          <button
            onClick={closeAirdropModal}
            className={`px-8 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center transition-all duration-300 font-passion ${
              isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            <span className="flex items-center">OK</span>
          </button>
        </div>
      )}
      {success == 3 && (
        <div className="relative w-10/12 h-4/6 bg-[#343433FA] flex items-center justify-start flex-col gap-4 rounded-lg shadow-lg p-6 z-50">
          <p className="font-passion text-[24px] text-white w-8/12 text-center">
            {errmsg}
          </p>

          <button
            onClick={closeAirdropModal}
            className={`px-8 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center transition-all duration-300 font-passion ${
              isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            <span className="flex items-center">OK</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ClaimRererralRewardModal;
