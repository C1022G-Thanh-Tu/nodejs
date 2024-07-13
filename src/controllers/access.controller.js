"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body);
      const { status, message } = await AccessService.signUp(req.body);
      return res.status(status).json({ message });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
