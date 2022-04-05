function validateZip(req, res, next) {
    const {zip} = req.params;
    if((/^-?\d+$/.test(zip)) && zip.length === 5){
        next();
    }else{
        next(`Zip (${zip}) is invalid!`);
    }
}

module.exports = validateZip;
