const shopifyAPI = require('shopify-node-api');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const Shopify = new shopifyAPI({
  shop: '530intern', // MYSHOP.myshopify.com
  shopify_api_key: '6b511e8273556c79b7fba29f16a9967d', // App API key
  access_token: 'b2e971a3abe0156e99a6c6b470a48bb7' // App API password
});

const port = 5555; // port 5555 for requests
let id; // product id
let title; // shipping title
let addTag = {
  "order": {
    "tags": "In-Store" // tag to be added to the orders
  }
}

app.get('/', function(req,res) {
  return res.end(req.query.challenge);
});

app.post('/', (req, res) => {
  console.log(`Order id: ${req.body.id}`);
  console.log(`Shipping Method: ${req.body.shipping_lines[0].title}`);
  title = req.body.shipping_lines[0].title;
  id = req.body.id;

  // Puts "In-Store" tag on orders with "In-Store" shipping method
  if (title === "In-Store") {
    Shopify.put('/admin/orders/' + id + '.json', addTag, function(err, data, headers) {
      if(err){} else {
        console.log("Tag Added: 'In-Store'");
      }
    })
  } else {
    console.log("Shipping method is not 'In-Store'. No action taken.")
  }
  res.sendStatus(200); // OK status for Shopify
});

app.listen(port, function() {
  console.log(`Listening for Shopify webhook event data on port ${port}.`);
});
