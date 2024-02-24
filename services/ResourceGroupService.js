const logger = require("../config/loggingConfig");
const {ResourceGroupModel} = require("../models/ResourceGroup");
const {ROOT_FOLDER} = require("../models/Resource");
const {create: createResource} = require("./ResourceService")
const crypto = require('crypto');


exports.create = async (tenant, resourceGroup) => {
  const data = {...resourceGroup, tenant: tenant, code: crypto.randomBytes(Math.ceil(8 / 2)).toString('hex').slice(0, 8)};
  logger.info(`RG: ${JSON.stringify(data)} `);
  const rg =  await ResourceGroupModel.create(data);
  await createResource(tenant, rg.code, {...ROOT_FOLDER})
  return rg;
};

exports.update = async (code, tenant, resourceGroup) => {
  logger.info(`Updating RG with code [${code}] for tenant [${tenant}]`)
  let newVal = {...resourceGroup}
  return await ResourceGroupModel.findOneAndUpdate({code: code, tenant: tenant}, newVal);
};

exports.rename = async (newName, code, tenant) => {
  logger.info(`Updating RG Name [${existingName}] for tenant [${tenant}]`)
  let newVal = {name: newName}
  return await ResourceGroupModel.findOneAndUpdate({code: code, tenant: tenant}, newVal);
};

exports.findByCode = async (code, tenant) => {
  return await ResourceGroupModel.findOne({code: code, tenant: tenant}, {_id: 0, __v: 0})
};

exports.deleteByCode = async (code, tenant) => {
  return await ResourceGroupModel.deleteOne({code: code, tenant: tenant});
};