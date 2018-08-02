const shopifyAPI = require('shopify-node-api');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

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

app.get('/', function(req,res) {
  return res.end(req.query.challenge);
});

app.post('/', (req, res) => {
  let id; // product id
  let title; // shipping title
  let tag1; // tag 1
  let tag2; // tag 2
  let tagsToAdd; // combined tags
  let addTag; // tag object
  console.log(`Order id: ${req.body.id}`);
  console.log(`Shipping Method: ${req.body.shipping_lines[0].title}`);
  title = req.body.shipping_lines[0].title.split(' '); // full shipping method split into an array
  for (let i = 0; i < title.length; i++) {
    if (title[i] === "Ground") {
      tag1 = "Ground";
    } else if (title[i] === "Expedited") {
      tag1 = "Expedited";
    } else if (title[i] === "In-Store") {
      tag1 = "In-Store";
    } else if (i === title.length - 1) { // if final object (date, zipcode, or overnight)
      if (title[i].length >= 7 && title[i] != "Overnight") { // if date
        tag2 = title[i].slice(0,-1); // remove parentheses at end of date
      } else if (title[i] === "Overnight") { // if overnight
        tagsToAdd = "Overnight";
      } else {
        tag2 = title[i]; // if zipcode
      }
    }
  }
  if (tagsToAdd == null) { // if tagsToAdd is still undefined
    tagsToAdd = tag1 + ", " + tag2;
  }
  id = req.body.id;
  addTag = {
    "order": {
      "tags": tagsToAdd // tag to be added to the orders
    }
  }
  // Puts "In-Store" tag on orders with "In-Store" shipping method
    Shopify.put('/admin/orders/' + id + '.json', addTag, function(err, data, headers) {
      if(err){} else {
        console.log("Tags Added: " + tagName + ", " + tagDate);
      }
    })
  res.sendStatus(200); // OK status for Shopify
});

app.listen(process.env.PORT || port, function() {
  console.log(`Listening for Shopify webhook event data on port ${port}.`);
});

// This is to prevent idling on Heroku which delays the time for order tagging and processing
setInterval(() => {
  http.get("http://order-shipping-tag.herokuapp.com");
  console.log("Pinged own server, staying alive!");
}, 300000); // pings every 5 minutes
