'use strict'
const Router = require('koa-router');
const logger = require('../utils/logger');
const router = new Router();
const {formatHttpError} = require("../utils/common.js")
const Aria2 = require("aria2");

const aria2 = new Aria2({
    host: 'pi',
    port: 6800,
    secure: false,
    secret: 'P3TERX',
    path: '/jsonrpc'
});

router.get('/notice', ctx => {

    try{
       let {name} = ctx.request.query;
       ctx.type="application/json"
       logger.info("upload success >>> "+name);
        ctx.body = {
            status: "ok"
        };
    }catch(error){
        formatHttpError(ctx, error, requestId);
    }
});


router.post('/upload', async (ctx)=>{
    const { requestId } = ctx;
    try {
        let {urls} = ctx.request.body;
        console.log(urls);
        urls = JSON.parse(urls);
        let batch = [];
        for(var i=0;i<urls.length;i++){
            let temp = ["aria2.addUri"];
            let url = urls[i]['url'];
            let name = urls[i]['name'];
            temp.push([url]);
            temp.push({out:name});
            batch.push(temp);
        }

        console.log(batch)
        await aria2.batch(batch)

        ctx.type="application/json"
        ctx.body = {
            status: "ok"
        };
    } catch (error) {
        formatHttpError(ctx, error, requestId);
    }
});


module.exports = router;

