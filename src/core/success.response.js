"use strict";

const StatusCodeEnum = require("../enum/StatusCodeEnum");
const StatusMsgEnum = require("../enum/StatusMsgEnum");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodeEnum.OK,
    statusMsg = StatusMsgEnum.OK,
    metadata = {},
  }) {
    this.message = message || statusMsg;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this.metadata);
  }
}

class OkResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodeEnum.CREATED,
    statusMsg = StatusMsgEnum.CREATED,
    metadata,
  }) {
    super({ message, statusCode, statusMsg, metadata });
  }
}

class NoContentResponse extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodeEnum.NO_CONTENT,
    statusMsg = StatusMsgEnum.NO_CONTENT,
    metadata,
  }) {
    super({ message, statusCode, statusMsg, metadata });
  }
}

module.exports = {
  OkResponse,
  CreatedResponse,
  NoContentResponse,
};
