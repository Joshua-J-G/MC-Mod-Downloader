const {BrowserWindow, app} = require("electron");
const {LoadConfig, SaveChanges, ChangeTheme} = require("./OpenConfigFile");
let {UserConfigs} = require("./OpenConfigFile");
const ipc = require('electron').ipcMain;
const path = require('node:path');
const ThemeFile = require('./ThemeFile');
let SettingsWindow = null;
let savedCallback;

let open = false;

function OpenSettingsWindow(primaryDisplay, callback, parentWindow) {

    if(open){
        return;
    }


    open = true;
    
    UserConfigs = LoadConfig();
    const SetHeight = 800 / primaryDisplay.scaleFactor;
    const SetWidth = 1200 / primaryDisplay.scaleFactor;
    SettingsWindow = new BrowserWindow({
        width: SetWidth,
        height: SetHeight,
        maxHeight: SetHeight,
        maxWidth: SetWidth,
        minWidth: SetWidth,
        minHeight:SetHeight,
        title:  "Settings Window",
        frame: true,
        parent: parentWindow,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false
        }
    });
    callback(SettingsWindow);
    SettingsWindow.loadFile('./src/HTML&CSS/settings.html');


    SettingsWindow.webContents.on("did-finish-load", ()=>{
        if(UserConfigs.Darkmode){
           // SettingsWindow.setBackgroundColor("#1c1c1c");
            //document.getElementById('style').setAttribute("href", "./settings_dark");
            SettingsWindow.webContents.send('dark-mode', {'DARKMODE': true});
        }else{
            //SettingsWindow.setBackgroundColor("#FFF9EC");
            //document.getElementById('style').setAttribute("href", "./settings_light");
            SettingsWindow.webContents.send('dark-mode', {'DARKMODE': false});
        }
    });
    
    SettingsWindow.on('close', () => {
        open = false;
    });
   
    ipc.on('close-settings',() => {
       
        SettingsWindow.close();
    })

    ipc.on('select-theme', (env, theme) => {
        console.log("new theme selected");
        console.log(theme.themename);
        ChangeTheme(theme.themename);
    })

    ipc.on('save-changes', () => {
        SaveChanges();
        app.relaunch()
        app.exit()
    })

    ipc.on('get-themes', () => {
        const themes = ThemeFile.ReadThemeFile();
        SettingsWindow.webContents.send('themes', {'themes': themes});
    })
}







module.exports = {
    OpenSettingsWindow,
    SettingsWindow
}