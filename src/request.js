const fetch = require('node-fetch');
const qs = require('querystring');

// 下载二维码图片并转为base64图片
const qrdownload = async (qrurl = '') => {
  // qrurl 为native接口二维码图片地址 
  const rsp = await fetch(qrurl)
  const buffer = await rsp.arrayBuffer()
  // 转为base64
  return 'data:image/png;base64,' + Buffer.from(buffer).toString('base64')
}

const post = async (url, payload = {}) => {
  const req = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: qs.stringify(payload)
  })
  const rsp = await req.json()
  // 状态【0：成功；1：失败】
  if (rsp.code !== 0) {
    throw new Error((rsp.msg || 'internal error').toUpperCase())
  }
  return rsp
}

const get = async (url) => {
  const req = await fetch(url, {
    method: 'GET',
  })
  const rsp = await req.json()
  // 状态【0：成功；1：失败】
  if (rsp.code !== 0) {
    throw new Error((rsp.msg || 'internal error').toUpperCase())
  }
  return rsp
}

exports.qrdownload = qrdownload
exports.post = post
exports.get = get

exports.fetch = fetch
