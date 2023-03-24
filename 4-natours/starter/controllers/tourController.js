const fs = require(`fs`);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = function (req, res, next, val) {
  console.log(`Tour id is ${val}`);
  const id = req.params.id * 1;
  if (val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  next();
};

exports.getAllTours = function (req, res) {
  res.status(200).json({
    status: `success`,
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.createTour = function (req, res) {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
};

exports.getTour = function (req, res) {
  const id = req.params.id * 1;

  const tour = tours.find((el) => {
    return el.id === id;
  });

  res.status(200).json({
    status: `success`,
    data: {
      tour,
    },
  });
};

exports.updateTour = function (req, res) {
  const id = req.params.id * 1;

  res.status(200).json({
    status: `success`,
    data: {
      tour: `<Updated tour here...>`,
    },
  });
};

exports.deleteTour = function (req, res) {
  res.status(204).json({
    status: `success`,
    data: null,
  });
};
