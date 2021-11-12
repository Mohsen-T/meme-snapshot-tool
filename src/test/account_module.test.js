const accountModule = require("../modules/account");

(async () => {
  const from = process.argv[2];
  const to = process.argv[3];
  const start = process.argv[4];

  // let accounts = await accountModule.getAccounts(from, to);
  // console.log(accounts);
  
  //let bal = await accountModule.getWBalance('0x49dc27AC94D93F1fef6f231D0DDb7336b4A0dd2C',from);
  //console.log(bal);

  let bals = await accountModule.getBalances(from, to, start);
  console.log(bals);

  process.exit(0);
})();
