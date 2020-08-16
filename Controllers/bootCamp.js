exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Show all bootcamps",
  });
};

exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Show single bootcamp",
  });
};

exports.createBootcamp = (req, res, next) => {};

exports.updateBootcamp = (req, res, next) => {};

exports.deleteBootcamp = (req, res, next) => {};
