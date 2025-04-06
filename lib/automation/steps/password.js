const { pageWaitForTimeout } = require('../../utils');
const { typeHumanLike, performRandomMouseMovements, clickHumanLike } = require('../../humanBehavior');

/**
 * Fill password fields
 * @param {Object} page - Puppeteer page
 * @param {Object} accountData - Account data
 */
async function fillPassword(page, accountData) {
  try {
    console.log("Filling out password...");
    
    // Wait for password fields to be visible
    await page.waitForSelector('input[name="Passwd"]', { visible: true, timeout: 10000 });
    await page.waitForSelector('input[name="PasswdAgain"]', { visible: true, timeout: 10000 })
      .catch(() => {
        // If PasswdAgain doesn't exist, try ConfirmPasswd
        return page.waitForSelector('input[name="ConfirmPasswd"]', { visible: true, timeout: 5000 });
      });
    
    // Add some human-like behavior
    await performRandomMouseMovements(page);
    
    // Type password with human-like typing
    await typeHumanLike(page, 'input[name="Passwd"]', accountData.password);
    await pageWaitForTimeout(800 + Math.floor(Math.random() * 1200));
    
    // Determine which confirm password field exists
    const confirmSelector = await page.$('input[name="PasswdAgain"]') 
      ? 'input[name="PasswdAgain"]' 
      : 'input[name="ConfirmPasswd"]';
    
    // Type confirmation password with human-like typing
    await typeHumanLike(page, confirmSelector, accountData.password);
    await pageWaitForTimeout(700 + Math.floor(Math.random() * 1000));
    
    // Sometimes click the show password button
    if (Math.random() > 0.5) {
      const showPasswordButton = await page.$('button[aria-label="Show password"]');
      if (showPasswordButton) {
        const box = await showPasswordButton.boundingBox();
        if (box) {
          // Move the mouse to the button with human-like movement
          await page.mouse.move(
            box.x + box.width/2 + (Math.random() * 10 - 5),
            box.y + box.height/2 + (Math.random() * 10 - 5),
            { steps: 10 + Math.floor(Math.random() * 15) }
          );
          await pageWaitForTimeout(200 + Math.floor(Math.random() * 300));
          
          // Click with random delay
          await page.mouse.click(
            box.x + box.width/2 + (Math.random() * 6 - 3),
            box.y + box.height/2 + (Math.random() * 6 - 3),
            { delay: 50 + Math.floor(Math.random() * 100) }
          );
          
          console.log("Clicked on show password button with human-like interaction");
          
          // Wait a moment before clicking next
          await pageWaitForTimeout(500 + Math.floor(Math.random() * 800));
        }
      }
    }
    
    // Click next button to proceed
    const nextButton = await page.$('#nextButton') || await page.$('button[type="button"]');
    if (nextButton) {
      await clickHumanLike(page, nextButton);
    } else {
      throw new Error("Next button not found after entering password");
    }
    
    // Wait for navigation to the next step
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    } catch (error) {
      console.log("Navigation timeout after entering password, proceeding anyway...");
    }
    
    console.log("Password step completed");
  } catch (error) {
    console.error("Error in password step:", error.message);
    throw error;
  }
}

module.exports = { fillPassword };
