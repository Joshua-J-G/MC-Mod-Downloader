const {app, screen, BrowserWindow, Notification, globalShortcut} = require('electron');
const Configs = require('./src/ConfigFileTemplates');
const fs =  require('fs');
const ThemeFile = require('./src/ThemeFile');
const Settings = require('./src/OpenSettings');

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
    console.log(themes);
    const currentTheme = themes.find((data) => data.ThemeName == UserConfigs.theme);

    //console.log(`Themes/${currentTheme.Folder}/Dark-${currentTheme.ThemeName}/intro.html`);
    if(currentTheme.Darkmode){
      if(UserConfigs.Darkmode){
        win.loadFile(`Themes/${currentTheme.Folder}/Dark-${currentTheme.ThemeName}/intro.html`);
        themeHook = require(`./Themes/${currentTheme.Folder}/Dark-${currentTheme.ThemeName}/intro.js`)
      }else{
        win.loadFile(`Themes/${currentTheme.Folder}/Light-${currentTheme.ThemeName}/intro.html`);
        themeHook = require(`./Themes/${currentTheme.Folder}/Light-${currentTheme.ThemeName}/intro.js`);
      }
    }else{
      win.loadFile(`Themes/${currentTheme.Folder}/${currentTheme.ThemeName}/intro.html`);
      themeHook = require(`./Themes/${currentTheme.Folder}/${currentTheme.ThemeName}/intro.html`);
    }

    this.CurrentTheme = currentTheme;
    mainWindow = win;
    win.on('page-title-updated', function(e) {
      e.preventDefault()
    });
    
}



const LoadConfig = () => {
  if(!fs.existsSync('config/UserConfig.cfg')){
    try { 
      fs.mkdir('config', {recursive: true}, (err) => {
        if (err) {
          new Notification({
            title: 'Directory Failed to Create',
            body: `Program failed to Create Directory "config" \n ${err}`
          }).show();
        } 
      });
      fs.writeFileSync('config/UserConfig.cfg', JSON.stringify(Configs.userConfigs, null, 2), 'utf-8');
    }catch(e) { 
      new Notification({
        title: 'File Failed to Create',
        body: `the UserConfig.cfg File Failed to create \n do you have write permissions in this directory \n ${e}`
      }).show();
      UserConfigs = Configs.userConfigs;
    }
  }

  try { UserConfigs = JSON.parse(fs.readFileSync('config/UserConfig.cfg', {encoding: 'utf-8', flag: 'r'}))} catch(e) { 
    new Notification({
      title: 'File Failed to Load UserConfigs',
      body: `the UserConfig.cfg File Failed to create \n do you have write permissions in this directory \n ${e}`
    }).show();
    UserConfigs = Configs.userConfigs;
  }

  

  console.log(UserConfigs);
}




app.whenReady().then(async () => {

  LoadConfig();
  createWindow();
  //ThemeFile.constructor("Soda", "This is A Test Description For Your Enjoyment Have Fun", false, false, "URL WE DONT NEED NO URL WHERE WERE GOING");
 // await ThemeFile.SelectIcon();

  //ThemeFile.CreateThemeFile();
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
