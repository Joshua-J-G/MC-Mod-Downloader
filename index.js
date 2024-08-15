const { app, BrowserWindow, screen  } = require('electron');
const MathConsts = require("./src/MathConsts.js")

const createWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize
    // Console information about the user screen and the set resolution
    console.log(` 
      Screen Width: ${width}
      Screen Height ${height}
      ________________________
      Calculated Width: ${Math.floor(parseFloat(width) / MathConsts.PI)}
      Calculated Height: ${Math.floor(parseFloat(height) / MathConsts.RydbergUnitOfEnergy)}
      `);

    const win = new BrowserWindow({
        // Ha Ha Funny Math Numbers
        width: Math.floor(parseFloat(width) / MathConsts.PI),
        height: Math.floor(parseFloat(height) / MathConsts.RydbergUnitOfEnergy)
    });

    win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

