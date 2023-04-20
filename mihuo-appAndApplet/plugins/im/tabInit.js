"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
});
import {
	tabSqls
} from '@/plugins/im/tabSqls.js'
import {
	isOpen,
	openDb,
	addTab,
	mergeSql,
	getDataList,
	addTabItem,
	closeSQL,
	deleteInformationType,
	getTable,
	getCount,
	replaceSQL,
	updateSQL,
	isTable,
	getDataPath,
	selectDataList,
	sqlSelect,
	getTableField,
	addField,
	insertAll
} from '@/plugins/im/sqlite.js'
class tabInit {
	constructor(arg) {

	}
	static async init() {
		const imUserInfo = uni.getStorageSync('imUserInfo');
		this.sqlName = imUserInfo ? imUserInfo.imId : '';
		if (!this.sqlName) return;
		//getDataPath(this.sqlName)
		if (uni.getStorageSync('sqliteDataVersion')) {
			let version = uni.getStorageSync('sqliteDataVersion');
			if (!isOpen(this.sqlName)) {
				await openDb(this.sqlName);
			}
			if (tabSqls.dataVersion != Number(version)) {
				if (!isOpen(this.sqlName)) {
					await openDb(this.sqlName);
				}
				//旧表的更修
				if (version > 0) {
					tabSqls.editContent.forEach(async item => {
						addField(this.sqlName, item.name, item.field)
					})
				}
				//新表的建立
				const hasTab = await getTable(this.sqlName);
				uni.setStorageSync('sqliteDataVersion', tabSqls.dataVersion)
				tabSqls.tabName.forEach(async item => {
					let iscreated = hasTab.find(value => value.name == item);
					if (!iscreated) {
						await addTab(this.sqlName, tabSqls[`create${item}Sql`]);
					}
				})
			}
		} else {
			if (!isOpen(this.sqlName)) {
				await openDb(this.sqlName);
			}
			const hasTab = await getTable(this.sqlName);
			uni.setStorageSync('sqliteDataVersion', this.sqlName)
			tabSqls.tabName.forEach(async item => {
				let iscreated = hasTab.find(value => value.name == item);
				if (!iscreated) {
					await addTab(this.sqlName, tabSqls[`create${item}Sql`]);
				}
			})
		}
		this.writeImUserInfo(tabSqls.ImUser, {
			ImId: imUserInfo.imId,
			UserId: 0,
			Name: imUserInfo.name,
			AvatarFileId: imUserInfo.imId,
			CustomField: '',
			Type: 1
		})
	}
	static async fileTableInit() {
		const tableName = "FileCache";
		if (!isOpen(tableName)) {
			await openDb(tableName);
			const hasTab = await getTable(tableName);
			console.log(hasTab)
			tabSqls.fileTabName.forEach(async item => {
				let iscreated = hasTab.find(value => value.name == item);
				if (!iscreated) {
					await addTab(tableName, tabSqls[`create${item}Sql`]);
				}
			})
		} else {
			const hasTab = await getTable(tableName);
			console.log(hasTab)
			tabSqls.fileTabName.forEach(async item => {
				let iscreated = hasTab.find(value => value.name == item);
				if (!iscreated) {
					await addTab(tableName, tabSqls[`create${item}Sql`]);
				}
			})
		}
		getDataPath(tableName)
	}
	static async deleteImUser() {
		if (!isOpen(this.sqlName)) {
			await deleteDbUser(this.sqlName);
		}
	}
	//批量更新文件
	static async insertFileAllData(tabName, data, type) {
		const table = "FileCache";
		if (!isOpen(table)) {
			await openDb(table);
		}
		const dataList = await insertAll(table, tabName, data, type);
	}
	//删除文件 
	static async deleteFiles(tabName,setData) {
	    const table = "FileCache";
		if (!isOpen(table)) {
			await openDb(table);
		}
		await deleteInformationType(table, tabName, setData);
	}
	//查询文件
	static async getFileInfo(tabName, where) {
		const table = "FileCache";
		if (!isOpen(table)) {
			await openDb(table);
		}
		const dataList = await sqlSelect(table, tabName, where);
		return dataList;
	}
	static async closeTableSQL() {
		await closeSQL("FileCache");
		await closeSQL(this.sqlName);
	}
	//用户信息的写入
	static async writeImUserInfo(tabName, setData) {
		if (!isOpen(this.sqlName)) {
			await openDb(this.sqlName);
		}
		await replaceSQL(this.sqlName, tabName, setData);
	}
	//批量更新
	static async insertAllData(tabName, data, type) {
		if (!isOpen(this.sqlName)) {
			await openDb(this.sqlName);
		}
		const dataList = await insertAll(this.sqlName, tabName, data, type);
	}
	static async getImUserInfo(tabName, where) {
		if (!isOpen(this.sqlName)) {
			await openDb(this.sqlName);
		}
		const dataList = await sqlSelect(this.sqlName, tabName, where);
		return dataList;
	}
	//会话列表
	static async getSessionList(tabName, setData, byName, byType) {
		if (!isOpen(this.sqlName)) {
			await openDb(this.sqlName);
		}
		const dataList = await selectDataList(this.sqlName, tabName, setData, byName, byType);
		return dataList;
	}
	//会话列表搜索
	//获取其他文件之类的聊天记录
	static async getSearchSession(tabName, where) {
		if (!isOpen(this.sqlName)) {
			await openDb(this.sqlName);
		}
		const dataList = await sqlSelect(this.sqlName, tabName, where);
		return dataList;
	}
	static async editData(tabName, setData, setName, setVal) {
		if (!isOpen(this.sqlName)) {
			await openDb(this.sqlName);
		}
		await updateSQL(this.sqlName, tabName, setData, setName, setVal);
	}
	static async updateData(tabName, setData) {
		if (!isOpen(this.sqlName)) {
			await openDb(this.sqlName);
		}
		await replaceSQL(this.sqlName, tabName, setData);
	}
	static async deleteSession(tabName, setData) {
		if (!isOpen(this.sqlName)) {
			await openDb(this.sqlName);
		}
		await deleteInformationType(this.sqlName, tabName, setData);
	}
	static async getMessage(tabName, num, size, where, byName, byType) {
		if (!isOpen(this.sqlName)) {
			await openDb(this.sqlName);
		}
		const dataList = await getDataList(this.sqlName, tabName, num, size, where, byName, byType);
		return dataList.reverse();
	}
	static async getFilesList(tabName, where, byName, byType) {
		if (!isOpen(this.sqlName)) {
			await openDb(this.sqlName);
		}
		const dataList = await sqlSelect(this.sqlName, tabName, where, byName, byType);
		return dataList;
	}
	static async insertMessage(tabName, message) {
		if (!isOpen(this.sqlName)) {
			//await closeSQL(this.sqlName);
			await openDb(this.sqlName);
		}
		const data = await addTabItem(this.sqlName, tabName, message);
	}
}
exports.default = tabInit;
