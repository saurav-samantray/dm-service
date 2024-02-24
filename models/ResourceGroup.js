const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {COLLECTION_PREFIX} = require('../config/dbConfig')

const resourceGroupSchema = new Schema({
  code: String,
  name: String,
  description: String,
  tenant: String,
  gitLink: String,
  visibility: {type: String, enum: ['PRIVATE', 'INTERNAL', 'PUBLIC'], default: 'INTERNAL'},
  owner: String,
  resources: Object,
}, {shardKey: {tenant: 1}});

resourceGroupSchema.index({ code: 1, tenant: 1}, { unique: true });

const ResourceGroupModel = mongoose.model(`${COLLECTION_PREFIX}resource_group`, resourceGroupSchema);

module.exports = {
  ResourceGroupModel
};
