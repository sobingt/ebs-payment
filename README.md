# EBS payment node SDK

## Usage

```js
var ebs = require("ebs");
```

## Table of Contents

- [1. Create EBS merchant object](#1-Create-EBS-merchant-object)
- [2. Create EBS user object](#2-Create-EBS-user-object)
- [3. Create EBS address objects](#3-Create-EBS-address-objects)
- [4. Attach EBS addresses to user](#4-Attach-EBS-addresses-to-user)
- [5. Create EBS transaction object](#5-Create-EBS-transaction-object)
- [6. Get transaction signed by merchant](#6-Get-transaction-signed-by-merchant)
- [7 Initiate payment](#7-Initiate-payment)
  - [7.1 Initiate payment with all options](#71-Initiate-payment-with-all-options)
  - [7.2 Initiate payment with a saved card](#72-Initiate-payment-with-a-saved-card)
    - [7.2.1 Create a payment instructment object](#7.2.1-Create-a-payment-instructment-object)
    - [7.2.2 Initiate payment with signed transaction with saved card](#7.2.2-Initiate-payment-with-signed-transaction-with-saved-card)
  - [7.3 Initiate payment with a perfered netbanking](#7.3-Initiate-payment-with-a-perfered-netbanking)
    - [7.3.1 Create a payment instructment object](#7.3.1-Create-a-payment-instructment-object)
    - [7.3.2 Initiate payment with signed transaction with saved card](#7.3.2-Initiate-payment-with-signed-transaction-with-saved-card)

### 1. Create EBS merchant object

```js
// Initialize merchant
var merchant = new ebs.Merchant({
  key : MERCHANT_KEY,
  account_id : MERCHANT_ACCOUNT_ID,
  mode : ebs.CONFIG.MODE.SANDBOX // or ebs.CONFIG.MODE.PRODUCTION
})
```
### 2. Create EBS user object

```js
// Create user
var user = new ebs.User({
  name : 'customer_name',
  email : 'customer@email.com',
  phone : '1234567890'
})
```
### 3. Create EBS address objects

```js
// Create billing address
var billingAddress = new ebs.Address({
  address : 'Address',
  city : 'Mumbai',
  state : 'Maharashtra',
  country : 'IND',
  postal_code : '400103'
})

//Create shipping address
var shippingAddress = new ebs.Address({
  name : 'Sobin',
  address : 'Address',
  city : 'Mumbai',
  state : 'Maharashtra',
  country : 'IND',
  postal_code : '400103',
  phone : '8097415085'
})
```
### 4. Attach EBS addresses to user

```js
// Seting billing address and shipping address to user
user.setBillingAddress(billingAddress)
user.setShippingAddress(shippingAddress)

//or in case both address are the same
user.setBillingAddress(billingAddress)
user.setShippingAddress(billingAddress)
```

### 5. Create EBS tranasction object

```js
var transaction = new ebs.Transaction({
  reference_no : 'long_transaction_id',
  amount : '1.00',
  description: 'Test Order Description',
  currency: 'INR',
  display_currency: 'GBP',
  display_currency_rates: '1',
  return_url : 'http://yourdomain.com/'
})
```
### 6. Get transaction signed by merchant

```js
//Merchant signing on transaction
const signedTxn = merchant.signTransaction(user, transaction)
```

### 7.1 Initiate payment
#### 7.1 Initiate payment with all options

```js
//Redirecting to EBS payment portal
app.get('/pay', function(req, res){
    ...
    ...
  const signedTxn = merchant.signTransaction(user, transaction)
  merchant.initiatePayment(signedTxn, function(error, body){
    res.send(body); 
    // body contain form element which loads the EBS portal based on your configuration.
  })
  ...
  ...
});

```
#### 7.2 Initiate payment with a saved card

##### 7.2.1 Create a payment instructment object
```js
//Creating Instructment of Netbanking
var savedCard = new ebs.Instrument({
  payment_mode : ebs.CONFIG.PAYMENT_MODE.CREDIT_CARD,
  card_brand   : ebs.CONFIG.CARD_BRAND.VISA,
  name_on_card : 'Test',
  card_number  : '4111111111111111',
  card_cvv     : '123',
  card_expiry  : '0716'
});

```
##### 7.2.2 Initiate Payment with signed transaction with saved card
```js
app.get('/pay', function(req, res){
    ...
    ...
  const signedTxn = merchant.signTransaction(user, transaction, savedCard)
  merchant.initiatePayment(signedTxn, function(error, body){
    res.send(body); 
    // body contain form element which loads the EBS portal based on your configuration.
  })
  ...
  ...
});

```
#### 7.3 Initiate payment with a perfered netbanking

##### 7.3.1 Create a payment instructment object
```js
//Creating Instructment of Saved Card
var preferedBank = new ebs.Instrument({
    payment_mode : ebs.CONFIG.PAYMENT_MODE.NET_BANKING,
    bank_code    : ebs.CONFIG.BANK_CODE.KOTAK_BANK
});

```
##### 7.3.2 Initiate Payment with signed transaction with saved card
```js
app.get('/pay', function(req, res){
    ...
    ...
  const signedTxn = merchant.signTransaction(user, transaction, preferedBank)
  merchant.initiatePayment(signedTxn, function(error, body){
    res.send(body); 
    // body contain form element which loads the EBS portal based on your configuration.
  })
  ...
  ...
});

```