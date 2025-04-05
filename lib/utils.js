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

module.exports = {
  getRandomUserAgent,
  generateRandomAccountData,
  generateStrongPassword,
  saveAccount
};
