import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { fromHexString } from "@dfinity/candid/lib/cjs/utils/buffer";
import { createActor } from "../IC/eyesledger";

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
    return null;
  }
};

export const eyesCreation = (privKey) => {
  try {
    const userIdentity = getUserIdentity(privKey);

    const userLokaIdentity = createActor(
      process.env.REACT_APP_EYES_LEDGER_ID_TEST,
      {
        identity: userIdentity,
      }
    );

    return userLokaIdentity;
  } catch (error) {
    return null;
  }
};
