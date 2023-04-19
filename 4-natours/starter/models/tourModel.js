const mongoose = require(`mongoose`);
const slugify = require(`slugify`);

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, `A tour name must be 40 characters or less`],
      minLength: [10, `A tour name must be 10 characters or more`],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, `A tour must have a duration`],
    },
    maxGroupSize: {
      type: Number,
      required: [true, `A tour must have a group size`],
    },
    difficulty: {
      type: String,
      required: [true, `A tour must have a difficulty`],
      enum: {
        values: [`easy`, `medium`, `difficult`],
        message: [`Difficulty must be 'easy', 'medium' or 'difficult'`],
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, `A rating must be 1.0 or higher`],
      max: [5, `A rating must be 5.0 or lower`],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price'],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, `A tour must have a description`],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, `A tour must have a cover image`],
    },
    image: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true } }
);

tourSchema.virtual(`durationWeeks`).get(function () {
  return Math.round((this.duration * 10) / 7) / 10;
});

// Wont trigger on findById and update
tourSchema.pre(`save`, function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre(`save`, (next) => {
//   console.log(`Will save next`);
//   next();
// });

// tourSchema.post(`save`, (doc, next) => {
//   console.log(doc);
//   next();
// });

// Querry middleware

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Querry took ${Date.cnow() - this.start}ms`);
  console.log(docs);
  next();
});

//Aggregation middleware
tourSchema.pre(`aggregate`, function (next) {
  this.pipeline().unsift({
    $match: {
      secretTour: { $ne: true },
    },
  });
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model(`Tour`, tourSchema);

module.exports = Tour;
