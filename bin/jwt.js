#! /usr/bin/env node

var colors = require('colors');
var json = require('format-json');
var jwt = require('jsonwebtoken');

function niceDate(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000);
    return colors.yellow(unixTimestamp) + " " + date.toLocaleString();
}

var token = {};

if (process.stdin.isTTY) {
    token['string'] = process.argv[2];
    processToken(token);
}
else {
    var data = '';
    process.stdin.on('readable', function() {
      var chunk;
      while (chunk = process.stdin.read()) {
          data += chunk;
      }
    });

    process.stdin.on('end', function () {
        // There will be a trailing \n from the user hitting enter. Get rid of it.
        data = data.replace(/\n$/, '');
        token['string'] = data;
        processToken(token);
    });
}

function processToken(token) {
    if (token.string === undefined || token.string.split('.').length !== 3) {
        console.log('jwt-cli version 1.0.5\n');
        console.log(colors.yellow('Usage:'));
        console.log(' jwt [encoded token]');
        return;
    }

    token.parts = token.string.split('.');
    token.decoded = jwt.decode(token.string, {complete: true});

    if (token.decoded === null) {
        console.log('\n😾  token no good');
        return;
    }

    console.log(
        '\n' +
        colors.red('http://jwt.io/#id_token=') +
        colors.green(token.parts[0]) + '.' +
        colors.yellow(token.parts[1]) + '.' +
        colors.red(token.parts[2])
    );

    console.log(colors.green('\n✻ Header'));
    console.log(colors.green(json.plain(token.decoded.header)));

    console.log(colors.yellow('\n✻ Payload'));
    console.log(colors.yellow(json.plain(token.decoded.payload)));

    console.log(colors.yellow('   iat: ') + niceDate(token.decoded.payload.iat));
    console.log(colors.yellow('   nbf: ') + niceDate(token.decoded.payload.nbf));
    console.log(colors.yellow('   exp: ') + niceDate(token.decoded.payload.exp));

    console.log(colors.red('\n✻ Signature ' + token.decoded.signature));
}
