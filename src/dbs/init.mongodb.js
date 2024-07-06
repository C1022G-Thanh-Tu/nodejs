"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helper/check.connect");
const {
  db: { host, port, name },
} = require("../config/config.mongodb");

const connectStr = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  // connect
  connect(type = "dev") {
    // setting for dev env
    if (type === "dev") {
      mongoose.set("debug", true && { color: true });
    }

    mongoose
      .connect(connectStr, {
        maxPoolSize: 50, // pool size là các connection mở sẵn cho việc connect DB mà kp tạo mới mỗi khi có 1 request về DB
      })
      .then((_) => console.log("Connect MongoDB Success: ", countConnect()))
      .catch((err) => console.log("Error Connect!:", err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
