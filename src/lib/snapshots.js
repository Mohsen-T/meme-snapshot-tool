const { exponentTenToDecrease } = require("./utils");
const { getNestManager, getWeb3DefaultBlock, getWsgb } = require("./web3");
const { updateSnapshotData } = require("./repo");
const { getAccountStake } = require("./liquidity");

const balanceFromBlockAddress = async (address, blockNumber) => {
  console.log(`balanceFromBlockAddress - from address: ${address} and block number: ${blockNumber}`);
  

}
const balancesFromBlock = async (blockNumber) => {
  console.log(`balancesFromBlock - from block number: ${blockNumber}`);
}

module.exports = { 
  balanceFromBlockAddress,
  balancesFromBlock
};

