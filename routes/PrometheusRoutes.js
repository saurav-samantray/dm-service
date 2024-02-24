const express = require("express");
const promClient = require('prom-client');
const logger = require("../config/loggingConfig");

const router = express.Router();


const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({
  app: 'ng-core-service',
  instance: process.env.NODE_APP_INSTANCE,
  msVersion: process.env.npm_package_version,
});

//const Registry = promClient.Registry;
const register = new promClient.Registry();

const http_request_counter = new promClient.Counter({
    name: 'http_request_count',
    help: 'Count of HTTP requests made to Cohotz service',
    labelNames: ['tenant', 'method', 'uri', 'status'],
  });

  const http_request_duration_seconds = new promClient.Histogram({
    tenant: 'tenant',
    name: 'http_server_requests_seconds',
    help: 'Duration of HTTP requests in seconds.',
    labelNames: ['tenant', 'method', 'uri', 'status'],
    buckets: [1,2,3,4,5,10,25,50,100,250,500,1000],
  })

register.registerMetric(http_request_counter);
register.registerMetric(http_request_duration_seconds);

register.setDefaultLabels({
    app: 'ng-core-service',
    //instance: process.env.NODE_APP_INSTANCE,
    msVersion: process.env.npm_package_version,
})

collectDefaultMetrics({ register });

router.get('/', function(req, res)
{
    res.setHeader('Content-Type',register.contentType)

    register.metrics().then(data => res.status(200).send(data))
});

module.exports = {
    router,
    http_request_counter,
    http_request_duration_seconds,
};
