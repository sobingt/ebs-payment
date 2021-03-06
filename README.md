# EBS payment node SDK

## Usage

```js
var ebs = require("ebsjs");
```

## Table of Contents

- [1. Create EBS merchant object](#1-create-ebs-merchant-object)
- [2. Create EBS user object](#2-create-ebs-user-object)
- [3. Create EBS address objects](#3-create-ebs-address-objects)
- [4. Attach EBS addresses to user](#4-attach-ebs-addresses-to-user)
- [5. Create EBS transaction object](#5-create-ebs-transaction-object)
- [6. Get transaction signed by merchant](#6-get-transaction-signed-by-merchant)
- [7 Initiate payment](#7-initiate-payment)
  - [7.1 Initiate payment with all options](#71-initiate-payment-with-all-options)
  - [7.2 Initiate payment with a stored card](#72-initiate-payment-with-a-stored-card)
    - [7.2.1 Create a payment instructment object](#721-create-a-payment-instructment-object)
    - [7.2.2 Initiate payment with signed transaction with stored card](#7.2.2-initiate-payment-with-signed-transaction-with-stored-card)
  - [7.3 Initiate payment with a perfered netbanking](#73-initiate-payment-with-a-perfered-netbanking)
    - [7.3.1 Create a payment instructment object](#731-create-a-payment-instructment-object)
    - [7.3.2 Initiate payment with signed transaction with stored card](#732-initiate-payment-with-signed-transaction-with-stored-card)
- [8. Using example](#8-using-example)

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
#### 7.2 Initiate payment with a stored card

##### 7.2.1 Create a payment instructment object
```js
//Creating Instructment of Netbanking
var storedCard = new ebs.Instrument({
  payment_mode : ebs.CONFIG.PAYMENT_MODE.CREDIT_CARD,
  card_brand   : ebs.CONFIG.CARD_BRAND.VISA,
  name_on_card : 'Test',
  card_number  : '4111111111111111',
  card_cvv     : '123',
  card_expiry  : '0716'
});

```
##### 7.2.2 Initiate Payment with signed transaction with stored card
```js
app.get('/pay', function(req, res){
    ...
    ...
  const signedTxn = merchant.signTransaction(user, transaction, storedCard)
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
//Creating Instructment of Stored Card
var preferedBank = new ebs.Instrument({
    payment_mode   : ebs.CONFIG.PAYMENT_MODE.NET_BANKING,
    payment_option : 1007 //HDFC PAYMENT OPTION
});

```
##### 7.3.2 Initiate Payment with signed transaction with stored card
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

### 8. Using example

```sh
cd examples
npm install
export EBS_KEY=<EBS_MERCHANT_KEY> EBS_ACCOUNT_ID=<EBS_MERCHANT_ACCOUNT_ID>
npm start

go to localhost:8000

```