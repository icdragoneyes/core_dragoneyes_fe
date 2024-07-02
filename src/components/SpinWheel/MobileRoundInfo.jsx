import PropTypes from "prop-types";
import BetInput from "./BetInput";
import "react-loading-skeleton/dist/skeleton.css";

const MobileRoundInfo = ({ walletAddress, spinGameData, winChance }) => {
  if (spinGameData)
    return (
      <div className="xl:hidden order-3 text-dark-blue">
        <div className="h-[400px]" />
        <div className="fixed bottom-0 w-full z-10">
          <div className="bg-primary-gray rounded-lg p-4">
            <div className="text-lg font-bold mb-2 text-center">Round #{Number(spinGameData.id)}</div>
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="flex flex-col justify-center items-start">
                <div className="text-sm font-bold"> {(Number(spinGameData.currentGameBet) / 100000000).toLocaleString()} ICP</div>
                <div className="text-sm font-bold">Prize Pool</div>
              </div>
              <div className="flex flex-col justify-center items-start">
                <div className="text-sm font-bold"> {(Number(spinGameData.currentGameBet) / 100000000).toLocaleString()} ICP</div>
                <div className="text-sm font-bold">My Entries</div>
              </div>
              <div className="flex flex-col justify-center items-end">
                <div className="text-sm font-bold">{winChance}</div>
                <div className=" text-sm font-bold">Win Chance</div>
              </div>
            </div>
            {walletAddress ? <BetInput /> : null}
          </div>
        </div>
      </div>
    );
};

MobileRoundInfo.propTypes = {
  walletAddress: PropTypes.string,
  spinGameData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    currentGameBet: PropTypes.number.isRequired,
  }).isRequired,
  winChance: PropTypes.string.isRequired,
};

export default MobileRoundInfo;
