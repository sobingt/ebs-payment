const config = require('./config'),
      pug = require('pug'),
      crypto = require('crypto'),
      path = require('path'),
      formTemplate = path.resolve(__dirname,'form.pug');
/**
 * Adding a prototype to object for merge two object. 
 * assign function can be used insert.
 * @param   {Object} obj 
 */
Object.prototype.merge = function (obj) {
  for (var attrname in obj) {this[attrname] = obj[attrname]; }
}

/**
 * Template generator for customer or user object 
 * @param   {Object} user 
 */
function User(user){
  this.name =user.name;
  this.email = user.email;
  this.phone = user.phone;
}

/**
 * Template generator for address object 
 * @param   {Object} address
 */
function Address(address){
  this.name = address.name || '';
  this.address = address.address;
  this.city = address.city;
  this.state = address.state;
  this.country = address.country;
  this.postal_code = address.postal_code;
  this.phone = address.phone || '';
}

/**
 * Template generator for merchant object 
 * @param   {Object} merchant 
 */
function Merchant(merchant){
  this.key = merchant.key;
  this.account_id = merchant.account_id;
  this.mode = merchant.mode;
  this.page_id = merchant.page_id || '';
}

/**
 * Template generator for payment instrument like
 * credit card, debit, paypal and so on
 * @param   {Object} payment
 */
function Instrument(payment){
  this.payment_mode = payment.payment_mode || '';
  this.bank_code = payment.bank_code || '';
  this.emil = payment.emi || '';
  this.card_brand = payment.card_brand;
  this.name_on_card = payment.name_on_card;
  this.card_number = payment.card_number;
  this.card_cvv = payment.card_cvv;
  this.card_expiry = payment.card_expiry;
}

/**
 * Template generator for transaction object 
 * @param   {Object} transaction 
 */
function Transaction(transaction){
  this.reference_no = transaction.reference_no;
  this.amount = transaction.amount;
  this.description = transaction.description;
  this.currency = transaction.currency;
  this.display_currency = transaction.display_currency || transaction.currency;
  this.display_currency_rates = transaction.display_currency_rates || '1';
  this.return_url = transaction.return_url;
}

/**
 * Adding a prototype to user object to attach a
 * billing address 
 * @param   {Object} address - address object  
 */
User.prototype.setBillingAddress = function(address){
  this.address = address.address;
  this.city = address.city;
  this.state = address.state;
  this.country = address.country;
  this.postal_code = address.postal_code;
}

/**
 * Adding a prototype to user object to attach a
 * shipping address 
 * @param   {Object} address - address object  
 */
User.prototype.setShippingAddress = function(address){
  this.ship_name = address.name || this.name; //optional
  this.ship_address = address.address;
  this.ship_city = address.city;
  this.ship_state = address.state;
  this.ship_country = address.country;
  this.ship_postal_code = address.postal_code;
  this.ship_phone = address.telephone || this.phone; //optional
}

/**
 * Adding a prototype to merchant object to sign
 * transaction of a user 
 * @param   {Object} user        - user object.
 * @param   {Object} transaction - transaction object.  
 * @param   {Object} instrument  - payment instrument object. optional.
 * @returns {Object} data        - signed transaction object.
 */
Merchant.prototype.signTransaction = function(user, transaction, instrument){

  var data = {},
      key = "",
      error = "",
      preHash = "";
  data.mode = this.mode;
  data.page_id = this.page_id;
  data.account_id = this.account_id;
  if(!instrument)
    data.channel = 0;
  else if(instrument.payment_mode == config.PAYMENT_MODE.CREDIT_CARD &&
    instrument.payment_mode == config.PAYMENT_MODE.DEBIT_CARD &&
    instrument.payment_mode == config.PAYMENT_MODE.CREDIT_CARD_EMI) {
    data.channel = 2;
    data.merge(instrument)
  }
  else {
    data.channel = 0;
  }

  if (!user && !transaction)
    return "User and Transaction Required";
  else {
    data.merge(user);
    data.merge(transaction);
  }
  
  for( i in config.HASHSEQUENCE)
  {
    key = config.HASHSEQUENCE[i];

    if(typeof data[key] !== 'undefined' &&  data[key] !== null &&  data[key] !== '' )
    {
      preHash += '|' + data[key];
    }
  }
  preHash = this.key + preHash;
  data.secure_hash = crypto.createHash('md5').update(preHash).digest('hex').toUpperCase();
  return data;
};

/**
 * Initiate payment to EBS by creating form html data
 * with merchant signed data
 * @param   {Object} signedTxn  - Signed tranaction created by @signTransaction
 * @param   {Function} callback - Callback function to pass form data
 */
Merchant.prototype.initiatePayment = function(signedTxn, callback) {
  var error;
  if(!signedTxn && !signedTxn.secure_hash)
    return callback("Merchant signed data required.");
  return callback(error, pug.renderFile(formTemplate,signedTxn))
}

module.exports = {
  User       : User,
  Address    : Address,
  Merchant   : Merchant,
  Instrument : Instrument,
  Transaction: Transaction,
  CONFIG     : config
};