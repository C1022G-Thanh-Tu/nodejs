"use strict";

const { findById } = require("../services/apiKey.service");
const { ForbiddenError, NotFoundError } = require("../core/error.response");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();

  if (!key) {
    throw new ForbiddenError("Invalid Api Key");
  }

  // check objKey
  const objKey = await findById(key);
  if (!objKey) {
    throw new NotFoundError("Not Found Api Key Object");
  }

  req.objKey = objKey;
  return next();
};

const permissions = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new ForbiddenError("Permission deny");
    }

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      throw new ForbiddenError("Permission deny");
    }

    return next();
  };
};

module.exports = { apiKey, permissions };
