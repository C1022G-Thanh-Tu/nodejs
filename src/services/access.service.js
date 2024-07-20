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
} = require("../core/error.response");
const { findByEmail } = require("../services/shop.service");

class AccessService {
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
