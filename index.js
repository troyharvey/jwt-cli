const {
  outputHeader,
  outputPayload,
  outputSignature,
  outputTokenAsJson,
  outputJwtIoLink,
  outputNicePayloadDates,
} = require("./src/output.js");

const { getToken, getArgument } = require("./src/input.js");
const { decodeToken } = require("./src/jwt.js");

(async () => {
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
