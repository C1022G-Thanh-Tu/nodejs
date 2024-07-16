"use strict";
const { createTokenPair } = require("../auth/authUtils");
const crypto = require("crypto");

const createTokens = async (id, email) => {
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");

  console.log({ privateKey, publicKey }); // save collection KeyStore

  // Create Token pair
  const tokens = await createTokenPair(
    { userId: id, email },
    publicKey,
    privateKey
  );

  console.log("Create tokens successful: ", tokens);

  return { tokens, publicKey, privateKey };
};

module.exports = { createTokens };
