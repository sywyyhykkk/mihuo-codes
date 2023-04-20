// 为了判断用户是否修改过内容，先猥琐的通过这种方法来解决

import permission from "./permission"
import moment from '@/static/js/moment.js'

// name=>字段名称 type=>字段类型 default=>默认值
const parameterMap = {
	'巡检': [{
			name: 'title',
			type: 'string',
			default: ''
		}, {
			name: 'content',
			type: 'string',
			default: ''
		}, {
			name: 'inspectAddDTOList',
			type: 'Array',
			default: [],
			list: [{
					name: 'audio',
					type: 'string',
					default: ''
				},
				{
					name: 'pics',
					type: 'string',
					default: '[]'
				},
				{
					name: 'contents',
					type: 'string',
					default: ''
				},
				{
					name: 'name',
					type: 'string',
					default: ''
				}
			]
		},
		{
			name: 'audio',
			type: 'string',
			default: ''
		},
		{
			name: 'pics',
			type: 'string',
			default: '[]'
		}
	],
	'验收': [{
			name: 'checkDesc',
			type: 'string',
			default: ''
		},
		{
			name: 'picFiles',
			type: 'string',
			default: '[]'
		},
		{
			name: 'voiceFiles',
			type: 'string',
			default: ''
		},
		{
			name: 'statusFlag',
			type: 'string',
			default: '-1'
		},
		{
			name: 'items',
			type: 'Array',
			default: [],
			list: [{
				name: 'active',
				type: 'string',
				default: ''
			}]
		}
	],
	'问卷': [{
		name: 'items',
		type: 'DeepObject',
		default: '{}',
		Object: {
			name: 'questionnaireList',
			type: 'Array',
			default: [],
			list: [{
				name: 'surveyTemplateQuesDTOList',
				type: 'Array',
				default: [],
				list: [{
						name: 'answer',
						type: 'string',
						default: ''
					},
					{
						name: 'supplementAnswerFile',
						type: 'string',
						default: ''
					},
					{
						name: 'supplementAnswerText',
						type: 'string',
						default: ''
					},
					{
						name: 'surveyTemplateOptionDTOList',
						type: 'Array',
						default: [],
						list: [{
								name: 'supplementAnswerFile',
								type: 'string',
								default: ''
							},
							{
								name: 'supplementAnswerText',
								type: 'string',
								default: ''
							}
						]
					}
				]
			}]
		}
	}],
	'交底问卷': [{
			name: 'items',
			type: 'DeepObject',
			default: '{}',
			Object: {
				name: 'questionnaireList',
				type: 'Array',
				default: [],
				list: [{
					name: 'surveyTemplateQuesDTOList',
					type: 'Array',
					default: [],
					list: [{
							name: 'answer',
							type: 'string',
							default: ''
						},
						{
							name: 'supplementAnswerFile',
							type: 'string',
							default: ''
						},
						{
							name: 'supplementAnswerText',
							type: 'string',
							default: ''
						},
						{
							name: 'surveyTemplateOptionDTOList',
							type: 'Array',
							default: [],
							list: [{
									name: 'supplementAnswerFile',
									type: 'string',
									default: ''
								},
								{
									name: 'supplementAnswerText',
									type: 'string',
									default: ''
								}
							]
						}
					]
				}]
			}
		},
		{
			name: 'formRemark',
			type: 'string',
			default: ''
		},
		{
			name: 'fileAudio',
			type: 'string',
			default: ''
		},
		{
			name: 'fileImage',
			type: 'string',
			default: ''
		}
	]
}


/**
 * 表单缓存
 * 相关页面：
 * 外部验收、内部验收、pages/construction/acceptance/acceptanceManagement
 * 巡检 pages/construction/patrolInspection/patrolInspection
 * sop交底问卷 pages/construction/disclosure/addDisclosure
 * 量房交底问卷 pages/construction/measuringRoom/measuringRoomForm
 * 材料测量问卷 pages/construction/measurement
 *
 * */
class formCache {

	constructor(option) {
		this.list = uni.getStorageSync('cacheList') || []
		this.listBack = uni.getStorageSync('cacheListBack') || []
		this.comparisonDataStatus = false
		this.index = 1
	}


	/**
	 * 1.因为问卷有默认答案，所以进入页面先自动保存一份，离开页面时再用当前数据跟缓存数据进行对比 
	 * 2.自动保存一份成功之后再返回一份数据，因为进入页面时需要进行数据回显	
	 * 2.0 => 2.1 自动保存一份成功之后再返回一份数据,根据用户操作判断是否进行数据回显
	 * @description 第一次进入时查看是否有缓存了，没有则保存当前数据，有则取缓存中的数据
	 */
	initCache(data, callback) {
		this.saveCache(data, 'cacheListBack', 'listBack', () => {
			let tempCacheData = this.list.find(item => item.cacheId == data.cacheId)
			callback && callback(tempCacheData)
		})
	}




	/**
	 * 1.提示是否需要缓存该数据
	 * 2.若数据未空，则不用提示，不缓存
	 * 3.若已缓存，则对比当前数据跟缓存中的数据是否有差异，有则弹出提示
	 * 4.isCache =>因为问卷有默认答案，所以
	 * data: 当前数据
	 * type: 缓存页面
	 * tempParameter: 需要对比的参数集合
	 * */
	contrastCache(data, type) {
		this.saveCache(data, 'cacheList', 'list')
	}


	/**
	 * 保存缓存 =>如果之前有数据了，则直接覆盖，否则添加新的数据
	 * data: 需要缓存的数据
	 * cacheKey 缓存key
	 * listKey  数组key
	 * */
	saveCache(data, cacheKey, listKey, callback) {
		if (this[listKey].length > 0) {
			let tempList = []
			let resultList = []
			let cacheIdList = []
			this[listKey].map(item => {
				cacheIdList.push(item.cacheId)
				if (item.cacheId == data.cacheId) {
					item.data = data
					item.createdTime = moment().format("YYYY-MM-DD HH:mm:ss")
				}
			})
			if (!cacheIdList.includes(data.cacheId)) {
				tempList.push({
					cacheId: data.cacheId,
					cacheName: '',
					data: data,
					createdTime: moment().format("YYYY-MM-DD HH:mm:ss")
				})
			}
			resultList = [...this[listKey], ...tempList]
			uni.setStorageSync(cacheKey, resultList)
			callback && callback()
		} else {
			// cacheId的值在sop节点上为nodeId，在工作台上为projectId
			// cacheName 预留为 sop节点名称、工作台名称
			this[listKey].push({
				cacheId: data.cacheId,
				cacheName: '',
				data: data,
				createdTime: moment().format("YYYY-MM-DD HH:mm:ss")
			})
			uni.setStorageSync(cacheKey, this[listKey])

			callback && callback()
		}
	}

	/**
	 * 清除缓存
	 * data: 需要缓存的数据
	 * */
	removelCache(data, type, callback) {
		if (this.list.length > 0) {
			let tempList = this.list.filter(item => item.cacheId !== data.cacheId)
			uni.setStorageSync('cacheList', tempList)
			if (type == '问卷') {
				let tempListBack = this.listBack.filter(item => item.cacheId !== data.cacheId)
				uni.setStorageSync('cacheListBack', tempListBack)
			}
			callback && callback()
		}
	}

	/**
	 * 赋值
	 * data：需要缓存的数据
	 * */
	assignmentCache(data, callback) {
		let resultForm = this.list.find(item => item.cacheId == data.cacheId)
		if (resultForm) {
			callback && callback(resultForm.data)
		} else {
			callback && callback(data)
		}
	}

	/**
	 * 查询出备份缓存 
	 *
	 */
	selectCache(cacheId) {
		return this.listBack.find(item => item.cacheId == cacheId)
	}


	/**
	 *  通过cacheId 获取缓存的数据,用于提示用户
	 *  
	 * */
	getCacheTime(cacheId) {
		return this.list.find(item => item.cacheId == cacheId)
	}


	/**
	 *  通过cacheId 获取缓存，判断缓存提示是否显示
	 *  data 当前数据
	 *  type 缓存页面(问卷、巡检、验收、量房)
	 * */
	isCacheTimeShow(data, type) {
		let tempCache = this.getCacheTime(data.cacheId)
		if (tempCache) {
			let tempParameter = parameterMap[type]
			this.comparisonData(data, tempParameter, tempCache && tempCache.data)
		} else {
			this.comparisonDataStatus = false
		}
		return this.comparisonDataStatus
	}

	/**
	 * 对比当前数据跟缓存中的数据是否相同
	 * cacheData：需要缓存的数据
	 * data：当前数据
	 * parameter: 需要对比的参数集合
	 * */
	comparisonData(data, parameter, cacheData) {
		// console.log(`第${this.index++}次进入`);
		if (!parameter) {
			return
		}
		try {
			parameter.forEach(el => {
				switch (el.type) {
					case 'string':
						if (cacheData) {
							if (data[el.name] !== '[]' || cacheData[el.name] !== '[]') {
								if (cacheData[el.name] == '[]' && data[el.name] == undefined) {

								} else {
									if (cacheData[el.name] !== data[el.name]) {
										throw `cacheData[el.name]==>${cacheData[el.name]},data[el.name]==>${data[el.name]},字段名称==>${el.name}`
									}
								}
							}
						} else {
							if (data[el.name]) {
								if (data[el.name] !== '[]' && data[el.name] != el.default) {
									throw `el.name==>${el.name},data[el.name]==>${data[el.name]},el.default==>${el.default},字段名称==>${el.name}`
								}
							}
						}
						break
					case 'Array':
						if (cacheData) {
							if (data[el.name].length > 0) {
								let tempCacheData = cacheData[el.name]
								let tempDataList = data[el.name]
								let tempParameter = el.list

								if (data[el.name].length !== cacheData[el.name].length) {
									throw el
								} else {
									tempDataList.forEach((tempData, index) => {
										this.comparisonData(tempData, tempParameter, tempCacheData[
											index])
									})
								}
							}
						} else {
							if (data[el.name].length > 0) {
								let tempDataList = data[el.name]
								let tempParameter = el.list
								tempDataList.forEach((tempData, index) => {
									this.comparisonData(tempData, tempParameter, '')
								})
							}
						}
						break
					case 'Object':
						if (JSON.stringify(data[el.name]) !== '{}') {
							throw el
						}
						break
					case 'DeepObject':
						Object.keys(data[el.name]).forEach((key) => {
							if (el.Object.name == key) {
								if (data[el.name][key].length > 0) {
									// 需要缓存的数据
									let tempCacheData = ''
									if (cacheData) {
										tempCacheData = cacheData[el.name][key]
									}
									// 当前数据
									let tempDataList = data[el.name][key]
									// 需要对比的参数
									let tempParameter = el.Object.list

									tempDataList.forEach((tempData, index) => {
										if (tempCacheData) {
											this.comparisonData(tempData, tempParameter,
												cacheData ? tempCacheData[index] : '')
										}
									})
								}
							}
						})

						break
				}
			})
		} catch (e) {
			// console.error(e);
			this.comparisonDataStatus = true
		}
	}


	/**
	 * 监听表单数据是否发生变化
	 * 
	 */
	defineReactive(obj, key, val) {
		Object.defineProperty(obj, key, {
			get: function() {
				return val
			},
			set: function(newVal) {
				if (newVal === val) {
					return
				}
				val = newVal
			}
		})
	}


	/**
	 * 观察者函数
	 */
	observe(obj, vm) {
		for (let key of Object.keys(obj)) {
			this.defineReactive(vm, key, obj[key])
		}
	}


}
export default formCache
