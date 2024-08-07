export const idlFactory = ({ IDL }) => {
  const Bet = IDL.Record({
    'id' : IDL.Nat,
    'result' : IDL.Text,
    'time_created' : IDL.Int,
    'betAmount' : IDL.Nat,
    'eyes' : IDL.Nat,
    'guess' : IDL.Nat,
    'caller' : IDL.Principal,
    'houseGuess' : IDL.Nat,
  });
  const ClaimHistory = IDL.Record({
    'reward_claimed' : IDL.Nat,
    'time' : IDL.Int,
    'icp_transfer_index' : IDL.Nat,
  });
  const RoshamboUser = IDL.Record({
    'walletAddress' : IDL.Principal,
    'claimableReward' : IDL.Nat,
    'icpbalance' : IDL.Nat,
    'claimHistory' : IDL.Vec(ClaimHistory),
    'eyesbalance' : IDL.Nat,
    'multiplierTimerEnd' : IDL.Int,
    'currentMultiplier' : IDL.Nat,
    'betHistory' : IDL.Vec(Bet),
  });
  const GameData = IDL.Variant({ 'ok' : RoshamboUser, 'none' : IDL.Null });
  const BetResult = IDL.Record({
    'icp' : IDL.Nat,
    'userData' : RoshamboUser,
    'eyes' : IDL.Nat,
    'cpuChoice' : IDL.Text,
    'userChoice' : IDL.Text,
    'outcome' : IDL.Text,
  });
  const PlaceBetResult = IDL.Variant({
    'closed' : IDL.Nat,
    'transferFailed' : IDL.Text,
    'success' : BetResult,
    'retry' : IDL.Nat,
  });
  const TransferResult = IDL.Variant({
    'error' : IDL.Text,
    'success' : IDL.Nat,
  });
  return IDL.Service({
    'blacklist' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'clearData' : IDL.Func([], [], []),
    'currentDevFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getAllBets' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, Bet))], []),
    'getBList' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Bool))], []),
    'getBalance' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalDevFee' : IDL.Nat,
            'canisterICP' : IDL.Nat,
            'totalWon' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getCounter' : IDL.Func([], [IDL.Nat], ['query']),
    'getCurrentGame' : IDL.Func([], [GameData], []),
    'getCurrentIndex' : IDL.Func([], [IDL.Nat], ['query']),
    'getDevPool' : IDL.Func([], [IDL.Principal], ['query']),
    'getNextHalving' : IDL.Func([], [IDL.Int], []),
    'getRewardPool' : IDL.Func([], [IDL.Principal], ['query']),
    'getUserBets' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'ok' : IDL.Vec(Bet), 'none' : IDL.Nat })],
        [],
      ),
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
    'tryTransfer' : IDL.Func([IDL.Nat], [TransferResult], []),
    'whoCall' : IDL.Func([], [IDL.Principal], ['query']),
  });
};

// eslint-disable-next-line no-unused-vars
export const init = ({ IDL }) => {
  return [];
};
