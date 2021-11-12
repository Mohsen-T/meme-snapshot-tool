const { getWeb3, getWsgb, promisify } = require("../config/web3_conf");
const utils = require("../libs/utils");
var constants = require("../config/constants");

const blockModule = require("./block");
const web3 = getWeb3();
const web3_wsgb = getWsgb();

const latestBlockNumber = async () => {
  let latest =  parseInt(await promisify(cb => web3.eth.getBlockNumber(cb)));
  return latest;
}
const getBalance = async (address, blockNumber = null) => {
  let latest =  await latestBlockNumber();
  if(latest<blockNumber || !blockNumber)
    blockNumber = latest;
  let bal = await promisify(callback => web3.eth.getBalance(address, blockNumber, callback));
  let nbal = Number(utils.exponentTenToDecrease(bal, constants.DIGITS,constants.DECIMAL));
  return nbal;
}
const getWBalance = async (address, blockNumber = null) => {
  let latest =  await latestBlockNumber();
  if(latest<blockNumber || !blockNumber)
    blockNumber = latest;
    const wsgbBalance = await web3_wsgb.methods.balanceOf(address).call({}, blockNumber);
    const nbal = Number(utils.exponentTenToDecrease(wsgbBalance, constants.DIGITS,constants.DECIMAL));
    return nbal;
}
const getAccounts = async (from, to) => {
  let latest =  await latestBlockNumber();
  if(latest < to || !to)
    to = latest;  
  // create an indexed array 'from' from to 'to' : example: from:3/to:5=>[3,4,5]
  let blockNumbers = Array.from({length: to - from + 1}, (_, i) => i + parseInt(from));
  const accounts = [];
  let promises = [];
  for (const blockNumber of blockNumbers) {
      cb = () => { return new Promise(async (resolve, reject) => {
        let blockData;
        try{
          blockData =  await blockModule.getBlockExt(blockNumber);
          for (const a of blockData.addresses) {
            if(!accounts.includes(a) && a)
              accounts.push(a);
          }
          resolve(blockData);
        }catch(err){
          //throw new Error(err.message);
          //reject(err.message);
          console.dir(err);
          //resolve();
        }
      });
    }
    promises.push(cb);
  }
    
  //await Promise.all(promises);
  const chunks = utils.createChunks(promises, constants.CHUNK_SIZE);

  for (const chunk of chunks) {
    let chuck_arr = chunk.map((cb) => cb());
    await Promise.all(chuck_arr);
  }

  return accounts;
}



const getBalances = async (from, to, start) => {
  let latest =  await latestBlockNumber();
  if(latest < to || !to)
    to = latest;
  start = !start ? to : start;

  // create an indexed array 'from' from to 'to' : example: from:3/to:5=>[3,4,5]
  //let blockNumbers = Array.from({length: to - from + 1}, (_, i) => i + parseInt(from));
  
  let accounts = await getAccounts(from, to);
  let bals = [];
  let promises = [];

  for (const account of accounts) {
     cb = () =>{
      return new Promise(async (resolve, reject) => {
      let sgb = 0, wsgb = 0;
      //if(!accounts.map(it=>it.address).includes(a) && a)
      sgb = await getBalance(account, start);
      wsgb = await getWBalance(account, start);
      bals.push({address:account, sgb:sgb, wsgb:wsgb});
      resolve();
      });
    }
    promises.push(cb);
  }

  const chunks = utils.createChunks(promises, constants.CHUNK_SIZE);

  for (const chunk of chunks) {
    let chuck_arr = chunk.map((cb) => cb());
    await Promise.all(chuck_arr);
  }
  return bals;
}
module.exports = {
  getBalance,
  getWBalance,
  getAccounts,
  getBalances,
}