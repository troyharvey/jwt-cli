const { decodeToken } = require("../src/jwt.js");

test("decode a jwt token", () => {
  expect(
    decodeToken(
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsImV4cCI6MTQwNzAxOTYyOSwianRpIjoiaWQxMjM0NTYiLCJ0eXAiOiJodHRwczpcL1wvZXhhbXBsZS5jb21cL3JlZ2lzdGVyIiwidGVzdC10eXBlIjoiZm9vIn0.UGLFIRACaHpGGIDEEv-4IIdLfCGXT62X1vYx7keNMyc"
    )
  ).toStrictEqual({
    header: { alg: "HS256", typ: "JWT" },
    input:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsImV4cCI6MTQwNzAxOTYyOSwianRpIjoiaWQxMjM0NTYiLCJ0eXAiOiJodHRwczpcL1wvZXhhbXBsZS5jb21cL3JlZ2lzdGVyIiwidGVzdC10eXBlIjoiZm9vIn0",
    payload: {
      aud: "http://example.com",
      exp: 1407019629,
      iat: 1356999524,
      iss: "http://example.org",
      jti: "id123456",
      nbf: 1357000000,
      "test-type": "foo",
      typ: "https://example.com/register",
    },
    signature: "UGLFIRACaHpGGIDEEv-4IIdLfCGXT62X1vYx7keNMyc",
  });
});

test("decode a jwt with a secret", () => {
  expect(
    decodeToken(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.bbnVJXHRSGcz5UbklFWC-_MCZQSucRVAwPfEbp5KoJ4",
      "derp"
    )
  ).toStrictEqual({
    header: {
      alg: "HS256",
      typ: "JWT",
    },
    payload: {
      iat: 1516239022,
      name: "John Doe",
      sub: "1234567890",
    },
    signature: "bbnVJXHRSGcz5UbklFWC-_MCZQSucRVAwPfEbp5KoJ4",
  });
});
