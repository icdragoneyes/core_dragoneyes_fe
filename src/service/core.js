import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { fromHexString } from "@dfinity/candid/lib/cjs/utils/buffer";
import { createActor } from "../IC/icdragon";

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

export const getUserPrincipal = (privKey) => {
  try {
    const userIdentity = Secp256k1KeyIdentity.fromSecretKey(
      fromHexString(privKey)
    );

    return userIdentity.getPrincipal();
  } catch (error) {
    console.log(error, "<<<errrorr");
    return null;
  }
};

export const coreActorCreation = (privKey) => {
  try {
    const userIdentity = getUserIdentity(privKey);
    var id = "p7g6o-ayaaa-aaaam-acwea-cai";
    const userLokaIdentity = createActor(id, {
      identity: userIdentity,
    });

    return userLokaIdentity;
  } catch (error) {
    return null;
  }
};
