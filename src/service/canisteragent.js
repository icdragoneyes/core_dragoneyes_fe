import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { fromHexString } from "@dfinity/candid/lib/cjs/utils/buffer";
import { createActor, agentList } from "../IC/agentlist";

export const getUserIdentity = (privKey) => {
  try {
    const userIdentity = Secp256k1KeyIdentity.fromSecretKey(
      fromHexString(privKey)
    );

    return userIdentity;
  } catch (error) {
    return null;
  }
};

export const agents = agentList;

export const getUserPrincipal = (privKey) => {
  try {
    const userIdentity = Secp256k1KeyIdentity.fromSecretKey(
      fromHexString(privKey)
    );

    return userIdentity.getPrincipal();
  } catch (error) {
    return null;
  }
};

export const createAgent = (privKey, idl, canisterId) => {
  try {
    const userIdentity = getUserIdentity(privKey);

    const agent = createActor(canisterId, idl, {
      identity: userIdentity,
    });

    return agent;
  } catch (error) {
    return null;
  }
};
