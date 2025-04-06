const { pageWaitForTimeout } = require('../../utils');
const { typeHumanLike, performRandomMouseMovements } = require('../../humanBehavior');

/**
 * Fill username field with fallback logic
 * @param {Object} page - Puppeteer page
 * @param {Object} accountData - Account data
 */
async function fillUsername(page, accountData) {
  try {
    console.log("Filling out username...");
    
    // Wait for the username field to be visible
    await page.waitForSelector('input[name="Username"]', { visible: true, timeout: 10000 });
    
    // Add some human-like behavior
    await performRandomMouseMovements(page);
    
    // Try first with a simple username
    const simpleUsername = accountData.firstName.toLowerCase() + accountData.lastName.toLowerCase().substring(0, 2) + Math.floor(Math.random() * 1000);
    
    await typeHumanLike(page, 'input[name="Username"]', simpleUsername);
    await pageWaitForTimeout(800 + Math.floor(Math.random() * 1200));
    
    // Click next button to check availability
    const nextButton = await page.$('#nextButton') || await page.$('button[type="button"]');
    if (nextButton) {
      await nextButton.click();
    } else {
      throw new Error("Next button not found after entering username");
    }
    
    // Wait briefly to see if there's an error message
    await pageWaitForTimeout(3000);
    
    // Check if we're still on the username page (meaning the username was not available)
    if (await page.$('input[name="Username"]')) {
      console.log("First username attempt not available, trying with the provided username...");
      
      // Clear the input field with triple click and backspace
      await page.click('input[name="Username"]', { clickCount: 3 });
      await page.keyboard.press("Backspace");
      await pageWaitForTimeout(500 + Math.floor(Math.random() * 700));
      
      // Try with the provided username
      await typeHumanLike(page, 'input[name="Username"]', accountData.username);
      await pageWaitForTimeout(800 + Math.floor(Math.random() * 1200));
      
      // Click next button again
      if (nextButton) {
        await nextButton.click();
      } else {
        throw new Error("Next button not found after entering fallback username");
      }
      
      // If we're still on the username page, try one more with a timestamp
      await pageWaitForTimeout(3000);
      if (await page.$('input[name="Username"]')) {
        console.log("Second username attempt not available, trying with timestamp...");
        
        // Clear the input field
        await page.click('input[name="Username"]', { clickCount: 3 });
        await page.keyboard.press("Backspace");
        await pageWaitForTimeout(500 + Math.floor(Math.random() * 700));
        
        // Create a timestamp-based username
        const timestamp = Date.now().toString().substring(7);
        const finalUsername = accountData.firstName.toLowerCase() + timestamp;
        
        await typeHumanLike(page, 'input[name="Username"]', finalUsername);
        await pageWaitForTimeout(800 + Math.floor(Math.random() * 1200));
        
        // Click next button one final time
        if (nextButton) {
          await nextButton.click();
        } else {
          throw new Error("Next button not found after entering timestamp username");
        }
        
        // Update the accountData with the final username
        accountData.username = finalUsername;
      }
    } else {
      // First attempt succeeded, update the accountData
      accountData.username = simpleUsername;
    }
    
    // Wait for navigation to the next step
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    } catch (error) {
      console.log("Navigation timeout after selecting username, proceeding anyway...");
    }
    
    console.log(`Username step completed with username: ${accountData.username}`);
  } catch (error) {
    console.error("Error in username step:", error.message);
    throw error;
  }
}

module.exports = { fillUsername };
