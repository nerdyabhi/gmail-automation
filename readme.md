
## 💻 Code Overview
> **⚠️ IMPORTANT DISCLAIMER**
> 
> This project is provided **strictly for educational purposes only**. It demonstrates browser automation and web interaction techniques as a learning resource.
> 
> **By using this code:**
> - You acknowledge that automated account creation may violate Gmail's Terms of Service
> - You assume full responsibility for any consequences resulting from your use of this software
> - You agree to use the knowledge gained ethically and legally
> 
> The author(s) disclaim all liability for misuse of this educational material. Users are solely responsible for ensuring their actions comply with applicable laws and service agreements.

### Core Modules

#### 1. Browser Management (`browser.js`)
Handles browser initialization with stealth plugins to avoid detection:
- Creates isolated browser profiles
- Applies anti-fingerprinting techniques
- Configures proxy support
- Sets realistic user agents and browser behavior

#### 2. Gmail Automation (`gmailAutomation.js`)
Contains the step-by-step process for Gmail account creation:
- Personal information entry (name, DOB, gender)
- Username selection and verification
- Password creation
- Phone verification handling
- Recovery email setup
- Terms and conditions acceptance

#### 3. Human Behavior Simulation (`humanBehavior.js`)
Implements natural human-like interaction patterns:
- Random mouse movements and hover actions
- Variable typing speeds with natural pauses
- Realistic scrolling behavior
- Random delays between actions
- Occasional exploratory page interactions

#### 4. SMS Verification (`sms.js`)
Integrates with Juicy SMS API for phone verification:
- Obtains temporary phone numbers
- Polls for incoming SMS messages
- Extracts verification codes
- Handles order cancellation to avoid charges

#### 5. Utilities (`utils.js`)
Provides helper functions:
- Random delay generation
- User agent rotation
- Account data generation
- Password creation
- Data persistence

### Service Integrations

#### Proxy Management (`proxyService.js`)
Handles IP rotation and proxy connections:
- Connects to proxy API services
- Caches available proxies
- Manages proxy selection and rotation
- Handles authentication

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/nerdyabhi/gmail-automation.git

# Navigate to the project directory
cd gmail-automation

# Install dependencies
npm install

node index.js
```