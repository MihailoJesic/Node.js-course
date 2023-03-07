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

async function getDogPic() {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map((el) => {
      return el.body.message;
    });

    await writeFilePro(`dog-img.txt`, imgs.join(`\n`));

    console.log(`Random Terriers Saved`);
  } catch (err) {
    console.log(`❌ ${err.message} ❌`);
    throw err;
  }
  return `Done ✔`;
}

(async () => {
  try {
    console.log(`I will acquire dog pics.`);
    const x = await getDogPic();
    console.log(x);
    console.log(`I have acquired dog pics!`);
  } catch (err) {
    console.log(`${err.message} ⭕`);
  }
})();

// getDogPic()
//   .then((x) => {
//     console.log(x);
//   })
//   .catch((err) => {
//     console.log(`${err.message} ❤❤❤❤`);
//   });

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body);
//     return writeFilePro(`dog-img.txt`, res.body.message);
//   })
//   .then(() => {
//     console.log(`Random Terrier Saved`);
//   })
//   .catch((err) => {
//     console.log(`❌ ${err.message} ❌`);
//   });
