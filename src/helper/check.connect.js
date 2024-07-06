"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const FIVE_SECONDS = 5000;

// count connect
const countConnect = () => {
  const numbConnection = mongoose.connections.length;
  return `Number of Connection: ${numbConnection}`;
};

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numbConnection = mongoose.connections.length;
    const numbCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example maximum number of connection based on number osf cores
    const maxConnections = numbCores * 5;

    console.log(`Active connection: ${numbConnection}`);
    console.log("Memory use: ", memoryUsage / 1024 / 1024, "MB");

    if (numbConnection > maxConnections) {
      console.log("Connection overload detected");
    }
  }, FIVE_SECONDS); // Monitor every 5s
};

module.exports = {
  countConnect,
  checkOverload
};
