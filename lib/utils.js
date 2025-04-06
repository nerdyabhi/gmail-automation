// List of modern user agents for better disguise
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36 Edg/91.0.864.71',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0'
];

// Get a random user agent
function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Add this function to get a random delay within a range
function getRandomDelay(min = 500, max = 3000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Add this function to your utils.js file
async function pageWaitForTimeout(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

// Generate random account data
function generateRandomAccountData() {
  const firstNames = ['John', 'Emma', 'Alex', 'Sarah', 'Michael', 'Olivia', 'William', 'Ava', 'James', 'Sophia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
  
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  // Generate username with random numbers
  const randomNum = Math.floor(Math.random() * 10000);
  const username = `${randomFirstName.toLowerCase()}${randomLastName.toLowerCase()}${randomNum}`;
  
  // Generate password with letters, numbers, and special characters
  const password = generateStrongPassword();
  
  // Generate random birth date (18-50 years old)
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - 18 - Math.floor(Math.random() * 32);
  const birthMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  const birthDay = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
  
  return {
    firstName: randomFirstName,
    lastName: randomLastName,
    username,
    password,
    birthYear: String(birthYear),
    birthMonth,
    birthDay,
    gender: Math.random() > 0.5 ? 'male' : 'female'
  };
}

// Generate a strong password
function generateStrongPassword() {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+';
  
  let password = '';
  
  // Add at least one of each character type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Add more random characters to reach length 10-14
  const allChars = lowercase + uppercase + numbers + special;
  const length = 10 + Math.floor(Math.random() * 5);
  
  while (password.length < length) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

// Save account data to JSON
async function saveAccount(accountData) {
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const accountsDir = path.join(__dirname, '..', 'data', 'accounts');
    await fs.mkdir(accountsDir, { recursive: true });
    
    const accountsFile = path.join(accountsDir, 'accounts.json');
    
    // Read existing accounts
    let accounts = [];
    try {
      const data = await fs.readFile(accountsFile, 'utf8');
      accounts = JSON.parse(data);
    } catch (error) {
      // File might not exist yet, that's fine
    }
    
    // Add new account
    accounts.push({
      ...accountData,
      createdAt: new Date().toISOString()
    });
    
    // Write back to file
    await fs.writeFile(accountsFile, JSON.stringify(accounts, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error saving account data:', error);
    return false;
  }
}

// Generate natural mouse movement path between two points
async function generateNaturalMouseMovement(page, start, end, options = {}) {
  const { minPoints = 5, maxPoints = 20, minStepDelay = 5, maxStepDelay = 20 } = options;
  
  // Generate a number of control points to create a natural curve
  const numPoints = Math.floor(Math.random() * (maxPoints - minPoints)) + minPoints;
  const points = [];
  
  // Start and end points
  points.push(start);
  
  // Generate random control points for natural curve
  for (let i = 0; i < numPoints; i++) {
    // Create deviation from straight line
    const progress = (i + 1) / (numPoints + 1);
    const linearX = start.x + (end.x - start.x) * progress;
    const linearY = start.y + (end.y - start.y) * progress;
    
    // Add some randomness to the path with bezier-like curves
    const deviation = Math.min(100, Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y)) * 0.3);
    const randomX = linearX + (Math.random() - 0.5) * deviation;
    const randomY = linearY + (Math.random() - 0.5) * deviation;
    
    points.push({ x: randomX, y: randomY });
  }
  
  points.push(end);
  
  // Move the mouse through the points with variable speed
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    await page.mouse.move(point.x, point.y);
    
    if (i < points.length - 1) {
      // Variable delay between movements to simulate acceleration/deceleration
      const stepDelay = Math.random() * (maxStepDelay - minStepDelay) + minStepDelay;
      await pageWaitForTimeout(stepDelay);
      
      // Occasionally add a small pause as if the user is hesitating
      if (Math.random() < 0.1) {
        await pageWaitForTimeout(getRandomDelay(200, 600));
      }
    }
  }
}

// Simulates human typing with variable speed and occasional typos
async function humanTypeInto(page, selector, text, options = {}) {
  const {
    typoFrequency = 0.03,
    minDelay = 50,
    maxDelay = 150,
    initialDelay = true,
    focusSelector = null
  } = options;
  
  // First focus on the element if needed
  if (focusSelector) {
    await page.focus(focusSelector);
  } else {
    await page.focus(selector);
  }
  
  // Initial delay as if human is thinking before typing
  if (initialDelay) {
    await pageWaitForTimeout(getRandomDelay(300, 1200));
  }
  
  for (let i = 0; i < text.length; i++) {
    // Decide if we should make a typo
    if (Math.random() < typoFrequency) {
      // Type a wrong character
      const typoChar = getRandomChar();
      await page.keyboard.press(typoChar);
      
      // Wait a bit to "notice" the typo
      await pageWaitForTimeout(getRandomDelay(200, 700));
      
      // Delete the typo
      await page.keyboard.press('Backspace');
      await pageWaitForTimeout(getRandomDelay(150, 400));
    }
    
    // Type the correct character
    await page.keyboard.press(text[i]);
    
    // Variable delay between keystrokes
    // Occasionally add a longer pause as if thinking or distracted
    if (Math.random() < 0.05) {
      await pageWaitForTimeout(getRandomDelay(700, 2500));
    } else {
      await pageWaitForTimeout(Math.random() * (maxDelay - minDelay) + minDelay);
    }
  }
  
  // Occasionally add a pause at the end of typing
  if (Math.random() < 0.3) {
    await pageWaitForTimeout(getRandomDelay(400, 1200));
  }
}

// Get a random character for typos
function getRandomChar() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return chars[Math.floor(Math.random() * chars.length)];
}

// Simulate exploratory behavior before performing critical actions
async function explorePageBeforeAction(page, targetSelector) {
  const numExploratoryActions = Math.floor(Math.random() * 5) + 1;
  
  for (let i = 0; i < numExploratoryActions; i++) {
    // Random scrolling
    await page.mouse.wheel({ deltaY: (Math.random() - 0.5) * 400 });
    await pageWaitForTimeout(getRandomDelay(300, 1200));
    
    // Occasionally move mouse to random locations
    const viewportWidth = page.viewport().width;
    const viewportHeight = page.viewport().height;
    
    const randomX = Math.floor(Math.random() * viewportWidth);
    const randomY = Math.floor(Math.random() * viewportHeight);
    
    await generateNaturalMouseMovement(page, 
      { x: page.mouse.x, y: page.mouse.y }, 
      { x: randomX, y: randomY }
    );
    
    // Occasionally hover over random elements
    if (Math.random() < 0.6) {
      const randomElements = ['a', 'button', 'input', 'div', 'span', 'img'];
      const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
      
      const elements = await page.$$(randomElement);
      if (elements.length > 0) {
        const randomIndex = Math.floor(Math.random() * elements.length);
        try {
          const elementBoundingBox = await elements[randomIndex].boundingBox();
          if (elementBoundingBox) {
            await generateNaturalMouseMovement(page, 
              { x: page.mouse.x, y: page.mouse.y }, 
              { 
                x: elementBoundingBox.x + elementBoundingBox.width / 2, 
                y: elementBoundingBox.y + elementBoundingBox.height / 2 
              }
            );
            await pageWaitForTimeout(getRandomDelay(200, 800));
          }
        } catch (e) {
          // Element might have disappeared, just continue
        }
      }
    }
    
    // Occasionally take a break as if distracted
    if (Math.random() < 0.15) {
      await pageWaitForTimeout(getRandomDelay(2000, 5000));
    }
  }
  
  // Finally, move to the target element
  if (targetSelector) {
    try {
      const targetElement = await page.$(targetSelector);
      if (targetElement) {
        const targetBoundingBox = await targetElement.boundingBox();
        if (targetBoundingBox) {
          await generateNaturalMouseMovement(page, 
            { x: page.mouse.x, y: page.mouse.y }, 
            { 
              x: targetBoundingBox.x + targetBoundingBox.width / 2, 
              y: targetBoundingBox.y + targetBoundingBox.height / 2 
            }
          );
        }
      }
    } catch (e) {
      console.log(`Could not move to target element: ${e.message}`);
    }
  }
}

// Simulate random session behavior like going back, reloading, or taking detours
async function addSessionVariance(page, probability = 0.15) {
  if (Math.random() < probability) {
    const actions = [
      // Go back
      async () => {
        console.log("Adding variance: Going back a page");
        await page.goBack();
        await pageWaitForTimeout(getRandomDelay(1000, 3000));
        await page.goForward();
      },
      // Reload page
      async () => {
        console.log("Adding variance: Reloading page");
        await page.reload();
        await pageWaitForTimeout(getRandomDelay(1500, 4000));
      },
      // Take a long break
      async () => {
        console.log("Adding variance: Taking a break");
        await pageWaitForTimeout(getRandomDelay(5000, 15000));
      },
      // Adjust window size slightly
      async () => {
        console.log("Adding variance: Adjusting window size");
        const currentViewport = page.viewport();
        const newWidth = currentViewport.width + (Math.random() < 0.5 ? -20 : 20);
        const newHeight = currentViewport.height + (Math.random() < 0.5 ? -20 : 20);
        await page.setViewport({
          width: newWidth,
          height: newHeight
        });
        await pageWaitForTimeout(getRandomDelay(1000, 3000));
      }
    ];
    
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    await randomAction();
  }
}

// Simulate thinking time before important actions
async function humanThinkingTime(page, importance = 'normal') {
  let minTime, maxTime;
  
  switch (importance) {
    case 'low':
      minTime = 500;
      maxTime = 2000;
      break;
    case 'high':
      minTime = 2000;
      maxTime = 7000;
      break;
    case 'critical':
      minTime = 3000;
      maxTime = 10000;
      break;
    case 'normal':
    default:
      minTime = 1000;
      maxTime = 4000;
  }
  
  await pageWaitForTimeout(getRandomDelay(minTime, maxTime));
}

// Map country codes to timezone, language and geolocation information
const COUNTRY_SETTINGS = {
  'US': {
    timezones: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'],
    languages: ['en-US'],
    coordinates: { latitude: 37.0902, longitude: -95.7129 }
  },
  'GB': {
    timezones: ['Europe/London'],
    languages: ['en-GB'],
    coordinates: { latitude: 55.3781, longitude: -3.4360 }
  },
  'CA': {
    timezones: ['America/Toronto', 'America/Vancouver', 'America/Edmonton'],
    languages: ['en-CA', 'fr-CA'],
    coordinates: { latitude: 56.1304, longitude: -106.3468 }
  },
  'AU': {
    timezones: ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth'],
    languages: ['en-AU'],
    coordinates: { latitude: -25.2744, longitude: 133.7751 }
  },
  'DE': {
    timezones: ['Europe/Berlin'],
    languages: ['de-DE'],
    coordinates: { latitude: 51.1657, longitude: 10.4515 }
  },
  'FR': {
    timezones: ['Europe/Paris'],
    languages: ['fr-FR'],
    coordinates: { latitude: 46.2276, longitude: 2.2137 }
  },
  'NL': {
    timezones: ['Europe/Amsterdam'],
    languages: ['nl-NL'],
    coordinates: { latitude: 52.1326, longitude: 5.2913 }
  },
  'ES': {
    timezones: ['Europe/Madrid'],
    languages: ['es-ES'],
    coordinates: { latitude: 40.4637, longitude: -3.7492 }
  },
  'IT': {
    timezones: ['Europe/Rome'],
    languages: ['it-IT'],
    coordinates: { latitude: 41.8719, longitude: 12.5674 }
  },
  'BR': {
    timezones: ['America/Sao_Paulo'],
    languages: ['pt-BR'],
    coordinates: { latitude: -14.2350, longitude: -51.9253 }
  },
  'IN': {
    timezones: ['Asia/Kolkata'],
    languages: ['en-IN', 'hi-IN'],
    coordinates: { latitude: 20.5937, longitude: 78.9629 }
  },
  'JP': {
    timezones: ['Asia/Tokyo'],
    languages: ['ja-JP'],
    coordinates: { latitude: 36.2048, longitude: 138.2529 }
  },
  // Default fallback
  'DEFAULT': {
    timezones: ['UTC'],
    languages: ['en-US'],
    coordinates: { latitude: 0, longitude: 0 }
  }
};

// Get timezone and language settings for a country
function getLocationSettingsForCountry(countryCode) {
  const settings = COUNTRY_SETTINGS[countryCode] || COUNTRY_SETTINGS['DEFAULT'];
  
  // Pick a random timezone from the list
  const timezone = settings.timezones[Math.floor(Math.random() * settings.timezones.length)];
  
  // Pick a random language from the list
  const language = settings.languages[Math.floor(Math.random() * settings.languages.length)];
  
  // Add slight randomness to coordinates for privacy fingerprinting
  const latitude = settings.coordinates.latitude + (Math.random() - 0.5) * 0.1;
  const longitude = settings.coordinates.longitude + (Math.random() - 0.5) * 0.1;
  
  return {
    timezone,
    language,
    coordinates: { latitude, longitude }
  };
}

// Apply location and timezone settings to a page based on country
async function applyLocationSettings(page, countryCode) {
  const settings = getLocationSettingsForCountry(countryCode);
  
  console.log(`Applying location settings for country ${countryCode}: `, settings);
  
  // Override timezone
  await page.emulateTimezone(settings.timezone);
  
  // Set geolocation
  const client = await page.target().createCDPSession();
  await client.send('Emulation.setGeolocationOverride', {
    latitude: settings.coordinates.latitude,
    longitude: settings.coordinates.longitude,
    accuracy: 100
  });
  
  // Set language
  await page.evaluateOnNewDocument((language) => {
    Object.defineProperty(navigator, 'language', {
      get: function() { return language; }
    });
    Object.defineProperty(navigator, 'languages', {
      get: function() { return [language, 'en-US']; }
    });
  }, settings.language);
  
  // Adjust the local timezone for JS Date objects
  await page.evaluateOnNewDocument((timezone) => {
    const dateTimeFormat = Intl.DateTimeFormat().resolvedOptions();
    Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
      get: function() {
        return function() {
          const options = dateTimeFormat;
          options.timeZone = timezone;
          return options;
        };
      }
    });
    
    // Override Date methods that reveal timezone
    const DateTimeFormat = Date.prototype.toLocaleString;
    const DateTimeFormatString = Date.prototype.toLocaleTimeString;
    const DateTimeFormatDateString = Date.prototype.toLocaleDateString;
    
    Date.prototype.toLocaleString = function() {
      return DateTimeFormat.apply(this, [settings.language, {timeZone: timezone}]);
    };
    
    Date.prototype.toLocaleTimeString = function() {
      return DateTimeFormatString.apply(this, [settings.language, {timeZone: timezone}]);
    };
    
    Date.prototype.toLocaleDateString = function() {
      return DateTimeFormatDateString.apply(this, [settings.language, {timeZone: timezone}]);
    };
  }, settings.timezone);
  
  return settings;
}

// Detect IP location using ipinfo.io service 
async function detectLocationFromIP(ip) {
  try {
    const axios = require('axios');
    
    // Remove any port number if present
    const cleanIP = ip.split(':')[0];
    
    const response = await axios.get(`https://ipinfo.io/${cleanIP}/json`);
    
    if (response.data && response.data.country) {
      return response.data.country;
    }
    
    console.warn(`Could not detect country from IP ${ip}, using default US`);
    return 'US';
  } catch (error) {
    console.error(`Error detecting location from IP: ${error.message}`);
    return 'US'; // Default to US if detection fails
  }
}

// Make sure all functions are properly exported
module.exports = {
  getRandomUserAgent,
  generateRandomAccountData,
  generateStrongPassword,
  saveAccount,
  pageWaitForTimeout,
  getRandomDelay,
  generateNaturalMouseMovement,
  humanTypeInto,
  explorePageBeforeAction,
  addSessionVariance,
  humanThinkingTime,
  getLocationSettingsForCountry,
  applyLocationSettings,
  detectLocationFromIP
};
