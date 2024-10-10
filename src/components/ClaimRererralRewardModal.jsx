import { useState, useEffect } from "react";
import SolReceived from "../assets/img/solReceived.png";
import { useAtom } from "jotai";

import {
  coreAtom,
  telegramInitDataAtom,
  isAuthenticatedAtom,
  referralUsedAtom,
  hasSeenSplashScreenAtom,
  selectedChainAtom,
  telegramUserDataAtom,
  userAtom,
} from "../store/Atoms";
import analytics from "../utils/segment";
const ClaimRererralRewardModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [referrerUsername, setReferrerUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coreAgent] = useAtom(coreAtom);
  const [code, setCode] = useState(false);
  const [initData] = useAtom(telegramInitDataAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [success, setSuccess] = useState(1);
  const [errmsg, setErrmsg] = useState("");
  const [refUsed, setRefUsed] = useAtom(referralUsedAtom);
  const [seenSplash] = useAtom(hasSeenSplashScreenAtom);
  const [chain] = useAtom(selectedChainAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);
  const [userData] = useAtom(userAtom);
  const [currentCode, setCurrentCode] = useState(false);
  const [currentReferrer, setCurrentReferrer] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    var claimResult = await coreAgent.applyCode(code);
    let user = await coreAgent.getUser();
    let { referrerName, referrerCode, referrerWallet } = user;

    if (claimResult.success) {
      setSuccess(2);
      analytics.track("Successful Referral Acquisition", {
        user_id: telegramUserData.id,
        name: telegramUserData.first_name,
        game_name: userData?.userName,
        campaign_code: currentCode,
        campaign_name: currentReferrer,
        referrer_username: referrerName,
        referrer_code: referrerCode,
        referrer_wallet: referrerWallet,
        category: "User Engagement",
        label: "Referral Code",
        mode: "Normal Mode",
        CHN: `${chain.name}`,
      });
    } else if (claimResult.referred) {
      setSuccess(3);
      setErrmsg("Cannot claim, you have already been referred");
      analytics.track("Referred User Receiving Referral Code", {
        user_id: telegramUserData.id,
        name: telegramUserData.first_name,
        game_name: userData?.userName,
        campaign_code: currentCode,
        campaign_name: currentReferrer,
        referrerUsername: referrerName,
        referrerCode: referrerCode,
        referrerWallet: referrerWallet,
        category: "User Engagement",
        label: "Referral Code",
        mode: "Normal Mode",
        CHN: `${chain.name}`,
      });
    } else if (claimResult.codeinvalid) {
      setSuccess(3);
      setErrmsg("You got invalid referral code, please try another code");
      analytics.track("Invalid Referral code", {
        user_id: telegramUserData.id,
        name: telegramUserData.first_name,
        game_name: userData?.userName,
        campaign_code: currentCode,
        campaign_name: currentReferrer,
        referrer_username: referrerName,
        referrer_code: referrerCode,
        referrer_wallet: referrerWallet,
        category: "User Engagement",
        label: "Referral Code",
        mode: "Normal Mode",
        CHN: `${chain.name}`,
      });
    } else if (claimResult.quotaexceeded) {
      setSuccess(3);
      setErrmsg(
        "Awww snap, you are too late, the quota for this referral code is exceeded. You can try again next Monday, or find another referral link"
      );
      analytics.track("Reffered late to claim referral code", {
        user_id: telegramUserData.id,
        name: telegramUserData.first_name,
        game_name: userData?.userName,
        campaign_code: currentCode,
        campaign_name: currentReferrer,
        referrer_username: referrerName,
        referrer_code: referrerCode,
        referrer_wallet: referrerWallet,
        category: "User Engagement",
        label: "Referral Code",
        mode: "Normal Mode",
        CHN: `${chain.name}`,
      });
    } else if (claimResult.err) {
      setSuccess(3);
      setErrmsg(claimResult.err);
      analytics.track("Error Applying Referral Code", {
        user_id: telegramUserData.id,
        name: telegramUserData.first_name,
        game_name: userData?.userName,
        campaign_code: currentCode,
        campaign_name: currentReferrer,
        referrer_username: referrerName,
        referrer_code: referrerCode,
        referrer_wallet: referrerWallet,
        category: "User Engagement",
        label: "Referral Code",
        mode: "Normal Mode",
        CHN: `${chain.name}`,
      });
    }
    setRefUsed(true);
    setIsLoading(false);
  };

  const closeAirdropModal = async () => {
    setRefUsed(true);
    setIsOpen(false);
  };

  useEffect(() => {
    const getRefferalCodeInfo = async (rcode) => {
      // mock respons success from endpoint

      if (isAuthenticated || rcode != "") {
        var referralData = await coreAgent.getCodeData(rcode);
        let user = await coreAgent.getUser();
        if (referralData.result) {
          setReferrerUsername(referralData.result.referrerUsername);
          setCurrentCode(rcode);
          setCurrentReferrer(referralData.result.referrerUsername);
          var claimResult = referralData.result.data;
          let { referrerName, referrerCode, referrerWallet } = user;
          setIsOpen(true);
          if (claimResult.success) {
            setSuccess(1);
          } else if (claimResult.referred) {
            setSuccess(3);
            setIsOpen(false);
            setErrmsg(
              "Cannot claim using this code, as you have already been referred"
            );
            analytics.track("Referred User Receiving Referral Code", {
              user_id: telegramUserData.id,
              name: telegramUserData.first_name,
              game_name: userData?.userName,
              referrer_username: referrerName,
              referrer_code: referrerCode,
              referrer_wallet: referrerWallet,
              category: "User Engagement",
              label: "Referral Code",
              mode: "Normal Mode",
              CHN: `${chain.name}`,
            });
          } else if (claimResult.codeinvalid) {
            setSuccess(3);
            setErrmsg("You got invalid referral code, please try another code");
            analytics.track("Invalid Referral code", {
              user_id: telegramUserData.id,
              name: telegramUserData.first_name,
              game_name: userData?.userName,
              referrer_username: referrerName,
              referrer_code: referrerCode,
              referrer_wallet: referrerWallet,
              category: "User Engagement",
              label: "Referral Code",
              mode: "Normal Mode",
              CHN: `${chain.name}`,
            });
          } else if (claimResult.quotaexceeded) {
            setSuccess(3);
            setErrmsg(
              "Awww snap, you're' too late, the quota for this referral code is exceeded. You can try again tomorrow, or find another referral link"
            );
            analytics.track("Referral code Quota Exceeded", {
              user_id: telegramUserData.id,
              name: telegramUserData.first_name,
              game_name: userData?.userName,
              referrer_username: referrerName,
              referrer_code: referrerCode,
              referrer_wallet: referrerWallet,
              category: "User Engagement",
              label: "Referral Code",
              mode: "Normal Mode",
              CHN: `${chain.name}`,
            });
          }
        } else {
          setRefUsed(true);
          setIsOpen(false);
        }
      } else {
        setReferrerUsername("none");
        setIsOpen(false);
      }
    };

    var referralCodeValue = false;
    if (isAuthenticated && coreAgent && initData && !refUsed && seenSplash) {
      var initData_ = window.Telegram.WebApp.initData;
      initData_ = initData;
      var urlParams = new URLSearchParams(initData_);

      // Get the referralCode from the query parameters
      var rc = urlParams.get("start_param");

      if (rc) {
        referralCodeValue = rc;
        setCode(rc);
        // You can now use the referralCode in your app logic
      } else {
        console.log("No referral code found");
      }
    } else {
      var queryParams = new URLSearchParams(location.search);
      referralCodeValue = queryParams.get("startapp");
      setCode(referralCodeValue);
    }

    if (referralCodeValue && coreAgent) {
      getRefferalCodeInfo(referralCodeValue);
    }
  }, [initData, isAuthenticated, coreAgent, seenSplash]);

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
          <p className="font-passion text-[24px] text-white w-8/12 text-center">{`You got 0.03 SOL from ${referrerUsername}`}</p>
          <img src={SolReceived} className="mt-5 w-[150px]" />

          <button
            onClick={handleSubmit}
            className={`px-8 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center transition-all duration-300 font-passion ${
              isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            <span className="flex items-center">
              {isLoading ? "Claiming..." : "Claim Now!"}
            </span>
          </button>
        </div>
      )}
      {success == 2 && (
        <div className="relative w-10/12 h-4/6 bg-[#343433FA] flex items-center justify-start flex-col gap-4 rounded-lg shadow-lg p-6 z-50">
          <p className="font-passion text-[40px] text-[#E8A700]">AWYISSS</p>
          <p className="font-passion text-[24px] text-white w-8/12 text-center">
            Claim successful!
            <br />
            <span className="text-[#E8A700]">0.03 SOL</span> is yours <br />
            Now let&apos;s go play some games!
          </p>
          <img
            src={SolReceived}
            className="mt-5 w-[150px]"
            alt="SOL Received"
          />
          <button
            onClick={closeAirdropModal}
            className={`px-8 py-2 bg-[#E8A700] text-[#343433] rounded-lg flex items-center justify-center transition-all duration-300 font-passion text-[20px] ${
              isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-[#FFB800]"
            }`}
            disabled={isLoading}
          >
            <span className="flex items-center">Let&apos;s Play!</span>
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
