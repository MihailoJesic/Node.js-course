const fs = require(`fs`);
const express = require(`express`);
const morgan = require(`morgan`);

const app = express();

// Middleware

app.use(morgan(`dev`));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Hello from middleware ⭕`);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

// Start Server

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}.`);
});
