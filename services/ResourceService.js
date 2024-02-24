const logger = require("../config/loggingConfig");
const {ResourceModel} = require("../models/Resource");
const crypto = require('crypto');


exports.create = async (tenant, rg, resource) => {
  const data = {...resource, tenant: tenant, resourceGroup: rg, code: crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, 16)};
  logger.info(`File: ${JSON.stringify(data)} `);
  return await ResourceModel.create(data);
};

exports.createResources = async (resources) => {
  logger.info(resources.length)
  logger.info("FileService:createFiles() ==> START");
  for (let i = 0; i < resources.length; i++) {
    logger.info("Current Resource", resources[i])
    await this.create(resources[i].tenant, resources[i])
  }
  logger.info("FileService:createFiles() ==> END");
  return [];
};

exports.update = async (code, tenant, rg, content) => {
  logger.info(`Updating Resource with code [${code}] for RG [${rg}] tenant [${tenant}]`)
  let newVal = {content: content}
  return await ResourceModel.findOneAndUpdate({code: code, resourceGroup: rg, tenant: tenant}, newVal);
};

exports.rename = async (newName, code, tenant, rg) => {
  logger.info(`Updating Resource Name [${existingName}] for RG [${rg}] tenant [${tenant}]`)
  let newVal = {name: newName}
  return await ResourceModel.findOneAndUpdate({code: code, resourceGroup: rg, tenant: tenant}, newVal);
};

exports.findByRG = async (rg, tenant) => {
  return await ResourceModel.find({resourceGroup: rg, tenant: tenant}, {_id: 0, __v: 0})
};

exports.findByCode = async (code, rg, tenant) => {
  return await ResourceModel.findOne({code: code, resourceGroup: rg, tenant: tenant}, {_id: 0, __v: 0})
};

exports.deleteByCode = async (code, rg, tenant) => {
  return await ResourceModel.deleteOne({code: code, resourceGroup: rg, tenant: tenant});
};