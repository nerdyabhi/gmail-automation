const { pageWaitForTimeout } = require('../../utils');
const { performRandomMouseMovements, simulateHumanScrolling, clickHumanLike } = require('../../humanBehavior');

/**
 * Accept terms and complete signup
 * @param {Object} page - Puppeteer page
 */
async function acceptTerms(page) {
  try {
    // Check if terms acceptance step is present
    const termsCheckbox = await page.$('input[type="checkbox"]');
    if (!termsCheckbox) {
      console.log("Terms acceptance step not found, skipping...");
      return;
    }
    
    console.log("Accepting terms and conditions...");
    
    // Simulate reading the terms - scroll down naturally
    await simulateHumanScrolling(page);
    await pageWaitForTimeout(1000 + Math.floor(Math.random() * 2000));
    
    // Do some random mouse movements
    await performRandomMouseMovements(page);
    
    // Click the checkbox with human-like behavior
    await clickHumanLike(page, 'input[type="checkbox"]');
    await pageWaitForTimeout(800 + Math.floor(Math.random() * 1200));
    
    // Click next/agree button
    const nextButton = await page.$('#nextButton') || 
                       await page.$('button[type="button"]') || 
                       await page.$('button:contains("I agree")');
    
    if (nextButton) {
      await clickHumanLike(page, nextButton);
    } else {
      throw new Error("Agree button not found during terms acceptance");
    }
    
    // Wait for navigation to complete
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    } catch (error) {
      console.log("Navigation timeout after accepting terms, proceeding anyway...");
    }
    
    console.log("Terms acceptance completed");
  } catch (error) {
    console.error("Error in terms acceptance step:", error.message);
    throw error;
  }
}

module.exports = { acceptTerms };
