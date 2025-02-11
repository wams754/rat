const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibU5ORDR5emVMWEdBeG4rd3BTOFFYcHRSTGwybjZhb0dCamppTnFoQnBuOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUjRpRzNiR0J4RThXS3BvY1ZBTFpQaHZHYzU1d3pHa1BlTHNKeXptUEZoST0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0R0I2NU1PY3poUVVaMWZQMVBUNHVrTDJkRlRYUXc4eDFJVzlRM0F0RWt3PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ2S2tOcysweDFSRk5MWm81eVRGRWwrclliVFo2VnBCbU5TNUNjb0REMFU0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IklETEFRQmRDaU9VWUt4dkw5YU5tS2pzclcvT1JaNjI4cjZ5VXlIK2gyVXc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InFaTWlxTkZCZndzSWlQbnBEZzB6YUR3aU9ONUlBVm5FcVZYU3JGMWZhUU09In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkxrK0ZZYU14SkNIaldQN0NWQVdPbEs2eW00MU1NbmZzOHhOcGJvYUltWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU0kvS0FkSUVtdFBYTGpvclpzYzN3Q3g4UEY2aW5hUEttWWc3cUg5UmtSRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlgxMUxLTUVsWnhrSnlGYVFOQjhqOUxLU0NiMUpCdkF3VlVYZm91eG9qN1FMQXdOVFJUWFdkeFIvUWNxU252dzFUcUR3amlPR0lDaWk3NTFwY1BSV0F3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTA3LCJhZHZTZWNyZXRLZXkiOiJLaE1Xek56NEhFMUVBVTNzTGs0WStMb2dFMWYrUnVCSnE5TDZ5cSs0ZS9NPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJDc2FrdUtJd1RLR0ZTa2NaYlJoYW9nIiwicGhvbmVJZCI6IjEwNzRkZmExLWVlZjMtNDZjMi1iZjgyLWFlZmM0YTdiM2RhYiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0dUozUjcrYkdRTlJCWnZIYkNob1Vmdk5NaWM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiM1FKSmZxdVhESlBuNmtZVHZ6b3hlL2ZzRFc4PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkxZUlFHNTFLIiwibWUiOnsiaWQiOiIyNDEwNDg1MjU0Mzo1OUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS09vM05vRUVOR1ByTDBHR0FVZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiM29sandQSFhuRXAycTdrSGxudm9uUGRmbVZLS084N29qcTRzZ3h5RkFXTT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiNFI1aHJNZnNTUDJXT3NTM092eUo5UkRrQnhVQWplZDlGL1NyZjFDWG42UkM2d2pmdWxpYTZXNzlsV0thQ0ZmU1Q0MmtSQklBeUFLcENGVkZZNmRxQlE9PSIsImRldmljZVNpZ25hdHVyZSI6IkhyWTMyVmJieVk2WGttcUcveDFMdDZhL0kyb1FMTEZhcHlmcmhMWHVaa0MyYjVPL0FIV2MzREJHRmRUUktlTFNob0kySi8xbXRQT3BuaWFYVm5ERUNnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjQxMDQ4NTI1NDM6NTlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZDZKWThEeDE1eEtkcXU1QjVaNzZKejNYNWxTaWp2TzZJNnVMSU1jaFFGaiJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczOTI2MTkyMH0=',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "France King",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "24174852543",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "off",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
