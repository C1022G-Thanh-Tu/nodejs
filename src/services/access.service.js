"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const RoleShopEnum = require("../enum/RoleEnum");
const KeyTokenService = require("./keyToken.service");
const { getInfoData } = require("../utils/index");
const { createTokens } = require("../utils/createTokens");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("../services/shop.service");
const { createTokenPair } = require("../auth/authUtils");

class AccessService {
  /*
    1/ Check token used
  */
  static handleRefreshToken = async ({refreshToken, user, keyStore}) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happens! Please re-login");
    }

    if (keyStore.refreshToken != refreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new UnauthorizedError("Account does not registered");
    }

    // create new tokens
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // update tokens
    await keyStore.updateOne({
      // $set sẽ cập nhật lại giá trị
      $set: {
        refreshToken: tokens.refreshToken,
      },
      // $addToSet sẽ thêm giá trị vào 1 mảng nếu giá trị chưa có trong mảng
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  /*
    1/ Check email in DBs
    2/ Check password
    3/ Create Access Token and Refresh Token
    4/ Generates tokens
    5/ Get data after login success
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // Step 1
    const saveShop = await findByEmail({ email });

    // Step 2
    const isValidPassword = await bcrypt.compare(password, saveShop.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Wrong Password");
    }

    // Step 3 + 4
    // create private key, public key, generate tokens
    const { tokens, publicKey, privateKey } = await createTokens(
      saveShop._id,
      email
    );

    const savedPublicKey = await KeyTokenService.createKeyToken({
      userId: saveShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!savedPublicKey) {
      throw new NotFoundError("Not found savedPublicKey");
    }

    // Step 5
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        objects: saveShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step 1: check email exist
    const existedShop = await shopModel.findOne({ email }).lean();
    if (existedShop) {
      throw new ConflictError("Email is resisted");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShopEnum.SHOP],
    });

    if (!newShop) {
      throw new BadRequestError("No data save");
    }
    // Create Token pair
    const { tokens, publicKey, privateKey } = await createTokens(
      newShop._id,
      email
    );

    const savedPublicKey = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!savedPublicKey) {
      throw new NotFoundError("Not found savedPublicKey");
    }

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        objects: newShop,
      }),
      tokens,
    };
  };
}

module.exports = AccessService;
