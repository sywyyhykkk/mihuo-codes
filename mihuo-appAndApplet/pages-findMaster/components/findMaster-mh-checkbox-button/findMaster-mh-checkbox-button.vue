<template>
	<view class="checkbox">
		<text 
			class="checkbox-item" 
			v-for="(item,index) in checkboxList" 
			:key="index"
			@click="changeCheckbox(item)"
			:class="{selectHover:curArr.indexOf(item) !=-1}"
			>
			{{ item }}
		</text>
		<view v-if="!show" class="custom" @click="add">+自定义</view>
		<input 
			v-else
			focus
			clearable
		 	@blur="eventHandle"
			class="custom-input" 
			placeholder="请输入自定义评语"
			:placeholder-style="`font-size: 24rpx`"
			/>
	</view>
</template>

<script>
	export default {
		name:"checkbox-button",
		props:{
			value:{
				type: [String, Array],
				default: ''
			},
			data:{
				type:  Array,
				default: []
			},
		},
		watch:{
			value(news){
				this.curArr=news
			},
			data:{
				handler(news){
					this.checkboxList = news
				},
				deep:true
			}
		},
		data() {
			return {
				checkboxList:[],
				show:false,
				curArr:[],
				isChecked:true,
			};
		},
		methods: {
			changeCheckbox(data){
				let repeatArr=[];		//重复元素计算
				this.curArr.push(data);
				for (var i = 0; i < this.curArr.length; i++) {
					if (this.curArr[i] == data) {
						repeatArr.push(data)
					}
				}
				if((repeatArr.length)%2===0){
					for (var i = 0; i < this.curArr.length; i++) {
						if (this.curArr[i] == data) {
							this.curArr.splice(i,1);
							i--
						}
					}
				}else{
					this.curArr = Array.from(new Set(this.curArr))
				}
				this.$emit('input',this.curArr)
			},
			// 数组去重
			unique(arr){
				return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
			},
			eventHandle(e){
				if(e.detail.value){
					this.checkboxList.push(e.detail.value)
				}
				this.show = false;
			},
			add(){
				this.show = true;
			}
		},
	}
</script>

<style lang="scss" scoped>
.checkbox{
	width: 100%;
	display: flex;
	flex-flow: row wrap;
	.checkbox-item{
		color: #333333;
		font-size: $smallFontSize;
		padding: 0 20rpx;
		border: 1rpx solid #A2A2A2;
		margin-right: 20rpx;
		border-radius: 40rpx;
		margin-top: 20rpx;
	}
	.custom{
		font-size: $smallFontSize;
		padding: 0 20rpx;
		border: 1rpx solid #A2A2A2;
		border-radius: 40rpx;
		color: #A2A2A2;
		margin-top: 20rpx;
	}
	.custom-input{
		width: 100%;
		border: 1rpx solid #A2A2A2;
		padding: 0 40rpx;
		height: 68rpx;
		border-radius: 60rpx;
		color: #333333;
		font-size: $smallFontSize;
		margin-top: 20rpx;
	}
	.selectHover{
		background: #FFF8F5;
		color: #FE6E32;
		border: 1rpx solid #FE6E32;
	}
}
</style>