const advanceResults = (model, populate) => async (req, res, next) => {

    let query;

    // copy req.query
    const reqQuery = {
        ...req.query
    };

    //fields to exclude
    const removeField = ['select,sort,page,limit'];


    //loop over removefields and delete them from reqQuery
    removeField.forEach(param => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(req.query);

    //create operators ($gt,$gte etc)
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    //Finding resources
    query = model.find(JSON.parse(queryStr));

    //Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt')
    }

    //pagination
    const page = parseInt(req, query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate)
    }

    //Executing query
    const results = await query;

    //pagination results
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    res.advanceResults = {
        succsess: true,
        count: results.length,
        pagination,
        data: results
    }

    next()
}

module.exports = advanceResults;