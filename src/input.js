const parseArgs = require("minimist");

async function pipedToken(readable) {
  let token = "";
  for await (const chunk of readable) {
    token += chunk;
  }
  return token;
}

async function getToken(process) {
  if (process.stdin.isTTY) {
    var argv = parseArgs(process.argv.slice(2));
    return argv["_"][0];
  }

  return await pipedToken(process.stdin);
}

function getArgument(key) {
  var argv = parseArgs(process.argv.slice(2));
  return argv[key];
}

const validCommands = { encode: true, decode: true };

/**
 * @return {'encode' | 'decode'}
 */
function getCommand() {
  let positional = parseArgs(process.argv.slice(2))._;
  let command = positional.shift();
  return validCommands[command] ? command : "decode";
}

module.exports = {
  getToken,
  getArgument,
  getCommand,
  pipedToken,
};
