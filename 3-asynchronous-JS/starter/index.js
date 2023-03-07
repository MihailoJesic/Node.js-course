const { rejects } = require("assert");
const fs = require(`fs`);
const { resolve } = require("path");
const superagent = require(`superagent`);

const api = ``;

function readFilePro(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err.message + ` ❌`);
      resolve(data);
    });
  });
}

function writeFilePro(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(err.message + ` ❌`);
      resolve(`File Writen.`);
    });
  });
}

readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body);

    return writeFilePro(`dog-img.txt`, res.body.message);
  })
  .then(() => {
    console.log(`Random Terrier Saved`);
  })
  .catch((err) => {
    console.log(err.message);
  });
