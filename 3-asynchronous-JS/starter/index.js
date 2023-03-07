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

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      console.log(res.body);

      fs.writeFile(`dog-img.txt`, res.body.message, (err) => {
        if (err) return console.log(err.message);
        console.log(`Random Terrier Saved`);
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});
