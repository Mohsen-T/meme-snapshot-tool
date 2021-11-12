const { exponentTenToDecrease } = require("./utils");
const { getNestManager, getWeb3DefaultBlock, getWsgb } = require("./web3");
const { updateSnapshotData } = require("./repo");
const { getAccountStake } = require("./liquidity");

const getSnapshotByWallet = async (wallet, blockNumber) => {
  const web3 = getWeb3DefaultBlock(blockNumber);
  const nestManager = getNestManager();
  const wsgb = getWsgb();

  const result = {
    total: 0,
  };

  const getCollateral = async () => {
    const nest = await nestManager.methods
      .getEntireDebtAndColl(wallet)
      .call({}, blockNumber);
    const coll = nest.coll;
    const collReqular = Number(exponentTenToDecrease(coll, 18));
    result.total += collReqular;
    result.collateral = collReqular;
  };

  const getSgbBalance = async () => {
    const sgbBalance = await web3.eth.getBalance(wallet);
    const balanceReg = Number(exponentTenToDecrease(sgbBalance, 18));
    result.total += balanceReg;
    result.sgb + balanceReg;
  };

  const getWsgbBalance = async () => {
    const wsgbBalance = await wsgb.methods
      .balanceOf(wallet)
      .call({}, blockNumber);

    const balanceWsgbReg = Number(exponentTenToDecrease(wsgbBalance, 18));
    result.total += balanceWsgbReg;
    result.wsgb = balanceWsgbReg;
  };

  const getStake = async () => {
    const staked = await getAccountStake(wallet);
    result.total += staked;
    result.stakedInLiquidity = staked;
  };

  await Promise.all([
    getCollateral(),
    getSgbBalance(),
    getWsgbBalance(),
    getStake(),
  ]);
  await updateSnapshotData(wallet, result, blockNumber);
};

module.exports = { getSnapshotByWallet };
