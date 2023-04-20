<template>
	<view>
		<view v-if="!item.Id && retrans" class="rowLoading">
			<u-icon @click.native="()=>retransmission()" size="30" color="red" name="error" mode="flower"></u-icon>
		</view>
		<view v-if="!item.Id && !retrans" class="rowLoading">
			<u-loading mode="flower"></u-loading>
		</view>
	</view>
</template>

<script>
	const xsoftmsdk = require("@/plugins/im/xsoftimsdk.js");
	import imsdk from "@/plugins/im/imsdk.js";
	import {
		imUpload
	} from "@/config/imUpload.js";
	export default {
		name: "message-mh-retranmission",
		props: {
			item: {
				type: Object,
				default: () => ({})
			},
		},
		data() {
			return {
				retrans: false,
			};
		},
		methods: {
			//消息重复发送
			async retransmission() {
				this.item.CreateTime = Math.floor(new Date().getTime() / 1000)
				const message = this.item;
				if (message.MessageType == xsoftmsdk.enums.MessageTypeEnum.Group) {
					const index = this.$store.state.groupList.findIndex(data => data.KeyID == message.KeyID)
					this.$store.state.groupList.splice(index, 1);
					const remessage = {
						...message,
						Id: 0,
						AtUsers: [],
						SharpUsers: []
					};
					remessage.ChangeTime = Math.floor(new Date().getTime() / 1000)
					//文件消息需要单独处理，
					if (remessage.Type == xsoftmsdk.enums.ContentType.Image || remessage.Type == xsoftmsdk.enums
						.ContentType.Voice || remessage.Type == xsoftmsdk.enums.ContentType.Video) {
						if (remessage.FileId) {
							this.$store.state.groupList.push(remessage)
							imsdk.sendMessage(remessage);
						} else {
							this.$store.state.groupList.push(remessage)
							let fileid = await imUpload(remessage.Content);
							if (fileid) {
								imsdk.sendMessage(remessage);
							}else{
								this.$util.toast("请检查您的网络连接");
							}
						}
					}else{
						this.$store.state.groupList.push(remessage)
						imsdk.sendMessage(remessage);
					}

				} else {
					const index = this.$store.state.normalList.findIndex(data => data.KeyID == message.KeyID)
					this.$store.state.normalList.splice(index, 1);
					const remessage = {
						...message,
						Id: 0
					};
					remessage.ChangeTime = Math.floor(new Date().getTime() / 1000)
					if (remessage.Type == xsoftmsdk.enums.ContentType.Image || remessage.Type == xsoftmsdk.enums
						.ContentType.Voice || remessage.Type == xsoftmsdk.enums.ContentType.Video) {
						if (remessage.FileId) {
							this.$store.state.normalList.push(remessage)
							imsdk.sendMessage(remessage);
						} else {
							let fileid = await imUpload(remessage.Content);
							if (fileid) {
								this.$store.state.normalList.push(remessage)
								imsdk.sendMessage(remessage);
							}else{
								this.$util.toast("请检查您的网络连接");
							}
						}
					}else{
						this.$store.state.normalList.push(remessage)
						imsdk.sendMessage(remessage);
					}
				}
			},
		},
		mounted() {
			const current = new Date().getTime() / 1000;
			switch (this.item.Type) {
				case xsoftmsdk.enums.ContentType.Voice:
					if ((current - this.item.CreateTime) > 30) {
						this.retrans = true
					} else {
						setTimeout(() => {
							this.item.Id ? this.retrans = false : this.retrans = true;
						}, 30000)
						break
					}
					break
				case xsoftmsdk.enums.ContentType.Image:
					if ((current - this.item.CreateTime) > 50) {
						this.retrans = true
					} else {
						setTimeout(() => {
							this.item.Id ? this.retrans = false : this.retrans = true;
						}, 50000)
						break
					}
					break
				default:
					if ((current - this.item.CreateTime) > 10) {
						this.retrans = true
					} else {
						setTimeout(() => {
							this.item.Id ? this.retrans = false : this.retrans = true;
						}, 10000)
						break
					}
					break
			}
		}
	}
</script>

<style>
</style>
