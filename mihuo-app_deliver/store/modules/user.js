import imsdk from '@/plugins/im/imsdk.js';
import tabInit from '@/plugins/im/tabInit.js';
import imHttp from '@/config/imRequest.js';
import storage from '@/plugins/storage.js';
import {
	toDescription
} from '@/static/js/chat.js'
const xsoftmsdk = require('@/plugins/im/xsoftimsdk.js')
import {
	tabSqls
} from '@/plugins/im/tabSqls.js';
import {
	createTopMessage
} from '@/plugins/utils.js'
export const state = {
	//用户数据
	userInfo: {},
	userData: {},
	imUserInfo: uni.getStorageSync('imUserInfo') || {},
	//单人聊天群里面的消息
	messageSessionList: [],
	normalList: [],
	SocketTask: '',
	groupList: [],
	groupUserList: [],
	num: 1,
	size: 15,
	uuid:'',
	netStatus: true, 
	searchHistory: [],
	currentChatId: 0, //当前聊天的imid;
	//待确认的全局弹出的订单集合
	waitOrderList: [],
	uabModule: '',
	webUmidToken: ''
};
export const mutations = {
	SET_UUID(state, data) {
		state.uuid = data;
	},
	lisinNetStatus(state, data) {
		state.netStatus = data;
	},
	//储存用户信息
	setUserInfo(state, data) {
		if (data) {
			state.userInfo = Object.assign({}, state.userInfo, data);
			// #ifdef H5
			// window.sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo));
			uni.setStorageSync('userInfo', state.userInfo);
			// #endif
			// #ifndef H5
			uni.setStorageSync('userInfo', state.userInfo);
			// #endif
		}
	},
	setUserData(state, data) {
		if (data) {
			state.userData = data;
			uni.setStorageSync('userData', state.userData);
		}
	},
	// webscoket初始化
	async WEBSOCKET_INIT(state, data) {
		if (!data) return;
		let deviceGuid = uni.getStorageSync('deviceGuid');
		if (!deviceGuid) {
			uni.setStorageSync('deviceGuid', xsoftmsdk.common.Guid());
			deviceGuid = uni.getStorageSync('deviceGuid');
		}
		if (data) {
			state.imUserInfo = Object.assign({}, state.imUserInfo, data);
			// #ifdef H5
			window.sessionStorage.setItem('imUserInfo', JSON.stringify(state.imUserInfo));
			// #endif
			// #ifndef H5
			uni.setStorageSync('imUserInfo', state.imUserInfo);
			// #endif
			await tabInit.init();
			// 聊天表初始完成后开始 更新会话
			tabInit.getSessionList(tabSqls.SessionList, {}, 'ChangeTime', 'desc').then(async res => {
				if (!res.length) {
					const dataList = await imHttp.get('/api/Sync/SyncSessionInfos');
					state.messageSessionList = dataList.length ? dataList : [];
					tabInit.insertAllData(tabSqls.SessionList, dataList.reverse())
					return
				}
				const setTop = res.filter(item => item.IsTopMost == "1" || item.IsTopMost ==
					"true");
				const noTop = res.filter(item => item.IsTopMost == "0" || item.IsTopMost ==
					"false");
				setTop.sort((a, b) => b.ChangeTime - a.ChangeTime);
				noTop.sort((a, b) => b.LastTime - a.LastTime);
				state.messageSessionList = [...setTop, ...noTop];
			});
		}
		imsdk.init({
			callNormal: async (normalMessage) => {
				console.log(normalMessage)
				let Content = JSON.parse(normalMessage.CustomContent);
				let normal = {
					KeyID: Content.GuidMini,
					...normalMessage
				}
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].route // 获取当前页面路由
				// 如果路由是当前页面则插入聊天,否则弹出提示框
				const sessionData = {
					"SessionId": 0,
					"UserId": normal.SourceId == state.imUserInfo.imId ? normal
						.SourceId : normal
						.TargetId,
					"TargetId": normal.SourceId == state.imUserInfo.imId ? normal
						.TargetId : normal
						.SourceId,
					"TargetName": '',
					"TargetAvatarFileId": 0,
					"Type": xsoftmsdk.enums.SessionType.Normal,
					"LastTime": normal.ChangeTime,
					"LastContent": toDescription(normal),
					"UnreadCount": 0,
					"IsTopMost": 0,
					"ChangeTime": normal.ChangeTime,
					"CustomField": JSON.stringify({
						TargetName: normal.TargetName
					})
				};
				if (curRoute == 'pages/message/chat/index') {
					if (normal.SourceId == state.currentChatId || normal.TargetId ==
						state
						.currentChatId) {
						if (normal.SourceId != state.imUserInfo.imId) {
							state.normalList.push(normal)
						} else {
							//判断本地是否有消息。
							let localMessage = false;
							for (let index = state.normalList.length - 1; index >=
								0; index--) {
								if (JSON.parse(state.normalList[index].CustomContent)
									.GuidMini == JSON
									.parse(normal.CustomContent).GuidMini) {
									localMessage = true;
									if (normal.Type == xsoftmsdk.enums.ContentType
										.Text) {
										state.normalList.splice(index, 1);
										state.normalList.splice(index, 0, normal);
										break;
									}
									if (normal.Type == xsoftmsdk.enums.ContentType
										.Image) {
										let data = state.normalList[index];
										data.Id = normal.Id;
										break;
									}
									if (normal.Type == xsoftmsdk.enums.ContentType
										.Voice) {
										let data = state.normalList[index];
										data.Id = normal.Id;
										state.normalList.splice(index, 1);
										state.normalList.splice(index, 0, data);
										break;
									} else {
										let data = state.normalList[index];
										data.Id = normal.Id;
										state.normalList.splice(index, 1);
										state.normalList.splice(index, 0, data);
										break;
									}
								}
							}
							if (!localMessage) {
								state.normalList.push(normal)
							}
						}
					}
					sessionData.UnreadCount = 0;
					const selectData = state.messageSessionList.find(item => item
						.TargetId == sessionData.TargetId);
					if (selectData) {
						sessionData.IsTopMost = selectData.IsTopMost;
					}
				} else {
					const selectData = state.messageSessionList.find(item => item
						.TargetId ==
						sessionData
						.TargetId);
					if (selectData) {
						sessionData.IsTopMost = selectData.IsTopMost;
						if (normal.SourceId != state.imUserInfo.imId) {
							sessionData.UnreadCount = selectData.UnreadCount + 1;
						}
					} else {
						sessionData.UnreadCount = 1;
					}
				}
				const findData = state.messageSessionList.filter(item => item
					.TargetId !=
					sessionData
					.TargetId);
				findData.push(sessionData);
				//console.log(findData)
				const setTop = findData.filter(item => (item.IsTopMost && item
					.IsTopMost ==
					"true"));
				const noTop = findData.filter(item => (!item.IsTopMost || item
					.IsTopMost ==
					"false"));
				setTop.sort((a, b) => b.ChangeTime - a.ChangeTime);
				noTop.sort((a, b) => b.ChangeTime - a.ChangeTime);
				//console.log(setTop,noTop)
				state.messageSessionList = [...setTop, ...noTop];
				let customeContent = JSON.parse(normal.CustomContent);
				let message = {
					KeyID: customeContent.GuidMini,
					...normal,
					Status: 1,
				}
				// 判断本地存的用户是否存在
				const data = await tabInit.getImUserInfo(tabSqls['ImUser'],
					`where ImId=${sessionData.TargetId}`);
				if (data.length) {
					sessionData.TargetName = data[0].Name;
					sessionData.TargetAvatarFileId = data[0].UserId;
				} else {
					const res = await imHttp.post('/api/Sync/SyncUserInfo', {
						ids: [sessionData.TargetId]
					});
					sessionData.TargetName = res[0].Name;
					//头像从自定义里面解析
					const custome = res[0].CustomField ? JSON.parse(res[0]
							.CustomField) :
						'';
					sessionData.TargetAvatarFileId = res[0].UserId;
					tabInit.writeImUserInfo(tabSqls.ImUser, {
						ImId: sessionData.TargetId,
						...res[0],
					})
				}
				//自己发的消息不能弹框和会话加1
				if (normal.SourceId != state.imUserInfo.imId && curRoute !=
					'pages/message/chat/index') {
					createTopMessage({
						title: sessionData.TargetName || '新消息',
						payload: JSON.stringify(sessionData),
						content: sessionData.LastContent
					})
				}
				delete message.IsOffline;
				tabInit.insertMessage(tabSqls.NormalMessage, message);
				tabInit.updateData(tabSqls.SessionList, sessionData);
			},
			callGroup: async (groupMessage) => {
				console.log(groupMessage)
				let Content = groupMessage.CustomContent ? JSON.parse(groupMessage
					.CustomContent) : '';
				let group = {
					KeyID: Content.GuidMini,
					...groupMessage
				}
				let imUser = uni.getStorageSync('imUserInfo');
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].route //获取当前页面路由
				//如果路由是当前页面则插入聊天,否则弹出提示框
				const sessionData = {
					"SessionId": 0,
					"UserId": group.SourceId,
					"TargetId": group.GroupId,
					"TargetName": '',
					"TargetAvatarFileId": 0,
					"Type": xsoftmsdk.enums.SessionType.Group,
					"LastTime": group.ChangeTime,
					"LastContent": toDescription(group),
					"UnreadCount": 0,
					"IsTopMost": 0,
					"ChangeTime": group.ChangeTime
				};
				//人员判断是否存在
				const data = await tabInit.getImUserInfo(tabSqls['ImUser'],
					`where ImId=${group.SourceId}`);
				if (!data.length) {
					const res = await imHttp.post('/api/Sync/SyncUserInfo', {
						ids: [group.SourceId]
					});
					tabInit.writeImUserInfo(tabSqls.ImUser, {
						ImId: group.SourceId,
						...res[0]
					})
					state.groupUserList.push({
						ImId: group.SourceId,
						...res[0]
					});
				}
				const groupPage = ['pages/message/group/index']
				if (groupPage.includes(curRoute)) {
					if (group.SourceId != imUser.imId && group.GroupId == state
						.currentChatId) {
						// 其他人发送的消息
						state.groupList.push(group)
					} else {
						for (let index = state.groupList.length - 1; index >=
							0; index--) {
							if (JSON.parse(state.groupList[index].CustomContent)
								.GuidMini ==
								JSON.parse(
									group.CustomContent).GuidMini) {
								if (group.Type == xsoftmsdk.enums.ContentType.Text) {
									state.groupList.splice(index, 1);
									state.groupList.splice(index, 0, group);
									break;
								}

								if (group.Type == xsoftmsdk.enums.ContentType.Image) {
									let data = state.groupList[index];
									data.Id = group.Id;
									state.groupList.splice(index, 1);
									state.groupList.splice(index, 0, data);
									break;
								}
								if (group.Type == xsoftmsdk.enums.ContentType.Voice) {
									let data = state.groupList[index];
									data.Id = group.Id;
									state.groupList.splice(index, 1);
									state.groupList.splice(index, 0, data);
									break;
								} else {
									let data = state.groupList[index];
									data.Id = group.Id;
									state.groupList.splice(index, 1);
									state.groupList.splice(index, 0, data);
									break;
								}
							}
						}
					}
					sessionData.UnreadCount = 0;
					const selectData = state.messageSessionList.find(item => item
						.TargetId ==
						sessionData
						.TargetId);
					if (selectData) {
						sessionData.IsTopMost = selectData.IsTopMost;
					}
				} else {
					// 弹出顶部提示框
					const selectData = state.messageSessionList.find(item => item
						.TargetId ==
						sessionData
						.TargetId);
					if (selectData) {
						sessionData.IsTopMost = selectData.IsTopMost;
						if (group.SourceId != state.imUserInfo.imId) {
							sessionData.UnreadCount = selectData.UnreadCount + 1;
						}
					} else {
						sessionData.UnreadCount = 1;
					}
				}
				const findData = state.messageSessionList.filter(item => item
					.TargetId !=
					sessionData
					.TargetId);
				findData.push(sessionData);
				const setTop = findData.filter(item => (item.IsTopMost && item
					.IsTopMost ==
					"true"));
				const noTop = findData.filter(item => (!item.IsTopMost || item
					.IsTopMost ==
					"false"));
				setTop.sort((a, b) => b.ChangeTime - a.ChangeTime);
				noTop.sort((a, b) => b.ChangeTime - a.ChangeTime);
				state.messageSessionList = [...setTop, ...noTop];
				let customeContent = JSON.parse(group.CustomContent);
				let message = {
					KeyID: customeContent.GuidMini,
					...group,
					Status: 1,
				}
				const dataGroup = await tabInit.getImUserInfo(tabSqls['ImUser'],
					`where ImId=${group.GroupId}`)
				if (dataGroup.length) {
					//判断我是不是这群的客户还是客服
					const customerInfo = dataGroup[0] ? JSON.parse(dataGroup[0]
							.CustomField) :
						'';
					//console.log(dataGroup, customerInfo, imUser.imId)
					if (customerInfo && customerInfo.type == "staff_group") {
						if (customerInfo.customerImId == imUser.imId) {
							sessionData.TargetName = dataGroup[0].Name;
						} else {
							sessionData.TargetName = dataGroup[0].Name + '-' + customerInfo
							.customer;
						}
					} else {
						sessionData.TargetName = dataGroup[0].Name;
					}
					sessionData.TargetAvatarFileId = dataGroup[0].UserId;
				} else {
					const resGroup = await imHttp.get('/api/Group/GetGroup?groupId=' +
						group
						.GroupId);
					sessionData.TargetName = resGroup.Name;
					sessionData.TargetAvatarFileId = resGroup.GroupId;
					tabInit.writeImUserInfo(tabSqls.ImUser, {
						ImId: resGroup.GroupId,
						UserId: 0,
						Name: resGroup.Name,
						AvatarFileId: resGroup.GroupId,
						CustomField: resGroup.CustomField,
						Type: xsoftmsdk.enums.MessageTypeEnum.Group
					})
				}
				// 消息
				if (!groupPage.includes(curRoute) && group.SourceId != state.imUserInfo
					.imId) {
					createTopMessage({
						title: sessionData.TargetName,
						payload: JSON.stringify(sessionData),
						content: sessionData.LastContent
					})
				}
				delete message.IsOffline;
				tabInit.insertMessage(tabSqls.GroupMessage, message);
				tabInit.updateData(tabSqls.SessionList, sessionData);
			},
			callMessageRecall: async (sourceId, messageId, targetId, isGroup) => {
				let imUser = uni.getStorageSync('imUserInfo');
				// 下面的处理是在用户和撤回的消息都存在的情况下的处理
				//群聊的撤回
				if (isGroup) {
					let sessionData;
					let messageTargetId = sourceId == imUser.imId ? targetId : sourceId;
					sessionData = state.messageSessionList.find(item => item.TargetId ==
						messageTargetId);
					// 查询撤回的消息是否存在
					const recallMessage = tabInit.getImUserInfo(tabSqls
						.GroupMessage, `where Id = ${messageId}`)
					if (recallMessage.length) {
						tabInit.editData(tabSqls.GroupMessage, {
							Type: xsoftmsdk.enums.ContentType.ReCall
						}, "Id", messageId);
					} else {
						let message = {
							KeyID: xsoftmsdk.common.GuidMini(),
							Id: messageId,
							GroupId: targetId,
							AtUsers: 0,
							CustomContent: JSON.stringify({
								GuidMini: xsoftmsdk.common.GuidMini(),
							}),
							SharpUsers: 0,
							ReferenceId: 0,
							SourceId: sourceId,
							CreateTime: Math.floor(new Date().getTime() /
								1000),
							ChangeTime: Math.floor(new Date().getTime() /
								1000),
							MessageType: xsoftmsdk.enums.SessionType.Group,
							Type: xsoftmsdk.enums.ContentType.ReCall,
							Content: '',
							FileId: '',
							SourceName: '',
							SourceAvatarId: '',
							CustomType: '',
							Status: ''
						}
						tabInit.insertMessage(tabSqls.GroupMessage, message);
					}
					if (sessionData) {
						if (state.currentChatId == messageTargetId) {
							for (let index = state.groupList.length - 1; index >=
								0; index--) {
								if (state.groupList[index].Id == messageId) {
									let message = state.groupList[index];
									message.Type = xsoftmsdk.enums.ContentType.ReCall;
									state.groupList.splice(index, 1);
									state.groupList.splice(index, 0, message);
									// #ifdef APP
									const data = await tabInit.getImUserInfo(tabSqls[
											'ImUser'],
										`where ImId=${sourceId}`);
									if (data.length) {
										const userName = data.length ? data[0].Name :
											'';
									} else {
										const userdata = await imHttp.post(
											'/api/Sync/SyncUserInfo', {
												ids: [group.SourceId]
											});
										const userName = userdata.Name;
									}
									// #endif
									// #ifdef MP
									const userdata = await imHttp.post(
										'/api/Sync/SyncUserInfo', {
											ids: [group.SourceId]
										});
									const userName = userdata.Name;
									// #endif
									sessionData.LastContent =
										`${imUser.imId==sourceId?'你':userName}撤回了一条消息`;
									// #ifdef APP-PLUS
									tabInit.updateData(tabSqls.SessionList,
										sessionData);
									// #endif

								}
							}

						} else {
							if (state.imUserInfo.imId == sourceId) {
								let userName = '你'
							} else {
								// #ifdef APP
								const data = await tabInit.getImUserInfo(tabSqls[
										'ImUser'],
									`where ImId=${sourceId}`);
								if (data.length) {
									let userName = data.length ? data[0].Name :
										'';
								} else {
									const userdata = await imHttp.post(
										'/api/Sync/SyncUserInfo', {
											ids: [group.SourceId]
										});
									let userName = userdata.Name;
								}
								// #endif
								// #ifdef MP
								const userdata = await imHttp.post(
									'/api/Sync/SyncUserInfo', {
										ids: [group.SourceId]
									});
								let userName = userdata.Name;
								// #endif
							}
							sessionData.LastContent = `${userName}撤回了一条消息`;
							// #ifdef APP-PLUS
							tabInit.updateData(tabSqls.SessionList,
								sessionData);
							// #endif
						}
					} else {
						const group = await imHttp.get('/api/Group/GetGroup?groupId=' +
							targetId);
						if (state.imUserInfo.imId == sourceId) {
							let userName = '你'
						} else {
							// #ifdef APP
							const data = await tabInit.getImUserInfo(tabSqls[
									'ImUser'],
								`where ImId=${sourceId}`);
							if (data.length) {
								let userName = data.length ? data[0].Name :
									'';
							} else {
								const userdata = await imHttp.post(
									'/api/Sync/SyncUserInfo', {
										ids: [group.SourceId]
									});
								let userName = userdata.Name;
							}
							// #endif
							// #ifdef MP
							const userdata = await imHttp.post(
								'/api/Sync/SyncUserInfo', {
									ids: [group.SourceId]
								});
							let userName = userdata.Name;
							// #endif
						}
						const sessionData = {
							"SessionId": 0,
							"UserId": sourceId,
							"TargetId": targetId,
							"TargetName": group.Name,
							"TargetAvatarFileId": 0,
							"Type": xsoftmsdk.enums.SessionType.Group,
							"LastTime": Math.floor(new Date().getTime() / 1000),
							"LastContent": `${userName}撤回了一条消息`,
							"UnreadCount": 0,
							"IsTopMost": 0,
							"ChangeTime": Math.floor(new Date().getTime() / 1000),
							"CustomField": JSON.stringify({
								TargetName: group.Name,
							})
						};
						state.state.messageSessionList.unshift(sessionData)
						tabInit.updateData(tabSqls.SessionList, sessionData);
					}
				} else {
					let sessionData;
					let messageTargetId = sourceId == imUser.imId ? targetId : sourceId;
					sessionData = state.messageSessionList.find(item => item.TargetId ==
						messageTargetId);
					// 查询撤回的消息是否存在
					const recallMessage = tabInit.getImUserInfo(tabSqls
						.NormalMessage, `where Id = ${messageId}`)
					if (recallMessage.length) {
						tabInit.editData(tabSqls.NormalMessage, {
							Type: xsoftmsdk.enums.ContentType.ReCall
						}, "Id", messageId);
					} else {
						let message = {
							KeyID: xsoftmsdk.common.GuidMini(),
							Id: messageId,
							TargetId: sourceId == imUser.imId ? targetId : sourceId,
							ReferenceId: 0,
							SourceId: sourceId == imUser.imId ? sourceId : sourceId,
							CreateTime: Math.floor(new Date().getTime() /
								1000),
							ChangeTime: Math.floor(new Date().getTime() /
								1000),
							Type: xsoftmsdk.enums.ContentType.ReCall,
							MessageType: xsoftmsdk.enums.SessionType.Normal,
							Content: '',
							FileId: 0,
							SourceName: '',
							CustomContent: JSON.stringify({
								GuidMini: xsoftmsdk.common.GuidMini(),
							}),
							SourceAvatarId: 0,
							CustomType: 0,
							Status: 1
						}
						tabInit.insertMessage(tabSqls.NormalMessage, message);
					}
					//单聊消息的撤回
					if (state.currentChatId == messageTargetId) {
						for (let index = state.normalList.length - 1; index >=
							0; index--) {
							if (state.normalList[index].Id == messageId) {
								let message = state.normalList[index];
								message.Type = xsoftmsdk.enums.ContentType.ReCall;
								state.normalList.splice(index, 1);
								state.normalList.splice(index, 0, message);
								let sessionData
								if (sourceId == imUser.imId) {
									// 我撤回
									sessionData = state.messageSessionList.find((
										item =>
										item.TargetId == targetId));
								} else {
									// 对面撤回
									sessionData = state.messageSessionList.find((
										item =>
										item.TargetId == sourceId));
								}
								sessionData.LastContent =
									`${imUser.imId==sourceId?'你':'对方'}撤回了一条消息`;
								// #ifdef APP-PLUS
								tabInit.updateData(tabSqls.SessionList, sessionData);
								// #endif
							}
						}

					} else {
						sessionData.LastContent =
							`${imUser.imId==sourceId?'你':'对方'}撤回了一条消息`;
						// #ifdef APP-PLUS
						tabInit.updateData(tabSqls.SessionList, sessionData);
						// #endif
					}
				}
			},
			callMessageUpdate(message, isgroup) {
				console.log(message)
			},
			callGroupUpdate(group) {
				const sessionItem = state.messageSessionList.find(item => item.TargetId ==
					group
					.GroupId);
				sessionItem.TargetName = group.Name;
				tabInit.getImUserInfo(tabSqls.SessionList,
						`where TargetId=${group.GroupId}`)
					.then(res => {
						const sessionData = {
							...res[0]
						};
						sessionData.TargetName = group.Name;
						tabInit.updateData(tabSqls.SessionList, sessionData);
					});
			},
			callUpdateSession(session) {

			},
			onGroupInvite: (creator, group, isConfirm, time) => {
				const sessionData = {
					"SessionId": 0,
					"UserId": group.sourceId,
					"TargetId": group.groupId,
					"TargetName": group.name,
					"TargetAvatarFileId": 0,
					"Type": 2,
					"LastTime": time,
					"LastContent": `${creator}邀请你加入该群`,
					"UnreadCount": 0,
					"IsTopMost": 0,
					"ChangeTime": time
				};
				tabInit.updateData(tabSqls.SessionList, sessionData);
			}
		})
		imsdk.errorClose((res) => {
			console.log(res);
		})
	},
	// 消息监听
	WEBSOCKET_ONMESSAGE(state) {},
	// 会话列表的数据加载
	WEBSOCKET_SESSIONLIST(state) {},
	// 会话列表的删除
	WEBSOCKET_DELETESESSIONLIST(state, data) {
		state.messageSessionList.forEach(function(item, index) {
			if (item.TargetId == data.TargetId && item.Type == data.Type) {
				state.messageSessionList.splice(index, 1);
				tabInit.deleteSession(tabSqls.SessionList, {
					'UserId': data.UserId,
					'Type': data.Type
				})
				imHttp.post(`/api/Session/DeleteSession`, {
					"targetId": data.TargetId,
					"type": data.Type
				})
				return;
			}
		});
	},
	// 会话列表的置顶
	WEBSOCKET_SETTOPSESSIONLIST(state, data) {
		data.IsTopMost = "true";
		state.messageSessionList.forEach(function(item, index) {
			if (item.TargetId == data.TargetId && item.Type == data.Type) {
				state.messageSessionList.splice(index, 1);
				return;
			}
		});
		//console.log(data);
		state.messageSessionList.unshift(data);
		tabInit.updateData(tabSqls.SessionList, data);
	},
	//取消置顶
	WEBSOCKET_CANCELTOPSESSIONLIST(state, data) {
		data.IsTopMost = 0;
		data.ChangeTime = Math.floor((new Date().getTime()) / 1000)
		state.messageSessionList.forEach(function(item, index) {
			if (item.TargetId == data.TargetId && item.Type == data.Type) {
				state.messageSessionList.splice(index, 1);
				return;
			}
		});
		//console.log(data);
		const setTop = state.messageSessionList.filter(item => (item.IsTopMost && item.IsTopMost == "true"));
		const noTop = state.messageSessionList.filter(item => (!item.IsTopMost || item.IsTopMost == "false"));
		setTop.sort((a, b) => b.ChangeTime - a.ChangeTime);
		noTop.unshift(data);
		state.messageSessionList = [...setTop, ...noTop]
		tabInit.updateData(tabSqls.SessionList, data);
	},
	// 单聊初始化进入
	WEBSOCKET_NORMAL(state, data) {
		const {
			TargetId
		} = data;
		state.num = 1;
		state.currentChatId = TargetId;
		const myIm = uni.getStorageSync('imUserInfo');
		const myImUserId = myIm.imId;
		const where =
			`where (SourceId=${myImUserId} and TargetId=${TargetId}) or (TargetId=${myImUserId} and SourceId=${TargetId})`
		tabInit.getMessage(tabSqls.NormalMessage, state.num, state.size, where, 'ChangeTime', 'desc').then(
			res => {
				state.normalList = res;
				if (!res.length) {
					imHttp.get('/api/Message/GetNormalMessages', {
						targetId: TargetId,
						index: 1,
						size: 20
					}).then(message => {
						if (!message.length) return;
						state.normalList.push(...message.reverse());
						const insertList = message.reverse();
						insertList.forEach(item => {
							let customeContent = JSON.parse(item.CustomContent);
							item.KeyID = customeContent.GuidMini;
							item.Status = 1;
						})
						tabInit.insertAllData(tabSqls.NormalMessage, insertList,
							'replace')
					})
				}
				//本地用户的更新
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === "none") {} else {
							imHttp.post('/api/Sync/SyncUserInfo', {
								ids: [TargetId]
							}).then(res => {
								tabInit.updateData(tabSqls.ImUser, {
									ImId: TargetId,
									...res[0],
								})
							});
						}
					}
				})

			});
		const index = state.messageSessionList.findIndex(item => item.TargetId == TargetId);
		if (index > -1) {
			state.messageSessionList[index].UnreadCount = 0
		};
		//会话未读数量的更新数据库
		tabInit.editData(tabSqls.SessionList, {
			UnreadCount: 0
		}, "TargetId", TargetId);
		imHttp.post('/api/Session/ReadSession', {
			"targetId": TargetId,
			"type": xsoftmsdk.enums.SessionType.Normal
		}).then(res => {
			//console.log(res);
		})
	},
	// 群聊的消息进入
	WEBSOCKET_GROUP(state, data) {
		const {
			TargetId
		} = data;
		state.num = 1;
		state.currentChatId = TargetId;
		const myIm = uni.getStorageSync('imUserInfo');
		const myImUserId = myIm.imId;
		if (!myImUserId) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			return;
		}
		const where = `where GroupId=${TargetId}`
		tabInit.getMessage(tabSqls.GroupMessage, state.num, state.size, where, 'ChangeTime', 'desc').then(
			res => {
				state.groupList.push(...res);
				if (!res.length) {
					imHttp.get('/api/Message/GetGroupMessages', {
						groupId: TargetId,
						index: 1,
						size: 20
					}).then(message => {
						if (!message.length) return;
						state.groupList.push(...message.reverse());
						const insertList = message.reverse();
						insertList.forEach(item => {
							let customeContent = JSON.parse(item.CustomContent);
							item.KeyID = customeContent.GuidMini;
							item.Status = 1;
						})
						tabInit.insertAllData(tabSqls.GroupMessage, insertList,
							'replace')
					})
				}
				const ids = state.groupList.map(item => item.SourceId);
				tabInit.getImUserInfo(tabSqls['ImUser'], `where ImId in (${ids.join(',')})`).then(
					res => {
						state.groupUserList.push(...res)
					})
				//这里再通过接口把这个群的人员的信息 这里就没事没网就不更新有网络了更新
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === "none") {} else {
							//这里再加个判断如果同步过那么就隔一天同步一次
							//没有则同步一次
							tabInit.getImUserInfo(tabSqls['GroupImUser'],
								`where GroupId = ${TargetId}`).then(res => {
								const cureentDay = new Date().getDate();
								if (!res.length) {
									imHttp.get('/api/Group/GetGroupUsers?groupId=' +
										TargetId).then(
										res => {
											const user = res.map(item => ({
												ImId: item.UserId,
												...item,
											}))
											const groupuser = res.map(item => ({
												GroupIdAndImId: TargetId +
													'' + item.UserId,
												ImId: item.UserId,
												GroupId: TargetId,
												...item,
											}))
											tabInit.insertAllData(tabSqls.ImUser, user,
												'replace')
											tabInit.insertAllData(tabSqls.GroupImUser,
												groupuser,
												'replace')
										})
								} else if (cureentDay % 2 == 0) {
									imHttp.get('/api/Group/GetGroupUsers?groupId=' +
										TargetId).then(
										res => {
											//console.log(res);
											const user = res.map(item => ({
												ImId: item.UserId,
												...item,
											}))
											const groupuser = res.map(item => ({
												GroupIdAndImId: TargetId +
													'' + item.UserId,
												ImId: item.UserId,
												GroupId: TargetId,
												...item,
											}))
											tabInit.insertAllData(tabSqls.ImUser, user,
												'replace')
											tabInit.insertAllData(tabSqls.GroupImUser,
												groupuser,
												'replace')
										})
								}
							})
						}
					}
				});
			});
		const index = state.messageSessionList.findIndex(item => item.TargetId == TargetId);
		if (index > -1) {
			state.messageSessionList[index].UnreadCount = 0
		};
		//会话未读数量的更新
		tabInit.editData(tabSqls.SessionList, {
			UnreadCount: 0
		}, "TargetId", TargetId);
		//服务端同步已读的消息
		imHttp.post('/api/Session/ReadSession', {
			"targetId": TargetId,
			"type": xsoftmsdk.enums.SessionType.Group
		}).then(res => {
			//console.log(res);
		})
	},
	// 聊天列表的清空
	WEBSOCKET_CHATCLEAR(state) {
		state.num = 1;
		state.normalList = [];
		state.groupList = [];
	},
	// 上滑加载消息
	WEBSOCKET_LOADNORMAL(state, data) {
		state.num++;
		const {
			TargetId
		} = data;
		const myIm = state.imUserInfo || uni.getStorageSync('imUserInfo');
		const myImUserId = myIm.imId;
		const where =
			`where (SourceId=${myImUserId} and TargetId=${TargetId}) or (TargetId=${myImUserId} and SourceId=${TargetId})`
		tabInit.getMessage(tabSqls.NormalMessage, state.num, state.size, where, 'ChangeTime', 'desc').then(
			res => {
				if (!res.length) return;
				state.normalList = [...res, ...state.normalList];
				//state.normalList.unshift(...res);
			});
	},
	// 消息撤回
	recallMessage(state, item) {
		imHttp.post('/api/Message/RecallMessage', item).then(res => {
			uni.hideLoading();
		});
	},
	// 退出APP
	emptyUserInfo(state) {
		state.userInfo = {};
		state.userData = {};
		state.imUserInfo = {};
		state.messageSessionList = []
		uni.removeStorageSync('imUserInfo')
		// #ifdef H5
		window.sessionStorage.removeItem("userInfo");
		// #endif
		// #ifndef H5
		uni.removeStorageSync("userInfo");
		// #endif
	},
	saveSearchHistory(state, data) {
		if (data) {
			let list = uni.getStorageSync('searchHistory');
			if (!list) {
				list = [];
			}
			list = list.filter(item => {
				return item.keyword !== data.keyword;
			})
			list.push(data);

			// 根据搜索时间倒序排序
			list.sort((a, b) => {
				if (a.searchTime > b.searchTime) return -1;
				if (a.searchTime < b.searchTime) return 1;
				return 0;
			});
			state.searchHistory = list;
			uni.setStorageSync('searchHistory', state.searchHistory);
		}
	},
	delSearchHistory(state, id) {
		if (id) {
			let list = uni.getStorageSync('searchHistory');
			state.searchHistory = list.filter(item => item.id !== id);
			uni.setStorageSync('searchHistory', state.searchHistory);
		}
	},
	clearSearchHistory(state) {
		state.searchHistory = [];
		uni.removeStorageSync('searchHistory');
	}
};
export const actions = {

};
