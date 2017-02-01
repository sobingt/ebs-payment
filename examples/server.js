const express = require('express'),
      bodyParser = require('body-parser'),
      app = module.exports = express(),
      ebs = require('../lib/');

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
// Initialize merchant 
var merchant = new ebs.Merchant({
    key : process.env.EBS_KEY,
    account_id : process.env.EBS_ACCOUNT_ID
  });

app.get('/', function(req, res){
  res.render('home');
});

app.post('/', function(req, res){
  if(req.body.ba_bankaccountcode != '' && req.body.split_amount != '')
  {
    var amt =0;
    for(i in req.body.split_amount)
    {
      amt+=parseInt(req.body.split_amount[i]);
    }
    if(amt<parseInt(req.body.amount))
    {
       return res.render('home', {message:'Invalid split amount. The total of all spilt amounts to be equal to or greater than amount'});
      ;
    }
  }
  // Initialize merchant
  merchant = new ebs.Merchant({
    key : process.env.EBS_KEY,
    account_id : req.body.account_id,
    mode : req.body.mode,
    algo : req.body.algo,
    page_id : req.body.page_id,
    channel : req.body.channel
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
    return_url : req.body.return_url,
    split_profile_code : req.body.split_profile_code,
    payby_date : req.body.payby_date,
    payby_time : req.body.payby_time,
    ba_bankaccountcode : req.body.ba_bankaccountcode,
    split_amount : req.body.split_amount
  });

  if(req.body.payment_mode!="")
  {
    if(req.body.payment_mode == ebs.CONFIG.PAYMENT_MODE.CREDIT_CARD ||
       req.body.payment_mode == ebs.CONFIG.PAYMENT_MODE.DEBIT_CARD)
      var paymentMethod = new ebs.Instrument({
        payment_mode : req.body.payment_mode,
        card_brand : req.body.card_brand,
        name_on_card : req.body.name_on_card,
        card_number : req.body.card_number,
        card_cvv : req.body.card_cvv,
        card_expiry : req.body.card_expiry
      });
    else if(req.body.payment_mode == ebs.CONFIG.PAYMENT_MODE.NET_BANKING)
      var paymentMethod = new ebs.Instrument({
        payment_mode : req.body.payment_mode,
        payment_option : req.body.payment_option
      });
    else 
      var paymentMethod = new ebs.Instrument({
        payment_mode : req.body.payment_mode
      });
    
    var signedTxn = merchant.signTransaction(user, transaction, paymentMethod)
    }
  else {
    // Merchant signing on transaction
    var signedTxn = merchant.signTransaction(user, transaction)
    }

  // Initiate Payment
  merchant.initiatePayment(signedTxn, function(error, body){
    res.send(body);
  })

});

//Get response
app.get('/response', function(req, res){
  var response = req.query;
  response.status = merchant.verifySignature(response);
  delete response.merge;
  res.render('response',{ data : response});
});

//POST response
app.post('/response', function(req, res){
  var response = req.body;
  response.status = merchant.verifySignature(response);
  delete response.merge;
  res.render('response',{ data : response});
});
if(!module.parent){
  app.listen(process.env.PORT || 8000, function(){
    console.log('Server running at 8000');
  });
}