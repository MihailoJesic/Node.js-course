const eventsEmitter = require(`events`);
const http = require(`http`);

class Sale extends eventsEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sale();

myEmitter.on(`newSale`, () => {
  console.log(`There was a sale!`);
});

myEmitter.on(`newSale`, () => {
  console.log(`Customer: Mihailo`);
});

myEmitter.on(`newSale`, (stock) => {
  console.log(`Event: ${stock} stock sold`);
});

myEmitter.emit(`newSale`, 9);

////////////////////

const server = http.createServer();

server.on(`request`, (req, res) => {
  console.log(`Request received`);
  console.log(req.url);
  res.end(`Request Received`);
});

server.on(`request`, (req, res) => {
  console.log(`Another one ⭕`);
});

server.on(`close`, (res, req) => {
  console.log(`Server Closed`);
});

server.listen(8000, `127.0.0.1`, () => {
  console.log(`waiting for requests...`);
});
