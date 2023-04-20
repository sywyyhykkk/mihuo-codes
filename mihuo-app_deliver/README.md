
3. 项目主题色介绍
4. 头部导航示例
5. 上拉加载，下拉刷新列表
6. 地区选择
7. 弹窗输入框
8. 滑动操作
9. 富文本编译

### SDK示例
1. 接口请求
2. APP版本更新
3. 支付
4. 分享
5. 小程序登录
6. 公众号登录
7. 登录拦截
8. 获取当前位置
9. 图片上传/文件上传
14. APP权限判断和跳转到系统设置
15. 常用工具

### 模板页面
1. 登录
2. 注册
3. 忘记密码
4. 绑定手机号
5. 协议

### 项目结构

``` bash
├── components                              // 业务组件
├── config                                  // 配置			
│   ├── baseUrl.js                          // 项目配置
│   ├── html5Utils.js                       // H5相关的功能（公众号支付、公众号登录）
│   ├── componentConfig.js                  // uni_modules里面的部分组件相关配置
│   ├── login.js                            // 小程序登录js代码部分和登录拦截器代码
│   ├── requestConfig.js                    // 接口请求配置
│   ├── socket.js                           // webSocket相关代码
│   └── utils.js                            // 项目相关工具（公众号分享、小程序分享数据处理、支付、获取经纬度、支付分配）
├── pages  									// 项目页面
├── plugins                                 // 公共SDK（基本上不需要改）
│   ├── md5.js                           	// md5加密
│   ├── permission.js                       // APP权限判断和打开手机系统设置
│   ├── utils.js                       		// 工具（时间转换、APP和小程序获取经纬度代码）
│   └── wxJsSDK.js                       	// 微信公众号SDK去权限获取页面
├── static                                  // 公共文件
│   ├── demo                          		// 本项目相关的图片（可删除）
│   ├── icon                          		// 项目图标
│   ├── mp-h5                          		// H5第三方包（公众号JS-SDK）
│   └── mp-weixin                          	// 微信小程序第三方包               
├── store                          		    // vuex商店
│	├── modules							    // vuex分类
│	│	├── common.js					    // vuex通用数据管理
│	│	├── user.js						    // vuex用户数据管理
│   │	└── order.js                        // vuex订单数据管理
│   └── index.js                          	// vuex方法集合
├── style
│   ├── common.scss                         // 公共样式文件
│   ├── input.scss                         	// 公共表单样式
│   ├── mixin.scss                          // 样式配置文件
│   └── table.scss                          // 本项目相关的css（可删除）
├── uni_modules                             // 公共功能组件
├── unpackage                               // 项目编译后的文件
├── App.vue                                 // 项目主界面
├── main.js                                 // 程序入口文件，加载各种公共组件
├── manifest.json                           // uni-app项目类型及环境配置
├── pages.json                           	// 项目路由及项目界面配置
├── README.md                               // 项目介绍文件
└── template.h5.html                        // 项目发布的时候使用的文件
```
