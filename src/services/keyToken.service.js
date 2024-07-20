"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const filter = { user: userId }; // Tìm kiếm theo userId
    const update = {
      publicKey,
      privateKey,
      refreshTokensUsed: [],
      refreshToken,
    };
    const options = { upsert: true, new: true }; // Kiểm tra nếu document chưa có thì insert mới, có rồi thì update
    const tokens = await keyTokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );

    return tokens.publicKey || null;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };
}

module.exports = KeyTokenService;
