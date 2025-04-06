/**
 * Comprehensive Gmail automation module combining all steps
 */
const { pageWaitForTimeout, getRandomDelay } = require('./utils.js');

// If humanBehavior.js doesn't exist yet, we'll need these functions
/**
 * Performs random mouse movements on the page
 * @param {Object} page - Puppeteer page
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

/**
 * Simulates human-like scrolling behavior
 * @param {Object} page - Puppeteer page
 */
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
    
    await pageWaitForTimeout(500 + Math.floor(Math.random() * 1000));
    
    // Maybe scroll back up a bit
    if (Math.random() > 0.7) {
      const upDistance = Math.floor(scrollDistance * 0.3);
      await page.evaluate((distance) => {
        window.scrollBy(0, -distance);
      }, upDistance);
      
      await pageWaitForTimeout(400 + Math.floor(Math.random() * 600));
    }
  }
}

/**
 * Types text with human-like variations in timing
 * @param {Object} page - Puppeteer page
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

/**
 * Clicks on an element with human-like behavior
 * @param {Object} page - Puppeteer page
 * @param {string|Object} selector - Element selector or element handle
 */
async function clickHumanLike(page, selector) {
  let elementHandle;
  
  if (typeof selector === 'string') {
    await page.waitForSelector(selector, { visible: true });
    elementHandle = await page.$(selector);
  } else {
    elementHandle = selector;
  }
  
  if (!elementHandle) {
    throw new Error(`Element not found: ${selector}`);
  }
  
  // Get element position
  const boundingBox = await elementHandle.boundingBox();
  
  if (!boundingBox) {
    throw new Error(`Cannot get bounding box for element: ${selector}`);
  }
  
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
    await clickHumanLike(page, nextButton);
    
    // Wait for navigation to complete
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    } catch (error) {
      console.log("Navigation timeout after clicking next, proceeding anyway...");
    }
  } else {
    console.error("Next button not found after filling personal info");
  }
  
  console.log("Personal information step completed");
}


async function fillBirthdayAndGender(page, accountData) {
  try {
    // Check if birthday/gender form is present
 
    console.log("Filling out birthday and gender...");

    // Wait for fields to be visible
    await page.waitForSelector('select[id="month"]', { visible: true });
    await page.waitForSelector('input[id="day"]', { visible: true }); 
    await page.waitForSelector('input[id="year"]', { visible: true });
    await page.waitForSelector('select[id="gender"]', { visible: true });

    await page.select('select[id="month"]', "3"); // March
    await page.type('input[id="day"]', "29", { delay: await getRandomDelay(50, 150) });
    await page.type('input[id="year"]', "1999", { delay: await getRandomDelay(50, 150) });
    await page.select('select[id="gender"]', "1"); // Male

    await page.click("button[type='button']");
    console.log("Birthday and gender filled!");
    await pageWaitForTimeout(5000); // Using pageWaitForTimeout instead of sleep
    
  } catch (error) {
    console.error("Error in birthday and gender step:", error.message);
  }
}

async function fillUsername(page, accountData) {
  try {
    console.log("Filling out username...");

    // Add random initial delay and mouse movements
    await pageWaitForTimeout(500 + Math.floor(Math.random() * 1000));
    await performRandomMouseMovements(page);

    await page.waitForSelector('input[name="Username"]', { visible: true });

    // Random delay before starting
    await pageWaitForTimeout(300 + Math.floor(Math.random() * 700));

    // Try first with firstName + "1234" as username
    const simpleUsername = accountData.firstName.toLowerCase() + 'x' + Date.now().toString().substring(0, 6);
    await typeHumanLike(page, 'input[name="Username"]', simpleUsername);
    
    // Random pause before clicking next
    await pageWaitForTimeout(800 + Math.floor(Math.random() * 1200));
    
    // Click next button with human-like behavior
    const nextButton = await page.$('#nextButton') || await page.$('button[type="button"]');
    if (nextButton) {
      await clickHumanLike(page, nextButton);
    }
    
    // Wait and check username availability with natural timing
    await pageWaitForTimeout(2000 + Math.floor(Math.random() * 2000));
    
    if (await page.$('input[name="Username"]')) {
      console.log(simpleUsername + ' is not available. Trying alternative...');
      
      // Natural pause before retrying
      await pageWaitForTimeout(600 + Math.floor(Math.random() * 1000));
      
      // Clear field with human-like behavior
      await clickHumanLike(page, 'input[name="Username"]');
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await pageWaitForTimeout(200 + Math.floor(Math.random() * 300));
      await page.keyboard.press('Backspace');
      
      // Create timestamp username with natural delay
      await pageWaitForTimeout(400 + Math.floor(Math.random() * 800));
      const timestamp = Date.now().toString().substring(7);
      const newUsername = accountData.firstName.toLowerCase() + accountData.lastName + timestamp;
      await typeHumanLike(page, 'input[name="Username"]', newUsername);
      
      accountData.username = newUsername;

      // Random pause before proceeding
      await pageWaitForTimeout(700 + Math.floor(Math.random() * 1000));
      
      if (nextButton) {
        await performRandomMouseMovements(page);
        await clickHumanLike(page, nextButton);
      }
    } else {
      accountData.username = simpleUsername;
    }

    // Wait for navigation with natural timing
    try {
      await page.waitForNavigation({ 
        waitUntil: 'networkidle2', 
        timeout: 10000 + Math.floor(Math.random() * 5000)
      });
    } catch (error) {
      console.log("Navigation timeout after username selection, continuing...");
    }
    
    console.log(`Username step completed: ${accountData.username}`);
  } catch (error) {
    console.error("Error in username step:", error.message);
  }
}

// Unified Gmail option handler
async function handleGmailOptions(page) {
  console.log("Handling Gmail options with human-like behavior...");
  
  // Add some random initial mouse movements
  await performRandomMouseMovements(page);
  
  const options = [
    'div ::-p-text(Create your own Gmail address)',
    'div ::-p-text(Create a Gmail address)'
  ];

  for (const optionSelector of options) {
    try {
      const option = await page.$(optionSelector);
      if (option) {
        console.log(`Found Gmail option: ${optionSelector}`);
        
        // Add human-like delay before clicking
        await pageWaitForTimeout(800 + Math.floor(Math.random() * 1200));
        
        // Click the option with human-like behavior
        await clickHumanLike(page, option);
        
        // Wait for and click the next button
        const nextButton = await page.$('button[type="button"]');
        if (nextButton) {
          await pageWaitForTimeout(500 + Math.floor(Math.random() * 800));
          await clickHumanLike(page, nextButton);
        }

        // Random delay between attempts
        await pageWaitForTimeout(1500 + Math.floor(Math.random() * 2000));
      }
    } catch (error) {
      console.log(`Option ${optionSelector} not found or not clickable`);
    }
  }

  // One final check for the first option again
  try {
    const finalOption = await page.$('div ::-p-text(Create your own Gmail address)');
    if (finalOption) {
      console.log("Found final Gmail option, handling it...");
      await performRandomMouseMovements(page);
      await pageWaitForTimeout(600 + Math.floor(Math.random() * 1000));
      await clickHumanLike(page, finalOption);
      
      const nextButton = await page.$('button[type="button"]');
      if (nextButton) {
        await pageWaitForTimeout(500 + Math.floor(Math.random() * 800));
        await clickHumanLike(page, nextButton);
      }
    }
  } catch (error) {
    console.log("Final option check complete");
  }

  console.log("Gmail options handling completed");
}

/**
 * Fill password fields
 * @param {Object} page - Puppeteer page
 * @param {Object} accountData - Account data
 */
async function fillPassword(page, accountData) {
  try {
    console.log("Filling out password...");
    
    // Add random initial delay and mouse movements
    await pageWaitForTimeout(500 + Math.floor(Math.random() * 1000));
    await performRandomMouseMovements(page);

    // Wait for password fields to be visible
    await page.waitForSelector('input[name="Passwd"]', { visible: true });
    await page.waitForSelector('input[name="PasswdAgain"]', { visible: true });

    // Type password with human-like behavior
    await typeHumanLike(page, 'input[name="Passwd"]', accountData.password);
    
    // Random pause between password fields
    await pageWaitForTimeout(800 + Math.floor(Math.random() * 1200));
    
    // Type confirm password with human-like behavior
    await typeHumanLike(page, 'input[name="PasswdAgain"]', accountData.password);

    // Random pause before show password
    await pageWaitForTimeout(500 + Math.floor(Math.random() * 800));

  


    // Random pause before clicking next
    await pageWaitForTimeout(700 + Math.floor(Math.random() * 1000));

    // Click next button with human-like behavior
    const nextButton = await page.$('button[type="button"]');
    if (nextButton) {
      await clickHumanLike(page, nextButton);
    }

    // Wait for navigation with random timeout
    try {
      await page.waitForNavigation({ 
        waitUntil: 'networkidle2',
        timeout: 10000 + Math.floor(Math.random() * 5000)
      });
    } catch (error) {
      console.log("Navigation timeout after password step, continuing...");
    }

    console.log("Password step completed");
  } catch (error) {
    console.error("Error in password step:", error.message);
  }
}

/**
 * Handle phone verification process
 * @param {Object} page - Puppeteer page
 * @param {Object} accountData - Account data
 */
async function handlePhoneVerification(page, accountData) {
  try {
    console.log("Handling phone verification...");
    
    // Check if we're on the phone verification page
    const phoneInput = await page.$('input[id="phoneNumberId"]') || await page.$('input[type="tel"]');

    if (!phoneInput) {
      console.log("Phone verification step not found, skipping...");
      return;
    }
    
    // Do some random mouse movements
    await performRandomMouseMovements(page);
    
    // Type the phone number with human-like behavior
    await typeHumanLike(page, 'input[type="tel"]', accountData.phoneNumber);
    await pageWaitForTimeout(700 + Math.floor(Math.random() * 1000));
    
    // Click next button
    const nextButton = await page.$('#nextButton') || await page.$('button[type="button"]');
    if (nextButton) {
      await clickHumanLike(page, nextButton);
    } else {
      console.error("Next button not found after entering phone number");
      return;
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
      console.error("Verify button not found after entering verification code");
      return;
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
  }
}

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
      console.error("Next button not found after entering recovery email");
      return;
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
  }
}

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
      console.error("Agree button not found during terms acceptance");
      return;
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
  }
}

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
    await fillPersonalInfo(page, accountData);
    await fillBirthdayAndGender(page, accountData);
    await handleGmailOptions(page);
    await fillUsername(page, accountData);
    await fillPassword(page, accountData);
    
    // Handle optional verification steps if they appear
    if (accountData.phoneNumber) {
      await handlePhoneVerification(page, accountData);
    }
    
    if (accountData.recoveryEmail) {
      await addRecoveryEmail(page, accountData);
    }
    
    // Accept terms and complete signup
    await acceptTerms(page);
    
    return true;
  } catch (error) {
    console.error('Error during Gmail signup process:', error);
    return false;
  }
}

// Support function for country code selection based on automation.ts
async function selectCountryAndEnterNumber(page, phoneNumber) {
  try {
    console.log("Entering phone number...");
    
    // Define country codes mapping
    const countryCodes = {
      "7": "Russia",      // Russia (+7)
      "1": "United States", // USA (+1)
      "44": "United Kingdom", // UK (+44)
      "91": "India", // India (+91)
      "86": "China", // China (+86)
      "49": "Germany", // Germany (+49)
      "33": "France", // France (+33)
      "55": "Brazil", // Brazil (+55)
      "81": "Japan" // Japan (+81)
    };

    // Extract the country code
    let countryCode = Object.keys(countryCodes).find(code => phoneNumber.startsWith(code));

    if (!countryCode) {
      console.error("Country code not found for number:", phoneNumber);
      return;
    }

    const telInput = await page.waitForSelector('input[type="tel"]');
    if (telInput) {
      // Type the country code with a "+" prefix
      await telInput.type(`+${countryCode}`, { delay: 200 });

      // Wait a moment
      await pageWaitForTimeout(1000);

      // Select all text in the input and delete it
      await telInput.click({ clickCount: 3 });
      await page.keyboard.press("Backspace");

      // Remove the countryCode from phoneNumber and type the phone number
      const numberWithoutCountry = phoneNumber.replace(countryCode, "");
      await telInput.type(numberWithoutCountry, { delay: 100 });

      console.log(`Entered number: ${numberWithoutCountry}`);

      // Click the button to proceed
      await page.waitForSelector("button[type='button']");
      await page.click("button[type='button']");
    } else {
      console.error("Telephone input not found.");
    }
  } catch (error) {
    console.error("Error in country and phone selection:", error.message);
  }
}

// Export all functions
module.exports = {
  executeGmailSignup,
  fillPersonalInfo,
  fillBirthdayAndGender,
  fillUsername,
  fillPassword,
  handlePhoneVerification,
  addRecoveryEmail,
  acceptTerms,
  typeHumanLike,
  clickHumanLike,
  performRandomMouseMovements,
  simulateHumanScrolling,
  selectCountryAndEnterNumber
};
