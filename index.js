#! /usr/bin/env node

const {
  outputHeader,
  outputHelp,
  outputJwtIoLink,
  outputNicePayloadDates,
  outputPayload,
  outputSignature,
  outputTokenAsJson,
  outputTokenAsEncoded,
  outputVersion,
} = require("./src/output.js");

const { getToken, getArgument, getCommand } = require("./src/input.js");
const { decodeToken, encodeToken } = require("./src/jwt.js");

(async () => {
  const token = await getToken(process);
  const secret = getArgument("secret");
  const output = getArgument("output");
  const versionFlag = getArgument("version");
  const verboseFlag = getArgument("verbose");
  const helpFlag = getArgument("help");

  if (versionFlag) {
    outputVersion();
    process.exit(0);
  }

  if (helpFlag) {
    outputHelp();
    process.exit(0);
  }

  const command = getCommand();
  switch (command) {
    case "encode":
      let header = getArgument("header");
      let body = getArgument("body");
      outputTokenAsEncoded(encodeToken(header, body, secret, { verboseFlag }));
      break;
    case "decode":
      decode(token, secret, output);
      break;
  }
})();

function decode(token, secret, output) {
  const decodedToken = decodeToken(token, secret);
  if (token === undefined) {
    process.exit(1);
  } else if (output === "json") {
    outputTokenAsJson(decodedToken);
  } else {
    outputJwtIoLink(token);
    outputHeader(decodedToken.header);
    outputPayload(decodedToken.payload);
    outputNicePayloadDates(decodedToken.payload);
    outputSignature(decodedToken.signature);
  }
}
