const logger = require('../config/loggingConfig');

const rgService = require("../services/ResourceGroupService");

exports.create = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    //const project = req.params.project;
    logger.info(`Creating new RG: ${req.body}`)
    let rg = await rgService.create(tenant, req.body)
    res.json({ result: rg, status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findByCode = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    const code = req.params.code;
    const rg = await rgService.findByCode(code, tenant);
    res.json({ result: rg, status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateByCode = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    const code = req.params.code;
    const rg = await rgService.update(code, tenant, req.body);
    res.json({ result: rg, status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteByCode = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    const code = req.params.code;
    await rgService.deleteByCode(code, tenant);
    res.json({ result: [], status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.renameRG = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    const code = req.params.code;
    const newName = req.query.newName;
    const rg = await rgService.rename(newName, code, tenant);
    res.json({ result: rg, status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

