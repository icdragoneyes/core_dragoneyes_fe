import PropTypes from "prop-types";

const StreakModeModal = ({ isOpen, onClose, streakMultiplier }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="h-auto w-80 bg-[#AE9F99] rounded-lg p-4 font-passion text-3xl">
        <div className="flex flex-col items-center">
          <div className="text-2xl text-orange-800">Streak Mode !</div>
          <div className="text-base align-middle text-center">
            Shoot and win 3x in a row to win <br />
            <span className="text-lg text-green-700">
              {Number(streakMultiplier)}x rewards!
            </span>{" "}
            <br />
            Draw or lose on in the 1st, 2nd or 3rd shoot means house win, player
            lose
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
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
