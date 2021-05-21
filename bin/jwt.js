#! /usr/bin/env node

var colors = require("colors/safe");
var json = require("format-json");
var jwt = require("jsonwebtoken");
var parseArgs = require("minimist");

function niceDate(unixTimestamp) {
  var dateString;
  if (typeof unixTimestamp === "number" && !isNaN(unixTimestamp)) {
    dateString = new Date(unixTimestamp * 1000).toLocaleString();
  } else {
    dateString = "Invalid Date";
  }
  return colors.yellow(unixTimestamp) + " " + dateString;
}

function processToken(token) {
  if (token.string === undefined || token.string.split(".").length !== 3) {
    const pkg = require("../package.json");
    console.log(`jwt-cli - JSON Web Token parser [version ${pkg.version}]\n`);
    console.info(
      colors.yellow("Usage: jwt <encoded token> --secret=<signing secret>\n")
    );
    console.log("ℹ Documentation: https://www.npmjs.com/package/jwt-cli");
    console.log(
      "⚠ Issue tracker: https://github.com/troyharvey/jwt-cli/issues"
    );
    return;
  }

  token.parts = token.string.split(".");
  token.decoded = jwt.decode(token.string, { complete: true });

  if (token.decoded === null) {
    console.log("\n😾  token no good");
    return false;
  }

  console.log(colors.yellow("\nTo verify on jwt.io:"));
  console.log(
    "\n" +
      colors.magenta("https://jwt.io/#id_token=") +
      colors.cyan(token.parts[0]) +
      "." +
      colors.yellow(token.parts[1]) +
      "." +
      colors.magenta(token.parts[2])
  );

  console.log(colors.cyan("\n✻ Header"));
  console.log(colors.cyan(json.plain(token.decoded.header)));

  console.log(colors.yellow("\n✻ Payload"));
  console.log(colors.yellow(json.plain(token.decoded.payload)));

  const dates = { iat: "Issued At", nbf: "Not Before", exp: "Expiration Time" };
  for (const [field, name] of Object.entries(dates)) {
    if (Object.prototype.hasOwnProperty.call(token.decoded.payload, field)) {
      console.log(
        colors.yellow(`   ${name}: `) + niceDate(token.decoded.payload[field])
      );
    }
  }

  console.log(colors.magenta("\n✻ Signature " + token.decoded.signature));
  return true;
}

function verifyToken(token, secret) {
  try {
    jwt.verify(token.string, secret);
    console.log(colors.green("\n✻ Signature Verified!"));
  } catch (err) {
    console.log(colors.red("\n✻ Invalid Signature!"));
  }
}

function handleTokenAsAnArg() {
  const argv = parseArgs(process.argv.slice(2));
  token.string = argv._[0];
  token.isValid = processToken(token);
  if (token.isValid && argv.secret) {
    verifyToken(token, argv.secret);
  }
}

function handleTokenAsStdin() {
  var data = "";
  process.stdin.on("readable", function () {
    var chunk;
    while ((chunk = process.stdin.read())) {
      data += chunk;
    }
  });

  process.stdin.on("end", function () {
    // There will be a trailing \n from the user hitting enter. Get rid of it.
    data = data.replace(/\n$/, "");
    token.string = data;
    processToken(token);
  });
}

var token = {};

if (process.stdin.isTTY) {
  handleTokenAsAnArg();
} else {
  handleTokenAsStdin();
}
