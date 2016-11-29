const express = require('express'),
      bodyParser = require('body-parser'),
      app = module.exports = express(),
      ebs = require('../lib');

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('home');
});

app.post('/', function(req, res){
  var merchant2 = new ebs.Merchant({
    key : process.env.EBS_KEY,
    account_id : req.body.account_id,
    mode : req.body.mode
  });
  var user2 = new ebs.User({
    name : req.body.name,
    email : req.body.email,
    phone : req.body.phone
  });
  var billingAddress2 = new ebs.Address({
    address : req.body.address,
    city : req.body.city,
    state : req.body.state,
    country : req.body.country,
    postal_code : req.body.postal_code
  });
  var shippingAddress2 = new ebs.Address({
    name : req.body.ship_name,
    address : req.body.ship_address,
    city : req.body.ship_city,
    state : req.body.ship_state,
    country : req.body.ship_country,
    postal_code : req.body.ship_postal_code,
    phone : req.body.ship_phone
  });
  user2.setBillingAddress(billingAddress2);
  user2.setShippingAddress(shippingAddress2);

  var transaction2 = new ebs.Transaction({
    reference_no : req.body.reference_no,
    amount : req.body.amount,
    description: req.body.description,
    currency: req.body.currency,
    display_currency: req.body.display_currency,
    display_currency_rates: req.body.display_currency_rates,
    return_url : req.body.return_url
  });

  const signedTxn2 = merchant2.signTransaction(user2, transaction2)
  merchant2.initiatePayment(signedTxn2, function(error, body){
    res.send(body);
  })
});

app.get('/pay', function(req, res){
  var merchant = new ebs.Merchant({
    key : process.env.EBS_KEY,
    account_id : process.env.EBS_ACCOUNT_ID,
    mode : ebs.CONFIG.MODE.SANDBOX
  });
  var user = new ebs.User({
    name : 'Sobin',
    email : 'sobingt@gmail.com',
    phone : '9969614407'
  });
  var billingAddress = new ebs.Address({
    address : 'Address',
    city : 'Mumbai',
    state : 'Maharashtra',
    country : 'IND',
    postal_code : '400103'
  });
  var shippingAddress = new ebs.Address({
    name : 'Sobin',
    address : 'Address',
    city : 'Mumbai',
    state : 'Maharashtra',
    country : 'IND',
    postal_code : '400103',
    phone : '8097415085'
  });
  user.setBillingAddress(billingAddress);
  user.setShippingAddress(shippingAddress);

  var transaction = new ebs.Transaction({
    reference_no : '3423423sds',
    amount : '1.00',
    description: 'Test Order Description',
    currency: 'INR',
    display_currency: 'GBP',
    display_currency_rates: '1',
    return_url : 'http://localhost:8000/'
  });
  const signedTxn = merchant.signTransaction(user, transaction)
  merchant.initiatePayment(signedTxn, function(error, body){
    res.send(body);
  })
});

if(!module.parent){
  app.listen(process.env.PORT || 8000, function(){
    console.log('Server running at 8000');
  });
}