export const idlFactory = ({ IDL }) => {
  const TransferResult = IDL.Variant({
    error: IDL.Text,
    success: IDL.Nat,
  });
  const DSOLMint = IDL.Record({
    id: IDL.Text,
    principal: IDL.Text,
    signature: IDL.Text,
    time: IDL.Int,
    amount: IDL.Nat,
  });
  const DSOLBurn = IDL.Record({
    principal: IDL.Text,
    signature: IDL.Text,
    time: IDL.Int,
    targetWallet: IDL.Text,
    amount: IDL.Nat,
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
    airdropMintDSOL: IDL.Func([IDL.Text, IDL.Nat], [TransferResult], []),
    confirmBurn: IDL.Func([IDL.Text, IDL.Text, IDL.Nat, IDL.Text], [], []),
    getMintHistory: IDL.Func(
      [IDL.Text],
      [
        IDL.Variant({
          no: IDL.Bool,
          ok: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(DSOLMint))),
        }),
      ],
      []
    ),
    getMinterAddress: IDL.Func([], [IDL.Opt(IDL.Text)], []),
    getUpdateRequest: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      []
    ),
    getWithdrawRequest: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, DSOLBurn))],
      []
    ),
    map: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    mintDSOL: IDL.Func(
      [IDL.Text, IDL.Nat, IDL.Text, IDL.Text],
      [
        IDL.Variant({
          no: IDL.Bool,
          ok: TransferResult,
          error: IDL.Text,
        }),
      ],
      []
    ),
    mintDSOLToGame: IDL.Func(
      [IDL.Nat, IDL.Text],
      [
        IDL.Variant({
          no: IDL.Bool,
          ok: TransferResult,
          error: IDL.Text,
        }),
      ],
      []
    ),
    getTopUpData: IDL.Func([], [IDL.Nat], []),
    outcall: IDL.Func([IDL.Text], [IDL.Text], []),
    transform: IDL.Func(
      [TransformArgs],
      [CanisterHttpResponsePayload],
      ["query"]
    ),
    updateBalance: IDL.Func(
      [],
      [
        IDL.Variant({
          no: IDL.Bool,
          ok: IDL.Record({ balance: IDL.Nat, updating: IDL.Bool }),
        }),
      ],
      []
    ),
    withdrawSOL: IDL.Func(
      [IDL.Nat, IDL.Text],
      [
        IDL.Variant({
          no: IDL.Bool,
          transferFailed: IDL.Text,
          success: IDL.Nat,
        }),
      ],
      []
    ),
  });
};

// eslint-disable-next-line no-unused-vars
export const init = ({ IDL }) => {
  return [];
};
