const { pageWaitForTimeout } = require('../../utils');
const { performRandomMouseMovements, typeHumanLike } = require('../../humanBehavior');

/**
 * Fill birthday and gender information
 * @param {Object} page - Puppeteer page
 * @param {Object} accountData - Account data
 */
async function fillBirthdayAndGender(page, accountData) {
  try {
    // Check if the birthday/gender form is present
    const monthSelector = await page.$('select[id="month"]');
    if (!monthSelector) {
      console.log("Birthday and gender form not found, skipping...");
      return;
    }
    
    console.log("Filling out birthday and gender...");
    
    // Wait for all fields to be visible
    await page.waitForSelector('select[id="month"]', { visible: true, timeout: 5000 });
    await page.waitForSelector('input[id="day"]', { visible: true, timeout: 5000 });
    await page.waitForSelector('input[id="year"]', { visible: true, timeout: 5000 });
    await page.waitForSelector('select[id="gender"]', { visible: true, timeout: 5000 });
    
    // Do some random mouse movements
    await performRandomMouseMovements(page);
    
    // Select Month with human-like delay
    await page.select('select[id="month"]', accountData.birthMonth);
    await pageWaitForTimeout(300 + Math.floor(Math.random() * 500));
    
    // Enter Day with human-like typing
    await typeHumanLike(page, 'input[id="day"]', accountData.birthDay);
    await pageWaitForTimeout(400 + Math.floor(Math.random() * 600));
    
    // Enter Year with human-like typing
    await typeHumanLike(page, 'input[id="year"]', accountData.birthYear);
    await pageWaitForTimeout(500 + Math.floor(Math.random() * 700));
    
    // Select Gender with human-like delay
    await page.select('select[id="gender"]', accountData.gender === 'male' ? '1' : '2');
    await pageWaitForTimeout(300 + Math.floor(Math.random() * 500));
    
    // Click Next to proceed
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
      throw new Error("Next button not found after filling birthday and gender");
    }
    
    console.log("Birthday and gender step completed");
  } catch (error) {
    console.error("Error in birthday and gender step:", error.message);
    throw error;
  }
}

module.exports = { fillBirthdayAndGender };
