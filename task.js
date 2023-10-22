const axios = require('axios');
const fs = require("fs");
const { parse } = require('path');
const { EmbedBuilder, Embed } = require('discord.js');
const { error } = require('console');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
  













async function getProductData(url, cookie) {

    let site = new URL(url);    



    let paths = site.pathname.split("/");
    let productId = paths[paths.length - 1];

    
    const data = {
        productIds: [productId],
        action: "get-products"
    };
    const headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "text/plain;charset=UTF-8",
        "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": cookie,
        "Referer": site.href,
        "Referrer-Policy": "strict-origin-when-cross-origin"
    };
    
    let response = await axios.post('https://www.nellisauction.com/api/projects', data, {headers: headers});
    let dataObject = JSON.stringify(response.data);




    return [dataObject, productId];
}

































async function bidOnProduct(cookie, link, bid) {
    let site = new URL(link);    
    let paths = site.pathname.split("/");
    let productID = paths[paths.length - 1];

    const headers = {
        'authority': 'www.nellisauction.com',
        'cookie': cookie,
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'text/plain;charset=UTF-8',
        'origin': 'https://www.nellisauction.com',
        'referer': link,
        'sec-ch-ua': 'Chromium;v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': 'Windows',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
    };

    const url = "https://www.nellisauction.com/api/bids";

    const body = {
        productId: productID,
        bid: bid
    };

    try {
        // Make the GET request with withCredentials: true
        const firstResponse = await axios.get(link, { headers, withCredentials: true });
        await sleep(1000);

        // Make the POST request with withCredentials: true
        const response = await axios.post(url, JSON.stringify(body), { headers, withCredentials: true });
        console.log(response.data);
        let json = JSON.stringify(response.data);
        return json;
    } catch (error) {
        console.log(error);
        try {
            if(error.response.data.message.includes("Your bid could not be accepted as entered. Bid amount is too low")) {
                return {message: "done"};
            }
        }
        catch (error) {}
        
        return { message: "" };
    }
}


function sendMessage(channelId, embed) {
    console.log(channelId, embed);
    process.send({ type: 'sendDiscordMessage', channelId: channelId, embed: embed});
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

async function ebay(link, bid, profitMargins, shipping, cookie) {
    // Your ebay function logic here
    console.log(profitMargins);
    let equation = Math.floor((bid * .8675) - .3 - profitMargins - shipping);
    if(profitMargins === "0") {
        equation = Math.floor(bid);
        console.log("NO PROFIT BID!!!");
    }
    console.log(equation + " is what you will pay bidding, " + Math.floor(equation / (1.15 + (1.15*0.086))) + " including taxes on the site.");

    // Placeholder function for bidder, ensure it's defined appropriately
    try {
        await bidder(link, equation, cookie,profitMargins);
       
    }
    catch(err) {
        console.log("Bidder errored out lol.");
        console.log(err);
        let result = deleteRunning(cookie, link);
        if(result) {
            console.log("Process " + link + " deleted due to error.");
        }
    }
    
}








function addRunning(cookie, arr) {
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
        accounts[i].running.push(arr);
        updateAccountInJSON(accounts[i]);
        return true;
      }
    
    }
    return false;
}












async function bidder(link, maxBid, cookie,profitMargins) {
        let product = await getProductData(link, cookie);
        let parsedData = JSON.parse(product[0]);
        let productInfo = parsedData[0];

        console.log(profitMargins);

        let account = getAccount(cookie);

        let arr = [productInfo, link, account.email, maxBid, account.phoneNumber];
        let x = addRunning(cookie, arr);
        profitMargins = parseInt(profitMargins, 10);
        console.log(productInfo.wprice, profitMargins);


        let embed = new EmbedBuilder()
            .setColor("#11ee30")
            .setThumbnail(productInfo.item.photos[0].url)
            .setTitle(productInfo.title)
            .setURL(link)
            .addFields({name: 'Your Bid Price', value: Math.floor(maxBid / (1.15 + (1.15*0.086)  )  ).toString()})
            .addFields({name: 'Current Bid Price', value: productInfo.wprice.toString()})
            .addFields({name: 'Account Credentials', value: "⬇️⬇️⬇️"})
            .addFields(
                { name: 'Email', value: account.email, inline: false },
                { name: 'Password', value: account.password, inline: false },
                { name: 'Account Num', value: account.num.toString(), inline: false },
                { name: 'Account Name', value: account.firstName, inline: false },
                {name: 'Account Phone #', value: account.phoneNumber.toString(), inline: false }
            )
            .setTimestamp();


         sendMessage("1156821176975380560", embed);
        
        const targetDate = new Date(productInfo.dateClosed.value);
        const now = new Date();
        
        // Calculate the time difference (subtracting 7 seconds)
        const delay = targetDate - now - 4200;  // 7000 milliseconds is 7 seconds
        
        if (delay > 0 && (parseInt(productInfo.wprice, 10) < Math.floor(maxBid / (1.15 + (1.15*0.086))))) {
            // Calculate the hours, minutes, and seconds
            let totalSeconds = Math.floor(delay / 1000);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;
        
            // Log the exact waiting time
            console.log(`Waiting ${hours} hours, ${minutes} minutes, and ${seconds} seconds before running the function.`);
        
            setTimeout(async () => {
               await runBid(link,maxBid, cookie,profitMargins);
            }, delay);


        } else {
            let reason = "";
            if(delay > 0) {
                reason = "Bidding Already Ended";
            }
            else {
                reason = "Max Bid Too Low";
            }
            console.log('The target time has already passed.');
            let embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setThumbnail(productInfo.item.photos[0].url)
            .setTitle(productInfo.title)
            .setURL(link)
            .addFields({name: 'Your Bid Price', value: Math.floor(maxBid / (1.15 + (1.15*0.086)  )  ).toString()})
            .addFields({name: 'Current Bid Price', value: productInfo.wprice.toString()})
            .addFields({name: 'Account Credentials', value: "⬇️⬇️⬇️"})
            .addFields(
                { name: 'Email', value: account.email, inline: false },
                { name: 'Password', value: account.password, inline: false },
                { name: 'Account Num', value: account.num.toString(), inline: false },
                { name: 'Account Name', value: account.firstName, inline: false },
                {name: 'Account Phone #', value: account.phoneNumber.toString(), inline: false },
                {name: "Reason", value: reason.toString()}
            )
            .setTimestamp();



            sendMessage("1156662531692183592", embed);
            throw error("Good Job.");
        }
        
} 




function getAccount(cookie) {
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
          return accounts[i];
      }
    }
}





async function runBid(link, maxBid, cookie,profitMargins) {

    let product = await getProductData(link, cookie);
    let parsedData = JSON.parse(product[0]);
    let productInfo = parsedData[0];

    profitMargins = parseInt(profitMargins, 10);
    console.log(productInfo.wprice, profitMargins);
    let targetTime = new Date(productInfo.dateClosed.value);


    while(new Date() < targetTime) {


        let nextBid = productInfo.bidState.userNextMinBid;

        if((productInfo.bidState.isActiveUserWinning === false) && (nextBid <= maxBid)) {
            console.log(`Bidding the max price of ${Math.floor(maxBid / (1.15 + (1.15*0.086)))} dollars on ${productInfo.title}.`)
            let bid = await bidOnProduct(cookie, link, Math.floor(maxBid / (1.15 + (1.15*0.086)  )  ));
            
            try {
                if(bid.message === "") {
                    console.log(`There was an error when bidding ${Math.floor(maxBid / (1.15 + (1.15*0.086)))} on ${productInfo.title}.`)
                    continue;
                }
                else if (bid.message === "done") {
                    break;
                }
            }catch(err) {}
            
            console.log("We bid the max price bid " + Math.floor(maxBid / (1.15 + (1.15*0.086)  )  ) + " dollars on " + productInfo.title + ".")
            break;



        }

        else if(nextBid > maxBid) {
            console.log(`The max bid has been reached. The current price of ${productInfo} is ${productInfo.bidState.userNextMinBid}.`);
            break;
        }
        else {
            await sleep(250);
        }



        product = await getProductData(link, cookie);
        parsedData = JSON.parse(product[0]);
        productInfo = parsedData[0];

    }

    console.log("At Timer");


    await sleep(600000);

    console.log("Finished Timer.");
    product = await getProductData(link, cookie);
    parsedData = JSON.parse(product[0]);
    productInfo = parsedData[0];


    if(productInfo.bidState.isActiveUserWinning) {
        let account = getAccount(cookie);

        let embed = new EmbedBuilder()
            .setColor("#11ee30")
            .setThumbnail(productInfo.item.photos[0].url)
            .setTitle(productInfo.title)
            .setURL(link)
            .addFields({name: 'Bid Total', value: (Math.ceil((productInfo.wprice * 1.15) * 1.086)).toString()})
            .addFields({name: 'Sell For', value: (Math.ceil(((productInfo.wprice * 1.15 * 1.086) + profitMargins + 1.3) / 0.8675)).toString()})
            .addFields({name: 'Account Credentials', value: "⬇️⬇️⬇️"})
            .addFields(
                { name: 'Email', value: account.email, inline: false },
                { name: 'Password', value: account.password, inline: false },
                { name: 'Account Num', value: account.num.toString(), inline: false },
                { name: 'Account Name', value: account.firstName, inline: false },
                {name: 'Account Phone #', value: account.phoneNumber.toString(), inline: false }
            )
            .setTimestamp();


        sendMessage("1156659822184374273", embed);
        await sleep(5000);
        
        let targetTime = new Date(productInfo.dateClosed.value);
        targetTime.setDate(targetTime.getDate() + 7);

        let won = [productInfo, link, account.email, (Math.ceil((productInfo.wprice * 1.15) * 1.086)).toString(), targetTime, account.phoneNumber, (Math.ceil(((productInfo.wprice * 1.15 * 1.086) + profitMargins + 1.3) / 0.8675)).toString(), false];
        account.won.push(won);

        updateAccountInJSON(account);

        let result = deleteRunning(cookie, link);
        if(result) {
            console.log("Process " + link + " deleted.");
        }
        else {
            console.log("Didn't work bro.");
        }

    }

    else {
        console.log("didn't get :(");

        let account = getAccount(cookie);

        let embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setThumbnail(productInfo.item.photos[0].url)
            .setTitle(productInfo.title)
            .setURL(link)
            .addFields({name: 'Current Bid Price', value: productInfo.wprice.toString()})
            .addFields({name: 'Account Credentials', value: "⬇️⬇️⬇️"})
            .addFields(
                { name: 'Email', value: account.email, inline: false },
                { name: 'Password', value: account.password, inline: false },
                { name: 'Account Num', value: account.num.toString(), inline: false },
                { name: 'Account Name', value: account.firstName, inline: false },
                {name: 'Account Phone #', value: account.phoneNumber.toString(), inline: false }
            )
            .setTimestamp();


        sendMessage("1156662531692183592", embed);
        await sleep(5000);

        let result = deleteRunning(cookie, link);
        if(result) {
            console.log("Process " + link + " deleted.");
        }
        else {
            console.log("Didn't work bro.");
        }
    }



}


(async() => {
    const link = process.argv[2];
    const bid = process.argv[3];
    const profitMargins = process.argv[4];
    const cookie = process.argv[5];
    await ebay(link, bid, profitMargins, 0, cookie);
})();