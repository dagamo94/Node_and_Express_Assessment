const express = require('express');
const morgan = require('morgan');
const app = express();

// ** import Router middleware function: validateZip **
const validateZip = require('./middleware/validateZip');

// ** import getZoos function **
const getZoos = require('./utils/getZoos');

// ** declare middleware **
// /check/:zip
const checkZip = (req, res, next) => {
    const {zip} = req.params;

    if(getZoos(zip)){
        res.send(`${zip} exists in our records.`);
    }else{
        next(`${zip} does not exist in our records.`);
    }
}

// /zoos/:zip
const getZoosByZip = (req, res, next) => {
    const {zip} = req.params;
    const zoos = getZoos(zip);

    if(zoos.length){
        res.send(`${zip} zoos: ${zoos.join('; ')}`);
    }else{
        next(`${zip} has no zoos.`);
    }
};

// /zoos/all
const allZoosAdmin = (req, res, next) => {
    const {admin} = req.query;

    if(admin === "true"){
        res.send(`All zoos: ${getZoos().join('; ')}`);
    }else{
        next(`You do not have access to that route.`);
    }
}

// ** routes pipeline **
app.use(morgan("dev"));
app.get("/check/:zip", validateZip, checkZip);
app.get("/zoos/all", allZoosAdmin);
app.get("/zoos/:zip", validateZip, getZoosByZip);
// ** error handling
app.use((req, res, next) => res.send(`That route could not be found!`));    // no route found
app.use((err, req, res, next) => {
    console.error(err);
    res.send(err);
})  // catch any other errors

// ** export express app **
module.exports = app;