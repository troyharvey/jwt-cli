#! /usr/bin/env node

const {
  outputHeader,
  outputHelp,
  outputJwtIoLink,
  outputNicePayloadDates,
  outputPayload,
  outputSignature,
  outputTokenAsJson,
  outputVersion,
} = require("./src/output.js");

const { getToken, getArgument } = require("./src/input.js");
const { decodeToken } = require("./src/jwt.js");

(async () => {
  const token = await getToken(process);
  const secret = getArgument("secret");
  const output = getArgument("output");
  const versionFlag = getArgument("version");
  const helpFlag = getArgument("help");
  const decodedToken = decodeToken(token, secret);

  if (versionFlag) {
    outputVersion();
    process.exit(0);
  }

  if (helpFlag) {
    outputHelp();
    process.exit(0);
  }

  if (token === undefined) {
    process.exit(1);
  } else if (output == "json") {
    outputTokenAsJson(decodedToken);
  } else {
    outputJwtIoLink(token);
    outputHeader(decodedToken.header);
    outputPayload(decodedToken.payload);
    outputNicePayloadDates(decodedToken.payload);
    outputSignature(decodedToken.signature);
  }
})();
