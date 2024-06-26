export const idlFactory = ({ IDL }) => {
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const ClaimHistory = IDL.Record({
    'reward_claimed' : IDL.Nat,
    'time' : IDL.Int,
    'icp_transfer_index' : IDL.Nat,
  });
  const Bet = IDL.Record({
    'id' : IDL.Nat,
    'round_bet_id' : IDL.Nat,
    'time' : IDL.Int,
    'walletAddress' : IDL.Principal,
    'game_id' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const SpinUser = IDL.Record({
    'walletAddress' : IDL.Principal,
    'claimableReward' : IDL.Nat,
    'currentGameBet' : IDL.Nat,
    'claimHistory' : IDL.Vec(ClaimHistory),
    'betHistory' : IDL.Vec(Bet),
  });
  const CurrentGame = IDL.Record({
    'id' : IDL.Nat,
    'is_spinning' : IDL.Bool,
    'time_created' : IDL.Int,
    'total_players' : IDL.Nat,
    'bets' : IDL.Vec(Bet),
    'previousWinner' : IDL.Text,
    'winner' : IDL.Text,
    'currentGameBet' : IDL.Nat,
    'totalBetsArray' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
    'totalReward' : IDL.Nat,
    'spin_time' : IDL.Int,
    'previousReward' : IDL.Nat,
  });
  const InitialData = IDL.Record({
    'userData' : SpinUser,
    'game' : CurrentGame,
  });
  const GameData = IDL.Variant({ 'ok' : InitialData, 'none' : IDL.Null });
  const PlaceBetResult = IDL.Variant({
    'closed' : IDL.Nat,
    'transferFailed' : IDL.Text,
    'success' : IDL.Nat,
  });
  const ICDragon = IDL.Service({
    'blacklist' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'calculateUnclaimed' : IDL.Func([], [IDL.Nat], []),
    'claimReward' : IDL.Func([], [IDL.Bool], []),
    'currentDevFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getBList' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Bool))], []),
    'getBalance' : IDL.Func(
        [IDL.Record({ 'te' : IDL.Vec(IDL.Nat8) })],
        [Tokens],
        [],
      ),
    'getCounter' : IDL.Func([], [IDL.Nat], ['query']),
    'getCurrentGame' : IDL.Func([], [GameData], []),
    'getCurrentIndex' : IDL.Func([], [IDL.Nat], ['query']),
    'getDevPool' : IDL.Func([], [IDL.Principal], ['query']),
    'getGame' : IDL.Func([IDL.Nat], [GameData], []),
    'getNextHalving' : IDL.Func([], [IDL.Int], []),
    'getRewardPool' : IDL.Func([], [IDL.Principal], ['query']),
    'getUserBets' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'ok' : IDL.Vec(Bet), 'none' : IDL.Nat })],
        [],
      ),
    'getUserData' : IDL.Func([], [SpinUser], []),
    'isNotPaused' : IDL.Func([], [IDL.Bool], ['query']),
    'isNowSping' : IDL.Func(
        [],
        [IDL.Record({ 'nes' : IDL.Int, 'now' : IDL.Int, 'res' : IDL.Bool })],
        [],
      ),
    'pauseCanister' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'place_bet' : IDL.Func([IDL.Nat, IDL.Nat], [PlaceBetResult], []),
    'setAdmin' : IDL.Func([IDL.Principal], [IDL.Principal], []),
    'setDevPool' : IDL.Func([IDL.Principal], [IDL.Principal], []),
    'setDuration' : IDL.Func([IDL.Nat], [], []),
    'setEyesToken' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'setRewardPool' : IDL.Func([IDL.Principal], [IDL.Principal], []),
    'spinManual' : IDL.Func([IDL.Bool], [], []),
    'startCanister' : IDL.Func([], [], []),
    'startTimer' : IDL.Func([], [IDL.Nat], []),
    'whoCall' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return ICDragon;
};
export const init = ({ IDL }) => {
  return [IDL.Record({ 'admin' : IDL.Principal })];
};