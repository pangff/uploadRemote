
'use strict'
const Aria2 = require("aria2");

const aria2 = new Aria2({
    host: 'pi',
    port: 6800,
    secure: false,
    secret: 'P3TERX',
    path: '/jsonrpc'
});

async function addUrls(batch){
    const promises = await aria2.batch(batch);
}

async function init(){

    // aria2
    // .open()
    // .then(() => console.log("open"))
    // .catch(err => console.log("error", err));

    // emitted when the WebSocket is open.
    aria2.on('open', () => {
        console.log('aria2 OPEN');
    });

    // emitted when the WebSocket is closed.
    aria2.on('close', () => {
      console.log('aria2 CLOSE');
    });

    // emitted for every message sent.
    aria2.on("output", m => {
    console.log("aria2 OUT", m);
    });

    // emitted for every message received.
    aria2.on("input", m => {
        console.log("aria2 IN", m);
    });
    // const methods = await aria2.listMethods();
    // const notifications = await aria2.listNotifications();
    /*
    [
    'onDownloadStart',
    'onDownloadPause',
    'onDownloadStop',
    'onDownloadComplete',
    'onDownloadError',
    'onBtDownloadComplete'
    ]
    */

    // notifications logger example
    // notifications.forEach((notification) => {
    //     aria2.on(notification, (params) => {
    //         console.log('aria2', notification, params)
    //     })
    // })


    const batch = [
        ["aria2.addUri",["http://img.aiimg.com/uploads/userup/0909/2Z64022L38.jpg"], {"out":"13.jpg"}]
      ]
     await addUrls(batch)
      
}

(async()=>{
    try{
        await init();  
    }catch(e){
        console.log(e);
    }
    
})();