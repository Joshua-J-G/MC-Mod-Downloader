const {app, screen, BrowserWindow, globalShortcut} = require('electron');


const ThemeFile = require('./src/ThemeFile');
const Settings = require('./src/OpenSettings');
const {LoadConfig} = require('./src/OpenConfigFile');

let themeHook;

const WidthMin = 900;
const HeightMin = 700;

let UserConfigs = {};
let CurrentTheme = {};

let mainWindow;
let SubWindows = new Set();

/**
 * 
 * @param {BrowserWindow} subWin 
 */
function registerNewWindow(subWin){
  console.log("Hi THere");
  SubWindows.add(subWin);
}

const createWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay()
    const {width , height} = primaryDisplay.workAreaSize;
    // Console information about the user screen and the set resolution
    console.log(` 
      Screen Width: ${width}
      Screen Height ${height}
      ________________________
      Calculated Width: ${WidthMin / primaryDisplay.scaleFactor}
      Calculated Height: ${HeightMin / primaryDisplay.scaleFactor}
      `);

    const win = new BrowserWindow({
        width: WidthMin / primaryDisplay.scaleFactor,
        height: HeightMin / primaryDisplay.scaleFactor ,
        minWidth: WidthMin / primaryDisplay.scaleFactor,
        minHeight: HeightMin / primaryDisplay.scaleFactor,
        title:  "Flux Mod loader",
        frame: true
        
    });
    
    const themes = ThemeFile.ReadThemeFile();
    //console.log(themes);
    const currentTheme = themes.find((data) => data.ThemeName == UserConfigs.theme);

    //console.log(`Themes/${currentTheme.Folder}/Dark-${currentTheme.ThemeName}/intro.html`);
    if(currentTheme.Darkmode){
      if(UserConfigs.Darkmode){
        win.loadFile(`${__dirname}/Themes/${currentTheme.Folder}/Dark-${currentTheme.ThemeName}/intro.html`);
        themeHook = require(`${__dirname}/Themes/${currentTheme.Folder}/Dark-${currentTheme.ThemeName}/intro.js`)
      }else{
        win.loadFile(`${__dirname}/Themes/${currentTheme.Folder}/Light-${currentTheme.ThemeName}/intro.html`);
        themeHook = require(`${__dirname}/Themes/${currentTheme.Folder}/Light-${currentTheme.ThemeName}/intro.js`);
      }
    }else{
      win.loadFile(`${__dirname}/Themes/${currentTheme.Folder}/${currentTheme.ThemeName}/intro.html`);
      themeHook = require(`${__dirname}/Themes/${currentTheme.Folder}/${currentTheme.ThemeName}/intro.js`);
    }

    this.CurrentTheme = currentTheme;
    mainWindow = win;
    win.on('page-title-updated', function(e) {
      e.preventDefault()
    });
    
}



app.whenReady().then(() => {

  UserConfigs = LoadConfig();
  
  //ThemeFile.constructor("Test File", "This is A Test Description For Your Enjoyment Have Fun", true, false, "URL WE DONT NEED NO URL WHERE WERE GOING");
   //ThemeFile.SelectIcon();

  //ThemeFile.CreateThemeFile();



  createWindow();
  const ret = globalShortcut.register('CommandOrControl+X', () => {
    Settings.OpenSettingsWindow(screen.getPrimaryDisplay(),registerNewWindow, mainWindow);
  })

  if (!ret) {
    console.log('registration failed')
  }

  console.log(globalShortcut.isRegistered('CommandOrControl+X'))
})

app.onbeforeunload = (e) => {
  
  globalShortcut.unregisterAll();

  e.returnValue = false;
}



module.exports = {
  registerNewWindow
}
