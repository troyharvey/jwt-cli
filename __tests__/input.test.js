const {
  getArgument,
  getCommand,
  getToken,
  pipedToken,
} = require("../src/input.js");
const { Readable } = require("stream");

async function* tokenGenerator() {
  yield "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.bbnVJXHRSGcz5UbklFWC-_MCZQSucRVAwPfEbp5KoJ4";
}

test("get a token from stdin piped readable input stream", async () => {
  const token = await pipedToken(Readable.from(tokenGenerator()));
  expect(token).toBe(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.bbnVJXHRSGcz5UbklFWC-_MCZQSucRVAwPfEbp5KoJ4"
  );
});

test("get cli argument", () => {
  expect(getArgument("output")).toBe(undefined);
});

test("get token from cli argument", async () => {
  process = {
    stdin: {
      isTTY: true,
    },
    argv: ["node", "index.js", "a.tok.en"],
  };
  const token = await getToken(process);
  expect(token).toBe("a.tok.en");
});

test("get token from stdin piped stream", async () => {
  process = {
    stdin: {
      isTTY: false,
    },
  };
  process.stdin = Readable.from(tokenGenerator());
  const token = await getToken(process);
  expect(token).toBe(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.bbnVJXHRSGcz5UbklFWC-_MCZQSucRVAwPfEbp5KoJ4"
  );
});

test("get command works as expected", () => {
  const oldArgv = process.argv;
  const args = ["node", "index.js"];
  try {
    // default is encode
    process.argv = args.concat(["some-token", "--secret", "s"]);
    let defaultCommand = getCommand();
    expect(defaultCommand).toEqual("decode");

    // explicit works as well
    process.argv = args.concat(["decode", "some-token", "--secret", "s"]);
    let explicitCommand = getCommand();
    expect(explicitCommand).toEqual("decode");

    // decode works when explicitly given
    process.argv = args.concat([
      "encode",
      "--header.alg",
      "HS256",
      "--body.sub",
      "me",
    ]);
    let encodeCommand = getCommand();
    expect(encodeCommand).toEqual("encode");
  } finally {
    process.argv = oldArgv;
  }
});
