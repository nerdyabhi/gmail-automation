/**
 * Human behavior simulation module for bot detection avoidance
 */

// Random delay between actions
async function randomDelay(min = 500, max = 3000) {
  const delay = Math.floor(Math.random() * (max - min) + min);
  await new Promise(resolve => setTimeout(resolve, delay));
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

// Main function to perform human-like actions on a page
async function performHumanLikeActions(page, accountData) {
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
  randomDelay
};
