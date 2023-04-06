const Tour = require(`./../models/tourModel`);
console.log(Tour);

exports.getAllTours = async function (req, res) {
  try {
    console.log(req.query);

    // Build Query
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = [`page`, `sort`, `limit`, `fields`];
    excludedFields.forEach((el) => delete queryObj[el]);

    //Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(`,`).join(` `);
      query = query.sort(sortBy);
    } else {
      query = query.sort(`-createdAt`);
    }

    // Field Limiting

    if (req.query.fields) {
      console.log(`💚 ${req.query.fields}`);
      query = query.select(req.query.fields.split(',').join(' '));
    } else {
      query = query.select(`-__v`);
    }

    // Execute Query
    const tours = await query;

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
    // const newTour = new Tour({});
    // newTour.save()

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
    // Tour.findOne({ _id: req.params.id });

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
