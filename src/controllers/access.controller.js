"use strict";

const AccessService = require("../services/access.service");
const { CreatedResponse, OkResponse } = require("../core/success.response");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    const serviceRes = await AccessService.handleRefreshToken(req.body.refreshToken);
    new OkResponse({
      metadata: serviceRes,
    }).send(res);
  };

  login = async (req, res, next) => {
    const serviceRes = await AccessService.login(req.body);
    new OkResponse({
      metadata: serviceRes,
    }).send(res);
  };

  signUp = async (req, res, next) => {
    const serviceRes = await AccessService.signUp(req.body);
    new CreatedResponse({
      metadata: serviceRes,
    }).send(res);
  };

  logout = async (req, res, next) => {
    const serviceRes = await AccessService.logout(req.keyStore);
    new OkResponse({
      metadata: serviceRes,
    }).send(res);
  };
}

module.exports = new AccessController();
