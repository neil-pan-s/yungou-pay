const { WxPay, AliPay } = require('./index.js');

(async () => {
  WxPay.config({
    mid: "xxxxxxxxxx",
    secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
  })

  const rsp = await WxPay.nativePay({
    body: 'test',
    total_fee: '0.01',
    out_trade_no: '952717317289884539',
    // notify_url: 'xxxxxxxx',
  })
  console.log('native pay rsp = ', JSON.stringify(rsp))

  const rsp2 = await WxPay.queryOrder({ out_trade_no: '952717317289884539' })
  console.log('query order rsp = ', JSON.stringify(rsp2))

  // AliPay 同上
})();
