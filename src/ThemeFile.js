const {dialog} = require('electron')
const fs = require('fs');
var EXIF = require('exifreader');
const path = require('path');


const MAGICNUMBER = 'THEME'
let   ThemeIcon = "";
const ImageSize = 512;

let loadinglock = false;

function isThemeFile () {
    
}    

ThemeName = "defauls";
Description = "Just a test Description";
Darkmode = true;
OnlineUpdate = true;
Url = "https:// this is not a scam.com";


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
    const fileLocation = dialog.showOpenDialogSync({title: 'Select Icon', properties: ['openFile'], filters: [ {name: 'Images', extensions: ['jpg', 'png']}]});
    console.log(fileLocation);
    try{
        const file = await fs.readFileSync(fileLocation[0]);
        

        const tags = EXIF.load(file);
        console.log(tags);
            
        if(tags['Image Width'].value != ImageSize && tags['Image Height'].value != ImageSize){
            dialog.showErrorBox("Image Wrong Size", "the Icon Image must be 512x512 pixels in size");
            return;
        }
    
        const extentionName = path.extname(fileLocation[0]);

        const Base64Image = Buffer.from(file, 'binary').toString('base64');

        const base64ImageStr = `data:image/${extentionName.split('.').pop()};base64,${Base64Image}`;
        // console.log(base64ImageStr);
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
    if(loadinglock){
        setTimeout({}, 10);
    }

    const SaveSpot = dialog.showOpenDialogSync({title: 'Select Theme Development Enviroment Location', properties: ['openDirectory', 'createDirectory']});
    console.log(SaveSpot);
    try { 
        let data = fs.createWriteStream(`${SaveSpot}/${this.ThemeName}.theme`);
        data.write(MAGICNUMBER);
        data.write(ThemeIcon);
        data.write(this.ThemeName);
        data.write(this.Description);
        data.write(booleanToBits(this.Darkmode));
        data.write(booleanToBits(this.OnlineUpdate));
        data.write(this.Url);
        console.log("Finished Writing File");
    }catch(e) { 
        dialog.showErrorBox(
            'File Failed to Create',
            `the ${this.ThemeName}.theme File Failed to create \n do you have write permissions in this directory \n ${e}`
        );
    }
}



function booleanToBits(val){
    const buffer =  [val ? 0 : 1];
    return Buffer.from(buffer);
}

module.exports = {
    constructor,
    SelectIcon, 
    CreateThemeFile
}