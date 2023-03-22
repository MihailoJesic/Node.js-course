const fs = require(`fs`);
const express = require(`express`);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

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

const router = express.Router();

router.route(`/`).get(getAllTours).post(createTour);
router.route(`/:id`).get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
