/**
 * Export all step functions from their respective modules
 */

const { fillPersonalInfo } = require('./personalInfo');
const { fillBirthdayAndGender } = require('./birthdayGender');
const { fillUsername } = require('./username');
const { fillPassword } = require('./password');
const { handlePhoneVerification } = require('./phoneVerification');
const { addRecoveryEmail } = require('./recoveryEmail');
const { acceptTerms } = require('./termsAcceptance');

module.exports = {
  fillPersonalInfo,
  fillBirthdayAndGender,
  fillUsername,
  fillPassword,
  handlePhoneVerification,
  addRecoveryEmail,
  acceptTerms
};
