# jwt

```sh
npm install -g jwt-cli
```

![](checkitout.gif)

`jwt` is an npm package for decoding [JSON Web Tokens](http://jwt.io/) (JWT) and the Unix timestamps within their bowels.

## Usage

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
