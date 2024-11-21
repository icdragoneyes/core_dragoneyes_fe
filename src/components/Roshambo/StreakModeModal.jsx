import PropTypes from "prop-types";

const StreakModeModal = ({ isOpen, onClose, streakMultiplier }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="h-auto w-80 bg-[#AE9F99] rounded-lg p-4 font-passion text-3xl">
        <div className="flex flex-col items-center">
          <div className="text-2xl text-orange-800">⚡️STREAK MODE ⚡️</div>
          <div className="text-base align-middle text-center">
            Place your bet and enter STREAK! <br />
            Pay once and win 3 rounds in a row to earn <br />
            <span className="text-2xl text-green-700">{Number(streakMultiplier)}x rewards!</span> <br />
            But be careful—if you lose or draw in any round, the STREAK ends, and you lose your bet!
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

StreakModeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  streakMultiplier: PropTypes.number.isRequired,
};

export default StreakModeModal;
