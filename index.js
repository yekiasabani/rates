const express = require('express');
const validateAccess = require('./queryMiddleware.js');
const app = express();
const port = process.env.PORT || 3000;
const rate = require('./scrape.js');
const rate2 = require('./scrape2.js');
const rate3 = require('./scrape3.js');

app.get("/", validateAccess, (req, res) => {
    // rate(res);
    res.send('ACESS DENIED...');
});

app.get("/second", validateAccess, (req, res) => {
    rate2(res);
});

app.get("/third", validateAccess, (req, res) => {
    rate3(res);
});

app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Sarf Application started successfuly and listening port ${port}`);
})