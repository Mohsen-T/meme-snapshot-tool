const Web3 = require("web3");

const nestManagerAbi = require("./abis/nestManager.json");
const stabilityPoolAbi = require("./abis/stabilityPool.json");
const erc20Abi = require("./abis/erc20.json");

const RPC = process.env.RPC;

const NEST_MANAGER = "0x2a5c62691596BFC7dc29F48918566Db5b4a36B34";
const STABILITY_POOL = "";
const WSGB = "0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED";

let web3Client;

const getWeb3 = () => {
  if (web3Client) return web3Client;
  web3Client = new Web3(RPC);
  return web3Client;
};

const getWeb3DefaultBlock = (blockNumber) => {
  if (web3Client) return web3Client;
  web3Client = new Web3(RPC);
  web3Client.eth.defaultBlock = blockNumber;
  return web3Client;
};

const getNestManager = () => {
  return new web3.eth.Contract(nestManagerAbi, NEST_MANAGER);
};

const getWsgb = () => {
  return new web3.eth.Contract(erc20Abi, WSGB);
};

const getStabilityPool = () => {
  return new web3.eth.Contract(stabilityPoolAbi, STABILITY_POOL);
};

let web3 = getWeb3();

module.exports = {
  getWeb3,
  getNestManager,
  getStabilityPool,
  getWeb3DefaultBlock,
  getWsgb,
};
