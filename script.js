require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const utils = require('./lib/utils.js');
const { initBrowser } = require('./lib/browser.js');
const { getProxy } = require('./services/proxyService.js');
const { executeGmailSignup } = require('./lib/gmailAutomation.js');
const fs = require('fs').promises;
const path = require('path');

// Apply stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// Global variable to store the browser instance for debugging
let globalBrowser = null;
let globalPage = null;

async function createGmailAccount(accountData) {
  const proxy = await getProxy();
  const browser = await initBrowser(proxy);
  
  // Set global browser for debugging
  globalBrowser = browser;
  
  try {
    const page = await browser.newPage();
    globalPage = page;
    
    // Create screenshots directory if it doesn't exist
    await fs.mkdir(path.join(__dirname, 'screenshots'), { recursive: true });
    
    // Set random user agent with fallback
    let userAgent;
    try {
      if (typeof utils.getRandomUserAgent === 'function') {
        userAgent = utils.getRandomUserAgent();
      } else {
        // Fallback if function not available
        userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36';
        console.warn('Using fallback user agent because getRandomUserAgent is not available');
      }
    } catch (error) {
      userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36';
      console.warn('Error getting random user agent, using fallback:', error.message);
    }
    
    await page.setUserAgent(userAgent);
    
    // Apply location settings based on proxy country
    if (proxy && proxy.country) {
      await utils.applyLocationSettings(page, proxy.country);
      console.log(`Applied location settings for country: ${proxy.country}`);
    } else {
      console.log('No proxy country detected, using default location settings');
      await utils.applyLocationSettings(page, 'US'); // Default to US
    }
    
    // Set additional headers to appear more human-like
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });

    // Execute the full Gmail signup process
    const success = await executeGmailSignup(page, accountData);
    
    if (success) {
      console.log('Account creation process completed successfully');
      
      // Save a screenshot as evidence
      await page.screenshot({path: `./screenshots/${accountData.username}_account_created.png`});
      
      return {
        success: true,
        username: accountData.username,
        password: accountData.password,
        timestamp: new Date().toISOString(),
        browser: browser, // Include browser for manual debugging if needed
        page: page
      };
    } else {
      console.error('Account creation process failed');
      
      // Save screenshot of the error state
      await page.screenshot({path: `./screenshots/error_${Date.now()}.png`});
      
      return {
        success: false,
        error: 'Account creation process failed',
        timestamp: new Date().toISOString(),
        browser: browser, // Include browser for manual debugging
        page: page
      };
    }
  } catch (error) {
    console.error('Error creating account:', error);
    
    // Save screenshot of the error state if page exists
    try {
      if (globalPage) {
        await globalPage.screenshot({path: `./screenshots/error_${Date.now()}.png`});
      }
    } catch (screenshotError) {
      console.error('Failed to capture error screenshot:', screenshotError);
    }
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      browser: globalBrowser, // Include browser for manual debugging
      page: globalPage
    };
  }
  // No finally block with browser.close() so browser stays open for debugging
}

// Function to manually close browser when done debugging
async function closeBrowser() {
  if (globalBrowser) {
    await globalBrowser.close();
    globalBrowser = null;
    globalPage = null;
    console.log("Browser closed manually");
  }
}

// Export the functions
module.exports = { 
  createGmailAccount,
  closeBrowser,
  getBrowser: () => globalBrowser,
  getPage: () => globalPage
};