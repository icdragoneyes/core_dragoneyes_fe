import PropTypes from "prop-types";
import solAirDropImg from "../assets/img/solReceived.png";

const ShareReferralModal = ({ isOpen, onShare, invitesLeft }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#343433FA] bg-opacity-98 p-6 rounded-lg shadow-xl font-passion max-w-md w-4/5">
        <div className="flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-bold text-[#E8A700] mb-4">Share your referral code</h2>
          <img src={solAirDropImg} alt="SOL Airdrop" className="w-24 h-24 mb-4" />
          <p className="text-white mb-4">
            Share the link directly to your friend or in a group. <br />
            Your invites allocation decreased only when new <br />
            friend(s) open the app from your link.
          </p>
          <p className="text-[#22C1F] mb-6">You have {invitesLeft} invites left this week.</p>
        </div>
        <div className="flex justify-center items-center">
          <button onClick={onShare} className="px-6 py-2 bg-[#D57500] text-white rounded hover:bg-[#C06800] transition-colors">
            Share Now!
          </button>
        </div>
      </div>
    </div>
  );
};

ShareReferralModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onShare: PropTypes.func.isRequired,
  invitesLeft: PropTypes.number.isRequired,
};

export default ShareReferralModal;
