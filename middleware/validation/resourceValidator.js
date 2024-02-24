const logger = require("../../config/loggingConfig");
const { ResourceGroupModel } = require("../../models/ResourceGroup");

const rgExists = async function (req, res, next) {
    if(!await isRGAvailable(req.params.rg, req.headers.tenant)){        
        logger.info(`RG [${req.params.rg}] exists  for tenant [${req.headers.tenant}]`)
        return res.status(400).send({
            status: 400,
            message: `Invalid Resource Group [${req.params.rg}] doesn't exists for tenant [${req.headers.tenant}]`
        });
    }
    next();
}

const isRGAvailable = async function (code, tenant) {
    if(code && tenant && (await ResourceGroupModel.find().where('code').equals(code).where('tenant').equals(tenant)).length > 0 ){
        logger.info(`Resource Group [${code}] exists  for tenant [${tenant}]`)
        return true;
    }
    return false;
}


module.exports = {
    rgExists
};