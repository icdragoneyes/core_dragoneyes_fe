import PropTypes from "prop-types";

const EyeRollConnectModal = ({ isOpen, onConnect }) => {
  const handleConnect = () => {
    // Implement your custom connection logic here
    onConnect();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <button onClick={handleConnect} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Connect
        </button>
      </div>
    </div>
  );
};

EyeRollConnectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConnect: PropTypes.func.isRequired,
};

export default EyeRollConnectModal;
