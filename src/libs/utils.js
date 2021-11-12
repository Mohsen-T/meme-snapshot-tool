const { BigNumber } = require("bignumber.js");

const tenExponent = (digits) => {
  return new BigNumber(10).exponentiatedBy(digits);
};

const exponentTenToIncrease = (number, digits, decimals = -1) => {
  number = number || "0";
  const bn = new BigNumber(number);
  const exp = tenExponent(digits);
  const outcome = bn.multipliedBy(exp);
  if (decimals !== -1) {
    return outcome.toFixed(decimals);
  }
  return outcome.valueOf();
};

const exponentTenToDecrease = (number, digits, decimals = -1) => {
  number = number || "0";
  const bn = new BigNumber(number);
  const exp = tenExponent(digits);
  const outcome = bn.dividedBy(exp);
  if (decimals !== -1) {
    return outcome.toFixed(decimals);
  }
  return outcome.valueOf();
};

const createChunks = (data, chSize) => {
  const chunks = [];
  while (data.length) {
    chunks.push(data.splice(0, chSize));
  }

  return chunks;
};

module.exports = { 
  exponentTenToDecrease, 
  exponentTenToIncrease,
  createChunks,
};
