const StatusMsgEnum = {
    FORBIDDEN: "Forbidden Error",
    CONFLICT: "Conflict Error",
    INTERNAL_ERROR: "Internal Error",
    BAD_REQUEST: "Bad Request Error",
    NOT_FOUND: "Not Found Error",
}

Object.freeze(StatusMsgEnum)

module.exports = StatusMsgEnum