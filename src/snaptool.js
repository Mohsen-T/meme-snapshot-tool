const { connectDb } = require("./db/db");
const { createLogger, getLogger } = require("./libs/logger");
const cache = require("./libs/cache");

const accountHandler = require("./handlers/account");
const liqHandler = require("./handlers/liquidity");
const  snapHandler = require("./handlers/snapshot");
/**
 * Calculate and get various of snapshots such as balance, liquidity, starting specific block number
 *
 * @param {string} snapType type of snapshot
 * @param {number} blockNumber Block number specified to snapshot
 * @param {address} account Account specified to snapshot
 * @returns {Promise} Promise will be returned
 * 
 * Type of snapshots: balance, accounts, etc
 */
(async () => {
  await connectDb();
  await cache.init();
  const type = process.argv[2];
  const logger = createLogger();

  if(type == "account") {
    const swBlock = process.argv[3];
    const swAddr = process.argv[4];
    console.log("Block number: ", swBlock);
    console.log("Account: ", swAddr);
    
  } else if(type == "liquidity") {

  } else if(type == "snapshot") {

  } else {
    throw new Error("Invalid arguments");
  }
  process.exit(0);
})();
