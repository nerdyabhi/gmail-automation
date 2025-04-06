const { pageWaitForTimeout } = require('./utils');

/**
 * Human behavior simulation module for bot detection avoidance
 */

// Random delay between actions
async function randomDelay(min = 500, max = 3000) {
  const delay = Math.floor(Math.random() * (max - min) + min);
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Performs random mouse movements on the page to simulate human behavior
 * @param {Object} page - Puppeteer page object
 */
async function performRandomMouseMovements(page) {
  const viewportSize = await page.viewport();
  const movementCount = 3 + Math.floor(Math.random() * 5); // 3-7 movements
  
  for (let i = 0; i < movementCount; i++) {
    const x = Math.floor(Math.random() * viewportSize.width);
    const y = Math.floor(Math.random() * viewportSize.height);
    
    await page.mouse.move(x, y, {
      steps: 10 + Math.floor(Math.random() * 20) // More steps = smoother movement
    });
    
    await pageWaitForTimeout(200 + Math.floor(Math.random() * 300));
  }
}

// Simulate human-like mouse movements
async function simulateHumanMouseMovement(page) {
  const width = page.viewport().width;
  const height = page.viewport().height;
  
  // Number of movements
  const numMovements = 5 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < numMovements; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    
    await page.mouse.move(x, y, { steps: 25 + Math.floor(Math.random() * 25) });
    await randomDelay(300, 800);
  }
}

// Simulate human-like scrolling
async function simulateHumanScrolling(page) {
  // Random number of scroll actions
  const scrollActions = 1 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < scrollActions; i++) {
    // Random scroll distance
    const scrollDistance = 100 + Math.floor(Math.random() * 300);
    
    // Scroll down
    await page.evaluate((distance) => {
      window.scrollBy(0, distance);
    }, scrollDistance);
    
    await randomDelay(500, 1500);
    
    // Maybe scroll back up a bit
    if (Math.random() > 0.7) {
      const upDistance = Math.floor(scrollDistance * 0.3);
      await page.evaluate((distance) => {
        window.scrollBy(0, -distance);
      }, upDistance);
      
      await randomDelay(400, 1000);
    }
  }
}

/**
 * Types text with human-like variations in timing
 * @param {Object} page - Puppeteer page object
 * @param {string} selector - Element selector
 * @param {string} text - Text to type
 */
async function typeHumanLike(page, selector, text) {
  await page.waitForSelector(selector, { visible: true });
  
  // Sometimes click before typing
  if (Math.random() > 0.3) {
    await page.click(selector);
    await pageWaitForTimeout(100 + Math.floor(Math.random() * 200));
  }
  
  // Type with variable delay between keystrokes
  for (const char of text) {
    await page.type(selector, char, { delay: 30 + Math.floor(Math.random() * 100) });
    
    // Occasionally pause while typing
    if (Math.random() > 0.9) {
      await pageWaitForTimeout(300 + Math.floor(Math.random() * 500));
    }
  }
  
  // Sometimes pause after typing
  if (Math.random() > 0.5) {
    await pageWaitForTimeout(200 + Math.floor(Math.random() * 500));
  }
}

// Add randomness to typing
async function typeWithHumanBehavior(page, selector, text) {
  await page.focus(selector);
  
  // Type character by character with variable delay
  for (const char of text) {
    // Occasionally pause longer to simulate thinking
    if (Math.random() < 0.1) {
      await randomDelay(500, 2000);
    }
    
    // Occasionally make a typo and correct it
    if (Math.random() < 0.05) {
      const typoChar = String.fromCharCode(
        97 + Math.floor(Math.random() * 26)
      );
      await page.keyboard.press(typoChar);
      await randomDelay(300, 700);
      await page.keyboard.press('Backspace');
      await randomDelay(200, 600);
    }
    
    await page.keyboard.type(char, { delay: 50 + Math.random() * 150 });
  }
}

/**
 * Clicks on an element with human-like behavior
 * @param {Object} page - Puppeteer page object
 * @param {string} selector - Element selector
 */
async function clickHumanLike(page, selector) {
  await page.waitForSelector(selector, { visible: true });
  
  // Get element position
  const elementHandle = await page.$(selector);
  const boundingBox = await elementHandle.boundingBox();
  
  // Move to element with some randomness
  const x = boundingBox.x + boundingBox.width/2 + (Math.random() * 10 - 5);
  const y = boundingBox.y + boundingBox.height/2 + (Math.random() * 10 - 5);
  
  // Move mouse to element
  await page.mouse.move(x, y, { steps: 5 + Math.floor(Math.random() * 10) });
  
  // Small pause before clicking
  await pageWaitForTimeout(50 + Math.floor(Math.random() * 150));
  
  // Click with random delay
  await page.mouse.click(x, y, { delay: 50 + Math.floor(Math.random() * 100) });
}

/**
 * Performs a series of human-like actions to fill a form
 * @param {Object} page - Puppeteer page object
 * @param {Object} accountData - Account data to fill in
 */
async function performHumanLikeActions(page, accountData) {
  // First do some random mouse movements
  await performRandomMouseMovements(page);
  
  // Fill form fields if they exist with human-like typing
  if (accountData.firstName && await page.$('input[name="firstName"]')) {
    await typeHumanLike(page, 'input[name="firstName"]', accountData.firstName);
  }
  
  if (accountData.lastName && await page.$('input[name="lastName"]')) {
    await typeHumanLike(page, 'input[name="lastName"]', accountData.lastName);
  }
  
  // Add some random delay between fields
  await pageWaitForTimeout(500 + Math.floor(Math.random() * 1000));
  
  if (accountData.username && await page.$('input[name="Username"]')) {
    await typeHumanLike(page, 'input[name="Username"]', accountData.username);
  }
  
  if (accountData.password) {
    if (await page.$('input[name="Passwd"]')) {
      await typeHumanLike(page, 'input[name="Passwd"]', accountData.password);
      
      // Random delay before confirming password
      await pageWaitForTimeout(300 + Math.floor(Math.random() * 700));
      
      if (await page.$('input[name="PasswdAgain"]') || await page.$('input[name="ConfirmPasswd"]')) {
        const confirmSelector = await page.$('input[name="PasswdAgain"]') 
          ? 'input[name="PasswdAgain"]' 
          : 'input[name="ConfirmPasswd"]';
        await typeHumanLike(page, confirmSelector, accountData.password);
      }
    }
  }
  
  // Simulate initial page exploration
  await simulateHumanMouseMovement(page);
  await simulateHumanScrolling(page);
  
  // Random clicks on non-form elements to simulate page exploration
  const randomClicks = Math.floor(Math.random() * 2);
  for (let i = 0; i < randomClicks; i++) {
    // Find non-form elements to click (like reading terms, etc.)
    const nonFormElements = await page.$$('p, span, div:not(form div)');
    if (nonFormElements.length > 0) {
      const randomElement = nonFormElements[Math.floor(Math.random() * nonFormElements.length)];
      // Hover first
      await randomElement.hover();
      await randomDelay(300, 800);
      await randomElement.click();
      await randomDelay(1000, 2000);
    }
  }
  
  // Add various browser fingerprint evasion techniques
  await page.evaluate(() => {
    // Override properties that can be used for fingerprinting
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false
    });
    
    // Add fake plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => {
        return [
          {
            name: 'Chrome PDF Plugin',
            filename: 'internal-pdf-viewer',
            description: 'Portable Document Format'
          },
          {
            name: 'Chrome PDF Viewer',
            filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
            description: 'Portable Document Format'
          }
        ];
      }
    });
  });
  
  return true;
}

module.exports = {
  performHumanLikeActions,
  simulateHumanMouseMovement,
  simulateHumanScrolling,
  typeWithHumanBehavior,
  randomDelay,
  performRandomMouseMovements,
  typeHumanLike,
  clickHumanLike
};
