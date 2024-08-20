const fs = require("fs");
const {Notification, app} = require("electron");

const Configs = require('./ConfigFileTemplates');
let UserConfigs = Configs.userConfigs;

/**
 * Read the User Configs 
 * @returns All User Config
 */
const LoadConfig = () => {
    if(!fs.existsSync(`${__dirname}/../config/UserConfig.cfg`)){
      try { 
        fs.mkdir(`${__dirname}/../config`, {recursive: true}, (err) => {
          if (err) {
            new Notification({
              title: 'Directory Failed to Create',
              body: `Program failed to Create Directory "config" \n ${err}`
            }).show();
            app.quit();
          } 
        });
        fs.writeFileSync(`${__dirname}/../config/UserConfig.cfg`, JSON.stringify(Configs.userConfigs, null, 2), 'utf-8');
      }catch(e) { 
        new Notification({
          title: 'File Failed to Create',
          body: `the UserConfig.cfg File Failed to create \n do you have write permissions in this directory \n ${e}`
        }).show();
        app.quit();
        UserConfigs = Configs.userConfigs;
      }
    }
  
    try { UserConfigs = JSON.parse(fs.readFileSync(`${__dirname}/../config/UserConfig.cfg`, {encoding: 'utf-8', flag: 'r'}))} catch(e) { 
      new Notification({
        title: 'File Failed to Load UserConfigs',
        body: `the UserConfig.cfg File Failed to create \n do you have write permissions in this directory \n ${e}`
      }).show();
      app.quit();
      UserConfigs = Configs.userConfigs;
    }
  
    
  
    return UserConfigs;
}

const ChangeTheme = (themename) => {
  UserConfigs.theme = themename;
}

const SaveChanges = () => {
 
    try { 
      fs.mkdir(`${__dirname}/../config`, {recursive: true}, (err) => {
        if (err) {
          new Notification({
            title: 'Directory Failed to Create',
            body: `Program failed to Create Directory "config" \n ${err}`
          }).show();
          app.quit();
        } 
      });
      fs.writeFileSync(`${__dirname}/../config/UserConfig.cfg`, JSON.stringify(UserConfigs, null, 2), 'utf-8');
    }catch(e) { 
      new Notification({
        title: 'File Failed to Create',
        body: `the UserConfig.cfg File Failed to create \n do you have write permissions in this directory \n ${e}`
      }).show();
      app.quit();
      UserConfigs = Configs.userConfigs;
    }
  
}

  module.exports = {
    LoadConfig,
    ChangeTheme,
    SaveChanges,
    UserConfigs
  }