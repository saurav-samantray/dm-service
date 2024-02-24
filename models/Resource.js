const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {COLLECTION_PREFIX} = require('../config/dbConfig')

const resourceSchema = new Schema({
  code: String,
  name: String,
  description: String,
  tenant: String,
  version: Number,
  extension: String,
  folder: String,
  resourceGroup: String,
  type: {type: String, enum: ['FILE', 'FOLDER'], default: 'FOLDER'},
  owner: String,
  resources: Object,
}, {shardKey: {tenant: 1}});

resourceSchema.index({ code: 1, resourceGroup: 1, tenant: 1}, { unique: true });

const ResourceModel = mongoose.model(`${COLLECTION_PREFIX}resource`, resourceSchema);

module.exports = {
  ResourceModel
};
