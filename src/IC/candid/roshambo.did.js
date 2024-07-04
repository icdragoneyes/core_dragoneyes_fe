export const idlFactory = ({ IDL }) => {
  const Tokens = IDL.Record({ e8s: IDL.Nat64 });
  const ClaimHistory = IDL.Record({
    reward_claimed: IDL.Nat,
    time: IDL.Int,
    icp_transfer_index: IDL.Nat,
  });
  const Bet = IDL.Record({
    id: IDL.Nat,
    win: IDL.Bool,
    time_created: IDL.Int,
    betAmount: IDL.Nat,
    eyes: IDL.Nat,
    guess: IDL.Nat,
    caller: IDL.Principal,
    houseGuess: IDL.Nat,
  });
  const RoshamboUser = IDL.Record({
    walletAddress: IDL.Principal,
    claimableReward: IDL.Nat,
    claimHistory: IDL.Vec(ClaimHistory),
    betHistory: IDL.Vec(Bet),
  });
  const GameData = IDL.Variant({ ok: RoshamboUser, none: IDL.Null });
  const BetResut = IDL.Record({
    eyes: IDL.Nat,
    cpuChoice: IDL.Text,
    userChoice: IDL.Text,
    outcome: IDL.Text,
  });
  const PlaceBetResult = IDL.Variant({
    closed: IDL.Nat,
    transferFailed: IDL.Text,
    success: BetResut,
    retry: IDL.Nat,
  });
  return IDL.Service({
    blacklist: IDL.Func([IDL.Text], [IDL.Bool], []),
    currentDevFee: IDL.Func([], [IDL.Nat], ["query"]),
    getBList: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Bool))], []),
    getBalance: IDL.Func([IDL.Record({ te: IDL.Vec(IDL.Nat8) })], [Tokens], []),
    getCounter: IDL.Func([], [IDL.Nat], ["query"]),
    getCurrentGame: IDL.Func([], [GameData], []),
    getCurrentIndex: IDL.Func([], [IDL.Nat], ["query"]),
    getDevPool: IDL.Func([], [IDL.Principal], ["query"]),
    getNextHalving: IDL.Func([], [IDL.Int], []),
    getRewardPool: IDL.Func([], [IDL.Principal], ["query"]),
    getUserBets: IDL.Func([IDL.Text], [IDL.Variant({ ok: IDL.Vec(Bet), none: IDL.Nat })], []),
    isNotPaused: IDL.Func([], [IDL.Bool], ["query"]),
    isNowSping: IDL.Func([], [IDL.Record({ nes: IDL.Int, now: IDL.Int, res: IDL.Bool })], []),
    pauseCanister: IDL.Func([IDL.Bool], [IDL.Bool], []),
    place_bet: IDL.Func([IDL.Nat, IDL.Nat], [PlaceBetResult], []),
    setAdmin: IDL.Func([IDL.Principal], [IDL.Principal], []),
    setDevPool: IDL.Func([IDL.Principal], [IDL.Principal], []),
    setDuration: IDL.Func([IDL.Nat], [], []),
    setEyesToken: IDL.Func([IDL.Bool], [IDL.Bool], []),
    setRewardPool: IDL.Func([IDL.Principal], [IDL.Principal], []),
    whoCall: IDL.Func([], [IDL.Principal], ["query"]),
  });
};
// eslint-disable-next-line no-unused-vars
export const init = ({ IDL }) => {
  return [];
};
