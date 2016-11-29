const express = require('express'),
      bodyParser = require('body-parser'),
      app = module.exports = express(),
      ebs = require('ebsjs');

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('home');
});

app.post('/', function(req, res){
  // Initialize merchant
  var merchant = new ebs.Merchant({
    key : process.env.EBS_KEY,
    account_id : req.body.account_id,
    mode : req.body.mode
  });
  // Create user
  var user = new ebs.User({
    name : req.body.name,
    email : req.body.email,
    phone : req.body.phone
  });
  // Create billing address
  var billingAddress = new ebs.Address({
    address : req.body.address,
    city : req.body.city,
    state : req.body.state,
    country : req.body.country,
    postal_code : req.body.postal_code
  });
  //Create shipping address
  var shippingAddress = new ebs.Address({
    name : req.body.ship_name,
    address : req.body.ship_address,
    city : req.body.ship_city,
    state : req.body.ship_state,
    country : req.body.ship_country,
    postal_code : req.body.ship_postal_code,
    phone : req.body.ship_phone
  });
  // Seting billing address and shipping address to user
  user.setBillingAddress(billingAddress);
  user.setShippingAddress(shippingAddress);

  // Creating a transaction
  var transaction = new ebs.Transaction({
    reference_no : req.body.reference_no,
    amount : req.body.amount,
    description: req.body.description,
    currency: req.body.currency,
    display_currency: req.body.display_currency,
    display_currency_rates: req.body.display_currency_rates,
    return_url : req.body.return_url
  });

  // Merchant signing on transaction
  const signedTxn = merchant.signTransaction(user, transaction)
    // Initiate Payment
  merchant.initiatePayment(signedTxn, function(error, body){
    res.send(body);
  })

  

});

if(!module.parent){
  app.listen(process.env.PORT || 8000, function(){
    console.log('Server running at 8000');
  });
}