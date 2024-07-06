import PropTypes from "prop-types";
import CountdownTimer from "./CountdownTimer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { spinGameDataAtom } from "../../store/Atoms";
import { useAtom } from "jotai";

const images = require.context("../../assets/weapons", false, /\.png$/);

const PlayerWeaponImage = ({ weaponPath }) => {
  const imageSrc = images(`./${weaponPath}`);

  return <img src={imageSrc} alt="Player Weapon" className="w-10 h-10 mr-1" />;
};

PlayerWeaponImage.propTypes = {
  weaponPath: PropTypes.string.isRequired,
};

function PlayersComponent({ players }) {
  const [spinGameData] = useAtom(spinGameDataAtom);
  if (!spinGameData) {
    return (
      <div className="flex flex-col gap-3 mr-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} containerClassName="flex-1" height={100} baseColor="#C4BCC8" highlightColor="#1E3557" />
        ))}
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="flex bg-primary-gray rounded-lg mr-2 h-32 justify-center items-center">
        <div className="mb-1 text-lg font-semibold text-ellipsis line-clamp-2">No Players, be the first to Fund!</div>
      </div>
    );
  } else {
    return players.map((player) => (
      <li key={player.id} className="flex items-center bg-primary-gray rounded-lg mr-2 h-28">
        <div className="flex w-full items-center p-4">
          <PlayerWeaponImage weaponPath={player.weaponPath} />
          <div className="flex-1 justify-center items-center">
            <div className="mb-1 text-lg font-semibold text-ellipsis line-clamp-2 text-center">{player.name}</div>
            <div className="text-sm text-center">Bet: {player.points.toLocaleString()} ICP</div>
            <div className="text-sm text-center">Win Chance: {player.winChance}</div>
          </div>
        </div>
        <div className="w-6 h-full rounded-r-lg" style={{ backgroundColor: player.bg }} />
      </li>
    ));
  }
}

PlayersComponent.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      weaponPath: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      points: PropTypes.number.isRequired,
      winChance: PropTypes.string.isRequired,
      bg: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const PlayerList = ({ players }) => {
  const [spinGameData] = useAtom(spinGameDataAtom);

  return (
    <div className="w-full xl:w-1/3 text-dark-blue h-full p-6 order-2 xl:order-1 z-10">
      <div className="bg-primary-gray rounded-lg p-2 flex flex-row justify-between items-center mb-4">
        <div className="text-2xl font-bold">Player List</div>
        <CountdownTimer />
      </div>
      <ul className="space-y-4 h-[400px] xl:h-[580px] overflow-y-scroll scrollbar">
        <PlayersComponent gameData={spinGameData} players={players} />
      </ul>
      <div className="bg-primary-gray rounded-lg p-2 flex flex-row justify-between items-center mt-4">
        <div className=" text-2xl font-bold">Prize Pool:</div>
        <div className=" text-2xl font-bold">{spinGameData ? (Number(spinGameData.totalReward) / 100000000).toLocaleString() : "-"} ICP</div>
      </div>
    </div>
  );
};

PlayerList.propTypes = {
  players: PropTypes.array.isRequired,
};

export default PlayerList;
