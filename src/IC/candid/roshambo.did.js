export const idlFactory = ({ IDL }) => {
  const Bet = IDL.Record({
    id: IDL.Nat,
    // multiplier: IDL.Nat,
    result: IDL.Text,
    time_created: IDL.Int,
    streak: IDL.Bool,
    username: IDL.Text,
    betAmount: IDL.Nat,
    eyes: IDL.Nat,
    guess: IDL.Nat,
    caller: IDL.Principal,
    houseGuess: IDL.Nat,
  });
  const TransferResult = IDL.Variant({
    error: IDL.Text,
    success: IDL.Nat,
  });
  const ClaimHistory = IDL.Record({
    reward_claimed: IDL.Nat,
    time: IDL.Int,
    icp_transfer_index: IDL.Nat,
  });
  const RoshamboUser = IDL.Record({
    walletAddress: IDL.Principal,
    claimableReward: IDL.Nat,
    icpbalance: IDL.Nat,
    claimHistory: IDL.Vec(ClaimHistory),
    eyesbalance: IDL.Nat,
    multiplierTimerEnd: IDL.Int,
    currentMultiplier: IDL.Nat,
    betHistory: IDL.Vec(Bet),
  });
  const GameData = IDL.Variant({ ok: RoshamboUser, none: IDL.Null });
  const BetResult = IDL.Record({
    icp: IDL.Nat,
    userData: RoshamboUser,
    eyes: IDL.Nat,
    cpuChoice: IDL.Text,
    userChoice: IDL.Text,
    outcome: IDL.Text,
  });
  const PlaceBetResult = IDL.Variant({
    closed: IDL.Nat,
    transferFailed: IDL.Text,
    success: BetResult,
    retry: IDL.Nat,
  });
  const BetRushResult = IDL.Record({
    icp: IDL.Nat,
    userData: RoshamboUser,
    streak: IDL.Nat,
    eyes: IDL.Nat,
    cpuChoice: IDL.Text,
    userChoice: IDL.Text,
    outcome: IDL.Text,
  });
  const PlaceBetRushResult = IDL.Variant({
    closed: IDL.Nat,
    transferFailed: IDL.Text,
    success: BetRushResult,
    retry: IDL.Nat,
  });
  return IDL.Service({
    betStatistic: IDL.Func(
      [],
      [
        IDL.Record({
          newbets: IDL.Nat,
          total: IDL.Float64,
          data: IDL.Vec(IDL.Tuple(IDL.Text, Bet)),
          scissors: IDL.Float64,
          rock: IDL.Float64,
          broadcast_id: IDL.Nat,
          paper: IDL.Float64,
        }),
      ],
      []
    ),
    blacklist: IDL.Func([IDL.Text], [IDL.Bool], []),
    clearData: IDL.Func([], [], []),
    currentDevFee: IDL.Func([], [IDL.Nat], ["query"]),
    customWD: IDL.Func([IDL.Nat, IDL.Text], [TransferResult], []),
    deployerWD: IDL.Func([IDL.Nat], [TransferResult], []),
    fetchNotification: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Text))], []),
    getAllBets: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, Bet))], []),
    getBList: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Bool))], []),
    getBalance: IDL.Func(
      [],
      [
        IDL.Record({
          grossLiquidity: IDL.Nat,
          totalDevFee: IDL.Nat,
          totalAirdrop: IDL.Nat,
          nettLiquidity: IDL.Nat,
          totalUniquePlayers: IDL.Nat,
          totalWon: IDL.Nat,
        }),
      ],
      []
    ),
    getCommissionData: IDL.Func(
      [],
      [
        IDL.Record({
          solRoshamboCommissionTotal: IDL.Nat,
          totalRoshamboPlayed: IDL.Nat,
          totalRoshamboFriendPlayed: IDL.Nat,
        }),
      ],
      ["query"]
    ),
    getCounter: IDL.Func([], [IDL.Nat], ["query"]),
    getCurrentGame: IDL.Func([], [GameData], []),
    getCurrentIndex: IDL.Func([], [IDL.Nat], ["query"]),
    getDevPool: IDL.Func([], [IDL.Principal], ["query"]),
    getRewardPool: IDL.Func([], [IDL.Principal], ["query"]),
    getStreakData: IDL.Func(
      [],
      [
        IDL.Record({
          userStreakNotification: IDL.Nat,
          betAmount: IDL.Nat,
          streakMultiplier: IDL.Nat,
          currentStreak: IDL.Nat,
        }),
      ],
      []
    ),
    getUserBets: IDL.Func([IDL.Text], [IDL.Variant({ ok: IDL.Vec(Bet), none: IDL.Nat })], []),
    getUserStreakStatus: IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], []),
    initLastBet: IDL.Func([], [IDL.Bool], []),
    isNotPaused: IDL.Func([], [IDL.Bool], ["query"]),
    lastBet: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, Bet))], []),
    pauseCanister: IDL.Func([IDL.Bool], [IDL.Bool], []),
    place_bet: IDL.Func([IDL.Nat, IDL.Nat], [PlaceBetResult], []),
    place_bet_rush: IDL.Func([IDL.Nat, IDL.Nat], [PlaceBetRushResult], []),
    roshamboInit: IDL.Func([], [IDL.Nat], []),
    setAdmin: IDL.Func([IDL.Principal], [IDL.Principal], []),
    setDevPool: IDL.Func([IDL.Principal], [IDL.Principal], []),
    setEyesToken: IDL.Func([IDL.Bool], [IDL.Bool], []),
    setRewardPool: IDL.Func([IDL.Principal], [IDL.Principal], []),
    setStreakMultiplier: IDL.Func([IDL.Nat], [IDL.Nat], []),
    setWeekTimestamp: IDL.Func([IDL.Nat], [IDL.Nat], []),
    tryTransfer: IDL.Func([IDL.Nat], [TransferResult], []),
  });
};
// eslint-disable-next-line no-unused-vars
export const init = ({ IDL }) => {
  return [];
};
