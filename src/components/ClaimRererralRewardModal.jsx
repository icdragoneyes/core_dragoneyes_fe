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
  //selectedWalletAtom
} from "../store/Atoms";

const ClaimRererralRewardModal = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [referrerUsername, setReferrerUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coreAgent] = useAtom(coreAtom);
  //const [quota, setQuota] = useState(false);
  const [initData] = useAtom(telegramInitDataAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const getRefferalCodeInfo = async (rcode) => {
    // mock respons success from endpoint
    if (isAuthenticated) {
      var referralData = await coreAgent.getCodeData(rcode);
      if (referralData.result) {
        setReferrerUsername(referralData.result.referrerUsername);
      }
    } else {
      setReferrerUsername("");
      setIsOpen(false);
    }
    setTimeout(() => {
      // assume respons success and referralCode is valid

      setIsOpen(true);
      //setReferrerUsername("rembo");
    }, 1000);
  };

  useEffect(() => {
    var queryParams = new URLSearchParams(location.search);
    var referralCodeValue = queryParams.get("start");

    if (isAuthenticated) {
      const initData_ = window.Telegram.WebApp.initData;
      var urlParams = new URLSearchParams(initData_);

      // Get the referralCode from the query parameters
      var rc = urlParams.get("start");

      if (rc) {
        console.log("Referral Code:", rc);
        referralCodeValue = rc;
        // You can now use the referralCode in your app logic
      } else {
        console.log("No referral code found");
      }

      toast.success(
        "telegram referral : " + rc + " init " + initData_.toString(),
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }

    if (referralCodeValue && coreAtom) {
      getRefferalCodeInfo(referralCodeValue);
    }
  }, [initData, isAuthenticated]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div className="relative w-10/12 h-4/6 bg-[#343433FA] flex items-center justify-start flex-col gap-4 rounded-lg shadow-lg p-6 z-50">
        <p className="font-passion text-[40px] text-[#E8A700]">
          Congratulations!
        </p>
        <p className="font-passion text-[24px] text-white w-8/12 text-center">
          {`You got 0.03 SOL from ${referrerUsername}`}
        </p>
        <img src={SolReceived} className="mt-5" />

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
    </div>
  );
};

export default ClaimRererralRewardModal;
