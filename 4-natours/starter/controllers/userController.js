const fs = require(`fs`);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.getAllUsers = function (req, res) {
  res.status(200).json({
    status: `success`,
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
};

exports.createUser = function (req, res) {
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign(newId, ...req.body);

  users.push(newUser);
  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
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
};

exports.getUser = function (req, res) {
  const id = req.params.id * 1;

  const user = users.find((el) => el.id === id);

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
};

exports.updateUser = function (req, res) {
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
};

exports.deleteUser = function (req, res) {
  const id = req.params.id * 1;
  if (id > users.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(204).json({
    status: `success`,
    data: null,
  });
};
