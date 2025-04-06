const axios = require('axios');
const { configDotenv } = require('dotenv');
configDotenv();
/**
 * SMS handling module using Juicy SMS API
 */


// Configure API settings

/**
 * Get a phone number for receiving SMS
 * @param {string} country - Country code (UK, NL, USA)
 * @param {string|number} serviceId - Service ID for the SMS service
 * @returns {Promise<Object>} Object containing id and number
 */
async function getNumber(country = 'UK', serviceId = '1') {
    try {
        const response = await axios.get(`https://juicysms.com/api/makeorder`, {
            params: {
                key: process.env.JUICY_SMS_API_KEY,
                serviceId,
                country,
            },
        });
        
        const responseData = response.data;
        
        // Handle error responses
        if (responseData === 'NO_PHONE_AVAILABLE') {
            throw new Error('No phone number available for this service');
        } else if (responseData === 'NO_BALANCE') {
            throw new Error('Insufficient account balance');
        } else if (responseData.startsWith('ORDER_ALREADY_OPEN_')) {
            const orderId = responseData.replace('ORDER_ALREADY_OPEN_', '');
            throw new Error(`Order already open with ID: ${orderId}`);
        }
        
        // Handle success response: ORDER_ID_{ORDER_ID}_NUMBER_{PHONE_NUMBER}
        if (responseData.startsWith('ORDER_ID_')) {
            const parts = responseData.split('_');
            const id = parts[2];
            const number = parts[4];
            
            return {
                id,
                number,
            };
        }
        
        throw new Error(`Unexpected API response: ${responseData}`);
    } catch (error) {
        console.error('Error getting phone number:', error.message);
        throw error;
    }
}

/**
 * Check for SMS messages for a specific number
 * @param {string} id - The ID of the number request
 * @returns {Promise<Array>} Array of messages
 */
async function checkSMS(id) {
    try {
        const response = await axios.get(`https://juicysms.com/api/getsms`, {
            params: {
                key: process.env.JUICY_SMS_API_KEY,
                orderId: id,
            },
        });
        
        const responseData = response.data;
        
        if (responseData === 'ORDER_EXPIRED') {
            throw new Error('The order has been canceled or has expired');
        } else if (responseData === 'WAITING') {
            return []; // No messages yet
        } else if (responseData.startsWith('SUCCESS_')) {
            const smsContent = responseData.replace('SUCCESS_', '');
            
            console.log("Response " , responseData);
            
            // Extract Google OTP code (G-XXXXX format)
            const otpMatch = smsContent.match(/\d{6}/);
            
            if (otpMatch) {
                // Return just the Google code
                return [{
                    text: otpMatch[0],
                    receivedAt: new Date().toISOString()
                }];
            }
            
            return [{
                text: smsContent,
                receivedAt: new Date().toISOString()
            }];
        }
        
        throw new Error(`Unexpected API response: ${responseData}`);
    } catch (error) {
        console.error('Error checking SMS messages:', error.message);
        throw error;
    }
}

/**
 * Wait for an SMS to arrive, polling a fixed number of times
 * @param {string} id - The ID of the number request
 * @param {number} maxAttempts - Maximum number of polling attempts
 * @param {number} interval - Check interval in milliseconds
 * @returns {Promise<string|null>} The SMS message text or null if no message after all attempts
 */
async function waitForSMS(id, maxAttempts = 7, interval = 5000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const messages = await checkSMS(id);
        
        if (messages.length > 0) {
            console.log("Message as : " , messages);
            
            // Return the first message's text, which is what checkSMS returns
            return messages[0].text;
        }
        
        // Don't wait after the last attempt
        if (attempt < maxAttempts) {
            // Wait for the interval before checking again
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }
    
    return null; // All attempts exhausted, no SMS received
}

/**
 * Cancel a number request (to avoid additional charges)
 * @param {string} id - The ID of the number request
 * @returns {Promise<boolean>} Success status
 */
async function cancelNumber(id) {
    try {
        const response = await axios.get(`https://juicysms.com/api/cancelorder`, {
            params: {
                key: process.env.JUICY_SMS_API_KEY,
                orderId: id,
            },
        });
        
        const responseData = response.data;
        
        if (responseData === 'ORDER_CANCELED') {
            return true;
        } else if (responseData === 'ORDER_ALREADY_EXPIRED') {
            console.log('The order has already expired');
            return false;
        } else if (responseData === 'ORDER_ALREADY_COMPLETED') {
            console.log('The order has already been completed');
            return false;
        }
        
        throw new Error(`Unexpected API response: ${responseData}`);
    } catch (error) {
        console.error('Error canceling number:', error.message);
        return false;
    }
}

async function main(){
    const ans = await cancelNumber(5824699);
    console.log(ans);
}

main();

module.exports = {
    getNumber,
    checkSMS,
    waitForSMS,
    cancelNumber,
};