const BASEURL = 'https://secure.ebs.in';
const ENDPOINTS = { 
  CREATE_PAYMENT : '/pg/ma/payment/request'
}

var MODE = {
  'SANDBOX' : 'TEST',
  'PRODUCTION' : 'LIVE'
}

const PAYMENT_MODE = {
  'ALL' : '',
  'CREDIT_CARD' : '1',
  'DEBIT_CARD' : '2',
  'NET_BANKING' : '3',
  'CASH_CARD' : '4',
  'CREDIT_CARD_EMI' : '5',
  'CREDIT_CARD_POINT' : '6',
  'PAYPAL' : '7'
}

const CARD_BRAND = {
  'ALL' : '',
  'VISA' : '1',
  'MASTER_CARD' : '2',
  'MAESTRO' : '3',
  'DINERS_CLUB' : '4',
  'AMERICAN_EXPRESS' : '5'
}

const HASHSEQUENCE = [
  'account_id',
  'address',
  'amount',
  'bank_code',
  'ba_account_code',
  'card_brand',
  'card_cvv',
  'card_expiry',
  'card_number',
  'channel',
  'city',
  'country',
  'currency',
  'description',
  'display_currency',
  'display_currency_rates',
  'email',
  'emi',
  'mode',
  'name',
  'name_on_card',
  'page_id',
  'payby_date',
  'payby_time',
  'payment_mode',
  'payment_option',
  'phone',
  'postal_code',
  'reference_no',
  'return_url',
  'ship_address',
  'ship_city',
  'ship_country',
  'ship_name',
  'ship_phone',
  'ship_postal_code',
  'ship_state',
  'split_profile_code',
  'state'
];

const POSTHASHSEQUENCE = [
  'Amount',
  'BillingAddress',
  'BillingCity',
  'BillingCountry',
  'BillingEmail',
  'BillingName',
  'BillingPhone',
  'BillingPostalCode',
  'BillingState',
  'DateCreated',
  'DeliveryAddress',
  'DeliveryCity',
  'DeliveryCountry',
  'DeliveryName',
  'DeliveryPhone',
  'DeliveryPostalCode',
  'DeliveryState',
  'Description',
  'IsFlagged',
  'MerchantRefNo',
  'Mode',
  'PaymentID',
  'PaymentMethod',
  'RequestID',
  'ResponseCode',
  'ResponseMessage',
  'TransactionID',
  'VirtualAccountNumber'
];

module.exports = {
  BASEURL : BASEURL,
  ENDPOINTS : ENDPOINTS,
  MODE : MODE,
  PAYMENT_MODE : PAYMENT_MODE,
  CARD_BRAND : CARD_BRAND,
  HASHSEQUENCE : HASHSEQUENCE,
  POSTHASHSEQUENCE : POSTHASHSEQUENCE
}