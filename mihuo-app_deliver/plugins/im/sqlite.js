import {
	deepClone
} from '../utils.js'
export const openDb = (name) => {
	//如果数据库存在则打开，不存在则创建。
	return new Promise((resolve, reject) => {
		plus.sqlite.openDatabase({
			name: name, //数据库名称
			path: `_doc/${name}.db`, //数据库地址
			success(e) {
				resolve(e);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}
//得到数据库路径
export const getDataPath = (name) => {
	console.log(plus.io.convertLocalFileSystemURL(`_doc/${name}.db`))
}
// 表新增字段
export const addField = (name, tableName, fidleName) => {
	return new Promise((resolve, reject) => {
		//先判断是否有该字段
		plus.sqlite.selectSql({
			name: name,
			sql: `select * from sqlite_master where name='${tableName}' and sql like '%${fidleName}%'`,
			success(data) {
				console.log(data);
				if (!data.length) {
					console.log(`alter table ${tableName} add column ${fidleName} TEXT`)
					plus.sqlite.selectSql({
						name: name,
						sql: `alter table ${tableName} add column ${fidleName} TEXT`,
						success(e) {
							console.log(e)
							resolve(e);
						},
						fail(e) {
							console.log(e)
							reject(e);
						}
					})
				}

			},
			fail(e) {

			}
		})
	})
}
// 查询表的字段
export const getTableField = (name, tableName) => {
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: `PRAGMA table_info([${tableName}])`,
			success(e) {
				console.log(e);
				resolve(e);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}
// 查询所有数据表名
export const getTable = (name) => {
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: "select * FROM sqlite_master where type='table'",
			success(e) {
				resolve(e);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}
// 查询表数据总条数
export const getCount = (name, tabName) => {
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: "select count(*) as num from " + tabName,
			success(e) {
				resolve(e);
			},
			fail(e) {
				reject(e);
			}
		})
	})
}
//有则更新  无则插入
export const replaceSQL = (name, tabName, setData) => {
	if (JSON.stringify(setData) != '{}') {
		let dataKeys = Object.keys(setData)
		let keyStr = dataKeys.toString()
		let valStr = ''
		dataKeys.forEach((item, index) => {
			if (dataKeys.length - 1 == index) {
				valStr += ("'" + setData[item] + "'")
			} else {
				valStr += ("'" + setData[item] + "',")
			}
		})
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: name,
				sql: `replace into ${tabName}(${keyStr}) values (${valStr})`,
				success(e) {
					resolve(e);
				},
				fail(e) {
					//console.log(e,`replace into ${tabName}(${keyStr}) values (${valStr})`)
					reject(e);
				}
			})
		})

	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		});
	}
}
// 查询表是否存在
export const isTable = (name, tabName) => {
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: `select count(*) as isTable FROM sqlite_master where type='table' and name='${tabName}'`,
			success(e) {
				resolve(e[0].isTable ? true : false);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}

// 修改数据
export const updateSQL = (name, tabName, setData, setName, setVal) => {
	if (JSON.stringify(setData) !== '{}') {
		let dataKeys = Object.keys(setData)
		let setStr = ''
		dataKeys.forEach((item, index) => {
			setStr += (
				`${item} = ${JSON.stringify(setData[item])}${dataKeys.length - 1 !== index ? "," : ""}`)
		})
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: name,
				sql: `update ${tabName} set ${setStr} where ${setName} = ${setVal}`,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e);
					reject(e);
				}
			})
		})
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		});
	}
}

//删除数据库数据
export const deleteInformationType = (name, tabName, setData) => {
	if (JSON.stringify(setData) !== '{}') {
		let dataKeys = Object.keys(setData)
		let setStr = ''
		dataKeys.forEach((item, index) => {
			setStr += (
				`${item}=${JSON.stringify(setData[item])}${dataKeys.length - 1 !== index ? " and " : ""}`
			)
		})
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: name,
				sql: `delete from ${tabName} where ${setStr}`,
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e);
				}
			})
		})
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		});
	}
}

//关闭数据库
export const closeSQL = (name) => {
	return new Promise((resolve, reject) => {
		plus.sqlite.closeDatabase({
			name: name,
			success(e) {
				// console.log(e)
				resolve(e);
			},
			fail(e) {
				console.log(e,name)
				reject(e);
			}
		})
	})
}

//监听数据库是否开启
export const isOpen = (name) => {
	let open = plus.sqlite.isOpenDatabase({
		name: name,
		path: `_doc/${name}.db`,
	})
	return open;
}
// 创建表 也可以当作其他的可以直接执行的sql
export const addTab = (name, sql) => {
	// tabName不能用数字作为表格名的开头
	return new Promise((resolve, reject) => {
		plus.sqlite.executeSql({
			name: name,
			sql: sql,
			success(e) {
				resolve(e);
			},
			fail(e) {
				reject(e);
				console.log(e);
			}
		})
	})
}
// 添加数据
export const addTabItem = (name, tabName, obj) => {
	if (obj) {
		let keys = Object.keys(obj)
		let keyStr = keys.toString()
		let valStr = ''
		keys.forEach((item, index) => {
			if (keys.length - 1 == index) {
				valStr += ("'" + obj[item] + "'")
			} else {
				valStr += ("'" + obj[item] + "',")
			}
		})
		let sqlStr = `replace into ${tabName}(${keyStr}) values(${valStr})`
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: name,
				sql: sqlStr,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e);
					reject(e);
				}
			})
		})
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		})
	}
}
// 合并数据
export const mergeSql = (name, tabName, tabs) => {
	if (!tabs || tabs.length == 0) {
		return new Promise((resolve, reject) => {
			reject("错误")
		})
	}
	let itemValStr = ''
	tabs.forEach((item, index) => {
		let itemKey = Object.keys(item)
		let itemVal = ''
		itemKey.forEach((key, i) => {
			if (itemKey.length - 1 == i) {
				if (typeof item[key] == 'object') {
					itemVal += (`'${JSON.stringify(item[key])}'`)
				} else {
					itemVal += (`'${item[key]}'`)
				}
			} else {
				if (typeof item[key] == 'object') {
					itemVal += (`'${JSON.stringify(item[key])}',`)
				} else {
					itemVal += (`'${item[key]}',`)
				}
			}
		})
		if (tabs.length - 1 == index) {
			itemValStr += ('(' + itemVal + ')')
		} else {
			itemValStr += ('(' + itemVal + '),')
		}
	})
	let keys = Object.keys(tabs[0])
	let keyStr = keys.toString()
	return new Promise((resolve, reject) => {
		plus.sqlite.executeSql({
			name: name,
			sql: `insert or ignore into ${tabName} (${keyStr}) values ${itemValStr}`,
			success(e) {
				resolve(e);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}
// 获取分页数据库数据
export const getDataList = async (name, tabName, num, size, where, byName, byType) => {
	let count = 0
	let sql = ''
	let numindex = 0
	await getCount(name, tabName).then((resNum) => {
		count = Math.ceil(resNum[0].num / size)
	})
	if (((num - 1) * size) == 0) {
		numindex = 0
	} else {
		numindex = ((num - 1) * size) + 1
	}
	sql = `select * from ${tabName}`
	if (where) {
		sql += ` ${where}`
	}
	if (byName && byType) {
		// desc asc
		sql += ` order by ${byName} ${byType}`
	}
	sql += ` limit ${numindex},${size}`
	if (count < num - 1) {
		return new Promise((resolve, reject) => {
			reject([])
		});
	} else {
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: name,
				sql: sql,
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e);
				}
			})
		})
	}
}
//直接执行where查询
export const sqlSelect = (name, tabName, where, byName, byType) => {
	let sql = `select * from ${tabName} ${where}`;
	if (byName && byType) {
		// desc asc
		sql += ` order by ${byName} ${byType}`
	}
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: sql,
			success(e) {
				resolve(e);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}
//查询数据库数据
export const selectDataList = (name, tabName, setData, byName, byType) => {
	let setStr = ''
	let sql = ''
	if (JSON.stringify(setData) !== '{}') {
		let dataKeys = Object.keys(setData)
		dataKeys.forEach((item, index) => {
			setStr += (
				`${item}=${JSON.stringify(setData[item])}${dataKeys.length - 1 !== index ? " and " : ""}`
			)
		})
		sql = `select * from ${tabName} where ${setStr}`
	} else {
		sql = `select * from ${tabName}`
	}
	if (byName && byType) {
		// desc asc
		sql += ` order by ${byName} ${byType}`
	}
	if (tabName != undefined) {
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: name,
				sql: sql,
				success(e) {
					resolve(e);
				},
				fail(e) {
					console.log(e)
					reject(e);
				}
			})
		})
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		});
	}
}
export async function insertAll(name, tableName, data = [], type = "insert") {
	let sql = ""
	// 获取数据库的字段
	try {
		let fieldList = await getAllField(name, tableName)
		if (tableName && data.length > 0) {
			// 取交集的字段，才是合法的，能存进数据库的字段（注意：取的字段，是按照第一条数据的字段，进行赋值的）
			let keys = intersection(fieldList, data[0])
			let keyStr = keys.toString()
			sql = `${type=='insert'?'insert':'replace'} into ${tableName} (${keyStr}) values`;
			for (let i = 0; i < data.length; i++) {
				sql += "(";
				for (const [k, v] of keys.entries()) {
					sql += `'${html2Escape(data[i][v])}',`
				}
				sql = sql.substring(0, sql.length - 1)
				sql += "),";
			}
			sql = sql.substring(0, sql.length - 1)
			//console.log("批量插入的sql", sql)
		} else {
			//this.$msg("表名为空或者插入数据为空")
		}
	} catch (e) {
		console.error("批量插入报错", e)
	}
	return executeSql(name, sql)
}
export function intersection(fieldList = [], obj) {
	// 获取数据库的字段
	let arrField = {}
	for (let i in fieldList) {
		arrField[fieldList[i].name] = null
	}
	// 取交集的字段，才是合法的，能存进数据库的字段
	let keys = []
	for (let i in arrField) {
		if (obj.hasOwnProperty(i)) {
			keys.push(i)
		}
	}

	return keys
}
// 获取表的所有字段
export async function getAllField(name, tableName) {
	return selectSql(name, `PRAGMA table_info([${tableName}])`)
}
export const selectSql = (name, sql) => {
	// console.log("查询的sql",sql)
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: sql,
			success(e) {
				resolve(e);
			},
			fail(e) {
				console.log("查询报错", e)
				reject(e);
			}
		})
	})
}
// 防止数据中的 单引号 报错
export function html2Escape(str) {
	if (typeof str === "string") {
		return str.replace(/'/g, "''");
	} else if (typeof str === "object") {
		return JSON.stringify(str).replace(/'/g, "''");
	} else {
		return str
	}
}
// 执行sql语句
export function executeSql(name, sql) {
	return new Promise((resolve, reject) => {
		//创建表格在executeSql方法里写
		// console.log("开始执行自定义sql",sql)
		plus.sqlite.executeSql({
			name: name,
			//表格创建或者打开，后面为表格结构
			sql: sql,
			success(e) {
				resolve(e);
			},
			fail(e) {
				console.log(e);
				reject(e);
			}
		})
	})
}
