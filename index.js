import { createDecoder, createVerifier } from 'fast-jwt'
import parseArgs from 'minimist';
import chalk from 'chalk';


async function pipedToken(readable) {
  let result = "";
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}

function niceDate(unixTimestamp) {
  if (typeof unixTimestamp === 'number' && !isNaN(unixTimestamp)) {
    return new Date(unixTimestamp * 1000).toLocaleString();
  }
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
  }

  return await pipedToken(process.stdin);
}

function getArgument(key) {
  var argv = parseArgs(process.argv.slice(2));
  return argv[key]
}

function prettyJson(json) {
  return JSON.stringify(json, null, 2);
}

function outputHeader(header) {
  console.log(chalk.cyan("\n✻ Header"));
  console.log(chalk.cyan(prettyJson(header)));
}

function outputPayload(payload) {
  console.log(chalk.yellow("\n✻ Payload"));
  console.log(chalk.yellow(prettyJson(payload)));

}

function outputSignature(signature) {
  console.log(chalk.magenta(`\n✻ Signature ${signature}`));
}

function outputTokenAsJson(decodedToken) {
  process.stdout.write(JSON.stringify(decodedToken, null, 2));
}

function outputJwtIoLink(token) {
  const parts = token.split('.');
  console.log(chalk.yellow('\nTo verify on jwt.io:'));
  console.log(
    '\n' +
      chalk.magenta('https://jwt.io/#id_token=') +
      chalk.cyan(parts[0]) +
      '.' +
      chalk.yellow(parts[1]) +
      '.' +
      chalk.magenta(parts[2])
  );
}

function outputNicePayloadDates(payload) {
  if (payload.iat) {
    console.log(chalk.yellow(`   iat: ${payload.iat} `) + niceDate(payload.iat));
  }

  if (payload.nbf) {
    console.log(chalk.yellow(`   nbf: ${payload.nbf} `) + niceDate(payload.nbf));
  }

  if (payload.exp) {
    console.log(chalk.yellow(`   exp: ${payload.exp} `) + niceDate(payload.exp));
  }
}

(async() => {
  const token = await getToken();
  const secret = getArgument("secret");
  const output = getArgument("output");
  const decodedToken = decodeToken(token, secret);

  if (output == "json") {
    outputTokenAsJson(decodedToken);
  } else {
    outputJwtIoLink(token);
    outputHeader(decodedToken.header);
    outputPayload(decodedToken.payload);
    outputNicePayloadDates(decodedToken.payload);
    outputSignature(decodedToken.signature);
  }

})();
