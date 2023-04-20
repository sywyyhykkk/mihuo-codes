const fs = require('fs');
const path = require('path');
//首先从page.json里面把路由获取回来，这时候
// 因为json里面有备注 转为对象不可行

let routelist = [{
        "root": "pages-appInfo",
        "pages": [{
                "path": "appUpdate/appUpdate",
                "style": {
                    "background": "rgba(0,0,0,0.3)",
                    "navigationBarTextStyle": "white",
                    "app-plus": {
                        "animationType": "fade-in",
                        "background": "rgba(0,0,0,0.3)",
                        "backgroundColor": "rgba(0,0,0,0.3)",
                        "bounce": "none"
                    }
                }
            }, {
                "path": "univerifyLogin/univerifyLogin",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false
                }

            }, {
                "path": "appInfo/appInfo",
                "style": {
                    "navigationBarTitleText": "",
                    "navigationStyle": "custom",
                    "bounce": "none"
                }
            }, {
                "path": "privacy/privacy",
                "style": {
                    "navigationBarTitleText": "隐私政策",
                    "navigationStyle": "default",
                    "navigationBarTextStyle": "black",
                    "enablePullDownRefresh": false,
                    "navigationBarBackgroundColor": "#FFFFFF",
                    "bounce": "none"
                }
            },
            {
                "path": "serviceAgreement/serviceAgreement",
                "style": {
                    "navigationBarTitleText": "服务协议",
                    "navigationStyle": "default",
                    "navigationBarTextStyle": "black",
                    "enablePullDownRefresh": false,
                    "navigationBarBackgroundColor": "#FFFFFF",
                    "bounce": "none"
                }
            }
        ]
    }, {
        "root": "pages-mall",
        "pages": [{
                "path": "shoppingCart/shoppingCart",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "backgroundColorTop": "#F2F2F2",
                    "backgroundColorBottom": "#F2F2F2",
                    "app-plus": {
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "submitOrder/submitOrder",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "app-plus": {
                        "softinputNavBar": "none",
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "address/address",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "disableScroll": false,
                    "app-plus": {
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "productDetail/productDetail",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "address/addAddress",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "cateList/cateList",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "backgroundColorTop": "#F2F2F2",
                    "backgroundColorBottom": "#F2F2F2",
                    "bounce": "none"
                }
            }
        ]
    },
    {
        "root": "pages-findMaster",
        "pages": [{
                "path": "findMasterWorker",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none",
                    "app-plus": {
                        "popGesture": "none"
                    }
                }
            },
            {
                "path": "callMaster",
                "style": {
                    "navigationStyle": "custom",
                    "backgroundColor": "#000000",
                    "disableSwipeBack": true,
                    "app-plus": {
                        "animationType": "fade-in",
                        "background": "transparent",
                        "backgroundColor": "rgba(0,0,0,0)", // 背景透明
                        "bounce": "none",
                        "popGesture": "none"
                    }
                }
            },
            {
                "path": "selectAddress",
                "style": {
                    "navigationBarTitleText": "选择地址",
                    "enablePullDownRefresh": false,
                    "navigationBarTextStyle": "black",
                    "navigationStyle": "default",
                    "navigationBarBackgroundColor": "#F5F5F5",
                    "bounce": "none"
                }
            },
            {
                "path": "editAddress",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "navigationBarTextStyle": "black",
                    "navigationStyle": "default",
                    "navigationBarBackgroundColor": "#FFFFFF",
                    "bounce": "none",
                    "app-plus": {
                        "popGesture": "none"
                    }
                }
            },
            {
                "path": "callOrder",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "backgroundColor": "#F5F5F5",
                    "app-plus": {
                        "bounce": "none",
                        "popGesture": "none"
                    }
                }
            },
            {
                "path": "issueOrder",
                "style": {
                    "navigationBarTitleText": "发布详细订单",
                    "enablePullDownRefresh": false,
                    "navigationBarTextStyle": "black",
                    "navigationStyle": "default",
                    "navigationBarBackgroundColor": "#FFFFFF",
                    "bounce": "none"
                }
            },
            {
                "path": "changeItemList",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            }, {
                "path": "serviceEvaluation",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none",
                    "app-plus": {
                        "popGesture": "none"
                    }
                }

            }, {
                "path": "changeItemDetail",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none",
                    "app-plus": {
                        "popGesture": "none"
                    }
                }
            }
        ]
    },
    {
        "root": "pages-user",
        "pages": [{
                "path": "miyou/miyou",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "disableSwipeBack": false,
                    "app-plus": {
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "miyou/miyouDetail",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "backgroundColorTop": "#F2F2F2",
                    "backgroundColorBottom": "#F2F2F2",
                    "bounce": "none",
                    "app-plus": {
                        "softinputNavBar": "none"
                    }
                }
            },
            {
                "path": "miyou/addMiyou",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "backgroundColorTop": "#F2F2F2",
                    "backgroundColorBottom": "#F2F2F2",
                    "navigationBarTextStyle": "#fff",
                    "app-plus": {
                        "softinputNavBar": "none",
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "realName",
                "style": {
                    "navigationBarTitleText": "实名认证",
                    "enablePullDownRefresh": false,
                    "navigationBarTextStyle": "white",
                    "app-plus": {
                        "bounce": "none" // 将回弹属性关掉
                    }
                }
            },
            {
                "path": "forget",
                "style": {
                    "navigationBarTitleText": "忘记密码",
                    "bounce": "none"
                }
            },
            {
                "path": "forgetPassword",
                "style": {
                    "navigationBarTitleText": "忘记密码",
                    "bounce": "none"
                }
            },
            {
                "path": "login",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "app-plus": {
                        "bounce": "none",
                        "popGesture": "none"
                    }
                }
            },
            {
                "path": "register",
                "style": {
                    "navigationBarTitleText": "注册",
                    "app-plus": {
                        "bounce": "none" // 将回弹属性关掉
                    }
                }
            },
            {
                "path": "setting/setting",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "setting/personalInfo",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "setting/editPhone",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "setting/pushSetting",
                "style": {
                    "navigationBarTitleText": "",
                    "navigationStyle": "custom",
                    "bounce": "none"
                }
            },
            {
                "path": "setting/helpCenterMore",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false
                }

            },
            {
                "path": "setting/resetLoginPwd",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false
                }
            }, {
                "path": "appLogin/appLogin",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false
                }

            }
        ]
    },
    {
        "root": "pages-common",
        "pages": [{
                "path": "mapSearch/mapSearch",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "app-plus": {
                        "bounce": "none",
                        "popGesture": "none"
                    }
                }
            },
            {
                "path": "mapSearchCity/mapSearchCity",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none",
                    "app-plus": {
                        "popGesture": "none"
                    }
                }
            },
            {
                "path": "operatorSelectCity/operatorSelectCity",
                "style": {
                    "navigationStyle": "custom",
                    "backgroundColor": "#000000",
                    "disableSwipeBack": true,
                    "app-plus": {
                        "animationType": "fade-in",
                        "background": "transparent",
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "full-screen/full-screen",
                "style": {
                    "navigationStyle": "custom", // 取消本页面的导航栏
                    "app-plus": {
                        "animationType": "fade-in", // 设置fade-in淡入动画，为最合理的动画类型
                        "background": "transparent", // 背景透明
                        "backgroundColor": "rgba(0,0,0,0)", // 背景透明
                        "popGesture": "none", // 关闭IOS屏幕左边滑动关闭当前页面的功能
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "full-screen/blankPages",
                "style": {
                    "navigationStyle": "custom", // 取消本页面的导航栏
                    "app-plus": {
                        "animationType": "fade-in", // 设置fade-in淡入动画，为最合理的动画类型
                        "background": "transparent", // 背景透明
                        "backgroundColor": "rgba(0,0,0,0.1)", // 背景透明
                        "popGesture": "none", // 关闭IOS屏幕左边滑动关闭当前页面的功能
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "emptyPage/index",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "notice/notice",
                "style": {
                    "navigationBarTitleText": "",
                    "navigationStyle": "default",
                    "navigationBarTextStyle": "black",
                    "enablePullDownRefresh": false,
                    "bounce": "none",
                    "app-plus": { //app端特有属性
                        "titleNView": {
                            "buttons": [{ //右侧操作按钮样式定义,是以数组形式定义，可定义多个
                                "color": "#666",
                                "fontSize": "24rpx",
                                "text": "全部已读",
                                "width": "160rpx"
                            }]
                        }
                    }
                }
            },
            {
                "path": "searchPage/searchPage",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "navigationStyle": "custom",
                    "app-plus": {
                        "softinputNavBar": "none"
                    }
                }
            },
            {
                "path": "logOff/logOff",
                "style": {
                    "navigationBarTitleText": "账号注销",
                    "navigationStyle": "default",
                    "navigationBarTextStyle": "black",
                    "enablePullDownRefresh": false,
                    "navigationBarBackgroundColor": "#FFFFFF",
                    "app-plus": {
                        "background": "#000000",
                        "backgroundColor": "#00000"
                    }
                }
            },
            {
                "path": "logOffInput/logOffInput",
                "style": {
                    "navigationBarTitleText": "注销",
                    "navigationStyle": "default",
                    "navigationBarTextStyle": "black",
                    "enablePullDownRefresh": false,
                    "navigationBarBackgroundColor": "#FFFFFF",
                    "app-plus": {
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "successPage/successPage",
                "style": {
                    "navigationBarTitleText": "",
                    "navigationStyle": "default",
                    "navigationBarTextStyle": "black",
                    "navigationBarBackgroundColor": "#F1F1F1",
                    "enablePullDownRefresh": false,
                    "bounce": "none",
                    "app-plus": { //app端特有属性
                        "titleNView": {
                            "buttons": [{ //右侧操作按钮样式定义,是以数组形式定义，可定义多个
                                "color": "#141414",
                                "fontSize": "24rpx",
                                "text": "再次呼叫",
                                "width": "60px"
                            }]
                        }
                    }
                }
            },
            {
                "path": "sessionSearchPage/sessionSearchPage",
                "style": {
                    "app-plus": {
                        "animationType": "fade-in",
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "protocolWebView/protocolWebView",
                "style": {
                    "navigationBarTitleText": "",
                    "navigationStyle": "default",
                    "navigationBarTextStyle": "black",
                    "enablePullDownRefresh": false,
                    "navigationBarBackgroundColor": "#FFFFFF",
                    "bounce": "none"
                }
            },
            {
                "path": "case/design/list",
                "style": {
                    "navigationBarTitleText": "设计案例",
                    "enablePullDownRefresh": false,
                    "app-plus": {
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "case/design/details",
                "style": {
                    "navigationBarTitleText": "案例详情",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "case/construction/details",
                "style": {
                    "navigationBarTitleText": "施工案例",
                    "enablePullDownRefresh": false,
                    "app-plus": {
                        "softinputNavBar": "none",
                        "bounce": "none"
                    }
                }
            },
            {
                "path": "case/construction/list",
                "style": {
                    "navigationBarTitleText": "施工现场",
                    "enablePullDownRefresh": false,
                    "app-plus": {
                        "bounce": "none",
                        "popGesture": "none",
                        "subNVues": [{
                                "id": "consumerSiteService",
                                "path": "case/subNVue/construction",
                                "style": {
                                    "position": "absolute",
                                    "bottom": "20upx",
                                    "width": "100%",
                                    "height": "246upx",
                                    "background": "transparent",
                                    "mask": "rgba(0,0,0,0)"
                                }
                            },
                            {
                                "id": "tableswitch",
                                "path": "case/subNVue/tableswitch",
                                "style": {
                                    "position": "absolute",
                                    "width": "96upx",
                                    "height": "106upx",
                                    "right": "30upx",
                                    "bottom": "300upx",
                                    "background": "transparent",
                                    "mask": "rgba(0,0,0,0)"
                                }
                            },
                            {
                                "id": "verticalList",
                                "path": "case/subNVue/verticalList",
                                "style": {
                                    "position": "absolute",
                                    "width": "100%",
                                    "bottom": "0upx",
                                    "background": "transparent",
                                    "mask": "rgba(255,255,255,255)"
                                }
                            }
                        ]
                    }
                }
            }
        ]
    },
    {
        "root": "pages-mine",
        "pages": [{ // 发表评价
                "path": "evaluation",
                "style": {
                    "bounce": "none",
                    "enablePullDownRefresh": false
                }
            },
            {
                "path": "myEvaluation",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "feedback",
                "style": {
                    "navigationBarTitleText": "意见反馈",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "myFeedback",
                "style": {
                    "navigationBarTitleText": "我的反馈",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "helpCenter",
                "style": {
                    "navigationBarTitleText": "帮助中心",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            {
                "path": "cms",
                "style": {
                    "navigationBarTitleText": "cms",
                    "enablePullDownRefresh": false,
                    "backgroundColorTop": "#F2F2F2",
                    "backgroundColorBottom": "#F2F2F2",
                    "bounce": "none"
                }
            },
            {
                "path": "history",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "backgroundColorTop": "#F2F2F2",
                    "backgroundColorBottom": "#F2F2F2",
                    "bounce": "none"
                }
            },
            {
                "path": "myFav",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "app-plus": {
                        "bounce": "none"
                    }
                }
            }
        ]
    },
    {
        "root": "pages-order",
        "pages": [{
                "path": "orderProgress",
                "style": {
                    "navigationBarTitleText": "查看进度",
                    "enablePullDownRefresh": false,
                    "navigationBarTextStyle": "black",
                    "navigationStyle": "default",
                    "navigationBarBackgroundColor": "#FFFFFF"
                }
            },
            {
                "path": "applyRefund",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false
                }
            },
            { // 订单列表
                "path": "orderList",
                "style": {
                    "enablePullDownRefresh": false,
                    "navigationBarTitleText": "",
                    "app-plus": {
                        "bounce": "none",
                        "popGesture": "none"
                    }
                }
            },
            { // 订单详情
                "path": "orderDetails",
                "style": {
                    "bounce": "none",
                    "enablePullDownRefresh": false,
                    "navigationBarTitleText": ""
                }
            },
            //呼叫订单详情
            {
                "path": "callOrderDetails",
                "style": {
                    "bounce": "none",
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false
                }
            },
            //施工情况
            {
                "path": "constructionDetails",
                "style": {
                    "bounce": "none",
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false
                }
            },
            {
                "path": "constructionLog",
                "style": {
                    "navigationBarTitleText": "施工日志",
                    "enablePullDownRefresh": false,
                    "navigationBarTextStyle": "black",
                    "navigationStyle": "default",
                    "navigationBarBackgroundColor": "#FFFFFF"
                }
            },
            {
                "path": "punchInRecord",
                "style": {
                    "navigationBarTitleText": "打卡记录",
                    "enablePullDownRefresh": false,
                    "navigationStyle": "default",
                    "navigationBarBackgroundColor": "#F7F7F7",
                    "bounce": "none"
                }

            },
            {
                "path": "acceptance/acceptance-report",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }

            },
            {
                "path": "acceptance/acceptance-report-template",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }

            },
            { // 退款/售后  待评价
                "path": "refund",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            },
            { // 退款详情
                "path": "refundDetails",
                "style": {
                    "navigationBarTitleText": "",
                    "enablePullDownRefresh": false,
                    "bounce": "none"
                }
            }
        ]
    }
]
// 文件递归处理
function resolveContent(filepath) {
    let newList = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    newList.forEach(function (file) {
        if (file.isFile()) {
            if (path.extname(file.name) == ".js" || path.extname(file.name) == '.vue' || path.extname(file.name) == '.nvue') {
                for (let i = 0; i < routelist.length; i++) {
                    for (let j = 0; j < routelist[i].pages.length; j++) {
                        readFile(filepath + '/' + file.name, routelist[i], routelist[i].pages[j])
                    }
                }
            }
        } else {
            //console.log(filepath + '/' + file.name)
            resolveContent(filepath + '/' + file.name)
        }
    })
}
// 文件读写
function readFile(name) {
    fs.readFile(name, 'utf8', function (err, data) {
        if (err) throw err;
        let content = data;
        for (let i = 0; i < routelist.length; i++) {
            for (let j = 0; j < routelist[i].pages.length; j++) {
                //readFile(filepath + '/' + file.name,routelist[i],routelist[i].pages[j])
                re = new RegExp('/pages/' + routelist[i].pages[j].path, "g")
                content = content.replace(re, '/' + routelist[i].root + '/' + routelist[i].pages[j].path)
            }
        }
        fs.writeFile(name, content, (res) => {
            console.log(res)
        })
        //console.log(package.root+'/'+page.path)
    });
}


//测试  读取主包的文件目录
//resolveContent('./src/pages')
function resolvePages(filepath) {
    let newList = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    newList.forEach(function (file) {
        if (file.isFile()) {
            if (path.extname(file.name) == ".js" || path.extname(file.name) == '.vue' || path.extname(file.name) == '.nvue') {
                readPageFile(filepath + '/' + file.name)
            }
        } else {
            //console.log(filepath + '/' + file.name)
            resolvePages(filepath + '/' + file.name)
        }
    })
}
// 文件读写
function readPageFile(name) {
    fs.readFile(name, 'utf8', function (err, data) {
        if (err) throw err;
        let content = data;
        //先正则看看有哪些静态的图片资源
        const img = data.match(/static.*?\.png/img);
        console.log(img, name);
        if (img) {
            img.forEach(item => {
                // var readStream = fs.createReadStream(path.join(__dirname, item));
                // var writeStream = fs.createWriteStream(path.join(__dirname,packagName,item));
                // console.log(readStream.pipe,writeStream)
                // readStream.pipe(writeStream);
                console.log(item);
                fs.copyFile(path.join(__dirname, item), path.join(__dirname, packagName, item), (err) => {
                    if (err) throw err;
                    console.log('success');
                });
            })
        }
        //console.log(package.root+'/'+page.path)
    });
}
//把目录创建好
function createDir(filepath) {
    let newList = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    newList.forEach(function (file) {
        if (file.isFile()) {

        } else {
            //fs.mkdirSync(filepath + '/' + file.name)
            let pathurl = filepath + '/' + file.name
            let newdir = pathurl.replace(/\/components\//, '/' + packagName + '/components/')
            fs.mkdirSync(newdir)
            createDir(filepath + '/' + file.name)
        }
    })
}
//包名

//文件分开
function resolveFilePage(filepath) {
    createDir(path.join(__dirname, 'static'));
    setTimeout(() => {
        resolvePages(path.join(__dirname, packagName))
    }, 10000)
}

//resolveFilePage()
//处理静态资源路径
const packagName = "pages-common"

function resolveStaticPath(filepath) {
    let newList = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    newList.forEach(function (file) {
        if (file.isFile()) {
            if (path.extname(file.name) == ".js" || path.extname(file.name) == '.vue' || path.extname(file.name) == '.nvue') {
                fs.readFile(filepath + '/' + file.name, 'utf8', function (err, data) {
                    if (err) throw err;
                    let content = data;
                    //先正则看看有哪些静态的图片资源
                    let r1 = '@/' + packagName + '/static/';
                    let r2 = '"@/static/';
                    let r3 = '"@/' + packagName + "/static/";
                    let r4 = "'@/" + packagName + "/static/";
                    let re = new RegExp('../../../static/', "g")
                    let re1 = new RegExp('../../static/', "g")
                    let re2 = new RegExp('@/static/', "g")
                    let re3 = new RegExp('\"/static/', "g")
                    let re4 = new RegExp('\'/static/', "g")
                    content = content.replace(re, r1)
                    content = content.replace(re1, r1)
                    content = content.replace(re2, r1)
                    content = content.replace(re3, r3)
                    content = content.replace(re4, r4)
                    fs.writeFile(filepath + '/' + file.name, content, (res) => {
                        //console.log(res)
                    })
                    //console.log(package.root+'/'+page.path)
                });
            }
        } else {
            //console.log(filepath + '/' + file.name)
            resolveStaticPath(filepath + '/' + file.name)
        }
    })
}
//resolveStaticPath(path.join(__dirname, packagName))


//这里开始处理组件
let = [];

function resolveComponents(filepath) {
    //读取组件目录
    componentlist = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
}

function resolvePagesPath(filepath) {
    let newList = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    newList.forEach(function (file) {
        if (file.isFile()) {
            if (path.extname(file.name) == ".js" || path.extname(file.name) == '.vue' || path.extname(file.name) == '.nvue') {
                fs.readFile(filepath + '/' + file.name, 'utf8', function (err, data) {
                    if (err) throw err;
                    let content = data;
                    console.log(file.name)
                    for (let item of componentlist) {
                        if (content.indexOf('<' + item.name) > 0) {
                            console.log(item.name)
                            resolveComponentsFile(path.join(__dirname, 'components/' + item.name))
                        }

                    }
                    //console.log(package.root+'/'+page.path)
                });
            }
        } else {
            //console.log(filepath + '/' + file.name)
            resolvePagesPath(filepath + '/' + file.name)
        }
    })
}
//这里处理组件文件
function resolveComponentsFile(pa) {
    let components = fs.readdirSync(pa, {
        encoding: 'utf8',
        withFileTypes: true
    })
    components.forEach(function (file) {
        if (file.isFile()) {
            let source = pa + '/' + file.name;
            let dest = source.replace(/\/components\//, '/' + packagName + '/components/')
            fs.copyFile(source, dest, (err) => {
                if (err) throw err;
                console.log('success');
            })
        } else {
            resolveComponentsFile(pa + '/' + file.name)
        }
    })
}
//之前的脚本忘了组件引用组件的问题

//处理组件使用组件的问题

function run() {
    //createDir(path.join(__dirname, 'components'));
    resolveComponents(path.join(__dirname, 'components'))
    resolvePagesPath(path.join(__dirname, packagName + '/components'))
}
//run();

//最后一步来处理组件中的静态文件 
function resolveComponentsStaticPath(filepath) {
    let newList = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    newList.forEach(function (file) {
        if (file.isFile()) {
            if (path.extname(file.name) == ".nvue" || path.extname(file.name) == ".vue" || path.extname(file.name) == ".js" || path.extname(file.name) == '.scss' || path.extname(file.name) == '.css') {
                readPageFile(filepath + '/' + file.name);
            }
        } else {
            //console.log(filepath + '/' + file.name)
            resolveComponentsStaticPath(filepath + '/' + file.name)
        }
    })
}
//resolveComponentsStaticPath(path.join(__dirname,packagName,'components'))



//删除多余文件夹
let currentComponents = [];
//读取组件全部名称
function resolveComponentsName(filepath) {
    currentComponents = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    console.log(currentComponents)
}
//组件全部重命名
function renameComponents(filepath) {
    let newList = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    newList.forEach(function (file) {
        if (file.isFile()) {
            if (path.extname(file.name) == ".nvue" || path.extname(file.name) == ".vue" || path.extname(file.name) == ".js" || path.extname(file.name) == '.scss' || path.extname(file.name) == '.css') {
                currentComponents.forEach(function (item) {
                    if (file.name.indexOf("uni-")<0 && file.name.indexOf(`${packagName.split('-'[1])}-`)<0 && file.name.indexOf(item.name)>-1) {
                        console.log(file.name)
                        fs.rename(filepath + '/' + file.name, filepath + `/${packagName.split('-')[1]}-` + file.name, (err) => {
                            if (err) throw err;
                            console.log('success');
                        })
                    }
                })
            }
        } else {
            //console.log(filepath + '/' + file.name)
            currentComponents.forEach(function (item) {
                if (file.name.indexOf("uni-")<0 && file.name.indexOf(`${packagName.split('-')[1]}-`)<0 && file.name == item.name) {
                    fs.rename(filepath + '/' + file.name, filepath + `/${packagName.split('-')[1]}-` + item.name, (err) => {
                        if (err) throw err;
                        console.log(filepath + `/${packagName.split('-'[1])}-` + file.name)
                        renameComponents(filepath + `/${packagName.split('-')[1]}-` + file.name)
                        console.log('success');
                    })
                }
            })
        }
    })
}

function deleteDir(filepath) {
    let newList = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    if (newList.length == 0) {
        fs.rmdirSync(filepath)
    }
    newList.forEach(function (file) {
        if (file.isFile()) {
            if (path.extname(file.name) == ".nvue" || path.extname(file.name) == ".vue" || path.extname(file.name) == ".js" || path.extname(file.name) == '.scss' || path.extname(file.name) == '.css') {

            }
        } else {
            //console.log(filepath + '/' + file.name)
            deleteDir(filepath + '/' + file.name)
        }
    })
}
// 读取文件 修改组件的匹配
function readComponentsPageFile(filepath) {
    let newList = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    if (newList.length == 0) {
        fs.rmdirSync(filepath)
    }
    newList.forEach(function (file) {
        if (file.isFile()) {
            if (path.extname(file.name) == ".nvue" || path.extname(file.name) == ".vue" || path.extname(file.name) == ".js") {
                fs.readFile(filepath + '/' + file.name, 'utf8', function (err, data) {
                    if (err) throw err;
                    let content = data;
                    currentComponents.forEach(files => {
                        console.log(files.name)
                        if (files.name.indexOf(`${packagName.split('-')[1]}-`) < 0 && files.name.indexOf("uni-") < 0) {
                            console.log(files.name)
                            if (content.indexOf('<' + files.name) > 0 || content.indexOf(files.name+'>') > 0) {
                                console.log(file.name,'</' + files.name+'>')
                                content = content.replace(new RegExp('<' + files.name, 'g'),`<${packagName.split('-')[1]}-` + files.name)
                                content = content.replace(new RegExp('</' + files.name+'>', 'g'), `</${packagName.split('-')[1]}-` + files.name+'>')
                            }
                        }
                    })
                    fs.writeFile(filepath + '/' + file.name, content, function (err) {
                        
                    })
                    //console.log(package.root+'/'+page.path)
                });
            }
        } else {
            //console.log(filepath + '/' + file.name)
            readComponentsPageFile(filepath + '/' + file.name)
        }
    })
}
function run1(){
   deleteDir(path.join(__dirname, packagName + '/components'))
   resolveComponentsName(path.join(__dirname, packagName + '/components'))
   setTimeout(()=>readComponentsPageFile(path.join(__dirname, packagName)),3000)
   setTimeout(()=>renameComponents(path.join(__dirname, packagName + '/components')),5000)
}
run1()
//组件命名遗漏的问题
function renameComponentssuffix(filepath) {
    let newList = fs.readdirSync(filepath, {
        encoding: 'utf8',
        withFileTypes: true
    })
    newList.forEach(function (file) {
        if (file.isFile()) {
            if (!path.extname(file.name)) {
                fs.rename(filepath + '/' + file.name, filepath + '/' + file.name+'.vue', (err) => {
                    if (err) throw err;
                    console.log('success');
                })
            }
        } else {
            //console.log(filepath + '/' + file.name)
            renameComponentssuffix(filepath +'/'+  file.name)
        }
    })
}
//renameComponentssuffix(path.join(__dirname, packagName + '/components'))
