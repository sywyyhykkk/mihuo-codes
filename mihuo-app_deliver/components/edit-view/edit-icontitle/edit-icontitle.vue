<template>
	<view class="iconContent">
		<text class="icon" ></text>
		<view class="wordInput"><text>{{jsondata.data.content}}</text></view>
	</view>
</template>
<script>
	export default {
		name: 'edit-icontitle',
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		},
	}
</script>
<style scoped lang="scss">
.iconContent{
  display: flex;
  align-items: center;
  .icon{
    color: #BFBFBF;
    width: 42rpx;
    height: 32rpx;
    background-image: url('/static/images/icon_title.png');
    background-repeat: no-repeat;
    background-size: 42rpx 32rpx;
    /* identical to box height */
    text-align: center;
  }
  .wordInput{
    outline: none;
    flex: 1;
    font-weight: 900;
    font-size: 32rpx;
    line-height: 44rpx;
    color: #303133;
    margin-left: 10rpx;
  }
}
</style>

