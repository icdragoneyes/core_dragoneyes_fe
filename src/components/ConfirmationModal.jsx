import PropTypes from "prop-types";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  address,
  chainName,
  progress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {progress == "start" && (
        <div className="bg-[#343433FA] bg-opacity-98 p-6 rounded-lg shadow-xl font-passion max-w-md w-4/5">
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Withdrawal Processing...
            </h2>
          </div>
        </div>
      )}
      {progress == "" && (
        <div className="bg-[#343433FA] bg-opacity-98 p-6 rounded-lg shadow-xl font-passion max-w-md w-4/5">
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Confirm Withdrawal
            </h2>
            <p className="text-white mb-6">
              Are you sure you want to withdraw <br />{" "}
              <span className="text-orange-500">
                {amount} {chainName}
              </span>{" "}
              to{" "}
              <span className="text-green-500">
                {address.slice(0, 5)}...{address.slice(-5)}
              </span>
              ?
            </p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#A9A9A9] text-[#A9A9A9] rounded hover:bg-[#A9A9A9] hover:text-white transition-colors w-24"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-[#1132A6] text-white rounded hover:bg-blue-700 transition-colors w-24"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {progress == "success" && (
        <div className="bg-[#343433FA] bg-opacity-98 p-6 rounded-lg shadow-xl font-passion max-w-md w-4/5">
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Withdrawal Success!
            </h2>
            <p className="text-white mb-6">
              Your SOL will soon be appeared on the destination wallet
            </p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1132A6] text-white rounded hover:bg-blue-700 transition-colors w-24"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// props type checking for this component below
ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  chainName: PropTypes.string.isRequired,
  progress: PropTypes.string.isRequired,
  //handletransfer : PropTypes.func.isRequired,
};

export default ConfirmationModal;
