### 案例一
```
<z-popup v-model="true" @change="onChange">
	<view class="popup_title">
		<text @click="popupShow = false">取消</text>
		<view>弹窗标题</view>
		<text @click="popupShow = false">确定</text>
	</view>
	<view class="popup_content">
		弹窗内容
	</view>
</z-popup>

// js
methods: {
	onChange(e){
		if(e){
			uni.showToast({
				title:"打开了弹窗",
				icon:"none"
			});
		}else {
			uni.showToast({
				title:"关闭了弹窗",
				icon:"none"
			});
		}
	}
},
```

### 属性
| 名称                        | 类型          | 默认值          | 描述                                               |
| ----------------------------|--------------- | ------------- | ---------------------------------------------------|
| value                     | Boolean       | false     	| 控制弹窗是否打开 |
| hideOnBlur                 | Boolean      | true          | 点击遮罩层关闭弹窗|
| scroll                    | Boolean       | true          | 禁止页面滚动（H5生效）                |
| type                     | String        | bottom         | 弹窗方位bottom 靠下， center 居中， top 靠上    |
| offset                   | Number        | 0              | type=bottom和type=top的时候设置这个数据弹窗会朝相反的方向偏移 |
| zIndex                   | Number        | 500            | 设置弹窗的层级, 普通vue页面有效 |
