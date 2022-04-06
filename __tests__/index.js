const { niceDate, outputHeader, prettyJson } = require("../src/output.js");

test("turn a jwt timestamp into a formatted date", () => {
  expect(niceDate(1407019629, "en-US")).toBe("8/2/2014, 6:47:09 PM");
});

test("format a json object", () => {
  const expected = `{
  "a": 1,
  "b": 2
}`;
  expect(prettyJson({ a: 1, b: 2 })).toBe(expected);
});

test("output jwt header", () => {
  const consoleSpy = jest.spyOn(console, 'log');
  outputHeader({ alg: "HS256", typ: "JWT" });
  expect(consoleSpy).toHaveBeenCalledTimes(2);
});
