var electron = require('electron')
var app = electron.app //调用app
var BrowserWindow = electron.BrowserWindow //窗口引用
var mainWindow = null //声明要打开的主窗口
//创建应用
app.on('ready', ()=>{
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            nodeIntegration: true, //node中所有东西都可以在渲染进程中使用
            enableRemoteModule: true
        }
    })
    //mainWindow.webContents.openDevTools()
    mainWindow.loadFile('index.html') //加载html页面
    mainWindow.on('closed', ()=>{
        mainWindow = null
    })
})