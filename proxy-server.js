const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const appid = queryObject.appid;
  const device_id = queryObject.device_id;
  const devkey = queryObject.devkey;

  // Construct the URL for the request to the other server
  const targetUrl = `https://gcdsdk.appsflyer.com/install_data/v4.0/${appid}?devkey=${devkey}&device_id=${device_id}`;

  // Send the request to the other server
  https.get(targetUrl, (response) => {
    let responseData = '';

    // Accumulate the response data
    response.on('data', (chunk) => {
      responseData += chunk;
    });

    // Once the response is complete, send it back to the client
    response.on('end', () => {
      res.setHeader('Content-Type', 'application/json');

      // Set the Access-Control-Allow-Origin header to allow cross-origin requests
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.end(responseData);
    });
  }).on('error', (error) => {
    console.error(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  });

});

server.listen(3000, () => {
  console.log('Proxy server is running on port 3000');
});

