<template>
	<view>
		<view v-if="item.MessageType == 'cancel'" class="cancel">
			<text v-if="item.SourceId != toUserId" class="text">你撤回了一条消息</text>
			<text v-else class="text">{{ item.toUserName }} 撤回了一条消息</text>
		</view>
		<view v-else class="item flex-row" :class="[item.SourceId == toUserId ? 'left' : 'right']">
			<!--处理头像-->
			<view>
				<im-avatar :imId="item.SourceId" class="face" />
			</view>
			<!--消息内容-->
			<view class="messageItem">
				<!--文本-->
				<view v-if="item.Type == xsoftmsdk.enums.ContentType.Text" @longpress="longPress(item)" class="content">
					{{ item.Content }}
				</view>
				<!--图片-->
				<view v-if="item.Type == xsoftmsdk.enums.ContentType.Image">
					<view style="position: relative">
						<image @click="preview(item)" v-if="!item.Id || !item.FileId" @longpress="longPress(item)"
							mode="heightFix" style="max-height: 300rpx;" :src="item.Content" />
						<img-cache @click="preview(item)" v-else mode="heightFix" style="max-height: 300rpx;"
							@longpress="longPress(item)" :indexed="$util.getImFiles(item.FileId,true,false)"
							:src="$util.getImFiles(item.FileId,true)" />
					</view>
				</view>
				<!--地图-->
				<view v-if="
		  item.Type == xsoftmsdk.enums.ContentType.Custom &&
		  getJSON(item.CustomContent).contentType == 12
		" class="content map" @tap="openLocation(getJSON(item.CustomContent))">
					<view class="title">{{
		  getJSON(item.CustomContent).name
		}}</view>
					<view class="subtitle">{{
		  getJSON(item.CustomContent).address
		}}</view>
					<image mode="aspectFill" class="box" src="/static/images/address_icon.png"></image>
					<!-- <map class="box" :latitude="getJSON(item.CustomContent).latitude" :longitude="getJSON(item.CustomContent).longitude"
							:markers="[{latitude: getJSON(item.CustomContent).latitude, longitude: getJSON(item.CustomContent).longitude, iconPath: '/static/images/icon-address/address-5.png'}]"
							@tap="openLocation(getJSON(item.CustomContent))"></map> -->
				</view>
				<!--语音-->
				<view v-if="item.Type == xsoftmsdk.enums.ContentType.Voice" @tap="playVoice(item)" class="content">
					<text class="duration">
						{{ getJSON(item.CustomContent).Duration + "''" }}
					</text>
					<image v-show="voicePlayingId != item.CustomContent" src="../../../static/images/audio.png"
						class="voice-icon" style="color: #fff">
					</image>
					<image v-show="voicePlayingId == item.CustomContent" src="../../../static/images/audio-play.gif"
						class="voice-icon" style="color: #fff">
					</image>
				</view>
				<view v-if="!item.Id" class="rowLoading">
					<u-loading mode="flower"></u-loading>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "message-item",
		data() {
			return {

			};
		}
	}
</script>

<style>

</style>
