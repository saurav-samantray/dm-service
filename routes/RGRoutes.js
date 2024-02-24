const express = require("express");
//const { keycloak, superAdminOnly, adminOnly } = require("../config/authConfig");
const {rgExists } = require("../middleware/validation/resourceValidator");
const logger = require("../config/loggingConfig");
const { 
    create: createRG,
    findByCode: findRGByCode,
    updateByCode: updateRGByCode,
    deleteByCode: deleteRGByCode,
    renameRG
 } = require("../controllers/RGController");

 const { 
    findByRG: findResourcesByRG,
    create: createResource,
    createFiles: createResources,
    findByCode: findResourceByCode,
    updateByCode: updateResourceByCode,
    deleteByCode: deleteResourceByCode,
    renameResource: renameResource
 } = require("../controllers/ResourceController");

const router = express.Router();

//Resource Group Routes
router.post('/', [], createRG)
router.get('/:code', [], findRGByCode)
router.put('/:code', [], updateRGByCode)
router.delete('/:code', [], deleteRGByCode)
router.put('/:code/rename', [], renameRG)

//Resource Routes
router.get('/:rg/resources', [rgExists], findResourcesByRG)
router.post('/:rg/resources', [rgExists], createResource)
router.post('/:rg/resources/bulk', [rgExists], createResources)
router.get('/:rg/resources/:code', [rgExists], findResourceByCode)
router.put('/:rg/resources/:code', [rgExists], updateResourceByCode)
router.delete('/:rg/resources/:code', [rgExists], deleteResourceByCode)
router.put('/:rg/resources/:code/rename', [rgExists], renameResource)

module.exports = router;
