const mongoose = require(`mongoose`);
const dotenv = require(`dotenv`);
const app = require(`./app`);

dotenv.config({ path: `./config.env` });

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
app.listen(port, () => {
  console.log(`App running on port: ${port}.`);
});
