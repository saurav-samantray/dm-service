const {v4: uuidv4} = require("uuid");
const logger = require('../../config/loggingConfig.js');
const {http_request_counter, http_request_duration_seconds} =  require('../../routes/PrometheusRoutes.js')

const tenantValidation = function (req, res, next) {
    let tenant;
    if(req?.kauth?.grant?.access_token?.content.tenant){
      if(process.env.MASTER_TENANT ?? 'COHOTZ' === req.kauth.grant.access_token.content.tenant) { //only master tenant users can over ride tenant param
        tenant = req.headers.tenant ?? req.kauth.grant.access_token.content.tenant
      } else {
        tenant = req.kauth.grant.access_token.content.tenant
      }
      req.headers['tenant'] = tenant;
      next()
    }else{
      req.headers['tenant'] = 'DEFAULT';
      next()
    }
    
  }

  const metrics = function (req, res, next) {
    if(!['/metrics', 'metrics'].includes(req.originalUrl)){
      let tenant = 'DEFAULT';
      if(req?.kauth?.grant?.access_token?.content.tenant){
        if(process.env.MASTER_TENANT ?? 'OD' === req.kauth.grant.access_token.content.tenant) { //only master tenant users can over ride tenant param
          tenant = req.headers.tenant ?? req.kauth.grant.access_token.content.tenant
        } else {
          tenant = req.kauth.grant.access_token.content.tenant
        }
      }
  
      // Start a timer for every request made
      res.locals.startEpoch = Date.now();
      res.on('finish', ()=>{
        const responseTimeInMilliseconds = Date.now() - res.locals.startEpoch;
        http_request_duration_seconds
          .labels(tenant, req.method, req.originalUrl, res.statusCode)
          .observe(responseTimeInMilliseconds/1000)
  
        // Increment the HTTP request counter
        http_request_counter.labels(tenant, req.method, req.originalUrl, res.statusCode).inc();
      });
  
    }
    next()
  }

  const SKIP_URLS = ['/metrics', '/api-docs', '/api-docs/']

  const requestLogger = function (req, res, next) {
    if(!SKIP_URLS.includes(req.originalUrl)) {
      req.headers['dm-request-id'] = uuidv4();
      req.headers['dm-request-time'] = Date.now();
      logger.info(`Request: [${req.headers['dm-request-id']}] [${req.method}][${req.originalUrl}] by Tenant [${req.headers.tenant}] at Time:[${Date.now()}]`)
    }
    next()
  }


  const responseLogger = function (req, res, next) {
    if(!SKIP_URLS.includes(req.originalUrl)) {
      res.on('finish', () => {
        const requestTime = req.headers['dm-request-time'];
        logger.info(`Response: [${req.headers['dm-request-id']}] [${req.method}][${req.originalUrl}][${res.statusCode}] by Tenant [${req.headers.tenant}] at Time:[${Date.now()}] and took [${Date.now() - parseInt(requestTime)}ms]`)
      });
    }
    next()
  }

  module.exports = {
    tenantValidation,
    metrics,
    requestLogger,
    responseLogger
};