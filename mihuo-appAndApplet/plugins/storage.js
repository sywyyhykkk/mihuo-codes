/**
  interface DB {
    url: string    // 网络地址（唯一）
    local: string  // 本地地址
  }
 */
import tabInit from '@/plugins/im/tabInit.js';
import {
	tabSqls
} from '@/plugins/im/tabSqls.js';
class Storage {
	constructor(name) {

	}
	// 获取缓存
	get storage() {

	}
	// 设置缓存
	set storage(data = []) {}
	// 插入数据
	insert({
		url,
		local,
		timestamp = 0
	}) {
		if (!url || !local) return;
		tabInit.insertFileAllData(tabSqls.FileList, [{
			Date: timestamp,
			LocalPath: local,
			NetPath: url
		}])
	}
	// 删除数据
	async delete(obj = {}) {
		//删除文件
		//console.log(obj)
		await tabInit.deleteFiles(tabSqls.FileList, {
			NetPath: obj.url
		})
	}
	// 查询数据
	async select(obj = {}) {
		const data = await tabInit.getFileInfo(tabSqls.FileList, `where NetPath = '${obj.url}'`)
		if (data.length) {
			return [{
				...data[0],
				local: data[0].LocalPath,
				url: data[0].NetPath
			}]
		} else {
			return []
		}
	}
	// 清空数据
	clear() {
		this.storage = []
	}
}
//im缓存的文件这个不能清除 除非用户自身清除缓存。
export const imgcache = new Storage('imgcache')
//这是功能里面的文件可以自动清除
export const funimgcache = new Storage('funimgcache')
