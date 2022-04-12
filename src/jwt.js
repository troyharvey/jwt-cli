const { createDecoder, createVerifier } = require("fast-jwt");

function decodeToken(token, secret) {
  if (token == undefined) {
    return undefined;
  }

  if (secret == undefined) {
    const decodeComplete = createDecoder({ complete: true });
    const sections = decodeComplete(token);
    return sections;
  }

  const verifier = createVerifier({ key: secret, complete: true });
  return verifier(token);
}

module.exports = {
  decodeToken,
};
