"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helper/exceptionHandler");
const HEADER = require("../enum/HeaderEnum");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

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

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1/ Check userId is missing?
    2/ Get access token
    3/ Verify token
    4/ Check user in DB
    5/ Check keyStore with userId
    6/ OK => return next
  */

  // Step 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError("Invalid Request");
  }

  //Step 2
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError(`Not found keyStore with userId: ${userId}`);
  }

  // Step 3
  const accessToken = req.headers[HEADER.ACCESS_TOKEN];
  if (!accessToken) {
    throw new UnauthorizedError("Invalid Request");
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new UnauthorizedError("Invalid User");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const verifyJWT = async (token, privateKey) => {
  return await JWT.verify(token, privateKey);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
};
