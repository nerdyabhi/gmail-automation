require('dotenv').config();
const { createGmailAccount } = require('./script.js');
const { generateRandomAccountData, saveAccount } = require('./lib/utils.js');

async function main() {
  const numAccounts = process.env.ACCOUNTS_TO_CREATE || 1;
  console.log(`Starting Gmail automation to create ${numAccounts} accounts...`);
  
  const results = {
    success: 0,
    failed: 0,
    accounts: []
  };
  
  for (let i = 0; i < numAccounts; i++) {
    console.log(`Creating account ${i+1} of ${numAccounts}...`);
    
    try {
      // Generate random account data
      const accountData = generateRandomAccountData();
      
      // Create account
      const result = await createGmailAccount(accountData);
      
      if (result.success) {
        console.log(`Successfully created account for ${result.username}`);
        results.success++;
        results.accounts.push(result);
        
        // Save account data
        await saveAccount(result);
      } else {
        console.error(`Failed to create account: ${result.error}`);
        results.failed++;
      }
      
      // Wait between account creations to avoid detection
      if (i < numAccounts - 1) {
        const waitTime = 60000 + Math.random() * 120000; // 1-3 minutes
        console.log(`Waiting ${Math.round(waitTime/1000)} seconds before next account creation...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    } catch (error) {
      console.error('Error in account creation process:', error);
      results.failed++;
    }
  }
  
  console.log('\nAutomation completed!');
  console.log(`Success: ${results.success}, Failed: ${results.failed}`);
  console.log('Successfully created accounts:');
  results.accounts.forEach(account => {
    console.log(`Username: ${account.username}, Password: ${account.password}`);
  });
}

// Start the automation process
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { main };
