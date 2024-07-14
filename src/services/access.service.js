"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const RoleShopEnum = require("../enum/RoleEnum");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../core/error.response");

class AccessService {
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

    // create private key, public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // Public Key CryptoGraphy Standards

    console.log({ privateKey, publicKey }); // save collection KeyStore

    const savedPublicKey = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey,
    });

    if (!savedPublicKey) {
      throw new NotFoundError("Not found savedPublicKey");
    }

    // Create Token pair
    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKey,
      privateKey
    );

    console.log("Create tokens success: ", tokens);

    return {
      status: 201,
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          objects: newShop,
        }),
        tokens,
      },
    };
  };
}

module.exports = AccessService;
