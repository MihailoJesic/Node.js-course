const express = require(`express`);

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

const router = express.Router();

router.route(`/`).get(getAllUsers).post(createUser);
router.route(`/:id`).get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
