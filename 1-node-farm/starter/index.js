const fs = require(`fs`);
const http = require(`http`);
const url = require(`url`);

////////////////////////////////////////////////////////
///Files
//Synchronous
// const textIn = fs.readFileSync("${__dirname}}/txt/input.txt", "utf-8");

// const textOut = `This is what we know about the avocado ${textIn}. \nCreated on ${Date.now()}`;

// fs.writeFileSync(`${__dirname}}/txt/output.txt`, textOut);
// console.log(`Text Writen`);

//Asynch
// fs.readFile(`${__dirname}}/txt/start.txt`, `utf-8`, (err, data1) => {
//   console.log(data1, err);
//   fs.readFile(`${__dirname}}/txt/${data1}.txt`, `utf-8`, (err, data2) => {
//     console.log(data2);
//     fs.readFile(`${__dirname}}/txt/append.txt`, `utf-8`, (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         `${__dirname}}/txt/output.txt`,
//         `${data2}\n\n${data3}\n\n❤`,
//         `utf-8`,
//         (err) => {}
//       );
//       console.log(`File Written`);
//     });
//   });
// });
// console.log(`After Read Log`);

////////////////////////////////////////////////////////
///Server

function replaceTemplate(temp, product) {
  console.log(`❌❌❌temp❌❌❌ = `, temp);
  console.log(`❌❌❌product❌❌❌ = `, product);

  let output = temp.replace(/{% ID %}/g, product.id);
  output = output.replace(/{% NAME %}/g, product.productName);
  output = output.replace(/{% IMAGE %}/g, product.image);
  output = output.replace(/{% FROM %}/g, product.from);
  output = output.replace(/{% NUTRIENTS %}/g, product.nutrients);
  output = output.replace(/{% QUANTITY %}/g, product.quantity);
  output = output.replace(/{% PRICE %}/g, product.price);
  output = output.replace(/{% DESCRIPTION %}/g, product.description);

  if (!product.organic) {
    output = output.replace(/{% NOT_ORGANIC %}/g, `not-organic`);
  }

  console.log(`❌❌❌restult❌❌❌ = `, output);
  return output;
}

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  `utf-8`
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  `utf-8`
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  `utf-8`
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, `utf-8`);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const path = req.url;

  if (path === `/overview` || path === `/`) {
    res.writeHead(200, { contentType: "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(``);

    const output = tempOverview.replace(`{% CARDS %}`, cardsHtml);

    res.end(output);
  } else if (path === `/product`) {
    res.end(`Hello World!\nThis is the Product`);
  } else if (path === `/api`) {
    res.writeHead(200, { contentType: "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end(`<h1>404 - PAGE NOT FOUND</h1>`);
  }
});

server.listen(8000, `127.0.0.1`, () => {
  console.log(`Listening on poert 8000`);
});
