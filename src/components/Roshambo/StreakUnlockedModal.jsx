import PropTypes from "prop-types";

const StreakUnlockedModal = ({ isOpen, onClose, streakMultiplier }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="h-auto w-80 bg-[#AE9F99] rounded-lg p-4 font-passion text-3xl">
        <div className="flex flex-col items-center">
          <div className="text-2xl text-orange-800">⚡️STREAK MODE UNLOCKED!⚡️</div>
          <div className="text-base align-middle text-center mt-4">
            You have unlocked STREAK mode! <br />
            Activate STREAK to get <span className="text-2xl text-red-700">{streakMultiplier}x</span> of your bet size if you win 3 times in a row!
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

StreakUnlockedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  streakMultiplier: PropTypes.number.isRequired,
};

export default StreakUnlockedModal;
