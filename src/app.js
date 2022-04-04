const express = require('express');
const morgan = require('morgan');
const app = express();

// import Router middleware function: validateZip
const validateZip = require('./middleware/validateZip');

// import getZoos function
const getZoos = require('./utils/getZoos');

// ** declare middleware **
// /check/:zip
const checkZip = (req, res, next) => {
    const zip = req.params.zip;
    const zoos = getZoos(zip);
    if(zoos){
        res.send(`${zip} exists in our records.`);
    }else{
        next(`${zip} does not exist in our records`);
    }
}

// /zoos/:zip
const getZoosByZip = (req, res, next) => {
    const zip = req.params.zip;
    const zoos = getZoos(zip);

    if(zoos){
        res.send(`${zip} zoos: ${zoos.join(';')}`);
    }
};

// ** routes pipeline **
app.use(morgan("dev"));
app.get("/check/:zip", validateZip, checkZip);
app.get("/zoos/all", checkZip);
app.get("/zoos/:zip", validateZip, getZoosByZip);
// ** error handling
// no route found
app.use((req, res, next) => res.send(`The route ${req.path} does not exist.`));
// catch any other errors
app.use((err, req, res, next) => {
    console.error(err);
    res.send(err);
})

// ** export express app **
module.exports = app;