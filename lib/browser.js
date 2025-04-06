const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const fs = require('fs').promises;
const path = require('path');
const { getRandomUserAgent } = require('./utils');

// Apply stealth plugin
puppeteer.use(StealthPlugin());

// Apply recaptcha plugin if API keys are available
if (process.env.RECAPTCHA_2CAPTCHA_API_KEY) {
  puppeteer.use(
    RecaptchaPlugin({
      provider: {
        id: '2captcha',
        token: process.env.RECAPTCHA_2CAPTCHA_API_KEY
      },
      visualFeedback: true
    })
  );
}

// Browser initialization with enhanced anti-detection
async function initBrowser(proxy = null) {
  console.log("Initializing browser with visible UI...");
  // Default browser arguments
  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-first-run',
    '--password-store=basic',
    '--use-mock-keychain',
    '--disk-cache-size=33554432', // 32MB disk cache
    '--incognito',
    // Random window size to avoid detection
    `--window-size=${1024 + Math.floor(Math.random() * 200)},${768 + Math.floor(Math.random() * 200)}`,
    // Add webgl and canvas fingerprinting protection
    '--disable-webgl',
    '--disable-reading-from-canvas',
    // Use a populated profile with cookies and history
    '--enable-features=NetworkService',
    // Make sure browser is visible on screen
    '--start-maximized',
    // Position window in a visible area (top-left of screen)
    '--window-position=10,10'
  ];

  // Add proxy if provided
  if (proxy) {
    args.push(`--proxy-server=${proxy.protocol}://${proxy.host}:${proxy.port}`);
  }
  
  // Create a custom user data directory for persistent sessions
  const userDataDir = path.join(__dirname, '..', 'data', 'browser-profiles', `profile-${Date.now()}`);
  await fs.mkdir(userDataDir, { recursive: true });
  
  // Copy some basic browser history and bookmarks to make profile seem used
  try {
    const templateProfileDir = path.join(__dirname, '..', 'data', 'browser-templates');
    if (await directoryExists(templateProfileDir)) {
      await copyTemplateFiles(templateProfileDir, userDataDir);
    }
  } catch (error) {
    console.log('Could not copy template profile data:', error.message);
  }

  console.log("Launching browser with headless=false to make it visible...");
  const browser = await puppeteer.launch({
    headless: false, // FIXED: Changed from string 'false' to boolean false to make browser visible
    args,
    userDataDir,
    ignoreHTTPSErrors: true,
    defaultViewport: {
      width: 1280 + Math.floor(Math.random() * 100),
      height: 800 + Math.floor(Math.random() * 100)
    }
  });

  console.log("Browser launched successfully. You should now see the browser window.");

  // Set up authentication if proxy requires it
  if (proxy && proxy.username && proxy.password) {
    browser.on('targetcreated', async (target) => {
      if (target.type() === 'page') {
        const page = await target.page();
        await page.authenticate({
          username: proxy.username,
          password: proxy.password
        });
      }
    });
  }

  return browser;
}

// Helper function to check if directory exists
async function directoryExists(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

// Helper function to copy template files to the user profile
async function copyTemplateFiles(sourceDir, targetDir) {
  const files = await fs.readdir(sourceDir);
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    const stats = await fs.stat(sourcePath);
    
    if (stats.isDirectory()) {
      await fs.mkdir(targetPath, { recursive: true });
      await copyTemplateFiles(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

// Initialize a page with human-like properties
async function initPage(browser) {
  const page = await browser.newPage();
  
  // Set a random user agent
  const userAgent = getRandomUserAgent();
  await page.setUserAgent(userAgent);
  
  // Set common headers to appear more human-like
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Referer': 'https://www.google.com/'
  });
  
  // Set viewport with slight randomization
  await page.setViewport({
    width: 1280 + Math.floor(Math.random() * 100),
    height: 800 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: true,
    isMobile: false
  });
  
  return page;
}

module.exports = { initBrowser, initPage };
