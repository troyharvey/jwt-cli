const { randomBytes, generateKeyPairSync } = require("node:crypto");
const { createDecoder, createVerifier, createSigner } = require("fast-jwt");

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

const algPrefixes = ["HS", "RS", "ES"];

function encodeToken(header, body = {}, secret = null, options = {}) {
  if (!header) throw new Error("no header for encoding");
  const { alg } = header;
  if (!alg) throw new Error("no header.algorithm for encoding");
  if (typeof alg !== "string") throw new Error("header.alg must be a string");

  /**
   * @type {'HS' | 'RS' | 'ES'}
   */
  const algClass = algPrefixes.filter((e) => alg.startsWith(e)).pop();
  if (!algClass)
    throw new Error(`not a known (${algPrefixes}) algorithm prefix: ${alg}`);

  if (!secret) {
    let generatedPublicKey;

    switch (algClass) {
      case "HS": {
        secret = randomBytes(64).toString("hex");
        break;
      }

      case "RS": {
        const { publicKey, privateKey } = generateKeyPairSync("rsa", {
          modulusLength: 1024,
          publicKeyEncoding: { type: "pkcs1", format: "pem" },
          privateKeyEncoding: { type: "pkcs1", format: "pem" },
        });
        secret = privateKey;
        generatedPublicKey = publicKey;
        break;
      }

      case "ES": {
        const { publicKey, privateKey } = generateKeyPairSync("ec", {
          namedCurve: "secp256k1",
          publicKeyEncoding: { type: "spki", format: "pem" },
          privateKeyEncoding: { type: "pkcs8", format: "pem" },
        });
        secret = privateKey;
        generatedPublicKey = publicKey;
        break;
      }
    }

    if (options.verboseFlag && generatedPublicKey) {
      const verboseMessage =
        "printing generated key because verbose mode is selected";
      let obj = { message: verboseMessage, secret, generatedPublicKey };
      console.log(JSON.stringify(obj, null, 2));
    }
  }

  return createSigner({
    ...header,
    algorithm: alg,
    key: secret,
    expiresIn: header.exp,
    notBefore: header.nbf,
    kid: algClass === "ES" ? "" + header.kid : header.kid,
  })(body);
}

module.exports = {
  decodeToken,
  encodeToken,
};
