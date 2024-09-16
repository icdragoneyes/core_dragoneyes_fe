/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import SolReceived from "../assets/img/solReceived.png";

const ClaimRererralRewardModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div className="relative w-10/12 h-4/6 bg-[#343433FA] flex items-center justify-start flex-col gap-4 rounded-lg shadow-lg p-6 z-50">
        <p className="font-passion text-[40px] text-[#E8A700]">
          Congratulations!
        </p>
        <p className="font-passion text-[24px] text-white w-8/12 text-center">
          You got 0.03 SOL from Night Fury
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
