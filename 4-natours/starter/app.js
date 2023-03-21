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

// Route handlers

function getAllTours(req, res) {
  console.log(req.requestTime);
  res.status(200).json({
    status: `success`,
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
}

function createTour(req, res) {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
}

function getTour(req, res) {
  const id = req.params.id * 1;

  const tour = tours.find((el) => {
    return el.id === id;
  });

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(200).json({
    status: `success`,
    data: {
      tour,
    },
  });
}

function updateTour(req, res) {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(200).json({
    status: `success`,
    data: {
      tour: `<Updated tour here...>`,
    },
  });
}

function deleteTour(req, res) {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(204).json({
    status: `success`,
    data: null,
  });
}

function getAllUsers(req, res) {
  res.status(200).json({
    status: `success`,
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
}

function createUser(req, res) {
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);

  users.push(newUser);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      });
    }
  );
}

function getUser(req, res) {
  const id = req.params.id * 1;

  const user = users.find((el) => {
    return el.id === id;
  });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(200).json({
    status: `success`,
    data: {
      user,
    },
  });
}

function updateUser(req, res) {
  const id = req.params.id * 1;
  if (id > users.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(200).json({
    status: `success`,
    data: {
      user: `<Updated user here...>`,
    },
  });
}

function deleteUser(req, res) {
  const id = req.params.id * 1;
  if (id > user.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(204).json({
    status: `success`,
    data: null,
  });
}

// Routes

app.route(`/api/v1/tours`).get(getAllTours).post(createTour);

app
  .route(`/api/v1/tours/:id`)
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route(`/api/v1/users`).get(getAllUsers).post(createUser);

app
  .route(`/api/v1/users/:id`)
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// Start Server

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}.`);
});
