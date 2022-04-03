const { createDecoder } = require('fast-jwt')

async function readableToString2(readable) {
  let result = '';
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}

async function main() {
    let result = await readableToString2(process.stdin);
    return result
}

(async() => {
    let token = await readableToString2(process.stdin);

    const decodeComplete = createDecoder({ complete: true })
    const sections = decodeComplete(token)
    console.log(sections)

})();
