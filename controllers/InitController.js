const intiService = require("../services/InitService");

exports.init = async (req, res) => {
  try {
    await intiService.execute(req.headers.tenant);
    res.json({ result: [], status: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
