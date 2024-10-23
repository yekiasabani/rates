const validateQuery = (req, res, next) => {
    const { currency } = req.query;
    if (!currency) {
        res.send('Query is not valid');
    }
    next();
}

module.exports = validateQuery;