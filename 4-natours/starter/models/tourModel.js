const mongoose = require(`mongoose`);
const slugify = require(`slugify`);

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
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
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
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
  },
  { toJSON: { virtuals: true } }
);

tourSchema.virtual(`durationWeeks`).get(function () {
  return Math.round((this.duration * 10) / 7) / 10;
});

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

const Tour = mongoose.model(`Tour`, tourSchema);

module.exports = Tour;
