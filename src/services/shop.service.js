"use strict";

const { BadRequestError } = require("../core/error.response");
const shopModel = require("../models/shop.model");

const findByEmail = async ({
  email,
  select = { email: 1, password: 2, name: 1, status: 1, roles: 1 },
}) => {
  const savedShop = await shopModel.findOne({ email }).select(select).lean();
  if (!savedShop) {
    throw new BadRequestError(`Email: ${email} is invalid`);
  }
  return savedShop;
};

module.exports = {
  findByEmail,
};
