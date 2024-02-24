const express = require("express");
const logger = require("../config/loggingConfig");
const {
  init
} = require("../controllers/InitController");

const router = express.Router();

// initialize events
router.post('/',init)

module.exports = router;
