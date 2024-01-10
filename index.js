/* ========================================================================= */
// Modules
const axios = require('axios');
const fs = require('fs');
const CryptoJS = require('crypto-js');

/* ========================================================================= */
// Constants and config
const config = require('./config.json');
const URL = `https://www.okx.com`;

/* ========================================================================= */
// MAIN
(async () => {

  let object = {};
  object.url = getUrl(`account_balances`);
  object.method = 'GET';
  // object.data = {ccy: 'USDT'};
  let sendRequest = await oxkRequest(object);
  // console.log("sendRequest result:", sendRequest);

  let data = sendRequest.data;
  // console.log("sendRequest data:", data);
  console.log("Balances: ");
  if (data?.data) {
    for (let asset of data.data) {
      console.log(asset.ccy, asset.availBal, asset.bal);
    }
  };

  // Считываем файл
  let file = fs.readFileSync('withdrawl.txt', 'utf-8');
  // console.log(file);
  let i = 1;
  for await (let asset of file.split("\n")) {
    console.log(`${i} из ${file.split("\n").length}`);
    i++;
    asset = asset.replaceAll("\r", "");
    let [address, token, chain, amount] = asset.split("\t");

    amount = amount.replaceAll(',', '.');
    // console.log(JSON.stringify(address));
    // console.log(JSON.stringify(token));
    // console.log(JSON.stringify(chain));
    // console.log(JSON.stringify(amount));
    console.log(address, token, chain, amount);
    let object = {};
    object.url = getUrl(`asset_currencies`);
    object.url += `?ccy=${token}`
    object.method = 'GET';
    let request = await oxkRequest(object);
    // console.log(request.data);
    chain = `${token}-${chain}`;
    let currencies = request.data.data;
    // console.log(currencies.map(cc=>cc.chain));
    // console.log(currencies);
    // for (let cur of currencies) {
    //   console.log(JSON.stringify(cur.name))
    //   console.log(JSON.stringify(cur.chain))
    //   console.log(JSON.stringify(chain))
    //   console.log(cur.chain === chain)
    // }
    currencies = currencies.filter(cur => cur.chain === chain);
    // console.log(currencies);
    // return;
    if (currencies.length === 0) {
      console.log("Нет такой сети для вывода");
      continue;
    }

    // console.log(currencies);

    object.url = getUrl(`asset_withdrawal`);
    object.url += `?ccy=${token}`;
    object.url += `&amt=${amount}`;
    object.url += `&dest=4`;
    object.url += `&toAddr=${address}`;
    object.url += `&fee=${currencies[0].minFee}`;
    object.url += `&chain=${chain}`;
    object.url = encodeURI(object.url)
    // console.log(object.url)
    // console.log(chain);

    object.method = 'POST';
    object.data = {
      ccy: token,
      amt: amount,
      dest: 4,
      toAddr: address,
      fee: currencies[0].minFee,
      chain: chain
    };

    // return;
    request = await oxkRequest(object);
    console.log('Msg:', request?.data?.msg)
    await pause(config.PAUSE_BETWEEN_WITHDRAWL_SEC * 1000);
  }
  process.exit();

})();

/* ========================================================================= */
// get url
function getUrl(type) {
  const URLS = {};
  URLS.account_balances = `/api/v5/asset/balances`;
  URLS.asset_withdrawal = `/api/v5/asset/withdrawal`;
  URLS.asset_currencies = `/api/v5/asset/currencies`;
  return (URLS[type]) ? URLS[type] : false;
}

/* ========================================================================= */
// generate sign for request
function generateSign(object) {
  object.timestamp = `${new Date(Date.now()).toISOString()}`;
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(object.timestamp + object.method + `${object.url}`
    + ((object.data) ? JSON.stringify(object.data) : ''),
      config.secretkey)
  )
}

/* ========================================================================= */
// oxkRequest
async function oxkRequest(object) {

  let sign = generateSign(object);
  
  await pause(config.API_PAUSE);

  return axios({
    method: object.method,
    url: `${URL}${object.url}`,
    data: object.data,
    headers: {
      'Content-Type': `application/json`,
      "OK-ACCESS-KEY": config.apikey,
      "OK-ACCESS-SIGN": sign,
      "OK-ACCESS-TIMESTAMP": object.timestamp,
      "OK-ACCESS-PASSPHRASE": config.passphrase
    }
  });
}

/* ========================================================================= */
// pause
async function pause(ms) {
  return await new Promise(r=>setTimeout(r, ms));
} 