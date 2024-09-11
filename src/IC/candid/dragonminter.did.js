export const idlFactory = ({ IDL }) => {
  const TransferResult = IDL.Variant({
    error: IDL.Text,
    success: IDL.Nat,
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
    getMinterAddress: IDL.Func([], [IDL.Opt(IDL.Text)], []),
    getUpdateRequest: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      []
    ),
    map: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    mintDSOL: IDL.Func(
      [IDL.Text, IDL.Nat, IDL.Text],
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
    outcall: IDL.Func([IDL.Text], [IDL.Text], []),
    transform: IDL.Func(
      [TransformArgs],
      [CanisterHttpResponsePayload],
      ["query"]
    ),
    updateBalance: IDL.Func(
      [],
      [IDL.Variant({ no: IDL.Bool, ok: IDL.Nat })],
      []
    ),
    withdrawSOL: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
  });
};

// eslint-disable-next-line no-unused-vars
export const init = ({ IDL }) => {
  return [];
};
