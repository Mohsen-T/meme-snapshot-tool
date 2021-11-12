const dotnev = require("dotenv-safe");
dotnev.config();
const CONFIG = process.env;
module.exports = CONFIG;
