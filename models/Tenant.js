const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tenantSchema = new Schema({
  name: String,
  code: String,
  description: String,
  active: Boolean,
  subscription: String,
  currency: String,
  employees: Number,
  median_salary: Number,
  cost_of_disengagement: Number,
  employees: Number,
  median_salary: Number,
  micro_culture_config: Object,
  encryption_config: Object,
  cohorts: Array,
  industry: String,
  feedbackAudience: String,
  display_settings: Object,
  nomenclature: Object,
  created_ts: {
    type: Date,
    default: Date.now,
  },
});

const TenantModel = mongoose.model("ch_tenant", tenantSchema);

module.exports = {
  TenantModel
};
