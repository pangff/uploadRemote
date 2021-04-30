'use strict';
const validator = require('validator');
const requestIp = require('request-ip');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const HttpStatus = require('./httpCode');
const moment = require('moment');


/**
 * 获取本机IP
 */
exports.getLocalIpAddr = () => {
    const interfaces = os.networkInterfaces();
    for (const deviceName in interfaces) {
        const deviceInterface = interfaces[deviceName];
        for (let i = 0; i < deviceInterface.length; i++) {
            const alias = deviceInterface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
};

class HttpCustomerError extends Error {
    constructor(message = '', statusCode = 500, name = 'HttpCustomerError') {
        super();
        this.name = name;
        this.statusCode = statusCode;
        if (message.length === 0) {
            this.message = HttpStatus.getStatusText(statusCode);
        } else {
            this.message = message;
        }
        this.stack = new Error(this.message).stack;
    }
}
exports.HttpCustomerError = HttpCustomerError;

/**
 * http 请求错误返回
 * @param ctx
 * @param error
 * @param requestId
 */
exports.formatHttpError = (ctx, error, requestId) => {
    if (error.response && error.response.statusCode) {
        ctx.status = error.response.statusCode;
        ctx.body = error.response.body;
    } else if (error.name === 'HttpCustomerError') {
        console.warn(error.stack);
        ctx.status = error.statusCode;
        ctx.body = { requestId, message: error.message };
    } else {
        console.warn(error.stack);
        ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
        ctx.body = { requestId, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR), error: error.message };
    }
};

/**
 * 获取真实IP
 * @param {*} ctx
 */
exports.getRealIp = ctx => {
    return requestIp.getClientIp(ctx);
};

/**
 * 生成response日志
 * @param {*} ctx
 */
exports.generateResponseLog = (ctx, ip) => {
    const { request, url, method, headers, requestId = uuidv4(), userInfo = ' ' } = ctx;
    const logInfo = {
        method,
        url,
        body: request.body,
        ip,
        currentUser: userInfo,
        headers,
        userAgent: headers['user-agent'],
        requestId,
    };
    return logInfo;
};

exports.cleanObj = obj => {
    for (const propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
};


/**
 * 检验是不是URL
 * 判断关键字，如果关键字开头以 https://或者http://，且长度大于 9 也就是 https://w.cn,怎么判断为是url查询
 * 如果是url查询，则直接不走 id和标题查询了，直接走url查询（去掉url的条件）
 * 同理如果不是url，查询条件中也去掉url查询
 * url 查询时，使用模糊查询
 * @param {String} keywords 关键字
 * @return {Boolean} 是不是URL
 */
exports.checkKeywordsIsUrl = keywords => {
    return (
        !!keywords &&
        keywords.length >= 9 &&
        validator.isURL(keywords, {
            protocols: [ 'http', 'https' ],
            require_protocol: true,
            require_tld: false,
        })
    );
};


/**
 * 格式化时间
 * @param {*} time 原始时间
 * @param {*} format 格式
 * @return {String} 格式化后的时间
 */
exports.formatTime = (time, format) => {
    return moment(time).format(format);
};

/**
 * 判断是不是图片
 */
exports.isUrl = url => {
    return validator.isURL(url);
};

/**
 * 判断参数是否为空
 */
exports.checkParamsEmpty = (key, value) => {
    if (!value) {
        throw new HttpCustomerError(`${key} 为空`, 500);
    }
};

/**
 * 请求成功返回
 */
exports.reSuccess = data => {
    return {
        code: 0,
        message: '',
        ...data,
    };
};
