# YunGou-Pay

![https://images.yungouos.com/YunGouOS/logo/merchant/logo.png](https://images.yungouos.com/YunGouOS/logo/merchant/logo.png)

YunGouOS - 专业支付系统服务提供商，从事支付行业9年之久，微信、支付宝首批服务商。基于微信/支付宝官方授权的服务商模式为中小商家提供便捷的支付接入服务，致力于为更多开发者、个体户、个人创业者、小微企业提供合法合规的官方支付接口。

官网地址：[https://www.yungouos.com](https://www.yungouos.com/#/invite/welcome?spm=Mjg3OTU=)

访问官网注册提交资料，由微信/支付宝审核，审核通过后下发商户号，即可通过此SDK对接 YunGouOS 使用。

## YunGou-Pay 意义

YunGouOS 官网有 [YunGouOS-Node-SDK](https://github.com/YunGouOS/YunGouOS-PAY-SDK/tree/master/YunGouOS-Node-SDK) , 但是 ...

不好用 那就自己来！！！

#### YunGou-Pay 和 YunGouOS-Node-SDK 差异 

1. \- 统一微信和支付宝接口，移除所有无意义async重复接口
2. 函数参数统一为JSON对象，而非顺序化传参 (简直噩梦 ...)
```js
// YunGouOS-Node-SDK 
const rsp = await WxPay.nativePay(out_trade_no, total_fee, mch_id, body, type, app_id, attach, notify_url, auto, auto_node, config_no,biz_params,payKey);

// YunGou-Pay
const rsp = await WxPay.nativePay({
    body: 'test',
    total_fee: '0.01',
    out_trade_no: '952717317289884539',
    // notify_url: 'xxxxxxxx',
})
```
3. 通过抛错方式 而非返回null处理参数异常等情况
4. native扫码支付接口 额外生成二维码图片base64数据
5. 接口保持统一命名风格
    - jsapiPay -> jsPay (WxPay)
    - refund -> refundOrder (WxPay、AliPay)
6. \+ queryOrder 订单支付状态查询接口
7. \+ notifyVerify 回调通知验签接口

YunGou-Pay和YunGouOS-Node-SDK接口命名基本保持一致, 可以无缝兼容, 细微差异列举如上。

## 快速上手

[API文档](./doc/global.html)

### 安装

```sh
npm i yungouos-pay
```

### 使用

```js
import { WxPay, AliPay } from 'yungou-pay'
```

调用 config函数 配置微信或支付宝商户信息:
```js
// 配置微信商户信息
WxPay.config({
    mid: "xxxxxxxxxx",
    secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
})
// 即可开始调用 YunGou-Pay 微信相关支付接口

// 配置微信商户信息
AliPay.config({
    mid: "xxxxxxxxxx",
    secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
})
// 即可开始调用 YunGou-Pay 支付宝相关支付接口
```

### 微信扫码支付示例

```js
// 发起扫码支付
const rsp = await WxPay.nativePay({
    body: 'test',
    total_fee: '0.01',
    out_trade_no: '952717317289884539',
    // notify_url: 'xxxxxxxx',
})
console.log('wxpay native rsp =', JSON.stringify(rsp))

// 查询支付结果
const rsp2 = await WxPay.queryOrder({ out_trade_no: '952717317289884539' })
console.log('wxpay query rsp =', JSON.stringify(rsp2))
```

### 支付宝扫码支付

```js
// 发起扫码支付
const rsp = await AliPay.nativePay({
    body: 'test',
    total_fee: '0.01',
    out_trade_no: '952717317289884599',
    // notify_url: 'xxxxxxxx',
})
console.log('alipay native rsp =', JSON.stringify(rsp))

// 查询支付结果
const rsp2 = await AliPay.queryOrder({ out_trade_no: '952717317289884599' })
console.log('alipay query rsp =', JSON.stringify(rsp2))
```

### 回调验签处理

用户扫码支付成功后 支付服务商平台会发起回调通知到notify_url 服务器收到回调通知后需要验签 保证数据的合法性 而非伪造

基于express的服务器验签处理示例

```js
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 9000

app.all('/notify', async function (req, res) {
    try {
        // 验签成功 返回解析后的参数JSON对象
        // 验签失败 抛出签名异常错误
        const params = await notifyVerify(req.body)

        // 核对订单号和支付金额等
        // ...

        // 业务处理成功 要求返回'SUCCESS' YunGouOS平台会终止回调通知
        return res.send('SUCCESS')
    } catch(e) {
        // 验签失败 返回非'SUCCESS' YunGouOS平台会再次回调通知
        return res.send(':(')
    }
})

app.listen(port)
```

## 同类收单服务商对比

### Payjs

https://payjs.cn/ (目前已停止个人商户收单业务)

### Xorpay

https://xorpay.com/ (间接调用JSApi支付 非微信原生扫码渠道 支付过程存在页面跳转)

项目开发过程中接触到的几个同类收单服务商，payjs其实很早就在使用， 但是无奈其业务转型到自助终端市场，即将暂停个人商户收单业务。Xorpay是间接走收单支付渠道的方式，虽然其公司有支付牌照，但是扫码支付后页面跳转多次的支付方式不够友好, 而且由于未直接走微信的商户支付平台，无法通过 微信商户助手小程序 便捷的管理订单和查看支付统计等信息。

PS: 其他支付平台接触过 z-pay 等，和xorpay有同样的问题，目前YunGouOS支付平台是最优解，也欢迎issue中反馈留言更多平台服务商。

## 关于 YunGouOS

### 解决什么问题

1、为个人用户提供官方的支付商户签约和支付接口

2、为企业用户提供更低的签约费率、统一API、自动分账等其他服务

YunGouOS支付平台是为更多开发者、个体户、个人创业者、小微企业提供正规的官方支付接口。基于微信/支付宝官方授权的服务商模式为中小商家提供便捷的支付接入服务。

### 产品优势

个人：个人用户也可以在微信/支付宝官方签约正规的商户，享受来自微信官方的商户相关的API接口和资金能力

个体户/企业：通过YunGouOS签约更低费率、使用YunGouOS统一API和SDK以及订单报表、分账、聚合支付等技术服务

### 用户疑惑

1、问：为什么你们可以给个人用户签约，实现原理是什么？

    我们是微信、支付宝官方服务商，官方对外个人是不开放的，
    个人这块给部分有权限的合作伙伴从事，我们刚好有相关权限可以给个人用户签约。

2、重要：交易款先到你们账户，然后由你们再支付给我？

    这是我们与市面上不同的地方！！
    用户交易款由微信官方直接清算你申请时候的银行卡账户。
    YunGouOS只负责技术信息流，资金流一概由微信负责。

3、交易款如何提现？到账时间？

    不需要提现，微信支付会在每日自动把前一日的交易款项自动打款到您的结算银行卡。

4、交易额达到多少才可以提现，有限制吗？

    没有限制，微信支付自动打款

5、交易怎么查询、如何查看资金？

    微信：使用微信商户助手小程序进行交易查询、资金管理等操作，https://pay.weixin.qq.com/guide/miniapp_assistant.shtml
    
    支付宝：打开支付宝APP，登录你的支付宝账户->我的->账单里面可以查询，资金实时到支付宝余额

6、交易收手续费吗？

    按照申请时候选择的费率扣除，申请支付时候可以选择支付费率

7、银行入账显示的付款方名称是什么？

    根据微信支付官方公告，银行入账显示的付款方将可能是下述两种之一：
    
    【财付通支付科技有限公司客户备付金】、【财付通支付科技有限公司】

### 产品介绍

![产品介绍](https://images.yungouos.com/YunGouOS/merchant/images/product-desc.png)


### 签约流程图

![开户流程](https://yungouos.oss-cn-shanghai.aliyuncs.com/YunGouOS/merchant/images/step.png)
