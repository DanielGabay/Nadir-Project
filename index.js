const electron = require('electron');
const {app, BrowserWindow} = electron;

let win;
app.on('ready',function(){
    win = new BrowserWindow({width: 1200, height: 900});
    win.loadURL(`file://${__dirname}/src/homePage.html`);
    //win.loadURL(`file://${__dirname}/src/login-ndr.html`);
});

exports.openWindow = (filename)=> {
    //win.currentOpenWindow().close();
    win = new BrowserWindow({width: 800, height: 600});
    win.loadURL(`file://${__dirname}` + filename  + `.html`);
};