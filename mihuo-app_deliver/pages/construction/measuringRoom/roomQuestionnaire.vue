<template>
	<view class="questionnaire-contain" ref="questionnaireRef">
		<form-cache-item ref="formCacheItem" :cacheId="nodeInfo.nodeId" @recovery="cacheForm('recovery')">
		</form-cache-item>

		<questionnaire-config :titleObejct="titleObejct" :uTabsFalse="true" ref="questionnaireConfig"
			:key="questionnaireConfigIndex" :cacheId="nodeId" :id="nodeId" type="量房" v-model="questionnaireObject">
		</questionnaire-config>
		<!-- <mh-empty v-show="questionnaireList.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" /> -->
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import formCache from '@/plugins/formCache'
	export default {
		data() {
			return {
				projectId: '', //项目编号
				nodeId: '',
				questionnaireObject: {},
				questionnaireConfigIndex: 0,
				formCacheStatus: false,
				timer: null,
				titleObejct: {
					backgroundColor: '#f5f5f5',
					showStatus: false
				}
			}
		},
		computed: {
			...mapState(['projectInfo', 'userPersonInfo', 'nodeInfo'])
		},
		mounted() {
			this.selectRoomGet()
		},
		beforeDestroy() {
			if (!this.formCacheStatus) {
				this.cacheForm('add')
			}
		},
		methods: {
			saveTiming() {
				this.timer = setInterval(() => {
					this.cacheForm('add')
				}, 5000)
				uni.setStorageSync('eliminateTiming', this.timer)
			},
			eliminateTiming() {
				clearInterval(this.timer);
				this.timer = null
			},
			selectRoomGet() { // 获取问卷答案
				this.projectId = this.projectInfo.projectId
				this.nodeId = this.nodeInfo.nodeId
				this.questionnaireConfigIndex++
			},
			submit() {
				if (this.$questionnaireVerification(this.questionnaireObject.questionnaireList)) {
					return
				}
				if (this.questionnaireObject.details) {
					this.$httpApi.selectRoomSave({
						id: this.questionnaireObject.details.id || '', // 保存时为空，
						projectId: this.projectId,
						nodeId: this.nodeId,
						answer: {
							answerContent: JSON.stringify(this.questionnaireObject.questionnaireList),
							id: this.questionnaireObject.details.id || '',
							projectId: this.projectId,
							surveyTemplateId: this.questionnaireObject.surveyTemplateId,
						}
					}).then(res => {
						this.$util.toast("操作成功");
						this.cacheForm('remove')
						this.$emit('callback')
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: `请添加量房问卷，再进行保存~`,
						duration: 3000
					})
				}
			},
			cacheForm(typeName) {
				let tempCache = new formCache()
				let tempParameter = {
					cacheId: this.nodeInfo.nodeId,
					items: this.questionnaireObject
				}
				switch (typeName) {
					case 'add':
						tempCache.contrastCache(tempParameter, '问卷')
						break
					case 'remove':
						tempCache.removelCache(tempParameter, '问卷', () => {
							this.formCacheStatus = true
						})
						break
					case 'recovery':
						this.$refs.questionnaireConfig && this.$refs.questionnaireConfig.recovery(() => {
							tempCache.removelCache(tempParameter, '问卷')
							this.$refs.formCacheItem && this.$refs.formCacheItem.eliminate()
						})
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
