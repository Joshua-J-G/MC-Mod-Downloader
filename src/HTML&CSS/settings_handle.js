const ipc = require("electron").ipcRenderer;

let current_themes_list = [];







ipc.on("dark-mode", function (evt, message){
    const getNight = document.getElementById("DarkBlock");
    const getDay = document.getElementById("LightBlock");


    console.log(message);
    if(message.DARKMODE){
        console.log("darkmode");
        document.getElementById('style').setAttribute("href", "./settings_dark.css");
        getNight.style.visibility = "visible";
        getDay.style.visibility = "hidden";
    }else{
        console.log("LightMode");
        document.getElementById('style').setAttribute("href", "./settings_light.css");
        getNight.style.visibility = "hidden";
        getDay.style.visibility = "visible";
    }

    ipc.send('get-themes', {});
});

ipc.on('themes', (event, objectarray) => {
    let all = document.querySelectorAll('[id=ThemeContainers]');
    all.forEach((object) => {
        object.remove();
    });


    current_themes_list = objectarray.themes;

    for(const i in current_themes_list){
        const theme = current_themes_list[i];
        format_html(theme.ThemeIcon, theme.ThemeName, theme.Description, i);
    }
 
})

function UserClicked(){
        
    const btn_user = document.getElementById("UserButton");
    const btn_theme = document.getElementById("ThemeButton");
    const btn_app = document.getElementById("AppButton");
    const btn_extra = document.getElementById("ExtraButton");

    console.log("User Clicked");
    btn_user.style.transform = "scaleX(1.5)";
    btn_theme.style.transform = "";
    btn_app.style.transform = "";
    btn_extra.style.transform = "";

    const ui_user = document.getElementById('User');
    SetVisible(ui_user);
}

function ThemeClicked(){

    const btn_user = document.getElementById("UserButton");
    const btn_theme = document.getElementById("ThemeButton");
    const btn_app = document.getElementById("AppButton");
    const btn_extra = document.getElementById("ExtraButton");

    console.log("Theme Clicked");

    btn_user.style.transform = "";
    btn_theme.style.transform = "scaleX(1.5)";
    btn_app.style.transform = "";
    btn_extra.style.transform = "";


    const ui_theme = document.getElementById('Themes');
    SetVisible(ui_theme);
}

function AppClicked(){

    
    const btn_user = document.getElementById("UserButton");
    const btn_theme = document.getElementById("ThemeButton");
    const btn_app = document.getElementById("AppButton");
    const btn_extra = document.getElementById("ExtraButton");

    console.log("App Clicked");

    btn_user.style.transform = "";
    btn_theme.style.transform = "";
    btn_app.style.transform = "scaleX(1.5)";
    btn_extra.style.transform = "";

    const ui_app = document.getElementById('App');
    SetVisible(ui_app);
}

function ExtraClicked(){


    const btn_user = document.getElementById("UserButton");
    const btn_theme = document.getElementById("ThemeButton");
    const btn_app = document.getElementById("AppButton");
    const btn_extra = document.getElementById("ExtraButton");

    console.log("Extra Clicked");

    btn_user.style.transform = "";
    btn_theme.style.transform = "";
    btn_app.style.transform = "";
    btn_extra.style.transform = "scaleX(1.5)";

    const ui_extra = document.getElementById('Extra');
    SetVisible(ui_extra);
}

function Save(){
    ipc.send('save-changes', {});
}

function Exit(){
    ipc.send('close-settings', {});
}

function format_html(img, title, desc, pos){

    const scroll = document.getElementById("scroll_themes");
    
    scroll.innerHTML += `<div id=\"ThemeContainers\">
    <h1 class="title" id="title">${title}</h1>
    <p class="desc" id="desc">${desc}</p>
    <div id="buttons">
        <img draggable="false" class="enableButton" src="../../res/Settings Assets/SVG/Enable.svg">
        <h1 style="font-size: 300%; font-family: New Amsterdam; color: #fff9ec; position: absolute; transform: translateY(-10px); right: 2%;">ENABLE</h1>
        <button style="border-radius: 0 47px 0 0;position: absolute;right: 0%; width: 15%; height: 13.9%;" onclick="enable_theme(${pos})"></button>
        <img draggable="false" class="deleteButton" src="../../res/Settings Assets/SVG/Delete.svg">
        <h1  style="font-size: 300%; font-family: New Amsterdam;color: #fff9ec; position: absolute; right: 2.5%; transform: translateY(70px)">DELETE</h1>
        <button style="border-radius: 0 0 47px 0; transform: translateY(88px);position: absolute;right: 0%; width: 15%; height: 13.9%;" onclick="delete_theme(${pos})"></button>
    </div>
    <img draggable="false" class="icon" id="icon" src="${img}">
    <img  draggable="false"  src="../../res/Settings Assets/SVG/BackBoard.svg">
    </div>`

}

function enable_theme(themepos){

    ipc.send('select-theme', {"themename": current_themes_list[themepos].ThemeName});
    console.log(themepos);
}

function delete_theme(themepos){
    console.log(themepos);
}

function SetVisible(page){
    const ui_theme = document.getElementById('Themes');
    const ui_app = document.getElementById('App');
    const ui_user = document.getElementById('User');
    const ui_extra = document.getElementById('Extra');
    console.log(ui_theme);
    if(page == ui_theme){
        ui_theme.visibility = "visible";
    }else{
        ui_theme.visibility = "hidden";
    }

    if(page == ui_app){
        ui_app.visibility = "visible";
    }else{
        ui_app.visibility = "hidden";
    }

    if(page == ui_user){
        ui_user.visibility = "visible";
    }else{
        ui_user.visibility = "hidden";
    }

    if(page == ui_extra){
        ui_extra.visibility = "visible";
    }else{
        ui_extra.visibility = "hidden";
    }

}