const express = require('express');
const validateAccess = require('./queryMiddleware.js');
const app = express();
const port = process.env.PORT || 3000;
const rate = require('./scrape.js');

app.get("/", validateAccess, (req, res) => {
    rate(res);
});

app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Sarf Application started successfuly and listening port ${port}`);
})