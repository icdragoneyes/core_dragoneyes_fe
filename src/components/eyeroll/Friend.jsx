import { useState } from "react";
import { toast } from "react-toastify";
import BottomNavBar from "./BottomNavBar";

const Friend = () => {
  const [referralCode] = useState("ABC123");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard!");
  };

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=Join%20me%20using%20this%20referral%20code:%20${referralCode}`;
    window.open(url, "_blank");
  };

  const shareViaTelegram = () => {
    const url = `https://t.me/share/url?url=Join%20me%20using%20this%20referral%20code:%20${referralCode}`;
    window.open(url, "_blank");
  };

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-start p-4 text-white">
      <h1 className="text-3xl font-bold mb-4 mt-6">Invite Friends</h1>
      <p className="text-lg mb-8 text-center">Invite your friends and earn rewards!</p>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Referral Code</h2>
        <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg mb-6">
          <span className="text-xl font-mono">{referralCode}</span>
          <button onClick={copyToClipboard} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Copy
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Invite via Email</h2>
        <form className="flex flex-col gap-4">
          <input type="email" placeholder="Friend's Email" className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Send Invite
          </button>
        </form>

        <h2 className="text-2xl font-semibold mb-4 mt-6">Invite via Social Media</h2>
        <div className="flex gap-4">
          <button onClick={shareViaWhatsApp} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            WhatsApp
          </button>
          <button onClick={shareViaTelegram} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Telegram
          </button>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default Friend;
