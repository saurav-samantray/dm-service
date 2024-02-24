const logger = require("../../config/loggingConfig");
const { TenantModel } = require("../../models/Tenant");

const tenantShouldNotExist = async function (req, res, next) {
    if(req.params.code && (await TenantModel.find().where('code').equals(req.params.code)).length > 0  ){
        logger.info(`Tenant exists based on path variable [${req.params.code}]`)
        return res.status(400).send({
            status: 400,
            message: `Tenant [${req.params.code}] already exists`
        });
    }
    if(req.body.code && (await TenantModel.find().where('code').equals(req.body.code)).length > 0 ){
        logger.info(`Tenant exists based on body code [${req.body.code}], [${await TenantModel.find().where('code').equals(req.body.code)}]`)
        return res.status(400).send({
            status: 400,
            message: `Tenant [${req.body.code}] already exists`
        });
    }
    next();
}

const doesTenantExists = async function (code) {
    if(code && (await TenantModel.find().where('code').equals(code)).length > 0 ){
        logger.info(`Tenant [${code}] exists`)
        return true;
    }
    return false;
}


module.exports = {
    tenantShouldNotExist,
    doesTenantExists
};