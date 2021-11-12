const { getWeb3, getWsgb, promisify } = require("../config/web3_conf");

const cache = require("../lib/cache");
const web3 = getWeb3();

const web3_wsgb = getWsgb();

const splitBatch = (a) => {
  const batch_size = 50;
  let b = [...a]; // clone
  let arrays = [];
  while (b.length > 0) arrays.push(b.splice(0, batch_size));
  return arrays;
};
const batchGetTransactionReceipts = async (transactions) => {
  let batch_promises = [];
  let arrays = splitBatch(transactions);
  arrays.forEach((a) => {
    let batch = new web3.eth.BatchRequest();
    a.forEach((txn) => {
      batch_promises.push(
        new Promise((resolve, reject) => {
          // @ts-ignore
          batch.add(
            web3.eth.getTransactionReceipt.request(txn, (err, response) => {
              if (err) reject(err);
              resolve(response);
            })
          );
        })
      );
    });
    batch.execute();
  });

  return Promise.all(batch_promises);
};

const getBlockExt = async (blockNumber) => {
  let balances = [];
  let addresses = [];

  const block = await web3.eth.getBlock(blockNumber, true);
  const logs = [];
  const txs = block.transactions.map((tx) => ({
    ...tx,
    timestamp: block.timestamp,
  }));
  const hashes = txs.map((t) => t.hash);
  let receipts = await batchGetTransactionReceipts(hashes);
  receipts = receipts.filter((t) => t !== null);
  if (receipts.length !== txs.length)
    throw new Error("An Error Occured: The number of receipts is different from the number of transactions");

  receipts.forEach((r) => {
    r.logs.forEach((l) => {
      logs.push(l);
    });
  });
  //Start Getter addresses from txns
  for (const tx of txs) {
    const pair = [tx.from, tx.to];
    for (const a of pair) {
      if (!addresses.includes(a) && a) {
        addresses.push(a);
      }
    }
  }
  //End Getter addresses from txns
  // Start Getter balance for every address

  let balBatch = new web3.eth.BatchRequest();
  let balBatch_promises = [];

  addresses.forEach((addr) => {
    balBatch_promises.push(
      new Promise((resolve, reject) => {
        balBatch.add(
          web3.eth.getBalance.request(addr, blockNumber, (err, result) => {
            if (err) reject(err);
            resolve({address: addr, balance: result});
          })
        );
      })
    );
  });
  balBatch.execute();
  let bals = await Promise.all(balBatch_promises);

  return {
    ...block,
    transactions: txs,
    receipts: receipts,
    logs: logs,
    addresses: addresses,
    balances: bals
  };
}

module.exports = { 
    getBlockExt,
};