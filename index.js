const { createDecoder, createVerifier } = require("fast-jwt")
var parseArgs = require('minimist')

async function pipedToken(readable) {
  let result = "";
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}

function decodeToken(token, secret) {
  if (secret == undefined) {
    const decodeComplete = createDecoder({ complete: true })
    const sections = decodeComplete(token)
    return sections
  }

  const verifier = createVerifier({ key: secret, complete: true });
  return verifier(token);
}

async function getToken() {
  if (process.stdin.isTTY) {
    var argv = parseArgs(process.argv.slice(2));
    return argv["_"][0]
  } else {
    return await pipedToken(process.stdin);
  }
}

function getArgument(key) {
  var argv = parseArgs(process.argv.slice(2));
  return argv[key]
}

function printToken(decodedToken, output) {
  if (output == "json") {
    console.log(JSON.stringify(decodedToken, null, 2));
    return;
  }

  console.log("\n✻ Header");
  console.log(decodedToken.header);

  console.log("\n✻ Payload");
  console.log(decodedToken.payload);
}

(async() => {
  token = await getToken();
  secret = getArgument("secret");
  output = getArgument("output");
  decodedToken = decodeToken(token, secret);
  printToken(decodedToken, output);
})();
