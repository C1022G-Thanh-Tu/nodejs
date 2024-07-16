"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  // accessToken
  const accessToken = await JWT.sign(payload, publicKey, {
    expiresIn: "2 days",
  });

  // refreshToken
  const refreshToken = await JWT.sign(payload, privateKey, {
    expiresIn: "7 days",
  });

  //
  JWT.verify(accessToken, publicKey, (error, decode) => {
    if (error) {
      console.log("error verify: ", error);
    } else {
      console.log("decode verify: ", decode);
    }
  });

  return { accessToken, refreshToken };
};

module.exports = {
  createTokenPair,
};
