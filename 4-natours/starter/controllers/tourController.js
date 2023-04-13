const Tour = require(`./../models/tourModel`);
const APIFeatures = require(`./../utils/apiFeatures`);

exports.aliasTopTours = async function (req, res, next) {
  req.query.limit = `5`;
  req.query.sort = `-ratingsAverage,price`;
  req.query.fields = `name,price,ratingsAverage,difficulty,summary`;
  next();
};

exports.getAllTours = async function (req, res) {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // Send Response
    res.status(200).json({
      status: `success`,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: `fail`,
      message: err,
    });
  }
};

exports.createTour = async function (req, res) {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async function (req, res) {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: `success`,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async function (req, res) {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: `success`,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async function (req, res) {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: `success`,
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats = async function (req, res) {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: null,
          // _id: `$ratingAverage`,
          _id: { $toUpper: `$difficulty` },
          num: { $sum: 1 },
          numOfRating: { $sum: `$ratingQuantity` },
          avgRating: { $avg: `$ratingAverage` },
          avgPrice: { $avg: `$price` },
          minPrice: { $min: `$price` },
          maxPrice: { $max: `$price` },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: `EASY` } },
      // },
    ]);

    res.status(200).json({
      status: `success`,
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async function (req, res) {
  try {
    const year = req.params.year * 1;

    console.log(`⭕${year}⭕`);

    const plan = await Tour.aggregate([
      {
        $unwind: `$startDates`,
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
    ]);

    console.log(`⭕${plan}⭕`);

    res.status(200).json({
      status: `success`,
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
