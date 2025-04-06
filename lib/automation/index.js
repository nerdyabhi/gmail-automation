/**
 * Main automation module that exports all step functions
 */

const steps = require('./steps');

/**
 * Execute the full Gmail account creation process
 * @param {Object} page - Puppeteer page
 * @param {Object} accountData - Account data to use
 * @returns {Promise<boolean>} - Success status
 */
async function executeGmailSignup(page, accountData) {
  try {
    // Navigate to Gmail signup
    await page.goto('https://accounts.google.com/signup', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Execute each step in sequence
    await steps.fillPersonalInfo(page, accountData);
    await steps.fillBirthdayAndGender(page, accountData);
    await steps.fillUsername(page, accountData);
    await steps.fillPassword(page, accountData);
    
    // Handle optional verification steps if they appear
    if (accountData.phoneNumber) {
      await steps.handlePhoneVerification(page, accountData);
    }
    
    if (accountData.recoveryEmail) {
      await steps.addRecoveryEmail(page, accountData);
    }
    
    // Accept terms and complete signup
    await steps.acceptTerms(page);
    
    return true;
  } catch (error) {
    console.error('Error during Gmail signup process:', error);
    return false;
  }
}

module.exports = {
  executeGmailSignup,
  ...steps
};
