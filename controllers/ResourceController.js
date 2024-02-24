const logger = require('../config/loggingConfig');

const fileService = require("../services/ResourceService");


exports.findByRG = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    const rg = req.params.rg;
    const resources = await fileService.findByRG(rg, tenant);
    res.json({ result: resources, status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    logger.info(`Params: ${JSON.stringify(req.params)}`)
    const rg = req.params.rg;
    logger.info(`Project: ${rg}`)
    let file = await fileService.create(tenant, rg, req.body)
    res.json({ result: file, status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createFiles = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    const rg = req.params.rg;
    let files = await fileService.createResources(req.body);
    res.json({ result: files, status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findByCode = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    const rg = req.params.rg;
    const code = req.params.code;
    const file = await fileService.findByCode(code, rg, tenant);
    res.json({ result: file, status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateByCode = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    const rg = req.params.rg;
    const code = req.params.code;
    const file = await fileService.update(code, tenant, rg, req.body.content);
    res.json({ result: file, status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteByCode = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    const rg = req.params.rg;
    const code = req.params.code;
    await fileService.deleteByCode(code, tenant, rg);
    res.json({ result: [], status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.renameResource = async (req, res) => {
  try {
    const tenant = req.headers.tenant;
    const rg = req.params.rg;
    const code = req.params.code;
    const newName = req.query.newName;
    const file = await fileService.rename(newName, code, tenant, rg);
    res.json({ result: file, status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

