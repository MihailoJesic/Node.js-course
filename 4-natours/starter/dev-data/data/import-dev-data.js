const fs = require(`fs`);
const mongoose = require(`mongoose`);
const dotenv = require(`dotenv`);
const Tour = require(`./../../models/tourModel`);

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

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, `utf-8`)
);

// Import Data into DB

async function importData() {
  try {
    await Tour.create(tours);
    console.log(`Data Successfully loaded`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

// Delete all data from DB
async function deleteData() {
  try {
    await Tour.deleteMany();
    console.log(`Data Successfully deleted`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

if (process.argv[2] === `--import`) {
  importData();
}

if (process.argv[2] === `--delete`) {
  deleteData();
}
