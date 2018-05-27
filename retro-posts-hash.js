/* Generate hashes for src/components/PostListing/retro-posts.json, rewriting
* the "cover" property of all entries in retro-posts.json
* */

const jsonPath = './src/components/PostListing/retro-posts.json';

const crypto = require('crypto');
const fs = require('fs');

const retroPosts = require(jsonPath);

function addHash(node) {
  const shasum = crypto.createHash('sha1');
  // Do not use existing cover or hash in the shasum;
  const shaSource = Object.assign({}, node, {cover: '', hash: ''});
  shasum.update(JSON.stringify(shaSource));
  const hash = shasum.digest('hex');
  const newNode = Object.assign({}, shaSource, {
    cover: `/cover/${hash}.png`,
    hash
  });
  return newNode;
}

function generate() {
  const retroPostsWithHash = retroPosts.map(addHash);
  const resultJson = JSON.stringify(retroPostsWithHash, null, 2);
  const fsPromise = new Promise((resolve) => {
    fs.writeFile(jsonPath, resultJson, 'utf8',
      () => {
        resolve(retroPostsWithHash.map(post => post.hash));
      });
  });
  return fsPromise;
}

module.exports = generate;