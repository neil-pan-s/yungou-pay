const md5 = require('md5');
const QRCode = require('qrcode');

// 二维码内容并转为base64图片
const qrbase64 = async (qrdata = '') => {
  const opts = {
    errorCorrectionLevel: 'H',
    margin: 1,
  };

  // qrdata 为native接口二维码内容 (eg. weixin://wxpay/bizpayurl?pr=jmmfbyN)
  return QRCode.toDataURL(qrdata, opts)
}

// 所有字段 字典排序后计算md5 (注意：只有必传参数才参与签名！！！)
const sign = (params = {}, key = '') => {
  if (!key) {
    throw new Error(`app key is required`)
  }

  const keys = Object.keys(params).sort()
  let s = ''
  for (let k of keys) {
    s += k + '=' + params[k] + '&'
  }
  s += 'key=' + key
  return md5(s).toString().toUpperCase()
}

// 必填参数检查
const checkRequiredParams = (params) => {
  for (let key in params) {
    // 必填参数允许数字0
    if (params[key] === 0) { continue }
    if (!params[key]) {
      throw new Error(`param ${key} is required`)
    }
  }
}

exports.md5 = md5
exports.sign = sign
exports.checkRequiredParams = checkRequiredParams
exports.qrbase64 = qrbase64
