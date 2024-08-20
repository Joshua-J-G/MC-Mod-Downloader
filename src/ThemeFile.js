const {dialog} = require('electron');
const fs = require('fs');
var EXIF = require('exifreader');
const path = require('path');
const {THEME_HTML_FILE} = require('./FileTemplates');

const MAGICNUMBER = 'THEME'
let   ThemeIcon = "";
const ImageSize = 512;

function isThemeFile (filestream) {
   // console.log("Identifing Theme File");
    
    const retrivedNumber = new TextDecoder().decode(filestream.subarray(0, 5))
    //console.log(retrivedNumber);

    if(retrivedNumber == MAGICNUMBER){
        return false;
    }

    return true;
}    

let ThemeName = "defauls";
let Description = "Just a test Description";
let Darkmode = true;
let OnlineUpdate = true;
let Url = "https:// this is not a scam.com";


/**
 * 
 * @param {string} ThemeName 
 * @param {string} Description 
 * @param {boolean} Darkmode 
 * @param {boolean} OnlineUpdate 
 * @param {string} Url 
 */
function constructor(ThemeName, Description, Darkmode, OnlineUpdate, Url){
    this.ThemeName = ThemeName;
    this.Description = Description,
    this.Darkmode = Darkmode,
    this.OnlineUpdate = OnlineUpdate,
    this.Url = Url,
    ThemeIcon = "hi";
}

async function SelectIcon(){
    const fileLocation = dialog.showOpenDialogSync({title: 'Select Icon', properties: ['openFile'], filters: [ {name: 'Images', extensions: ['jpg', 'png', 'gif']}]});
   // console.log(fileLocation);
    try{
        const file = fs.readFileSync(fileLocation[0]);
        

        const tags = EXIF.load(file);
        //console.log(tags);
            
        if(tags['Image Width'].value != ImageSize && tags['Image Height'].value != ImageSize){
            dialog.showErrorBox("Image Wrong Size", "the Icon Image must be 512x512 pixels in size");
            return;
        }
    
        const extentionName = path.extname(fileLocation[0]);

        const Base64Image = Buffer.from(file, 'binary').toString('base64');
        
        const base64ImageStr = `data:image/${extentionName.split('.').pop()};base64,${Base64Image}`;
        //console.log(base64ImageStr);
        ThemeIcon = base64ImageStr;
        //console.log(ThemeIcon);
        //this.ThemeIcon = base64ImageStr;
        
    }catch(e){
        
        dialog.showErrorBox(
            'File Not Found or Closed',
            `File does not exist${e}`
        );
    }
}

async function CreateThemeFile () {
    const SaveSpot = dialog.showOpenDialogSync({title: 'Select Theme Development Enviroment Location', properties: ['openDirectory', 'createDirectory']});
    console.log(SaveSpot);

    if(SaveSpot == undefined){
        return;
    }
    try { 
        let data = fs.createWriteStream(`${SaveSpot[0]}/metadata.skin`, {encoding: 'binary'});
        let encoder = new TextEncoder();

        
        data.write(encoder.encode(MAGICNUMBER));
        let b = Buffer.alloc(4);
        b.writeUInt32LE(ThemeIcon.length);
        data.write(b);
        data.write(ThemeIcon);
        b = Buffer.alloc(2);
        b.writeUInt16LE(this.ThemeName.length);
        data.write(b);
        data.write(this.ThemeName);
        b = Buffer.alloc(4);
        b.writeUInt32LE(this.Description.length);
        data.write(b);
        data.write(this.Description);
        b = Buffer.alloc(1);
        b.writeUint8(this.Darkmode ? 1 : 0);
        data.write(b);
        b = Buffer.alloc(1);
        b.writeUint8(this.OnlineUpdate ? 1 : 0);
        data.write(b);
        b = Buffer.alloc(2);
        b.writeUInt16LE(this.Url.length);
        data.write(b);
        data.write(this.Url);
        data.close();
        console.log("Finished Writing File");

        if(this.Darkmode){
            fs.mkdirSync(`${SaveSpot[0]}/Dark-${this.ThemeName}`, {recursive: true});
            fs.mkdirSync(`${SaveSpot[0]}/Light-${this.ThemeName}`, {recursive: true});

            fs.mkdirSync(`${SaveSpot[0]}/res`, {recursive: true});
            // Create Dark Mode Files
            if(!fs.existsSync(`${SaveSpot[0]}/Dark-${this.ThemeName}/intro.html`)){
                fs.writeFileSync(`${SaveSpot[0]}/Dark-${this.ThemeName}/intro.html`, THEME_HTML_FILE);
                console.log("created Dark Mode HTML FIlE");
            }

            if(!fs.existsSync(`${SaveSpot[0]}/Dark-${this.ThemeName}/intro.css`)){
                fs.writeFileSync(`${SaveSpot[0]}/Dark-${this.ThemeName}/intro.css`, "");
                console.log("created Dark Mode CSS FIlE");
            }
            
            if(!fs.existsSync(`${SaveSpot[0]}/Dark-${this.ThemeName}/intro.js`)){
                fs.writeFileSync(`${SaveSpot[0]}/Dark-${this.ThemeName}/intro.js`, "");
                console.log("created Dark Mode JavaScript FIlE");
            }

            // Create Light Mode Files
            if(!fs.existsSync(`${SaveSpot[0]}/Light-${this.ThemeName}/intro.html`)){
                fs.writeFileSync(`${SaveSpot[0]}/Light-${this.ThemeName}/intro.html`, THEME_HTML_FILE);
                console.log("created Light Mode HTML FIlE");
            }
            if(!fs.existsSync(`${SaveSpot[0]}/Light-${this.ThemeName}/intro.css`)){
                fs.writeFileSync(`${SaveSpot[0]}/Light-${this.ThemeName}/intro.css`, "");
                console.log("created Light Mode CSS FIlE");
            }
            if(!fs.existsSync(`${SaveSpot[0]}/Light-${this.ThemeName}/intro.js`)){
                fs.writeFileSync(`${SaveSpot[0]}/Light-${this.ThemeName}/intro.js`, "");
                console.log("created Light Mode JavaScript FIlE");
            }

        }else{
            fs.mkdirSync(`${SaveSpot[0]}/${this.ThemeName}`, {recursive: true});

            fs.mkdirSync(`${SaveSpot[0]}/res`, {recursive: true});

            if(!fs.existsSync(`${SaveSpot[0]}/${this.ThemeName}/intro.html`)){
                fs.writeFileSync(`${SaveSpot[0]}/${this.ThemeName}/intro.html`, THEME_HTML_FILE);
                console.log("created HTML FIlE");
            }

            if(!fs.existsSync(`${SaveSpot[0]}/${this.ThemeName}/intro.css`)){
                fs.writeFileSync(`${SaveSpot[0]}/${this.ThemeName}/intro.css`, "");
                console.log("created CSS FIlE");
            }

            if(!fs.existsSync(`${SaveSpot[0]}/${this.ThemeName}/intro.js`)){
                fs.writeFileSync(`${SaveSpot[0]}/${this.ThemeName}/intro.js`, "");
                console.log("created JavaScript FIlE");
            }
        }
    }catch(e) { 
        dialog.showErrorBox(
            'File Failed to Create',
            `the ${this.ThemeName}.theme File Failed to create \n do you have write permissions in this directory \n ${e}`
        );
    }
}

function ReadThemeFile() {
    let themesFolders = fs.readdirSync(`${__dirname}/../Themes`);

    let themesData = [];
    for(const theme of themesFolders){
        try{
            if(fs.existsSync(`${__dirname}/../Themes/${theme}/metadata.skin`)){
                const filestream = fs.readFileSync(`${__dirname}/../Themes/${theme}/metadata.skin`);
                //console.log(filestream);
                
                if(isThemeFile(filestream)){
                    throw "File is Not Really A theme FIle";
                }
                let decoder = new TextDecoder();

                const readFile = {
                    ThemeIcon: "",
                    ThemeName: "",
                    Description: "",
                    Darkmode: false,
                    Online: false,
                    URL: "",
                    Folder: "",
                }
                let current_point = 5;

                let finalPosforBase64 = filestream.readUint32LE(current_point);
                current_point += 4;
                readFile.ThemeIcon = decoder.decode(filestream.subarray(current_point, finalPosforBase64));
                current_point += finalPosforBase64;
                
                let finalPosForThemeName = filestream.readUInt16LE(current_point);
                current_point += 2;
                readFile.ThemeName = filestream.subarray(current_point, current_point + finalPosForThemeName).toString();
                current_point += finalPosForThemeName;
               
                let finalPosforDescriptionName = filestream.readUInt32LE(current_point);
                current_point += 4;

                readFile.Description = filestream.subarray(current_point, current_point + finalPosforDescriptionName).toString();
                current_point += finalPosforDescriptionName;
                //console.log(current_point);
                readFile.Darkmode = Boolean(filestream.readUint8(current_point));
                current_point++;
                readFile.Online = Boolean(filestream.readUint8(current_point));
                current_point++;
                //console.log(current_point);
                let finalPosforUrlName = filestream.readUint16LE(current_point);
                //console.log(finalPosforUrlName);
                current_point += 2;
                readFile.URL = filestream.subarray(current_point, current_point + finalPosforUrlName).toString();

                readFile.Folder = theme;
                themesData.push(readFile);
            }
        }catch (e) {
            console.log(e);
        }
    }

    return themesData;
}

module.exports = {
    constructor,
    SelectIcon, 
    CreateThemeFile,
    ReadThemeFile
}