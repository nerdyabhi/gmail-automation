const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const fs = require('fs').promises;
const path = require('path');

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
    `--window-size=${1024 + Math.floor(Math.random() * 200)},${768 + Math.floor(Math.random() * 200)}`
  ];

  // Add proxy if provided
  if (proxy) {
    args.push(`--proxy-server=${proxy.protocol}://${proxy.host}:${proxy.port}`);
  }
  
  // Create a custom user data directory for persistent sessions
  const userDataDir = path.join(__dirname, '..', 'data', 'browser-profiles', `profile-${Date.now()}`);
  await fs.mkdir(userDataDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new', // Use new headless mode
    args,
    userDataDir,
    ignoreHTTPSErrors: true,
    defaultViewport: {
      width: 1280 + Math.floor(Math.random() * 100),
      height: 800 + Math.floor(Math.random() * 100)
    }
  });

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

module.exports = { initBrowser };
