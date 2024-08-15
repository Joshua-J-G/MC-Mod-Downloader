const { app, BrowserWindow, screen  } = require('electron');
const MathConsts = require("./src/MathConsts.js")

const createWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay()
  
  

    const win = new BrowserWindow({
        // Ha Ha Funny Math Numbers
        width: 800 / primaryDisplay.scaleFactor,
        height: 600 / primaryDisplay.scaleFactor
    });

    win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

