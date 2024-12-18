const qs = require("querystring");
const request = require("../request.js");
const utils = require("../utils.js");

const API_URL = "https://api.pay.yungouos.com";

const sign = (params) => utils.sign(params, secret);
const checkRequiredParams = (params) => utils.checkRequiredParams(params);

let mid, secret;

/**
 * 商户信息配置
 *
 * 登录yungouos.com-》支付宝-》商户管理 支付宝商户号 获取
 *
 * @param {*} params.mid 商户号
 * @param {*} params.secret 商户密钥
 */
const config = (params = {}) => {
  mid = params.mid;
  secret = params.secret;
};

/**
 * 条码支付
 *
 * 用户打开支付宝出示付款码，商家通过扫码枪、扫码盒子等设备主动扫描用户付款码完成扣款。
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/codePay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.auth_code 扫码支付授权码，设备读取用户支付宝中的条码或者二维码信息
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.hbfq_num 花呗分期期数。只支持3、6、12（仅限渠道商户使用）
 * @param {*} params.hbfq_percent 花呗分期商户承担手续费比例。只支持0、100（仅限渠道商户使用）
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回二维码支付链接地址或原生支付链接
 */
const codePay = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/codePay";

  // 必填参数
  const payload = {
    out_trade_no: params.out_trade_no,
    total_fee: params.total_fee,
    mch_id: params.mch_id || mid,
    body: params.body,
    auth_code: params.auth_code,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  // 花呗分期业务
  const hbfqBiz = {};
  params.hbfq_num && (hbfqBiz.hbfq_num = params.hbfq_num);
  params.hbfq_percent && (hbfqBiz.hbfq_percent = params.hbfq_percent);
  if (Object.keys(hbfqBiz).length) {
    payload.hb_fq = JSON.stringify(hbfqBiz);
  }

  return request.post(url, payload);
};

/**
 * 扫码支付
 *
 * 同步发起扫码支付 返回原生支付链接或二维码连接地址，根据type类型决定
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/nativePay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.type 返回类型（1、返回支付宝原生的支付连接需要自行生成二维码；2、直接返回付款二维码地址，页面上展示即可。不填默认1）
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.hbfq_num 花呗分期期数。只支持3、6、12（仅限渠道商户使用）
 * @param {*} params.hbfq_percent 花呗分期商户承担手续费比例。只支持0、100（仅限渠道商户使用）
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回Promise化结果，需要自行处理返回结果
 */
const nativePay = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/nativePay";

  // 必填参数
  const payload = {
    out_trade_no: params.out_trade_no,
    total_fee: params.total_fee,
    mch_id: params.mch_id || mid,
    body: params.body,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  // 二维码返回类型（1、返回微信原生的支付连接需要自行生成二维码；2、直接返回付款二维码地址，页面上展示即可。不填默认1 ）
  payload.type = params.type || "1";

  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  // 花呗分期业务
  const hbfqBiz = {};
  params.hbfq_num && (hbfqBiz.hbfq_num = params.hbfq_num);
  params.hbfq_percent && (hbfqBiz.hbfq_percent = params.hbfq_percent);
  if (Object.keys(hbfqBiz).length) {
    payload.hb_fq = JSON.stringify(hbfqBiz);
  }

  const rsp = await request.post(url, payload);

  // 二维码返回类型为文本链接时 自动生成base64二维码
  if (rsp.data && payload.type === "1") {
    rsp.qrcode = await utils.qrbase64(rsp.data);
  }

  return rsp;
};

/**
 * WAP支付
 *
 * 返回支付宝WAP支付连接，重定向到该地址即可。安装了支付宝APP将自动唤起支付宝APP进行支付
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/wapPay
 * @param {*} params -请求参数
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.hbfq_num 花呗分期期数。只支持3、6、12（仅限渠道商户使用）
 * @param {*} params.hbfq_percent 花呗分期商户承担手续费比例。只支持0、100（仅限渠道商户使用）
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回支付宝WAP支付连接
 */
const wapPay = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/wapPay";

  // 必填参数
  const payload = {
    out_trade_no: params.out_trade_no,
    total_fee: params.total_fee,
    mch_id: params.mch_id || mid,
    body: params.body,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  // 花呗分期业务
  const hbfqBiz = {};
  params.hbfq_num && (hbfqBiz.hbfq_num = params.hbfq_num);
  params.hbfq_percent && (hbfqBiz.hbfq_percent = params.hbfq_percent);
  if (Object.keys(hbfqBiz).length) {
    payload.hb_fq = JSON.stringify(hbfqBiz);
  }

  return request.post(url, payload);
};

/**
 * JS支付
 *
 * JS支付，适用于支付宝网页内打开的H5应用使用支付宝的JSSDK发起支付
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/jsPay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝商户号 获取
 * @param {*} params.buyer_id 买家的支付宝唯一用户号（2088开头的16位纯数字）
 * @param {*} params.body 商品描述
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.hbfq_num 花呗分期期数。只支持3、6、12（仅限渠道商户使用）
 * @param {*} params.hbfq_percent 花呗分期商户承担手续费比例。只支持0、100（仅限渠道商户使用）
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回支付宝的JSSDK所需的参数
 */
const jsPay = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/jsPay";

  // 必填参数
  const payload = {
    out_trade_no: params.out_trade_no,
    total_fee: params.total_fee,
    mch_id: params.mch_id || mid,
    body: params.body,
    buyer_id: params.buyer_id,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  // 花呗分期业务
  const hbfqBiz = {};
  params.hbfq_num && (hbfqBiz.hbfq_num = params.hbfq_num);
  params.hbfq_percent && (hbfqBiz.hbfq_percent = params.hbfq_percent);
  if (Object.keys(hbfqBiz).length) {
    payload.hb_fq = JSON.stringify(hbfqBiz);
  }

  return request.post(url, payload);
};

/**
 * H5支付
 *
 * 支付宝H5手机网站接口，可自动打开支付宝APP支付。和WAP接口不同的是，H5可以传递return_url也就是支付后或取消支付可以自动跳回网站
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/mobilePay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.return_url 同步回调地址，用户支付成功后或取消支付都会跳转回到该地址
 * @param {*} params.hbfq_num 花呗分期期数。只支持3、6、12（仅限渠道商户使用）
 * @param {*} params.hbfq_percent 花呗分期商户承担手续费比例。只支持0、100（仅限渠道商户使用）
 * @param {*} params.payKey 支付密钥 登录yungouos.com-》支付宝-》商户管理 支付密钥 获取
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回支付宝H5支付的form表单
 */
const h5Pay = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/mobilePay";

  // 必填参数
  const payload = {
    out_trade_no: params.out_trade_no,
    total_fee: params.total_fee,
    mch_id: params.mch_id || mid,
    body: params.body,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  // 花呗分期业务
  const hbfqBiz = {};
  params.hbfq_num && (hbfqBiz.hbfq_num = params.hbfq_num);
  params.hbfq_percent && (hbfqBiz.hbfq_percent = params.hbfq_percent);
  if (Object.keys(hbfqBiz).length) {
    payload.hb_fq = JSON.stringify(hbfqBiz);
  }

  return request.post(url, payload);
};

/**
 * APP支付
 *
 * 支付宝原生APP支付，返回APP端拉起支付宝所需的参数
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/appPay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.hbfq_num 花呗分期期数。只支持3、6、12（仅限渠道商户使用）
 * @param {*} params.hbfq_percent 花呗分期商户承担手续费比例。只支持0、100（仅限渠道商户使用）
 * @param {*} params.payKey 支付密钥 登录yungouos.com-》支付宝-》商户管理 支付密钥 获取
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回APP端拉起支付宝所需的参数
 */
const appPay = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/appPay";

  // 必填参数
  const payload = {
    out_trade_no: params.out_trade_no,
    total_fee: params.total_fee,
    mch_id: params.mch_id || mid,
    body: params.body,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  // 花呗分期业务
  const hbfqBiz = {};
  params.hbfq_num && (hbfqBiz.hbfq_num = params.hbfq_num);
  params.hbfq_percent && (hbfqBiz.hbfq_percent = params.hbfq_percent);
  if (Object.keys(hbfqBiz).length) {
    payload.hb_fq = JSON.stringify(hbfqBiz);
  }

  return request.post(url, payload);
};

/**
 * 电脑网站支付
 *
 * 支付宝电脑网站支付，适合PC端使用，返回PC端跳转表单字符串和跳转url
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/webPay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.return_url 同步回调地址，用户支付成功后或取消支付都会跳转回到该地址
 * @param {*} params.hbfq_num 花呗分期期数。只支持3、6、12（仅限渠道商户使用）
 * @param {*} params.hbfq_percent 花呗分期商户承担手续费比例。只支持0、100（仅限渠道商户使用）
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回PC端跳转表单字符串和跳转url
 */
const webPay = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/webPay";

  // 必填参数
  const payload = {
    out_trade_no: params.out_trade_no,
    total_fee: params.total_fee,
    mch_id: params.mch_id || mid,
    body: params.body,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  // 花呗分期业务
  const hbfqBiz = {};
  params.hbfq_num && (hbfqBiz.hbfq_num = params.hbfq_num);
  params.hbfq_percent && (hbfqBiz.hbfq_percent = params.hbfq_percent);
  if (Object.keys(hbfqBiz).length) {
    payload.hb_fq = JSON.stringify(hbfqBiz);
  }

  return request.post(url, payload);
};

/**
 * 发起退款
 *
 * 对已支付的订单发起退款
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/refundOrder
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝商户号 获取
 * @param {*} params.money 退款金额
 * @param {*} params.out_trade_refund_no 商户自定义退款单号
 * @param {*} params.refund_desc 退款描述
 * @param {*} params.notify_url 异步回调地址，退款成功后会把退款结果发送到该地址，不填则无回调
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/alipay/refundOrder
 */
const refundOrder = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/refundOrder";

  // 必填参数
  const payload = {
    out_trade_no: params.out_trade_no,
    money: params.money,
    mch_id: params.mch_id || mid,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.out_trade_refund_no &&
    (payload.out_trade_refund_no = params.out_trade_refund_no);
  params.refund_desc && (payload.refund_desc = params.refund_desc);
  params.notify_url && (payload.notify_url = params.notify_url);

  return request.post(url, payload);
};

/**
 * 查询退款结果
 *
 * 对已发起退款申请的订单查询支付宝的退款结果
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/getRefundResult
 *
 * @param {*} params.refund_no 退款单号
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝商户号 获取
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/alipay/getRefundResult
 */
const getRefundResult = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/getRefundResult";

  // 必填参数
  const payload = {
    refund_no: params.refund_no,
    mch_id: params.mch_id || mid,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  return request.post(url, payload);
};

/**
 * 关闭订单
 *
 * 对已经发起的订单进行关闭，订单如果已支付不能关闭。已支付订单需要关闭请使用撤销订单接口
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/closeOrder
 *
 * @param {*} params.out_trade_no 商户单号
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝 获取
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/alipay/closeOrder
 */
const closeOrder = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/closeOrder";

  // 必填参数
  const payload = {
    out_trade_no: params.out_trade_no,
    mch_id: params.mch_id || mid,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  return request.post(url, payload);
};

/**
 * 撤销订单
 * 支付交易返回失败或支付系统超时，调用该接口撤销交易。
 * @see https://open.pay.yungouos.com/#/api/api/pay/alipay/reverseOrder
 *
 * @param {*} params.out_trade_no 商户单号
 * @param {*} params.mch_id 支付宝商户号 登录yungouos.com-》支付宝-》商户管理 支付宝 获取
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/alipay/reverseOrder
 */
const reverseOrder = async (params = {}) => {
  const url = API_URL + "/api/pay/alipay/reverseOrder";

  // 必填参数
  const payload = {
    out_trade_no: params.out_trade_no,
    mch_id: params.mch_id || mid,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  return request.post(url, payload);
};

/**
 * 订单查询
 *
 * 根据订单号查询支付订单 (该接口限流，规则为1qps/10s)
 *
 * @see https://open.pay.yungouos.com/#/api/api/system/order/getPayOrderInfo
 *
 * @param {*} params.out_trade_no 商户单号
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/system/order/getPayOrderInfo
 */
const queryOrder = async (params = {}) => {
  const url = API_URL + "/api/system/order/getPayOrderInfo";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    out_trade_no: params.out_trade_no,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  return request.get(url + "?" + qs.stringify(payload));
};

/**
 * 回调通知签名校验
 *
 * 支持异步回调、同步回调签名校验 (未支持退款回调通知验签)
 *
 * @see https://open.pay.yungouos.com/#/callback/notify
 *
 * @param {*} params form表单形式数据
 * @return {*} 返回验签通过后的JSON结构数据, 验签不通过则抛出错误
 */
const notifyVerify = async (params = {}) => {
  // content-type 为 application/x-www-form-urlencoded
  params = qs.parse(params);

  // md5签名校验
  const payload = {
    code: params.code,
    orderNo: params.orderNo,
    outTradeNo: params.outTradeNo,
    payNo: params.payNo,
    money: params.money,
    mchId: params.mchId,
  };
  const checksum = sign(payload);
  if (checksum !== params.sign) {
    throw new Error("invalid notify sign");
  }

  return params;
};

module.exports = {
  config,

  codePay,
  nativePay,
  wapPay,
  jsPay,
  h5Pay,
  appPay,
  webPay,

  refundOrder,
  getRefundResult,
  closeOrder,
  reverseOrder,
  queryOrder,

  notifyVerify,
};
