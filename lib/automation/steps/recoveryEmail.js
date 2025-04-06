const { pageWaitForTimeout } = require('../../utils');
const { typeHumanLike, performRandomMouseMovements, clickHumanLike } = require('../../humanBehavior');

/**
 * Add recovery email
 * @param {Object} page - Puppeteer page
 * @param {Object} accountData - Account data
 */
async function addRecoveryEmail(page, accountData) {
  try {
    // Check if recovery email step is present
    const recoveryInput = await page.$('input[name="recoveryEmail"]');
    if (!recoveryInput) {
      console.log("Recovery email step not found, skipping...");
      return;
    }
    
    console.log("Adding recovery email...");
    
    // Do some random mouse movements
    await performRandomMouseMovements(page);
    
    // Type the recovery email with human-like behavior
    await typeHumanLike(page, 'input[name="recoveryEmail"]', accountData.recoveryEmail);
    await pageWaitForTimeout(600 + Math.floor(Math.random() * 900));
    
    // Click next button
    const nextButton = await page.$('#nextButton') || await page.$('button[type="button"]');
    if (nextButton) {
      await clickHumanLike(page, nextButton);
    } else {
      throw new Error("Next button not found after entering recovery email");
    }
    
    // Wait for navigation to the next step
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    } catch (error) {
      console.log("Navigation timeout after adding recovery email, proceeding anyway...");
    }
    
    console.log("Recovery email step completed");
  } catch (error) {
    console.error("Error in recovery email step:", error.message);
    throw error;
  }
}

module.exports = { addRecoveryEmail };
