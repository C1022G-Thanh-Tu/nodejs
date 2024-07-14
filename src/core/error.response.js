"use strict";

const StatusCodeEnum = require("../enum/StatusCodeEnum");
const StatusMsgEnum = require("../enum/StatusMsgEnum");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictError extends ErrorResponse {
  constructor(
    message = StatusMsgEnum.CONFLICT,
    status = StatusCodeEnum.CONFLICT
  ) {
    super(message);
    this.status = status;
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = StatusMsgEnum.BAD_REQUEST,
    status = StatusCodeEnum.BAD_REQUEST
  ) {
    super(message);
    this.status = status;
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = StatusMsgEnum.NOT_FOUND,
    status = StatusCodeEnum.NOT_FOUND
  ) {
    super(message);
    this.status = status;
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = StatusMsgEnum.FORBIDDEN,
    status = StatusCodeEnum.FORBIDDEN
  ) {
    super(message);
    this.status = status;
  }
}

module.exports = {
  ConflictError,
  BadRequestError,
  NotFoundError,
  ForbiddenError
};
