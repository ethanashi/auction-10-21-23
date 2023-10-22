const puppeteer = require('puppeteer');
const fs = require('fs');
const { createCursor } = require( "ghost-cursor");
const {generateRandomStreetAddress, generateRandomName} = require('./randomAddress.js');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




class Account {
  constructor(email, password, num, phoneNumber, firstName) {
      this.email = email;
      this.password = password;
      this.num = num;
      this.won = [];
      this.returns = 0;
      this.returned = [];
      this.running = [];
      this.cookies = "";
      this.phoneNumber = phoneNumber;
      this.firstName = firstName;  
  }
}






function getRandomDelay(min, max) {
    return Math.random() * (max - min) + min;
}






















function createAccountInJSON(originalEmail, password, phoneNumber, firstName) {
    // Read the accounts.json file
    let accounts = [];
    try {
        const data = fs.readFileSync('accounts.json', 'utf8');
        accounts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts.json:', error);
    }
    
    // Determine the next number to use
    let nextNum = 1;
    accounts.forEach(account => {
        const match = account.email.match(/\+(\d+)@/);
        if (match && +match[1] >= nextNum) nextNum = +match[1] + 1;
    });
    
    // Construct the new email and create a new Account object
    const [localPart, domain] = originalEmail.split('@');
    const newEmail = `${localPart}+${nextNum}@${domain}`;
    const newAccount = new Account(newEmail, password, nextNum, phoneNumber, firstName);
    
    // Add the new account to the list and write it back to the accounts.json file
    accounts.push(newAccount);
    try {
        fs.writeFileSync('accounts.json', JSON.stringify(accounts, null, 2), 'utf8');
        console.log('New account added:', newEmail);
    } catch (error) {
        console.error('Error writing to accounts.json:', error);
    }
    return newAccount;
}



























async function createAccount() {

    let phoneNumber = await promptForPhoneNumber();
    const browser = await puppeteer.launch({ headless: true , args: ['--window-size=1280,720']});
    const page = await browser.newPage();
    const cursor = createCursor(page);


    let firstName = generateRandomName();  // Assuming generateRandomName generates a random first name
    let account = createAccountInJSON("ethanashihundu26@gmail.com", "Owen2021!!!", phoneNumber, firstName);
    

    // Setting a custom user agent
    await page.setViewport({ width: 1280, height: 720 });

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto("https://www.nellisauction.com/registration/setup");
    
    await sleep(2000);
    await typing("#email", account.email);
    await typing("#confirmEmail", account.email);
    await typing("#password", account.password);
    await typing("#confirmPassword", account.password);
    await randSleepClick("#registrationForm > div > button");
    await sleep(5000);
    await typing("#firstName", account.firstName);
    await typing("#lastName", "Smith");
    await typing("#headlessui-combobox-input-1", generateRandomStreetAddress());
    await sleep(100);
    await page.keyboard.press("Enter");
    await typing("#city", "Chandler");
    await typing("#state", "Arizona");
    await typing("#zip", "85225");
    await randSleepClick("#registrationDetailsForm > div > button");
    await sleep(4000);
    await typing("#phone", account.phoneNumber);
    await randSleepClick("#phone-verification > div > div > div > button");
    await new Promise((resolve) => {
      rl.question('Enter a valid phone number verification: ', async (verification) => {
        await typing("#code", verification);
        rl.close(); // Close the readline interface when you're done
        resolve(); // Resolve the promise after user input
      });
    });    
    await randSleepClick("#code-verification > button");
    await sleep(5000);
    await randSleepClick("body > div.__layout-wrapper > div.__layout-main > div > div.__registration-form-wrapper > div > div.__terms-form-header.__terms-form-wrapper > div > div:nth-child(2) > span");
    await sleep(500);
    await page.keyboard.press("PageDown");
    await sleep(500);
    await page.keyboard.press("PageDown");
    await sleep(500);
    await page.keyboard.press("PageDown");
    await sleep(500);
    await page.keyboard.press("PageDown");
    await sleep(500);
    await page.keyboard.press("PageDown");
    await sleep(500);
    await page.keyboard.press("PageDown");
    await sleep(500);
    await page.keyboard.press("PageDown");
    await sleep(500);

    await randSleepClick("body > div.__layout-wrapper > div.__layout-main > div > div.__registration-form-wrapper > div > div:nth-child(4) > div.__terms-form-agree-conditions-wrapper > button");
    await randSleepClick("#accept-terms-of-service-form > button");
    await new Promise((resolve) => {
      askQuestion('Enter email whatever: ').then(async (verification) => {
          resolve(); // Resolve the promise after user input
      });
  });  
    await page.goto("https://www.nellisauction.com/");
    const cookies = await page.cookies();
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
 
    account.cookies = cookieString;

    // Update the accounts.json file with the modified account
    updateAccountInJSON(account);


    await page.close()

    await browser.close();
    return 0;

    


    async function randSleepClick(selector) {
        await sleep(Math.ceil(Math.random() * 1000 + 700));
        await cursor.click(selector);
    }

    async function typing(selector, text) {
        await randSleepClick(selector);
        for (const char of text) {
            await page.keyboard.press(char, { delay: getRandomDelay(50, 150) }); // Random delay between 50ms and 150ms
        }
    } 
}




























function updateAccountInJSON(updatedAccount) {
  // Read the existing accounts from the accounts.json file
  let accounts;
  try {
      const data = fs.readFileSync('accounts.json', 'utf8');
      accounts = JSON.parse(data);
  } catch (error) {
      console.error('Error reading accounts.json:', error);
      return;
  }
  
  // Find and update the account with the same num as updatedAccount.num
  for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].num === updatedAccount.num) {
          accounts[i] = updatedAccount;  // Update the account in the array
          break;
      }
  }

  // Write the modified accounts array back to the accounts.json file
  try {
      fs.writeFileSync('accounts.json', JSON.stringify(accounts, null, 2), 'utf8');
  } catch (error) {
      console.error('Error writing to accounts.json:', error);
  }
}



















async function askQuestion(query) {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });
  return new Promise((resolve) => {
      rl.question(query, (answer) => {
          rl.close();
          resolve(answer);
      });
  });
}







function checkPhoneNumberAvailability(phoneNumber) {
    return new Promise((resolve) => {
      let accounts = [];
  
      try {
        const data = fs.readFileSync('accounts.json', 'utf8');
        accounts = JSON.parse(data);
      } catch (error) {
        console.error('Error reading accounts.json:', error);
        resolve(false);
      }
  
      const isPhoneNumberUsed = accounts.some((account) => account.phoneNumber === phoneNumber);
  
      if (isPhoneNumberUsed) {
        console.log('Phone number already exists.');
        resolve(false);
      }
  
      // Assuming any non-empty string is considered valid.
      if (phoneNumber.trim() === '') {
        console.log('Invalid phone number.');
        resolve(false);
      }
  
      resolve(phoneNumber);
    });
  }
  
  async function promptForPhoneNumber() {
    while (true) {
        const phoneNumber = await new Promise((resolve) => {
            rl.question('Enter a valid phone number: ', resolve);
        });

        const validPhoneNumber = await checkPhoneNumberAvailability(phoneNumber);

        if (validPhoneNumber) {
            console.log('Phone number is available:', validPhoneNumber);
            return validPhoneNumber; // You can safely return the value here
        }
    }
}












createAccount();
