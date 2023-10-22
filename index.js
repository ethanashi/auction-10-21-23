const axios = require('axios');
const fs = require("fs");
const { parse } = require('path');
const { EmbedBuilder, Embed } = require('discord.js');
const { fork } = require('child_process');
let processes = new Map(); // To store the spawned processes
const puppeteer = require('puppeteer');




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}





const { Client, Intents } = require('discord.js');
const client = new Client({intents: 3276799});

const PREFIX = "!";  // Prefix for your bot command.

client.once('ready', async () => {
    purge();
    const channel = await client.channels.fetch("1156821176975380560");
    channel.send("Nellis Bot has restarted, no bids running currently!");
    console.log('Bot is online!');
});




const extractNumberFromUrl = (url) => {
    // Use a regular expression to match the number at the end of the URL
    const match = url.match(/\/(\d+)$/);
  
    if (match && match[1]) {
      // Return the matched number as an integer
      return parseInt(match[1], 10);
    } else {
      // Return null if no number is found
      return null;
    }
};







function getAccount(email) {
    let accounts;
    try {
        const data = fs.readFileSync('accounts.json', 'utf8');
        accounts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts.json:', error);
        return;
    }
  
    for(i = 0; i < accounts.length; i++) {
      if(accounts[i].email === email) {
          return accounts[i];
      }
    }
}


function amountWonAndRunningInTime(account) {
    let currentDate = new Date();
    let count = 0;

    for(let i = 0; i < account.won.length; i++) {
        if(!account.won[i][7]) {
            let nextDate = new Date(account.won[i][4]);
            nextDate.setDate(nextDate.getDate() + 7); // Add 7 days to the extracted date

            if(nextDate > currentDate) {
                count++;
            }
        }
    }
    console.log(`The count for account ${account} is ${count}.`)
    return count;
}
   
   
function findNextCookie() {
       let accounts;
     try {
         const data = fs.readFileSync('accounts.json', 'utf8');
         accounts = JSON.parse(data);
     } catch (error) {
         console.error('Error reading accounts.json:', error);
         return;
     }
   
     for(i = 0; i < accounts.length; i++) {
       let count = amountWonAndRunningInTime(accounts[i]);
       if((accounts[i].returns < 3) && (accounts[i].running.length + accounts[i].returns + count < 3)) {
           console.log("I chose account " + accounts[i].email);
           return accounts[i].cookies;
       }
     }
     return false;
}





async function sendMessage(channelId, embed) {
    const channel = await client.channels.fetch(channelId);
    channel.send({ embeds: [embed] });
}





async function getBuyNowId(productId, cookie) {
    try {
      const url = 'https://www.nellisauction.com/dashboard/cart';
      const response = await axios.get(url, {
        headers: {
          'Cookie': cookie
        }
      });
  
      const htmlContent = response.data;
  
      // Find the window.__remixContext variable in HTML content using a regular expression
      const regex = /window\.__remixContext\s*=\s*({[\s\S]+?});\s*<\/script>/;
      const match = htmlContent.match(regex);
  
      if (!match) {
        console.error('window.__remixContext not found');
        return;
      }
  
      const remixContextStr = match[1];
      const remixContext = JSON.parse(remixContextStr);
  
      // Navigate through the object structure to find the items array
      const loaderData = remixContext.state.loaderData['routes/dashboard.cart'].pickUpsByLocation;
  
      let buyNowId;
  
      for (const location in loaderData) {
        const items = loaderData[location].items;
        
        for(const item of items) {
          if (item.projectId == productId) {
            buyNowId = item.buynowId;
            break;
          }
        }
  
        if(buyNowId) return buyNowId; // Break the outer loop if buyNowId is found
      }
  
      return false;
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

function isBought(link) {
    let accounts;
    try {
        const data = fs.readFileSync('accounts.json', 'utf8');
        accounts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts.json:', error);
        return;
    }
    for(i = 0; i < accounts.length; i++) {
        for(j = 0; j < accounts[i].won.length; j++) {
            if(accounts[i].won[j][1] === link) {
                return [accounts[i].cookies, accounts[i].won[j]];
            }
        }
    }

    return false;
}


function convertToPuppeteerCookies(cookieString, domain) {
    return cookieString.split('; ').map(cookie => {
        const [name, value] = cookie.split('=');
        return { name, value, domain, path: '/' }; // Default path is '/'
    });
}




function removeWonItemByEmailAndProductId(account, productId) {

    let removed = false;
    for (let index = 0; index < account.won.length; index++) {
        const wonArray = account.won[index];
        
        // Check if any item in the wonArray has the given productId
        const hasProduct = wonArray.some(item => item.bidState && item.bidState.projectId === productId);
        
        if (hasProduct) {
            // Remove the entire wonArray from the account.won
            account.won.splice(index, 1);
            removed = true;
            break;
        }
    }

    if (removed) {
        console.log(`Array containing item with productId: ${productId} removed successfully from account: ${account.email}`);
    } else {
        console.log(`Item with productId: ${productId} not found in account: ${account.email}`);
    }
}































async function returnItem(link) {
    const item = isBought(link);

    let productId = "";
  
    if (item !== false) {
      productId =  extractNumberFromUrl(link);

      let num = await getBuyNowId(productId, item[0]);

      console.log(num);
      
      const refererUrl = 'https://www.nellisauction.com/cancel-item/' + num;
  

  
      // Make a POST request with withCredentials set to true and the payload data
      try {

        const doubleClickWithDelay = async (selector, delay) => {
            try {
                const element = await page.$(selector);
                const box = await element.boundingBox();
                
                const x = box.x + box.width / 2;
                const y = box.y + box.height / 2;
                
                // Perform the first click
                await page.mouse.click(x, y);
                
                // Wait for the specified delay before the second click
                await sleep(delay);
                
                // Perform the second click
                await page.mouse.click(x, y);
                
                // Perform any additional tasks if needed
                
            } catch (error) {
                console.error('Error performing double click with delay:', error);
            }
        };


        const browser = await puppeteer.launch({ headless: true , args: ['--window-size=1920,1080']});
         // Set to true to run browser in background
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Set cookies

        const domain = 'www.nellisauction.com'; // Domain without the protocol
        const puppeteerCookies = convertToPuppeteerCookies(item[0], domain);
        await page.setCookie(...puppeteerCookies);
        
        // Navigate to the specified URL
        await page.goto(refererUrl);
        
        // Perform any additional tasks if needed, like taking screenshots or extracting data
        await sleep(5000);
        await page.keyboard.press("PageDown");
        await sleep(1000);
        await page.click('body > div.__layout-wrapper > div.__layout-main > div.__cancellation-container > div.__cancellation-form-container.__cancellation-form-green-border.__cancellation-form-green-bg > div > div > div.__cancellation-proceed-container > div > button > span:nth-child(2)');

        await sleep(2000);
        await doubleClickWithDelay("#cancel-item > div > div.__validated-select-input-container > div > button", 400);

        await sleep(2000);
        await page.click('#cancel-item > div > div.__cancel-item-form-button-container > button');
        await sleep(10000);
        await browser.close();


        let account = getAccount(item[1][2]);

        account.returns = account.returns + 1;

        removeWonItemByEmailAndProductId(account, productId);

        updateAccountInJSON(account);
        
        
  
        let embed = new EmbedBuilder()
        .setTitle("Returned")
        .setColor("#FFA500")
        .addFields({name: "Name", value: `[${item[1][0].title}](${item[1][1]})`})
        .addFields({name: "Account Name", value: account.firstName})
        .addFields({name: "Account Email", value: account.email})
        .addFields({name: "Returns Left", value: (3 - account.returns).toString()})
        .setThumbnail(item[1][0].item.photos[0].url)
        .setTimestamp();
              
        await sendMessage('1156668875430166618', embed);
      } catch (error) {
        console.error('Error:', error);
      }


      









    } else {
      return false;
    }
  }




















  

function purge() {
    let accounts;
    try {
        const data = fs.readFileSync('accounts.json', 'utf8');
        accounts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts.json:', error);
        return;
    }
    for(i = 0; i < accounts.length; i++) {
        accounts[i].running = [];
        updateAccountInJSON(accounts[i]);
    }

}

async function getBought() {
    let accounts;
    let listArr = [];
    try {
        const data = fs.readFileSync('accounts.json', 'utf8');
        accounts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts.json:', error);
        return;
    }

    // Get the current date and time.
    let currentDate = new Date();

    for(let i = 0; i < accounts.length; i++) {
        accounts[i].won.forEach(run => {
            let runDate = new Date(run[4]); // Convert the string to a Date object
            // Compare the runDate with the current date and push it to listArr only if it is in the past.
            if(runDate > currentDate) {
                listArr.push([run[0].title, run[1], run[2], run[5], runDate, run[7]]);
            }
        });
    }

    if(listArr.length > 0) {
        let embed = new EmbedBuilder();
        let i = 0;
        
        listArr.forEach(run => {
            // Format the date to only include month, day, hour, and minute.
            let formattedDate = `${run[4].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${run[4].toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
            if(!run[5]) {
                i++;
                embed.addFields({
                    name: `Email: ${run[2]}, Time: ${formattedDate}`, // Display the formatted date here.
                    value: `[${run[0]}](${run[1]})`
                });
            }
        });
        
        embed.setColor("#FFFF00");
        embed.setTimestamp();
        
        // Assuming sendMessage is a predefined function in your environment.
        if(i > 0) {
            sendMessage("1156821176975380560", embed);
            return true;
        }
    }   

    return false;
}




async function spawnTask(link, bid, profitMargins, cookie) {
    const task = fork('./task.js', [link, bid, profitMargins, cookie]);
    processes.set(link, {bid, profitMargins, cookie ,task}); // Use link as a unique identifier for each task


    task.on('error', (err) => {
        console.error('Error occurred in child process:', err);
      });
    
    
    if (task && task.stdout) {
        task.stdout.on('data', (data) => {
            console.log(`[Child ${link}] ${data}`);
        });
    } else {
        console.error('Failed to create child process or access stdout');
    }
    



    task.on('message', async (message) => {
        console.log(message);
        if (message.type === 'sendDiscordMessage') {
            await sendMessage(message.channelId, message.embed);
        }
    });

    task.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
      });
    
  }

  


client.on('messageCreate', async message => {
    if (message.author.bot) return;

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'nellis':
            if (args.length < 4) {
                message.channel.send('Please provide all the required parameters: link, bid, profitMargins');
                return;
            }

            let [link, bid, profitMargins] = args.slice(1);
            console.log(link, bid, profitMargins);
            
            try {
                let cookie = findNextCookie();
                if(cookie  !== false) {
                    await spawnTask(link, parseFloat(bid), parseFloat(profitMargins), cookie);
                } 
                else {
                    terminateTask(link);
                    message.channel.send('Generate accounts, out of buying slots to use!');
                }
                
            }
            catch(err) {
                console.log(err);
                message.channel.send("An error occured when processing this request.");
            }
            break;
        
            case 'help':
                message.channel.send(
                    '```asciidoc\n' +
                    '= Command List =\n' +
                    '\n' +
                    '!nellis [Link] [Ebay Price] [Expected Profit Margins] :: Starts a bid on the item with the given Nellis Auction link, price, and profit margins.\n' +
                    'Example: !nellis https://nellis.com 100 5\n' +
                    '\n' +
                    '!delete [Link] :: Stops the bid associated with the provided Nellis Auction link.\n' +
                    'Example: !delete https://nellis.com\n' +
                    '\n' +
                    '!list :: Displays all the currently running bids.\n' +
                    '\n' +
                    '!return [Link] :: Returns the item associated with the provided Nellis Auction link if it is in the cart.\n' +
                    'Example: !return https://nellis.com\n' +
                    '\n' +
                    '!buy [Link] :: Deletes item from cart (shown by using \"!cart\") because you bought it already (used for organization). THIS FUNCTION DOESN\'T ACTUALLY BUY THE ITEM, YOU MUST DO THAT MANUALLY!\n' +
                    'Example: !buy https://nellis.com\n' +
                    '\n' +
                    '!unbuy [Link] :: Adds item back to cart (shown by using \"!cart\") because you used \"!buy\" wrong (used for organization). THIS FUNCTION DOESN"T ACTUALLY RETURN ITEMS, ONLY "!return" DOES!\n' +
                    'Example: !unbuy https://nellis.com\n' +
                    '\n' +
                    '!cart :: Displays all items in your cart that need to be bought or returned, along with the remaining time to act.\n' +
                    '\n' +
                    '!amount :: Displays the number of bids left.\n' + // Added line for the new 'amount' command
                    '\n' +
                    '!help :: Displays this help message detailing command usage.\n' +
                    '```'
                );
                break;

        case 'delete':
            let [website] = args.slice(1);
            let result = terminateTask(website);
            if(result) {
                message.channel.send('Stopped Running!');
            }
            else {
                message.channel.send('Task was not running.');
            }
            break;


        case 'list':
            let listResult = await getList();
            if(!listResult) {
                message.channel.send("There are No Proccesses Running!")
            }
            break;
        
        case 'return': 
            let [webS] = args.slice(1);
            let ret = await returnItem(webS);
            if(!ret) {
                message.channel.send("The item was never added to the cart!")
            }
            break;

        case 'buy':
            let [webSs] = args.slice(1);
            let lystResult = buy(webSs);
            if(!lystResult) {
                message.channel.send("This item has already been \"bought\" or the item was never won to begin with. Use \"!cart\" command to see the items in the cart.");
            }
            else {
                message.channel.send("Item has been bought!");
            }
            break;

        case 'cart':
            let lResult = await getBought();
            if(!lResult) {
                message.channel.send("Step up your game, Nothing is in your cart!");
            }
            break;

        case 'amount':
            let numOfBids = bidsLeft();
            message.channel.send("You have " + numOfBids + " bids left!");
            break;
        
        case 'unbuy':
            let [webSss] = args.slice(1);
            let lestResult = unbuy(webSss);
            if(!lestResult) {
                message.channel.send("This item is already in the cart or the item was never won to begin with. Use \"!cart\" command to see the items in the cart.");
            }
            else {
                message.channel.send("Item has been put back in cart!");
            }
            break;
    
    }
});

async function getWon() {
    let accounts;
    let listArr = [];
    try {
        const data = fs.readFileSync('accounts.json', 'utf8');
        accounts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts.json:', error);
        return;
    }
    for(i = 0; i < accounts.length; i++) {
        accounts[i].won.forEach(run => {
            listArr.push([run[0].title, run[1], run[2], run[5]]);
        });
    }

    if(listArr.length > 0) {
        let embed = new EmbedBuilder();

        listArr.forEach(run => {
            embed.addFields({
                name: `Email: ${run[2]}, Price: ${run[3].toString()}`, // This will make run[0] a hyperlink pointing to run[1] URL
                value: `[${run[0]}](${run[1]})`
            });
    
        });
    
        embed.setColor("#FFFF00");
        embed.setTimestamp();
        
        sendMessage("1156821176975380560", embed);
        return true;
    }   

    return false;
}








function terminateTask(link) {
    // Check if a process with the given link exists
    const processInfo = processes.get(link);
    
    if (processInfo) {
        // If the process exists, kill it
        processInfo.task.kill();

        // Remove the process from the processes map
        processes.delete(link);

        // Optionally delete the running task from the accounts.json
        deleteRunning(processInfo.cookie, link);

        return true;
    } else {
        // If there's no process with the given link, just return false
        return false;
    }
}











async function getList() {
    let accounts;
    let listArr = [];
    try {
        const data = fs.readFileSync('accounts.json', 'utf8');
        accounts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading accounts.json:', error);
        return;
    }
    for(i = 0; i < accounts.length; i++) {
        accounts[i].running.forEach(run => {
            listArr.push([run[0].title, run[1], run[2], run[3]]);
        });
    }

    if(listArr.length > 0) {
        let embed = new EmbedBuilder();

        listArr.forEach(run => {
            embed.addFields({
                name: `Email: ${run[2]}, (Site Bid/Total Bid) Price: ${(Math.floor(parseInt(run[3], 10)/1.2486)).toString()}/${run[3]}`, // This will make run[0] a hyperlink pointing to run[1] URL
                value: `[${run[0]}](${run[1]})`
            });
    
        });
    
        embed.setTimestamp();
        
        sendMessage("1156821176975380560", embed);
        return true;
    }   

    return false;
}








function deleteRunning(cookie, link) {
    let accounts;
  try {
      const data = fs.readFileSync('accounts.json', 'utf8');
      accounts = JSON.parse(data);
  } catch (error) {
      console.error('Error reading accounts.json:', error);
      return;
  }

  for(i = 0; i < accounts.length; i++) {
    if(accounts[i].cookies === cookie) {
        for(j = 0; j < accounts[i].running.length; j++) {
            if(accounts[i].running[j][1] === link) {
                accounts[i].running.splice(j, 1);
                updateAccountInJSON(accounts[i]);
                return true;
            }
        }
       
    }
  }
  return false;
}

function buy(link) {
    let accounts;
  try {
      const data = fs.readFileSync('accounts.json', 'utf8');
      accounts = JSON.parse(data);
  } catch (error) {
      console.error('Error reading accounts.json:', error);
      return;
  }

  for(i = 0; i < accounts.length; i++) {
    for(j = 0; j < accounts[i].won.length; j++) {
        if((accounts[i].won[j][1] === link) && (accounts[i].won[j][7] !== true)) {
            accounts[i].won[j][7] = true;
            updateAccountInJSON(accounts[i]);
            return true;
        } 
    }

  }
  return false;
}


function unbuy(link) {
    let accounts;
  try {
      const data = fs.readFileSync('accounts.json', 'utf8');
      accounts = JSON.parse(data);
  } catch (error) {
      console.error('Error reading accounts.json:', error);
      return;
  }

  for(i = 0; i < accounts.length; i++) {
    for(j = 0; j < accounts[i].won.length; j++) {
        if((accounts[i].won[j][1] === link) && (accounts[i].won[j][7] !== false)) {
            accounts[i].won[j][7] = false;
            updateAccountInJSON(accounts[i]);
            return true;
        } 
    }

  }
  return false;
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
  

  function bidsLeft() {
    let accounts;
    let numOfBids = 0;
       try {
           const data = fs.readFileSync('accounts.json', 'utf8');
           accounts = JSON.parse(data);
       } catch (error) {
           console.error('Error reading accounts.json:', error);
           return;
       }
       for(i = 0; i < accounts.length; i++) {
           let count = amountWonAndRunningInTime(accounts[i]);
           numOfBids = numOfBids + (3 - (accounts[i].running.length + accounts[i].returns + count));
       }
   
       return numOfBids;
   }

















client.login('MTE0ODAxNDE4NjY3NzQyMDE0NA.GN5OGx.x5EGzt0QdlIBM6fo9m3vAFpMygns8EAQuwVKjI');