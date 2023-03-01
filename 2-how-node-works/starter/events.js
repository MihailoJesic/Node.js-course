const eventsEmitter = require(`events`);

const myEmitter = new eventsEmitter();

myEmitter.on(`newSale`, () => {
  console.log(`There was a sale!`);
});

myEmitter.on(`newSale`, () => {
  console.log(`Customer: Mihailo`);
});

myEmitter.emit(`newSale`);
