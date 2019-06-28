const {
    app,
    BrowserWindow
} = require('electron');
let mainWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 1000
    });
    mainWindow.loadURL(`file://${__dirname}/src/login-ndr.html`);
    // mainWindow.setMenu(null);
    // mainWindow.webContents.on("devtools-opened", () => {
    //     win.webContents.closeDevTools();
    // });
    mainWindow.on('close', function () {
        mainWindow = null;
    });
});