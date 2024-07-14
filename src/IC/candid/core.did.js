export const idlFactory = ({ IDL }) => {
  const FixedReward = IDL.Record({
    'usd' : IDL.Float64,
    'chain' : IDL.Text,
    'gameName' : IDL.Text,
    'amount' : IDL.Nat,
    'decimal' : IDL.Nat,
    'canisterid' : IDL.Text,
  });
  const HttpHeader = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const HttpResponsePayload = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HttpHeader),
  });
  const TransformArgs = IDL.Record({
    'context' : IDL.Vec(IDL.Nat8),
    'response' : HttpResponsePayload,
  });
  const CanisterHttpResponsePayload = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HttpHeader),
  });
  return IDL.Service({
    'addAccess' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'getAllTotalReward' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, FixedReward))],
        ['query'],
      ),
    'getTotalReward' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Record({ 'usd' : IDL.Float64, 'reward' : IDL.Float64 })],
        ['query'],
      ),
    'mintEyes' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [IDL.Variant({ 'error' : IDL.Text, 'success' : IDL.Nat })],
        [],
      ),
    'mintTestEyes' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [IDL.Variant({ 'error' : IDL.Text, 'success' : IDL.Nat })],
        [],
      ),
    'outcall' : IDL.Func([IDL.Text], [IDL.Text], []),
    'setATH' : IDL.Func([IDL.Text, IDL.Float64], [], []),
    'transform' : IDL.Func(
        [TransformArgs],
        [CanisterHttpResponsePayload],
        ['query'],
      ),
    'writeTotalReward' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Nat],
        [],
        [],
      ),
  });
};
// eslint-disable-next-line no-unused-vars
export const init = ({ IDL }) => { return []; };