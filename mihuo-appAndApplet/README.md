# 1.UI 规范

## 1.1 尺寸

- 像素转换 px -> rpx

> 蓝湖

```css
width: 120px;
height: 120px;
background: #000000;
border-radius: 10px;
```

> uni-app

```css
width: 120rpx;
height: 120rpx;
background: #000000;
border-radius: 10rpx;
```

### uni-app

> 全局页面样式

```css
width: 750rpx;
padding: 0 30rpx;
/* 或者 */
width: 690rpx;
margin: 0 30rpx;
```

> 页面背景色

```css
background: #ffffff;
```

> css 常量(style/mixin.scss)

> css 方法(style/mixin.scss)

```css
/* 文字单行省略号, 要给定width */
@include toe();
/* 文字多行省略号, 要给定width */
@include bov(2);
/* ios安全区 */
@include safearea();
```

# 2.组件规范

## 2.1 主包(/pages)

> 以下几个页面的组件直接放在根目录 components 里面，命名规范 components-name 例如：mihuo-image
**主包里的页面，页面引用的组件静态资源路径必须为static/**

```js
'/pages/home/home'
'/pages/category/category'
'/pages/myHome/myHome'
'/pages/message/index'
'/pages/mine/personalCenter'
'/pages/wxPay/wxPay'
```

## 2.2 分包(/pages-common 等)

> 分包页面的组件放在对应的分包目录 components 里面，命名规范 common-mh-components-name 例如：common-mh-construction-case
**分包的组件里所有静态资源的引入必须是分包下的static/**
1. 尽量避免自定义组件内使用自定义组件的情形，如果有则使用时按规范新建组件并导入

## 2.3 组件命名
> 组件命名除满足以上规范外，还因满足
1. 全部小写英文字母
2. 单词之间用 "-" 隔开
3. 示例
```html
<!-- 主包使用的组件 -->
<image-upload-new></image-upload-new>

<!-- 分包使用的组件 -->
<common-mh-construction-case></common-mh-construction-case>
```

# 3. API 规范

## 3.1 API 命名规范

> 【请求方法】【请求内容】【请求主键参数】【基本的注释描述】

```js
/**
 * @description 根据ID获取内容素材 GET mall cms_content_manager/customer
 */
getCMSContentById(data) {
	return $http.get('mall/cms_content_manager/customer', data);
}
```

## 3.2 API 引用

> 使用 api 的时候先在 config/api.js 里搜索是否已经有相同 api，如果有直接使用。如果没有，再依照规范新增

- 使用方法

```js
this.$httpApi.getCMSContentById()
```

## 3.3 修改 API 版本、环境

> 在 config/common.js 里切换对应版本和环境

```js
// 切换对应的环境 processDev=开发 processPro=生产 processTest=测试
if (process.env.NODE_ENV === 'development') {
  configdata = processDev
}

// 切换版本 apiVersion A=默认版本 可以切换至后端的任意版本(询问后端版本号)
let processDev = {
  imageGlobal: 'https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/',
  apiUrl: 'http://dev.51mihuo.com:9999/',
  apiVersion: 'A',
  data: {
    coid: '37' // 重庆运营商
  }
}
```

**提交代码时要把 config/common.js 里的改动复原，尤其是版本号**

# 4.开发规范

## 4.1 顶部导航栏

> 最好使用 z-nav-bar 这个组件(文档 uni_modules/z-nav-bar/readme.md)

_.nav-bar 已在全局样式声明，不需单独声明_
_左边按钮默认是返回按钮，右边按钮使用 slot="right"_

```html
<z-nav-bar backState="1000">
  <view slot="default" class="nav-bar"> 装修花费 </view>
</z-nav-bar>
```

## 4.2 输入框

> 最好使用 uni-easyinput 这个组件

```html
<uni-easyinput
  v-model="amount"
  type="number"
  placeholder="请输入金额"
  :clearable="false"
  :inputBorder="false"
/>
```

## 4.3 底部按钮

```html
<bottom-button title="按钮"></bottom-button>
```

## 4.4 公共工具

**plugins/utils.js 和 static/js/util.js 有很多工具，如果没有再自己实现**

> 发起支付
```js
// 参考注释 static/js/util.js
this.requestPay()
```

> 发起支付
```js
// 参考注释 static/js/util.js
this.$util.requestPay()
```

> 跳转到聊天
```js
// 参考注释 static/js/util.js
this.$util.goToChat()
```

> 图片 url

```js
// 参考注释 static/js/util.js
this.$util.thumbnailImage(src, true, 750)
```

> 用户头像

```js
// 参考注释 static/js/util.js
this.$util.avatarImage(userId)
```

> 提示

```js
// 参考注释 static/js/util.js
this.$util.toast(src, true, 750)
```

> 弹窗

```js
// 参考注释 plugins/utils.js 920行附近
uni.showModal({
  title: '确认操作',
  content: `确认删除${item.name}？`,
  success: (res) => {
    if (res.confirm) {
      this.$httpApi.deleteCostNoteType(item.id).then((response) => {
        if (response) {
          this.getNoteType(true)
          this.$util.toast('删除成功')
        }
      })
    }
  }
})
```

> 加载框

```js
// 参考注释 plugins/loading.js
uni.showLoading({
    title: '',
    duration: '',
    mask: true:
    isFullScreen: true,
})
```

> 登录校验
```js
// 已弃用
// 对于需要登录才能跳转的页面、按钮、方法等
this.checkIsLogin(() => {
	console.log('校验登录后才会执行')
})

// 登录后跳转到该页面
this.checkIsLogin('/pages-to-some-where')
```

> 关于console.log
- 页面内的打印接口信息等在开发完成后删除console.log，不然会影响别人开发
- store、公共方法、公共工具等打印信息可以保留

## 4.5 关于金额计算
> 涉及到金额计算的部分请使用this.$math计算
```js
// plugins/mathoperation.js
this.$math.floatSub(2.01 - 1.06)
```
# 5.跨平台编译

## 5.1 静态资源

1. 主包的静态资源放在 static 目录下，要在服务器同步新增或删除 https://www.51mihuo.com/static
2. 分包的静态资源放在对应分包的 static 目录下
3. 不使用的静态资源一定要删除，且要在服务器同步删除 https://www.51mihuo.com/static

## 5.2 已知需要条件编译的问题

> 顶部导航栏

```css
/* #ifdef MP-WEIXIN */
margin-left: 30rpx;
/* #endif */
/* #ifndef MP */
margin-right: 30rpx;
/* #endif */
```

> template 里获取样式

```html
// 非小程序
<view :style="getStyle"></view>

// 小程序
<view :style="[getStyle]"></view>

// 可以统一成
<view :style="[getStyle]"></view>
```

> template 里小程序获取不到 this(虽然一般也不会这么写)

```html
// 非小程序 可以获取到title
<view>{{ this.title }}</view>

// 小程序 获取不到title
<view>{{ this.title }}</view>
// 改成以下
<view>{{ title }}</view>
```

## 5.3 一些常见问题

> v-for 一定要使用 key，嵌套使用 v-for 时，index 名称不能相同

```html
<view v-for="item, index in list" :key="index">
  <view v-for="item2, index2 in list2" :key="index2"></view>
</view>
```

> css 最好给定宽高，最好使用 flex 布局
> **不要使用 justify-content: end，使用 justify-content: flex-end**

```css
width: 690rpx;
height: max-content;
min-height: 300rpx;
display: flex;
justify-content: flex-end;
```

**写完代码以后请格式化代码，尤其是缩进，不然别人合并代码的时候很难弄**

## 5.4 跨平台适配

1. iOS 底部安全区 40rpx

```css
@include safearea()
/* 或者 */
padding-bottom: env(safe-area-inset-bottom));
```

# 6. Git 规范

## 6.1 主要分支

1. master: 用于发布正式版，不可直接 push，只能通过 pr 合并
2. test: 用于测试人员测试，可以直接 push 和 pull，可以合并 dev
3. dev: 用于开发人员开发，可以直接 push 和 pull，可以合并 test

## 6.2 分支规范

1. **自己创建的分支，请在开发完成后合并到 dev 并删除源分支。合并到 dev 以后，在 h5，app，小程序端都没有问题且没有冲突后再 push 到 dev。push 到 dev 以后再合并到 test，不然测试人员拉不到代码**

> 分支命名(建议) fix-【修改的内容】-【tfs 任务号（可选）】

```bash
git branch fix-home-style-12345
```

## 6.3 commit 规范

> commit 类型

1. chore 修改配置文件，一些不重要的修改，typo 等
2. docs 修改文档，文本内容，typo 等
3. feat 新功能
4. fix 修复 bug
5. refactor 重构
6. style 样式修改

> commit 信息

```bash
// fix(影响的范围，可选): 内容
git commit -m "fix: 我的家切换时没有更新数据"
// 或者
git commit -m "fix(我的家): 我的家切换时没有更新数据"

```


## 6.4 小程序的问题
> 1 小程序的key值，不能为null或者undefind之类的数据，否则方法里面的参数会成为undefind
## 6.5 组件的相关问题
> 1 当组件需要传入组件的方法时，如果界面有其他的点击方法，两个方法表现不一致时候，。尽量采用refs的方法调用打开、关闭等事件。例如u-poup关闭时候请使用 this.refs.poup.close


##6.5骨架组件mh-skeleton
>内部包裹的内容用一个view包裹，否则App端表现不正常

##6.6 不要继续使用各个分包下面的瀑布流组件
>分包下面的瀑布流组件是之前uview下的瀑布流组件在app上面的节点交互会导致内存闪退。





**以上规范只是建议，不强制要求。可以随时补充各种问题的解决方案。问题及时收录方便后续的开发人员开发与错误修正**
