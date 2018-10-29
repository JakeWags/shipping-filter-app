const shopifyAPI = require('shopify-node-api');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const Shopify = new shopifyAPI({
  shop: '', // MYSHOP.myshopify.com **** HIDDEN FOR SECURITY PURPOSES ****
  shopify_api_key: '', // App API key **** HIDDEN FOR SECURITY PURPOSES ****
  access_token: '' // App API password **** HIDDEN FOR SECURITY PURPOSES ****
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
  stringTitle = req.body.shipping_lines[0].title;
  title = stringTitle.split(' (')[0];
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
