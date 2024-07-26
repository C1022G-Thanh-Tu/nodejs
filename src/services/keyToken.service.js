"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    // Lọc theo userId
    const filter = { user: userId };
    // updateModel là một đối tượng chứa các giá trị sẽ được cập nhật hoặc thêm vào document.
    const updateModel = {
      publicKey,
      privateKey,
      refreshTokensUsed: [],
      refreshToken,
    };
    // upsert: true: Nếu không tìm thấy document nào khớp với filter, MongoDB sẽ tạo một document mới với giá trị trong update.
    // new: true: Tùy chọn này yêu cầu MongoDB trả về document mới sau khi cập nhật.
    const options = { upsert: true, new: true };
    const tokens = await keyTokenModel.findOneAndUpdate(
      filter,
      updateModel,
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

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
