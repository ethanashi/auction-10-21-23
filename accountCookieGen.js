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
      this.won = 0;
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





function findAccountWithoutCookies() {
    try {
      // Read the JSON file and parse it into an array of accounts
      const accounts = JSON.parse(fs.readFileSync('accounts.json', 'utf-8'));
  
      // Iterate through the accounts
      for (const account of accounts) {
        if (!account.cookies) {
          // If the account doesn't have cookies, return it
          return account;
        }
      }
  
      // If all accounts have cookies, return false
      return false;
    } catch (error) {
      console.error('Error reading or parsing the JSON file:', error);
      return false;
    }
  }



































async function createAccount() {
    

    while(findAccountWithoutCookies()) {
        let account = findAccountWithoutCookies();
        console.log(account);


        const browser = await puppeteer.launch({ headless: false , args: ['--window-size=1280,720']});
        const page = await browser.newPage();
        const cursor = createCursor(page);

        // Setting a custom user agent
        await page.setViewport({ width: 1280, height: 720 });

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto("https://www.nellisauction.com/login");
        await sleep(4000);
        await typing("#email", account.email);
        await typing("#password", account.password);
        await randSleepClick("#login > button");
        await sleep(4000);
        const cookies = await page.cookies();
        const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    
        account.cookies = cookieString;

        // Update the accounts.json file with the modified account
        updateAccountInJSON(account);
        await browser.close();

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








createAccount();
