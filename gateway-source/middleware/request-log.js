'use strict';
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const {generateResponseLog, getRealIp} = require('../utils/common');

module.exports = () => {
  return async (ctx, next) => {
    const startTime = Date.now();
    ctx.requestId = uuidv4();
    const realIp = getRealIp(ctx);
    ctx.realIp = realIp;
    await next();
    let {logInfo, status} = ctx;
    if (!logInfo) {
      logInfo = generateResponseLog(ctx, realIp);
    }
    logInfo.status = status;
    logInfo.useTime = Date.now() - startTime;
    logger.info('response info:', `${JSON.stringify(logInfo)}`);
  };
};