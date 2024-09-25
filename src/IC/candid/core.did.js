export const idlFactory = ({ IDL }) => {
  const Reward = IDL.Record({
    usd: IDL.Float64,
    chain: IDL.Text,
    gameName: IDL.Text,
    amount: IDL.Nat,
    decimal: IDL.Nat,
    canisterid: IDL.Text,
  });
  const HttpHeader = IDL.Record({ value: IDL.Text, name: IDL.Text });
  const HttpResponsePayload = IDL.Record({
    status: IDL.Nat,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HttpHeader),
  });
  const TransformArgs = IDL.Record({
    context: IDL.Vec(IDL.Nat8),
    response: HttpResponsePayload,
  });
  const CanisterHttpResponsePayload = IDL.Record({
    status: IDL.Nat,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HttpHeader),
  });
  return IDL.Service({
    addAccess: IDL.Func([IDL.Text], [IDL.Nat], []),
    applyCode: IDL.Func(
      [IDL.Text],
      [
        IDL.Variant({
          err: IDL.Text,
          referred: IDL.Text,
          codeinvalid: IDL.Text,
          success: IDL.Text,
          quotaexceeded: IDL.Text,
        }),
      ],
      []
    ),
    blacklist: IDL.Func([IDL.Text, IDL.Bool], [IDL.Bool], []),
    dR: IDL.Func([IDL.Text], [], []),
    defaultUsername: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    genCode: IDL.Func([], [IDL.Record({ a: IDL.Text, nato: IDL.Text })], []),
    getAllCodeOwner: IDL.Func([IDL.Text], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], ["query"]),
    getAllTG: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], []),
    getAllTotalReward: IDL.Func(
      [],
      [
        IDL.Record({
          id: IDL.Nat,
          icp: IDL.Nat,
          usdicp: IDL.Float64,
          fullData: IDL.Vec(IDL.Tuple(IDL.Text, Reward)),
        }),
      ],
      ["query"]
    ),
    getCode: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ["query"]),
    getCodeData: IDL.Func(
      [IDL.Text],
      [
        IDL.Variant({
          result: IDL.Record({
            referrerUsername: IDL.Text,
            data: IDL.Variant({
              err: IDL.Text,
              referred: IDL.Text,
              codeinvalid: IDL.Text,
              success: IDL.Text,
              quotaexceeded: IDL.Text,
            }),
          }),
          error: IDL.Text,
        }),
      ],
      ["query"]
    ),
    getCodeOwner: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ["query"]),
    getReferralData: IDL.Func(
      [IDL.Text],
      [
        IDL.Record({
          tier: IDL.Opt(IDL.Nat),
          quota: IDL.Opt(IDL.Nat),
          refCode: IDL.Opt(IDL.Text),
        }),
      ],
      []
    ),
    getSOLwallet: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    getTotalReferred: IDL.Func([], [IDL.Nat], ["query"]),
    getTotalReward: IDL.Func([IDL.Text, IDL.Text], [IDL.Record({ usd: IDL.Float64, reward: IDL.Float64 })], ["query"]),
    getUser: IDL.Func(
      [],
      [
        IDL.Record({
          userName: IDL.Text,
          referralCode: IDL.Text,
          invitationQuota: IDL.Nat,
          referrerCode: IDL.Text,
          referrerName: IDL.Text,
          referrerWallet: IDL.Text,
          friends: IDL.Vec(IDL.Text),
        }),
      ],
      []
    ),
    getUserList: IDL.Func(
      [],
      [
        IDL.Record({
          referrer: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
          users: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
        }),
      ],
      []
    ),
    initCore: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], []),
    mintEyes: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Variant({ error: IDL.Text, success: IDL.Nat })], []),
    mintTestEyes: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Variant({ error: IDL.Text, success: IDL.Nat })], []),
    outcall: IDL.Func([IDL.Text], [IDL.Text], []),
    referrers: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], ["query"]),
    regenerateInvitation: IDL.Func([], [IDL.Opt(IDL.Text)], []),
    setATH: IDL.Func([IDL.Text, IDL.Float64], [], []),
    setTier: IDL.Func([IDL.Text, IDL.Nat, IDL.Bool], [IDL.Bool], []),
    setUsername: IDL.Func(
      [IDL.Text],
      [
        IDL.Variant({
          ok: IDL.Text,
          err: IDL.Text,
          exist: IDL.Text,
        }),
      ],
      []
    ),
    setUsernameByAddr: IDL.Func(
      [IDL.Text, IDL.Text],
      [
        IDL.Variant({
          ok: IDL.Text,
          err: IDL.Text,
          exist: IDL.Text,
        }),
      ],
      []
    ),
    showQuota: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], []),
    siwt: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    stopCampaign: IDL.Func([IDL.Bool], [IDL.Bool], []),
    syncUserName: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], ["query"]),
    tierReListing: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], []),
    transform: IDL.Func([TransformArgs], [CanisterHttpResponsePayload], ["query"]),
    whois: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
    writeTotalReward: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Nat], [], []),
  });
};
// eslint-disable-next-line no-unused-vars
export const init = ({ IDL }) => {
  return [];
};
