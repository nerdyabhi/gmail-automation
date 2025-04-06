const { pageWaitForTimeout } = require('../../utils');
const { typeHumanLike, performRandomMouseMovements } = require('../../humanBehavior');

/**
 * Fill personal information step (first name, last name)
 * @param {Object} page - Puppeteer page
 * @param {Object} accountData - Account data
 */
async function fillPersonalInfo(page, accountData) {
  console.log("Filling out personal information...");
  
  // First do some random mouse movements to simulate human behavior
  await performRandomMouseMovements(page);
  
  // Wait for the form fields to be visible
  await page.waitForSelector('input[name="firstName"]', { visible: true });
  await page.waitForSelector('input[name="lastName"]', { visible: true });
  
  // Enter First Name with human-like typing
  await typeHumanLike(page, 'input[name="firstName"]', accountData.firstName);
  
  // Random pause between fields
  await pageWaitForTimeout(500 + Math.floor(Math.random() * 1000));
  
  // Enter Last Name with human-like typing
  await typeHumanLike(page, 'input[name="lastName"]', accountData.lastName);
  
  // Random pause before clicking next
  await pageWaitForTimeout(700 + Math.floor(Math.random() * 1000));
  
  // Click the Next button to proceed to the next step
  const nextButton = await page.$('#nextButton') || await page.$('button[type="button"]');
  if (nextButton) {
    await nextButton.click();
    
    // Wait for navigation to complete
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    } catch (error) {
      console.log("Navigation timeout after clicking next, proceeding anyway...");
    }
  } else {
    throw new Error("Next button not found after filling personal info");
  }
  
  console.log("Personal information step completed");
}

module.exports = { fillPersonalInfo };
