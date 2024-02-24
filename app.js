const express = require("express");
const request = require('request')
const session = require('express-session');
const { startDatabase } = require("./config/dbConfig");
const { keycloak, memoryStore, adminOnly, superAdminOnly } = require("./config/authConfig");
const rgRouter = require("./routes/RGRoutes");
const initRouter = require("./routes/InitRoutes");
const { router: prometheusRouter, http_request_counter, http_request_duration_seconds  } = require("./routes/PrometheusRoutes");
const { tenantValidation, metrics, requestLogger, responseLogger } = require("./middleware/common/commonMiddleware");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require("./config/loggingConfig");

//Only uncomment for development if auth service running on self signed certificate
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = process.env.DM_NODE_TLS_REJECT_UNAUTHORIZED || 0; //remove this once keycloak has SSL

const app = express();
app.set( 'trust proxy', true );
const PORT = process.env.DM_APP_PORT || 3111;

app.use(session({
  secret: process.env.DM_APP_SECRET || 'DM@772198%',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

//app.use( keycloak.middleware() );

app.use(metrics);

//app.use(tenantValidation);

app.use(requestLogger)

app.use(responseLogger)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('express-status-monitor')());
app.use("/api/resourceGroups", [], rgRouter);
app.use("/api/init", [tenantValidation, keycloak.protect(superAdminOnly)], initRouter);
app.use("/metrics",[],prometheusRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).send({ 
    'app-name':  process.env.npm_package_name,
    'app-version': process.env.npm_package_version,
    'nodejs-version': process.version,
    'description': 'Next Gen Cohotz Core Service' 
  });
})

app.use(function (req, res, next) {
  res.status(404).send({
      status: 404, 
      message: 'resource not found!',
      resource: req.baseUrl, 
      result: {errorCode: 'DM-ERR-404', 
      errorMessage: 'resource not found!'}})
})

//start database
startDatabase();

app.listen(PORT, () => {
  console.log(`
  /\    \                  /\    \              /\    \                  /\    \                          /\    \                 /::\    \                 /\    \                  /\    \                  /\    \          /\    \                  /\    \                  /\    \         
  /::\    \                /::\    \            /::\    \                /::\    \                        /::\____\               /::::\    \               /::\    \                /::\    \                /::\____\        /::\    \                /::\____\                /::\    \        
 /::::\    \              /::::\    \           \:::\    \              /::::\    \                      /::::|   |              /::::::\    \             /::::\    \              /::::\    \              /:::/    /        \:::\    \              /::::|   |               /::::\    \       
/::::::\    \            /::::::\    \           \:::\    \            /::::::\    \                    /:::::|   |             /::::::::\    \           /::::::\    \            /::::::\    \            /:::/    /          \:::\    \            /:::::|   |              /::::::\    \      
/:::/\:::\    \          /:::/\:::\    \           \:::\    \          /:::/\:::\    \                  /::::::|   |            /:::/~~\:::\    \         /:::/\:::\    \          /:::/\:::\    \          /:::/    /            \:::\    \          /::::::|   |             /:::/\:::\    \     
/:::/  \:::\    \        /:::/__\:::\    \           \:::\    \        /:::/__\:::\    \                /:::/|::|   |           /:::/    \:::\    \       /:::/  \:::\    \        /:::/__\:::\    \        /:::/    /              \:::\    \        /:::/|::|   |            /:::/  \:::\    \    
/:::/    \:::\    \      /::::\   \:::\    \          /::::\    \      /::::\   \:::\    \              /:::/ |::|   |          /:::/    / \:::\    \     /:::/    \:::\    \      /::::\   \:::\    \      /:::/    /               /::::\    \      /:::/ |::|   |           /:::/    \:::\    \   
/:::/    / \:::\    \    /::::::\   \:::\    \        /::::::\    \    /::::::\   \:::\    \            /:::/  |::|___|______   /:::/____/   \:::\____\   /:::/    / \:::\    \    /::::::\   \:::\    \    /:::/    /       ____    /::::::\    \    /:::/  |::|   | _____    /:::/    / \:::\    \  
/:::/    /   \:::\ ___\  /:::/\:::\   \:::\    \      /:::/\:::\    \  /:::/\:::\   \:::\    \          /:::/   |::::::::\    \ |:::|    |     |:::|    | /:::/    /   \:::\ ___\  /:::/\:::\   \:::\    \  /:::/    /       /\   \  /:::/\:::\    \  /:::/   |::|   |/\    \  /:::/    /   \:::\ ___\ 
/:::/____/     \:::|    |/:::/  \:::\   \:::\____\    /:::/  \:::\____\/:::/  \:::\   \:::\____\        /:::/    |:::::::::\____\|:::|____|     |:::|    |/:::/____/     \:::|    |/:::/__\:::\   \:::\____\/:::/____/       /::\   \/:::/  \:::\____\/:: /    |::|   /::\____\/:::/____/  ___\:::|    |
\:::\    \     /:::|____|\::/    \:::\  /:::/    /   /:::/    \::/    /\::/    \:::\  /:::/    /        \::/    / ~~~~~/:::/    / \:::\    \   /:::/    / \:::\    \     /:::|____|\:::\   \:::\   \::/    /\:::\    \       \:::\  /:::/    \::/    /\::/    /|::|  /:::/    /\:::\    \ /\  /:::|____|
\:::\    \   /:::/    /  \/____/ \:::\/:::/    /   /:::/    / \/____/  \/____/ \:::\/:::/    /          \/____/      /:::/    /   \:::\    \ /:::/    /   \:::\    \   /:::/    /  \:::\   \:::\   \/____/  \:::\    \       \:::\/:::/    / \/____/  \/____/ |::| /:::/    /  \:::\    /::\ \::/    / 
\:::\    \ /:::/    /            \::::::/    /   /:::/    /                    \::::::/    /                       /:::/    /     \:::\    /:::/    /     \:::\    \ /:::/    /    \:::\   \:::\    \       \:::\    \       \::::::/    /                   |::|/:::/    /    \:::\   \:::\ \/____/  
\:::\    /:::/    /              \::::/    /   /:::/    /                      \::::/    /                       /:::/    /       \:::\__/:::/    /       \:::\    /:::/    /      \:::\   \:::\____\       \:::\    \       \::::/____/                    |::::::/    /      \:::\   \:::\____\    
\:::\  /:::/    /               /:::/    /    \::/    /                       /:::/    /                       /:::/    /         \::::::::/    /         \:::\  /:::/    /        \:::\   \::/    /        \:::\    \       \:::\    \                    |:::::/    /        \:::\  /:::/    /    
\:::\/:::/    /               /:::/    /      \/____/                       /:::/    /                       /:::/    /           \::::::/    /           \:::\/:::/    /          \:::\   \/____/          \:::\    \       \:::\    \                   |::::/    /          \:::\/:::/    /     
\::::::/    /               /:::/    /                                    /:::/    /                       /:::/    /             \::::/    /             \::::::/    /            \:::\    \               \:::\    \       \:::\    \                  /:::/    /            \::::::/    /      
 \::::/    /               /:::/    /                                    /:::/    /                       /:::/    /               \::/____/               \::::/    /              \:::\____\               \:::\____\       \:::\____\                /:::/    /              \::::/    /       
  \::/____/                \::/    /                                     \::/    /                        \::/    /                 ~~                      \::/____/                \::/    /                \::/    /        \::/    /                \::/    /                \::/____/        
   ~~                       \/____/                                       \/____/                          \/____/                                           ~~                       \/____/                  \/____/          \/____/                  \/____/                                  

  `)
  logger.info(`${process.env.npm_package_name} ${process.env.npm_package_version}`)
  logger.info(`Powered By NodeJS: [${process.version}]`)
  logger.info(`Application is running on port ${PORT}`);
});


module.exports = app;
