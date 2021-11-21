const cache = require("../libs/cache");
const { getLogger } = require("../libs/logger");
const utils = require("../libs/utils");
const { getAccounts, getBalancesImpl } = require("../modules/account");
const { latestBlockNumber } = require("../modules/block");

const logger = getLogger();

const fetchAccounts = async (startBlock, blockCount = 1) => {
    
    startBlock = Number(startBlock);
    blockCount = Number(blockCount);
    let fetchArray = [];
    const latest = await latestBlockNumber();
    if(!startBlock) {
        startBlock = latest;
        blockCount = 0;    
    } else {
        if(startBlock + blockCount>latest) {
            blockCount = latest - startBlock;
        } else if(startBlock + blockCount <0) {
            blockCount = - startBlock;
        }
    }
    if(startBlock <= 1000) startBlock = 1000;
    
    fetchArray = utils.orderToArray(startBlock, startBlock + blockCount);

    console.log("fetchArray: ", fetchArray);
    let savedBlocks = await cache.getBlockNumbers();
    console.log("savedBlocks: ", savedBlocks);
    let realFetchArray = fetchArray.filter(x => !savedBlocks.includes(x));
    console.log("realFetchArray: ", realFetchArray);
    try{
        for(bk of realFetchArray) {
            console.log("- Block Number : %s => ", bk); // OR console.log(`- Block Number : ${bk} => `);
            accounts = await getAccounts(bk, bk);
            console.log("   Accounts: ", accounts);
            await cache.saveAccounts(accounts);
            await cache.saveBlockNumber(bk);
        }
    }catch(err){
        throw new Error(err.message);
    }
}
const fetchBalances = async (startBlock) => {
    accounts = await cache.getAccounts();
    console.log(accounts);
    chunks = utils.createChunks(accounts, 100);
    balances = []
    for (const chunk of chunks) {
        accBalaces = await getBalancesImpl(chunk, startBlock);
        console.log("acc balances => ", accBalaces);
        balances = balances.concat(accBalaces);
        await cache.saveBalances(balances, startBlock);
    }
}

module.exports = {
    fetchAccounts,
    fetchBalances,
};