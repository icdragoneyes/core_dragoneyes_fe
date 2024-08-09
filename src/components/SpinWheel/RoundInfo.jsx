import PropTypes from "prop-types";
import BetInput from "./BetInput";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { spinGameDataAtom, walletAddressAtom } from "../../store/Atoms";
import { useAtom } from "jotai";

const RoundInfo = ({ winChance }) => {
  const [spinGameData] = useAtom(spinGameDataAtom);
  const [walletAddress] = useAtom(walletAddressAtom);

  return (
    <section id="player-data" className="hidden xl:block z-10 w-1/3 text-dark-blue justify-start items-start h-full py-6 order-3 xl:order-3 ">
      {spinGameData ? (
        <div className="bg-primary-gray rounded-lg p-4">
          <div className="text-xl font-bold mb-4 text-center">Round #{Number(spinGameData.id)}</div>
          <div className="flex flex-row justify-between items-center mb-4">
            <div className="flex flex-col justify-center items-start">
              <div className=" text-xl font-bold">{(Number(spinGameData.totalReward) / 100000000).toLocaleString()} ICP</div>
              <div className=" text-sm font-bold">Prize Pool</div>
            </div>
            <div className="flex flex-col justify-center items-end">
              <div className=" text-xl font-bold">{Number(spinGameData.total_players)}/100</div>
              <div className=" text-sm font-bold">Players</div>
            </div>
          </div>

          {walletAddress ? (
            <div>
              <div className="flex flex-row justify-between items-center mb-4">
                <div className="flex flex-col justify-center items-start">
                  <div className=" text-xl font-bold"> {(Number(spinGameData.currentGameBet) / 100000000).toLocaleString()} ICP</div>
                  <div className=" text-sm font-bold">My Entries</div>
                </div>
                <div className="flex flex-col justify-center items-end">
                  <div className="text-xl font-bold">{winChance}</div>
                  <div className=" text-sm font-bold">Win Chance</div>
                </div>
              </div>
              <BetInput />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-3 mr-2">
          <Skeleton containerClassName="flex-1" height={300} baseColor="#C4BCC8" highlightColor="#1E3557" />
        </div>
      )}
    </section>
  );
};

RoundInfo.propTypes = {
  winChance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default RoundInfo;
