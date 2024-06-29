// Modal.js
import PropTypes from "prop-types";
import Chest from "../../assets/spin_wheel/chest.png";

const images = require.context("../../assets/weapons", false, /\.png$/);

const PlayerWeaponImage = ({ weaponPath }) => {
  const imageSrc = images(`./${weaponPath}`);

  return <img src={imageSrc} alt="Player Weapon" className="w-16 h-16 mr-1" />;
};

PlayerWeaponImage.propTypes = {
  weaponPath: PropTypes.string.isRequired,
};

const ModalWinner = ({ isVisible, onClose, winnerUsername, prizePool, weaponPath }) => {
  if (!isVisible) return null;

  return (
    <div className="p-6 xl:p-12 fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-20 text-white">
      <div className="rounded-2xl bg-dark-blue lg:bg-opacity-85 w-full max-w-lg p-4 md:p-8">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h1 className="text-xl flex-grow text-center">The dragon has been slain</h1>
          <button onClick={onClose} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 flex-shrink-0">
            <PlayerWeaponImage weaponPath={weaponPath} />
          </div>
          <div className="ml-4">
            <p className="text-lg font-bold text-red-500">{winnerUsername === "You" ? "Your" : winnerUsername + "&apos;s"} Party!</p>
            <p>has found {prizePool} worth of treasure in the dragon&apos;s den!</p>
          </div>
        </div>
        <div className="w-full h-64">
          <img src={Chest} alt="Treasure Chest" className="w-full h-full object-contain object-bottom" />
        </div>
      </div>
    </div>
  );
};

ModalWinner.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  winnerUsername: PropTypes.string.isRequired,
  prizePool: PropTypes.string.isRequired,
  weaponPath: PropTypes.string.isRequired,
};

export default ModalWinner;
