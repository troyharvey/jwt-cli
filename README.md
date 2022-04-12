# jwt-cli

[![npm (tag)](https://img.shields.io/npm/v/jwt-cli/latest.svg)](https://www.npmjs.com/package/jwt-cli)
[![npm](https://img.shields.io/npm/dt/jwt-cli.svg)](https://www.npmjs.com/package/jwt-cli)

```sh
npm install -g jwt-cli
```

![](checkitout.gif)

## What is this?

`jwt` is an npm CLI program for decoding [JSON Web Tokens](http://jwt.io/) (JWT) and the Unix timestamps within their bowels.

## Usage

There are two ways to parse a jwt. Copy the jwt to your clipboard and pipe it into the `jwt` command, or paste it as an argument.

1. `pbpaste | jwt`
2. `jwt <encoded token> --secret=<optional signing secret>`--output=json

```sh
$ jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsImV4cCI6MTQwNzAxOTYyOSwianRpIjoiaWQxMjM0NTYiLCJ0eXAiOiJodHRwczpcL1wvZXhhbXBsZS5jb21cL3JlZ2lzdGVyIiwidGVzdC10eXBlIjoiZm9vIn0.UGLFIRACaHpGGIDEEv-4IIdLfCGXT62X1vYx7keNMyc

✻ Header
{
  "typ": "JWT",
  "alg": "HS256"
}

✻ Payload
{
  "iss": "http://example.org",
  "aud": "http://example.com",
  "iat": 1356999524,
  "nbf": 1357000000,
  "exp": 1407019629,
  "jti": "id123456",
  "typ": "https://example.com/register",
  "test-type": "foo"
}
   iat: 1356999524 Mon Dec 31 2012 19:18:44 GMT-0500 (EST)
   nbf: 1357000000 Mon Dec 31 2012 19:26:40 GMT-0500 (EST)
   exp: 1407019629 Sat Aug 02 2014 18:47:09 GMT-0400 (EDT)

✻ Signature UGLFIRACaHpGGIDEEv-4IIdLfCGXT62X1vYx7keNMyc
```

<a href="http://jwt.io">![](https://cdn.auth0.com/badges/jwt-compatible.svg)</a>
