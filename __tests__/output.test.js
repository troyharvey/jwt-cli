const {
  niceDate,
  outputHeader,
  outputHelp,
  outputJwtIoLink,
  outputNicePayloadDates,
  outputPayload,
  outputSignature,
  outputTokenAsJson,
  outputVersion,
  prettyJson,
} = require("../src/output.js");

test("turn a jwt timestamp into a formatted date", () => {
  expect(niceDate(1407019629, "en-US")).toBe("8/2/2014, 6:47:09 PM");
});

test("nice date is not a date", () => {
  expect(niceDate("derp")).toBe(undefined);
});

test("format a json object", () => {
  const expected = `{
  "a": 1,
  "b": 2
}`;
  expect(prettyJson({ a: 1, b: 2 })).toBe(expected);
});

test("output jwt header", () => {
  const consoleSpy = jest.spyOn(console, "log");
  outputHeader({ alg: "HS256", typ: "JWT" });
  expect(consoleSpy).toHaveBeenCalledTimes(2);
  consoleSpy.mockRestore();
});

test("output jwt payload", () => {
  const consoleSpy = jest.spyOn(console, "log");
  outputPayload({
    iss: "http://example.org",
    aud: "http://example.com",
    iat: 1356999524,
    nbf: 1357000000,
    exp: 1407019629,
    jti: "id123456",
    typ: "https://example.com/register",
    "test-type": "foo",
  });
  expect(consoleSpy).toHaveBeenCalledTimes(2);
  consoleSpy.mockRestore();
});

test("output signature", () => {
  const consoleSpy = jest.spyOn(console, "log");
  outputSignature("UGLFIRACaHpGGIDEEv-4IIdLfCGXT62X1vYx7keNMyc");
  expect(consoleSpy).toHaveBeenCalled();
  consoleSpy.mockRestore();
});

test("output token as json", () => {
  const stdoutWrite = jest.spyOn(process.stdout, "write");
  const token = {
    header: {
      typ: "JWT",
      alg: "HS256",
    },
    payload: {
      iss: "http://example.org",
      aud: "http://example.com",
      iat: 1356999524,
      nbf: 1357000000,
      exp: 1407019629,
      jti: "id123456",
      typ: "https://example.com/register",
      "test-type": "foo",
    },
    signature: "UGLFIRACaHpGGIDEEv-4IIdLfCGXT62X1vYx7keNMyc",
  };
  outputTokenAsJson(token);
  expect(stdoutWrite).toHaveBeenCalled();
  stdoutWrite.mockRestore();
});

test("output jwt.io link", () => {
  const consoleSpy = jest.spyOn(console, "log");
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsImV4cCI6MTQwNzAxOTYyOSwianRpIjoiaWQxMjM0NTYiLCJ0eXAiOiJodHRwczpcL1wvZXhhbXBsZS5jb21cL3JlZ2lzdGVyIiwidGVzdC10eXBlIjoiZm9vIn0.UGLFIRACaHpGGIDEEv-4IIdLfCGXT62X1vYx7keNMyc";
  outputJwtIoLink(token);
  expect(consoleSpy).toHaveBeenCalledTimes(2);
  consoleSpy.mockRestore();
});

test("output nice payload dates", () => {
  const consoleSpy = jest.spyOn(console, "log");
  outputNicePayloadDates({
    iat: 1356999524,
    nbf: 1357000000,
    exp: 1407019629,
  });
  expect(consoleSpy).toHaveBeenCalledTimes(3);
  outputNicePayloadDates({
    iat: 1356999524,
  });
  expect(consoleSpy).toHaveBeenCalledTimes(4);
  outputNicePayloadDates({
    nbf: 1357000000,
  });
  expect(consoleSpy).toHaveBeenCalledTimes(5);
  outputNicePayloadDates({
    exp: 1407019629,
  });
  expect(consoleSpy).toHaveBeenCalledTimes(6);
  consoleSpy.mockRestore();
});

test("output help", () => {
  const consoleSpy = jest.spyOn(console, "log");
  outputHelp();
  expect(consoleSpy).toHaveBeenCalledTimes(4);
  consoleSpy.mockRestore();
});

test("output version", () => {
  const consoleSpy = jest.spyOn(console, "log");
  outputVersion();
  expect(consoleSpy).toHaveBeenCalledTimes(1);
  consoleSpy.mockRestore();
});
