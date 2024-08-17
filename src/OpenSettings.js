const {BrowserWindow, app} = require("electron");



let SettingsWindow = null;

let savedCallback;

function OpenSettingsWindow(primaryDisplay, callback, parentWindow) {
    const SetHeight = 800 / primaryDisplay.scaleFactor;
    const SetWidth = 400 / primaryDisplay.scaleFactor;
    SettingsWindow = new BrowserWindow({
        width: SetWidth,
        height: SetHeight,
        maxHeight: SetHeight,
        maxWidth: SetWidth,
        minWidth: SetWidth,
        minHeight:SetHeight,
        title:  "Settings Window",
        frame: true,
        parent: parentWindow
    });
    callback(SettingsWindow);
}







module.exports = {
    OpenSettingsWindow,
    SettingsWindow
}