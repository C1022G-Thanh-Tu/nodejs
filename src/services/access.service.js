"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const RoleShop = require("../enum/RoleEnum");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step 1: check email exist
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          status: 409,
          message: "Email existed",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
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
          return {
            status: 404,
            message: "savedPublicKey have no value",
          };
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
      }

      return {
        status: 200,
        metadata: null,
      };

    } catch (error) {
      console.error(error);
      return {
        status: 400,
        message: error.message,
      };
    }
  };
}

module.exports = AccessService;
