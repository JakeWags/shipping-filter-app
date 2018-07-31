const shopifyAPI = require('shopify-node-api');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const Shopify = new shopifyAPI({
  shop: 'jtc-staging', // MYSHOP.myshopify.com
  shopify_api_key: '149c0fcdb13d84baa1023a285cd9d4b4', // App API key
  access_token: 'a08e70b521773024447029c256f92bbf' // App API password
});

const port = 5555; // port 5555 for requests
let id; // product id
let title; // shipping title


app.get('/', function(req,res) {
  return res.end(req.query.challenge);
});

app.post('/', (req, res) => {
  console.log(`Order id: ${req.body.id}`);
  console.log(`Shipping Method: ${req.body.shipping_lines[0].title}`);
  title = req.body.shipping_lines[0].title;
  id = req.body.id;
  let addTag = {
    "order": {
      "tags": title // tag to be added to the orders
    }
  }
  // Puts "In-Store" tag on orders with "In-Store" shipping method
    Shopify.put('/admin/orders/' + id + '.json', addTag, function(err, data, headers) {
      if(err){} else {
        console.log("Tag Added: " + title);
      }
    })
  res.sendStatus(200); // OK status for Shopify
});

app.listen(process.env.PORT || port, function() {
  console.log(`Listening for Shopify webhook event data on port ${port}.`);
});
