const mongoose = require(`mongoose`);
const dotenv = require(`dotenv`);

dotenv.config({ path: `./config.env` });
const app = require(`./app`);

const DB = process.env.DATABASE.replace(
  `<PAASSWORD>`,
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB Connection Successful`);
  });

//Local Database Host Version
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log(`DB Connection Successful`);
//   });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port: ${port}.`);
});

process.on(`unhandledRejection`, (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDLED REJECTION! Shutting down`);
  server.close(() => {
    process.exit(1);
  });
});
