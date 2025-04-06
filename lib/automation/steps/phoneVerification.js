const { pageWaitForTimeout } = require('../../utils');
const { typeHumanLike, performRandomMouseMovements, clickHumanLike } = require('../../humanBehavior');

/**
 * Handle phone verification process
 * @param {Object} page - Puppeteer page
 * @param {Object} accountData - Account data
 */
async function handlePhoneVerification(page, accountData) {
  try {
    console.log("Handling phone verification...");
    
    // Check if we're on the phone verification page
    const phoneInput = await page.$('input[id="phoneNumberId"]');
    if (!phoneInput) {
      console.log("Phone verification step not found, skipping...");
      return;
    }
    
    // Do some random mouse movements
    await performRandomMouseMovements(page);
    
    // Type the phone number with human-like behavior
    await typeHumanLike(page, 'input[id="phoneNumberId"]');
    await pageWaitForTimeout(700 + Math.floor(Math.random() * 1000));
    
    // Click next button
    const nextButton = await page.$('#nextButton') || await page.$('button[type="button"]');
    if (nextButton) {
      await clickHumanLike(page, nextButton);
    } else {
      throw new Error("Next button not found after entering phone number");
    }
    
    console.log("Waiting for SMS verification code...");
    
    // Wait for verification code input to appear
    await page.waitForSelector('input[name="code"]', { visible: true, timeout: 120000 });
    
    // Get verification code from service or user
    // Implementation depends on your SMS service
    let verificationCode;
    if (typeof accountData.getVerificationCode === 'function') {
      // If there's a function to get the code automatically
      verificationCode = await accountData.getVerificationCode(accountData.phoneNumber);
    } else {
      // Fallback to fixed code for testing
      verificationCode = "123456";
      console.warn("Using fixed verification code: 123456. Replace with actual SMS verification logic.");
    }
    
    // Type verification code with human-like behavior
    await typeHumanLike(page, 'input[name="code"]', verificationCode);
    await pageWaitForTimeout(500 + Math.floor(Math.random() * 800));
    
    // Click verify button
    const verifyButton = await page.$('#nextButton') || await page.$('button[type="button"]');
    if (verifyButton) {
      await clickHumanLike(page, verifyButton);
    } else {
      throw new Error("Verify button not found after entering verification code");
    }
    
    // Wait for navigation to the next step
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });
    } catch (error) {
      console.log("Navigation timeout after phone verification, proceeding anyway...");
    }
    
    console.log("Phone verification step completed");
  } catch (error) {
    console.error("Error in phone verification step:", error.message);
    throw error;
  }
}

module.exports = { handlePhoneVerification };
