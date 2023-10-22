const axios = require('axios');

const url = 'https://accounts.nike.com/authorize/v1?redirect_uri=snkrs://oidc/authorize_code/v1&scope=openid%20profile%20email%20phone%20flow%20offline_access%20nike.digital&response_type=code&code_challenge=AyGIfvVFcqG61jzwElVo2fv6g1R_fWXnadkH0WsJlZI&code_challenge_method=S256';

const headers = {
  'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
};

axios.get(url, { headers })
  .then(response => {
    console.log('Response:', response.status);
  })
  .catch(error => {
    console.error('Error:', error);
  });

  



