const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    title: 'CompassInt — OSINT Investigation Dashboard',
    // Custom icon can be added later: icon: path.join(__dirname, 'icon.png')
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Allow loading external resources (Leaflet, Google Fonts, OSINT APIs)
      webSecurity: false
    },
    backgroundColor: '#0a0e14',
    show: false, // wait until ready-to-show for a smooth launch
    autoHideMenuBar: true // hide the default menu bar for a cleaner look
  });

  // Load the app
  win.loadFile(path.join(__dirname, 'index.html'));

  // Show the window gracefully once content is ready
  win.once('ready-to-show', () => {
    win.show();
  });
}

// Fix for GPU artifacting (white lines) on certain GPU drivers —
// matches the same issue seen in VSCode, WhatsApp, and other Chromium apps.
app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();

  // macOS: re-create window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
