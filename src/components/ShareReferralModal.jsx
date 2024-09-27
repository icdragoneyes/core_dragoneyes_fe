import PropTypes from "prop-types";
import solAirDropImg from "../assets/img/solReceived.png";

const ShareReferralModal = ({ isOpen, onShare, invitesLeft, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#343433FA] bg-opacity-98 p-6 rounded-lg shadow-xl font-passion max-w-md w-4/5">
        <div className="flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl font-bold text-[#E8A700] mb-4">Share your referral code</h2>
          <img src={solAirDropImg} alt="SOL Airdrop" className="w-24 h-24 mb-4" />
          <p className="text-white text-xs mb-4">
            {invitesLeft > 0 ? (
              <>
                Share the link directly to your friend or in a group. <br />
                Your friend will get 0.03 SOL airdrop, and you&apos;ll earn 10K $EYES + 20% fee commission <br />
                from the games your friends playing.
              </>
            ) : (
              <>
                Share the link directly to your friend or in a group. <br />
                You will earn 10K $EYES + 20% fee commission from the games your friends playing.
              </>
            )}
          </p>
          {invitesLeft > 0 && <p className="text-[#22C31F] text-[16px] mb-6">You have {invitesLeft} airdrop invites left this week.</p>}
        </div>
        <div className="flex justify-center items-center space-x-4">
          <button onClick={onClose} className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors w-1/2">
            Cancel
          </button>
          <button onClick={onShare} className="px-6 py-3 bg-[#D57500] text-white rounded hover:bg-[#C06800] transition-colors w-1/2">
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
  onClose: PropTypes.func.isRequired,
};

export default ShareReferralModal;
