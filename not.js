const axios = require('axios');

const url = 'https://accounts.nike.com/credential_lookup/v1';

const headers = {
  'content-type': 'application/json',
 'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'max-age=0',
  'x-kpsdk-v': 'j-0.0.0',
  'origin': 'https://accounts.nike.com',
  'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  'referer': 'https://accounts.nike.com/lookup?client_id=18fe0b45ebb820a67f3f039edea18e5f&redirect_uri=snkrs://oidc/authorize_code/v1&response_type=code&scope=openid%20profile%20email%20phone%20flow%20offline_access%20nike.digital&code_challenge=AyGIfvVFcqG61jzwElVo2fv6g1R_fWXnadkH0WsJlZI&code_challenge_method=S256&native=true',
  'x-nike-ux-id': 'com.nike.unite',
  'cookie': '_abck=C28EEAE7D69A15B4EF904EDC19A048BF~-1~YAAQhyk0FyWj03yKAQAA63OehgpIindsV48MqQXQ3hUy8uhovEBYjurOSeuQssmD8J6LsBqUBtl4UeXMwkVvhqsNBMHAXRGHY7fuAxsB8KLwAI3Kn+KnYcA+qkHm4WeTqRpF+Pxi3CgzssjC6Bz5A5xhiykI81gMYCrhYSXZAGLKc1V/8DjZcaZzzM2n5zTO7UWiwMpAgj4W366jkkRRgSOVshZq59xhAxUkxUlupDeQeJMTNaNlTgmCD3jSJ9H3UN9QHqBPKpkAMTGcZCqjCCkjhpSOpAZ1rIqk7FIuLBBAAgTw9Wf9b2GPvPv6XRpN3nlPJoHLdKU5KJlT7Ydn+ZlLy+Tukex1rm71mpIinr9v1tDwlu7HnHx+ADbNd09c7zO3qgmwSVOSfsjX4kpXJTxiF0z/MUiNJIAerp4yB7c8TmjRr3lrG4m9F/KTlfpkzX3PAyuWZRjlbxTeQPkqzdZVyYlJXo5yVvDtpN7qKfAN94CLPTuv2taKJsKYPU4yutPzPUvTtiWpQLw0ircwtVBbRsRM~-1~-1~-1',
};

const data = {
  credential: 'jamallung@gmail.com',
  client_id: '18fe0b45ebb820a67f3f039edea18e5f'
};

axios.post(url, data, { headers })
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
