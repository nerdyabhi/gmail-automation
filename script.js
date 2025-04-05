require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getRandomUserAgent } = require('./lib/utils');
const { initBrowser } = require('./lib/browser');
const { getProxy } = require('./services/proxyService');
const { performHumanLikeActions } = require('./lib/humanBehavior');

// Apply stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

async function createGmailAccount(accountData) {
  const proxy = await getProxy();
  const browser = await initBrowser(proxy);
  
  try {
    const page = await browser.newPage();
    
    // Set random user agent
    const userAgent = getRandomUserAgent();
    await page.setUserAgent(userAgent);
    
    // Set additional headers to appear more human-like
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });

    // Navigate to Gmail signup
    await page.goto('https://accounts.google.com/signup', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Add random delay to simulate human behavior
    await page.waitForTimeout(2000 + Math.floor(Math.random() * 2000));
    
    // Fill out the form using human-like behaviors
    await performHumanLikeActions(page, accountData);
    
    // Fill in first name and last name
    await page.type('input[name="firstName"]', accountData.firstName, {delay: 50 + Math.random() * 100});
    await page.waitForTimeout(500 + Math.random() * 1000);
    await page.type('input[name="lastName"]', accountData.lastName, {delay: 70 + Math.random() * 100});
    await page.waitForTimeout(700 + Math.random() * 1000);
    
    // Click next button and wait for username screen
    await page.click('#nextButton');
    await page.waitForSelector('input[name="Username"]', {timeout: 10000});
    
    // Enter username with natural typing speed
    await page.type('input[name="Username"]', accountData.username, {delay: 100 + Math.random() * 150});
    await page.waitForTimeout(1000 + Math.random() * 1500);
    
    // Enter password
    await page.type('input[name="Passwd"]', accountData.password, {delay: 80 + Math.random() * 120});
    await page.waitForTimeout(800 + Math.random() * 1200);
    await page.type('input[name="ConfirmPasswd"]', accountData.password, {delay: 90 + Math.random() * 130});
    
    // Click next and wait for phone verification
    await page.click('#nextButton');
    await page.waitForSelector('input[id="phoneNumberId"]', {timeout: 10000});
    
    // Enter phone number if provided
    if (accountData.phoneNumber) {
      await page.type('input[id="phoneNumberId"]', accountData.phoneNumber, {delay: 70 + Math.random() * 100});
      await page.click('#nextButton');
      
      // Wait for verification code
      console.log('Waiting for SMS verification code...');
      await page.waitForSelector('input[name="code"]', {timeout: 120000});
      
      // Prompt for verification code (in a real system, this would be automated)
      // This is a placeholder - you would replace this with your SMS verification service
      const verificationCode = await promptForVerificationCode();
      await page.type('input[name="code"]', verificationCode, {delay: 150 + Math.random() * 200});
      await page.click('#nextButton');
    }
    
    // Complete additional verification steps if they appear
    try {
      await page.waitForSelector('input[name="recoveryEmail"]', {timeout: 10000});
      if (accountData.recoveryEmail) {
        await page.type('input[name="recoveryEmail"]', accountData.recoveryEmail, {delay: 80 + Math.random() * 120});
        await page.click('#nextButton');
      }
    } catch (e) {
      // Recovery email step might be skipped
      console.log('Recovery email step skipped or not found');
    }
    
    // Enter birth date
    try {
      await page.waitForSelector('select#month', {timeout: 10000});
      await page.select('select#month', accountData.birthMonth);
      await page.type('input#day', accountData.birthDay, {delay: 50 + Math.random() * 70});
      await page.type('input#year', accountData.birthYear, {delay: 70 + Math.random() * 90});
      await page.select('select#gender', accountData.gender);
      await page.click('#nextButton');
    } catch (e) {
      console.log('Birth date step skipped or not found:', e.message);
    }
    
    // Accept terms
    try {
      await page.waitForSelector('input[type="checkbox"]', {timeout: 10000});
      await page.click('input[type="checkbox"]');
      await page.waitForTimeout(500 + Math.random() * 1000);
      await page.click('#nextButton');
    } catch (e) {
      console.log('Terms acceptance step skipped or not found');
    }
    
    // Wait for account creation to complete
    await page.waitForNavigation({waitUntil: 'networkidle2', timeout: 60000});
    
    console.log('Account creation process completed successfully');
    
    // Save a screenshot as evidence (optional)
    await page.screenshot({path: `./screenshots/${accountData.username}_account_created.png`});
    
    return {
      success: true,
      username: accountData.username,
      password: accountData.password,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating account:', error);
    
    // Save screenshot of the error state
    try {
      await page.screenshot({path: `./screenshots/error_${Date.now()}.png`});
    } catch (screenshotError) {
      console.error('Failed to capture error screenshot:', screenshotError);
    }
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  } finally {
    await browser.close();
  }
}

// Placeholder function - replace with actual SMS verification service
async function promptForVerificationCode() {
  // In a real implementation, this would connect to an SMS service API
  // For now, it's just a mock implementation
  return "123456"; // Replace with actual code retrieval logic
}

module.exports = { createGmailAccount };