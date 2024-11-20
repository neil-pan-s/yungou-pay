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
 * 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
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
 * 线下付款码被扫支付，用于扫码枪、扫码盒子、刷脸支付等场景
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/codePay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.auth_code 返回类型（1、返回微信原生的支付连接需要自行生成二维码；2、直接返回付款二维码地址，页面上展示即可。不填默认1 ）
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.receipt 是否开具电子发票 0：否 1：是 默认0
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/wxpay/codePay
 */
const codePay = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/codePay";

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
  params.receipt && (payload.receipt = params.receipt);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return request.post(url, payload);
};

/**
 * 扫码支付
 *
 * 同步发起扫码支付 返回原生支付链接或二维码连接地址，根据type类型决定
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/nativePay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.type 返回类型（1、返回微信原生的支付连接需要自行生成二维码；2、直接返回付款二维码地址，页面上展示即可。不填默认1 ）
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回Promise化结果，需要自行处理返回结果
 */
const nativePay = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/nativePay";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  // 二维码返回类型（1、返回微信原生的支付连接需要自行生成二维码；2、直接返回付款二维码地址，页面上展示即可。不填默认1 ）
  payload.type = params.type || "1";
  params.notify_url && (payload.notify_url = params.notify_url);
  params.attach && (payload.attach = params.attach);
  params.app_id && (payload.app_id = params.app_id);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  const rsp = await request.post(url, payload);

  // 二维码返回类型为文本链接时 自动生成base64二维码
  if (rsp.data && payload.type === "1") {
    rsp.qrcode = await utils.qrbase64(rsp.data);
  }

  return rsp;
};

/**
 * 公众号支付/JSAPI
 *
 * 用户在微信内的商户H5页面发起支付。
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/jsapi
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.openId 用户openId 通过授权接口获得
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.return_url 同步地址。支付完毕后用户浏览器返回到该地址
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} JSSDK支付需要的jspackage
 */
const jsPay = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/jsapi";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
    openId: params.openId,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.return_url && (payload.return_url = params.return_url);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return request.post(url, payload);
};

/**
 * 微信小程序支付（个人）
 *
 * 微信小程序支付，获取小程序支付所需参数，需自行通过小程序跳转API发起支付
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/minPay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.title 支付收银小程序页面顶部的title 可自定义品牌名称 不传默认为 “收银台” 如传递参数 “海底捞” 页面则显示 “海底捞-收银台”
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回跳转“支付收银”小程序所需的参数
 */
const minAppPayParams = async (params = {}) => {
  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.title && (payload.title = params.title);

  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return payload;
};

/**
 * 微信小程序支付（个体户、企业）
 *
 * 微信小程序支付，获取小程序支付所需参数，需自行通过小程序wx.requestPayment拉起支付
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/minPay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.openId 用户openId（调用小程序wx.login接口获取）
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回小程序API wx.requestPayment所需的支付参数
 */
const minAppPay = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/minAppPay";

  if (!params.openId) {
    throw new Error(`param openId is required`);
  }

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.openId && (payload.openId = params.openId);

  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return request.post(url, payload);
};

/**
 * 微信小程序支付(原生)（支持个人、个体户、企业）
 *
 * 微信小程序支付，获取小程序支付所需参数，需自行通过小程序wx.requestPayment拉起支付
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/minAppPay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.open_id 用户open_id（调用小程序wx.login接口获取）
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回小程序API wx.requestPayment所需的支付参数
 */
const minAppPayV3 = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/v3/minAppPay";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
    open_id: params.open_id,
    app_id: params.app_id,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return request.post(url, payload);
};

/**
 * 收银台支付
 *
 * 收银台支付是进一步对支付接口的封装，商户无需关注调用什么接口，收银台自动识别用户设备完成发起支付并提供相关支付页面。尤其是公众号支付需要获取openid，使用收银台支付商户无需关注该流程，收银台自动完成该操作。用户在页面完成支付后返回商户自己网站，收银台将携带参数重定向到商户传递的return_url上。重定向携带参数与异步回调参数一致，通过url拼接方式
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/cashierPay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.return_url 同步回调地址，不传支付后关闭页面
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 收银台支付链接地址
 */
const cashierPay = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/cashierPay";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.return_url && (payload.return_url = params.return_url);

  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return request.post(url, payload);
};

/**
 * 刷脸支付
 *
 * 微信刷脸支付，通过微信刷脸SDK或青蛙APP调用摄像头获取到扫描人脸获取到人脸数据后，发起刷脸支付请求，进行支付扣款。
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/facePay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.openId 用户openId（调用授权接口获取）
 * @param {*} params.face_code 人脸凭证，通过摄像头配合微信刷脸SDK获得
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/wxpay/facePay
 */
const facePay = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/facePay";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
    openId: params.openId,
    face_code: params.face_code,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return request.post(url, payload);
};

/**
 * 刷脸支付凭证
 *
 * 微信刷脸支付SDK模式，适用于自研安卓、windows应用在微信刷脸设备上使用微信刷脸SDK接入刷脸支付。等同于微信刷脸流程中的【获取调用凭证】步骤
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/getFacePayAuthInfo
 *
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.store_id 门店编号，由商户定义，各门店唯一。
 * @param {*} params.store_name 门店名称，由商户定义。（可用于展示）
 * @param {*} params.face_auth_info 人脸数据。调用【get_wxpayface_authinfo】接口获取到的结果
 * @param {*} params.device_id 终端设备编号，由商户定义。
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，需要JSON字符串格式
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/wxpay/getFacePayAuthInfo
 */
const getFacePayAuthInfo = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/getFacePayAuthInfo";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    store_id: params.store_id,
    store_name: params.store_name,
    face_auth_info: params.face_auth_info,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.attach && (payload.attach = params.attach);
  params.device_id && (payload.device_id = params.device_id);
  params.app_id && (payload.app_id = params.app_id);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return request.post(url, payload);
};

/**
 * H5支付
 *
 * 微信H5支付接口，在非微信以外的第三方浏览器环境下拉起微信客户端进行付款。
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/wapPay
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.return_url 同步回调地址，用户支付成功后从微信APP跳转回该地址。调转不会携带任何参数，如需携带参数请自行拼接
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回拉起微信支付的URL。
 */
const wapPay = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/wapPay";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.return_url && (payload.return_url = params.return_url);

  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return request.post(url, payload);
};

/**
 * QQ小程序支付
 *
 * QQ小程序内使用微信支付进行付款，返回拉起微信支付的URL。
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/qqPay
 *
 * @param {*} params.app_id QQ小程序APPID
 * @param {*} params.access_token QQ小程序的access_token
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.return_url 同步回调地址，用户支付成功后从微信APP跳转回该地址。调转不会携带任何参数，如需携带参数请自行拼接
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回拉起微信支付的URL。
 */
const qqPay = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/qqPay";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
    app_id: params.app_id,
    access_token: params.access_token,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.return_url && (payload.return_url = params.return_url);

  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return request.post(url, payload);
};

/**
 * QQ小程序支付（个人）
 *
 * QQ小程序支付，获取小程序支付所需参数，需自行通过小程序跳转API发起支付
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/qqPay
 *
 * @param {*} params. out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.app_id 在YunGouOS平台报备的app_id，不传则按照商户号开户时的场景发起。
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.title 支付收银小程序页面顶部的title 可自定义品牌名称 不传默认为 “收银台” 如传递参数 “海底捞” 页面则显示 “海底捞-收银台”
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 返回跳转“支付收银”小程序所需的参数
 */
const qqPayParams = async (params = {}) => {
  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.title && (payload.title = params.title);

  params.app_id && (payload.app_id = params.app_id);
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return payload;
};

/**
 * APP支付
 *
 * 微信APP支付接口，返回APP拉起微信支付的参数，用户只需在APP端做拉起支付的动作即可。
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/appPay
 *
 * @param {*} params.app_id 微信开放平台申请的APPID
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.total_fee 支付金额  单位:元
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.body 商品描述
 * @param {*} params.attach 附加数据，回调时候原路返回
 * @param {*} params.notify_url 异步回调地址，用户支付成功后系统将会把支付结果发送到该地址，不填则无回调
 * @param {*} params.auto 分账模式。【0：不分账 1：自动分账 2：手动分账】 默认 0
 * @param {*} params.auto_node 执行自动分账动作的节点，枚举值【pay、callback】分别表示【付款成功后分账、回调成功后分账】
 * @param {*} params.config_no 分账配置单号。支持多个分账，使用,号分割
 * @param {*} params.biz_params 附加业务参数。json对象，具体参考API文档
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/wxpay/appPay
 */
const appPay = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/appPay";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    body: params.body,
    total_fee: params.total_fee,
    out_trade_no: params.out_trade_no,
    app_id: params.app_id,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.attach && (payload.attach = params.attach);
  params.notify_url && (payload.notify_url = params.notify_url);
  params.auto && (payload.auto = params.auto);
  params.auto_node && (payload.auto_node = params.auto_node);
  params.config_no && (payload.config_no = params.config_no);
  params.biz_params && (payload.biz_params = JSON.stringify(params.biz_params));

  return request.post(url, payload);
};

/**
 * 发起退款
 *
 * 对已支付的订单发起退款
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/refundOrder
 *
 * @param {*} params.out_trade_no 商户订单号
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.money 退款金额
 * @param {*} params.out_trade_refund_no 商户自定义退款单号
 * @param {*} params.refund_desc 退款描述
 * @param {*} params.notify_url 异步回调地址，退款成功后会把退款结果发送到该地址，不填则无回调
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/wxpay/refundOrder
 */
const refundOrder = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/refundOrder";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    money: params.money,
    out_trade_no: params.out_trade_no,
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
 * 对已发起退款申请的订单查询微信支付的退款结果
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/getRefundResult
 *
 * @param {*} params.refund_no 退款单号
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/wxpay/getRefundResult
 */
const getRefundResult = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/getRefundResult";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    refund_no: params.refund_no,
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
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/closeOrder
 *
 * @param {*} params.out_trade_no 商户单号
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/wxpay/closeOrder
 */
const closeOrder = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/closeOrder";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    out_trade_no: params.out_trade_no,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  return request.post(url, payload);
};

/**
 * 撤销订单
 *
 * 支付交易返回失败或支付系统超时，调用该接口撤销交易。如果此订单用户支付失败，微信支付系统会将此订单关闭；如果用户支付成功，微信支付系统会将此订单资金退还给用户。
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/reverseOrder
 *
 * @param {*} params.out_trade_no 商户单号
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/wxpay/reverseOrder
 */
const reverseOrder = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/reverseOrder";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    out_trade_no: params.out_trade_no,
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
 * 下载对账单
 *
 * 下载微信官方对账单。商户可以通过该接口下载历史交易清单。返回excel下载地址和原生数据
 *
 * @see https://open.pay.yungouos.com/#/api/api/pay/wxpay/downloadBill
 *
 * @param {*} params.mch_id 微信支付商户号 登录yungouos.com-》微信支付-》商户管理 微信支付商户号 获取
 * @param {*} params.date 对账单日期 示例值：2020-01-23
 * @param {*} params.end_date 对账单结束日期 示例值：2020-01-25
 * @param {*} params.device_info 设备或门店信息，接口下单时候通过biz_params传递
 * @return {*} 参考文档：https://open.pay.yungouos.com/#/api/api/pay/wxpay/downloadBill
 */
const downloadBill = async (params = {}) => {
  const url = API_URL + "/api/pay/wxpay/downloadBill";

  // 必填参数
  const payload = {
    mch_id: params.mch_id || mid,
    date: params.date,
  };

  // 必填参数检查
  checkRequiredParams(payload);
  // md5签名 (只有必传参数才参与签名)
  payload.sign = sign(payload);

  // 可选参数
  params.end_date && (payload.end_date = params.end_date);
  params.device_info && (payload.device_info = params.device_info);

  return request.post(url, payload);
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
  jsPay,
  minAppPayParams,
  minAppPay,
  minAppPayV3,
  cashierPay,
  facePay,
  getFacePayAuthInfo,
  wapPay,
  appPay,
  qqPay,
  qqPayParams,

  refundOrder,
  getRefundResult,
  closeOrder,
  reverseOrder,
  queryOrder,

  notifyVerify,
  downloadBill,
};
