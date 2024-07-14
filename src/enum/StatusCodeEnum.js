const StatusCodeEnum = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
}

Object.freeze(StatusCodeEnum)

module.exports = StatusCodeEnum