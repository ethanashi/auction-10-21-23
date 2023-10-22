const axios = require('axios');

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

// Replace with the actual productId and cookie you are using
const productId = '17873197';
const cookie = '_hp2_id.1530949394=%7B%22userId%22%3A%224573947786276139%22%2C%22pageviewId%22%3A%22273064179230156%22%2C%22sessionId%22%3A%224781525525064900%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%224.0%22%7D; __adroll_fpc=7f3c6085b77597fd7b316f0876544e64-1695694568366; __ar_v4=%7CQSXTKNUYXNCWNFQAP2WPHK%3A20230926%3A1%7CXCWDW22TAVFONKHMZRMNJ5%3A20230926%3A1%7CEQNY52S66BH4VH6D3CIXQE%3A20230926%3A1; ap3c=IGUSPurO34oKqD8DAGUSPuqRBy2F8k1oZ30SLELHdcP0GSGZmw; _ga_Z14LK6XFVL=GS1.1.1695694567.1.1.1695694588.39.0.0; _ttp=-ikVGXUG8ZTp_Pl9bHkoExARicA; _tt_enable_cookie=1; _fbp=fb.1.1695694568084.119828667; __navigation=eyJhdXRoUmVkaXJlY3QiOiIvIn0%3D.%2F%2FDloNKWkzcXKnazbtrGHl0vHeuuY%2FiSIu%2Bz%2FuNkiNM; _rdt_uuid=1695694568067.41625de3-0542-40a8-a1f9-540dc4b9c96d; _ga=GA1.1.198708744.1695694568; clientside-cookie=4e97807010212fb3458c41de9c1ed5a13f3f741cc02178d65eea0c9c7f43c0cd8d16af96a9155f395b20c5c9cf0aa759538586c1ffce1f1c1cc511be0b98c10e26f7d771add41c97473b05e36adffe3abb4969a3e96f33de87d52eb10925b36ecc746c0b8d8f2fc68f077165b3a095ee2818fbe00c0546bfdd5f00dd9998052c24ef8e4a0c509d6c2d4daa0dcc4bc034ce7034a36bf3ab69680a99; _hp2_ses_props.1530949394=%7B%22ts%22%3A1695694567709%2C%22d%22%3A%22www.nellisauction.com%22%2C%22h%22%3A%22%2Flogin%22%7D; _gcl_au=1.1.213757455.1695694568; __session=eyJ1c2VySWQiOjQ4Njc3NSwidXNlckF1dGhUb2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNk5EZzJOemMxTENKcFlYUWlPakUyT1RVMk9UUTFPRGNzSW1WNGNDSTZNVFk1T0RJNE5qVTROMzAuSktQV3RoYkpEc3NPZXFDVE0zQ09OVmUwTW5BdlF4Uk1VUWRXM00xYlRFMCJ9.AYbBRTTbG8epnkHFYq%2FbjihjDiJmNYx25gKdQG%2BuGHw; ap3pages=1; _gid=GA1.2.884065898.1695694568; _gat=1; __public=e30%3D.GcnILYfJMKY278FQnUClucHACfVuNPNrwhUHVleAYNQ';
getBuyNowId(productId, cookie);
