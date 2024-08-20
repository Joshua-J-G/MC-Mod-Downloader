const {contextBridge} = require('electron');

contextBridge.exposeInMainWorld('dark-mode', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
})