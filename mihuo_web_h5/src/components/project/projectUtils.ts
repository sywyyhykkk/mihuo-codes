//根据选材的数据结构，组装返回业务数据
export const getMaterialGroup = (data: any, filed: any, label: any) => {
  let list: any = []
  if (!data || data.length == 0) {
    return list
  } else {
    list = JSON.parse(JSON.stringify(data))

    list.forEach((res: any, index: any) => {
      res.idx = index
      let dataLength: number = 0
      res.label = res.areaName || res.type
      if (res.materialList) {
        res.materialList.forEach((res2: any) => {
          if (res2.productId != 0) {
            dataLength += 1
          }
        })
        res.children = groupData(res.materialList, filed, label, index)
      } else {
        res.children = []
      }
      res.dataLength = dataLength

    })
    console.log(list)
    return list
  }
}

//根据量房数据，分组返回
export const getScapeGroupData = (data: any) => {
  let list: any = []
  if (!data || data.length == 0) {
    return list
  } else {
    list = JSON.parse(JSON.stringify(data))
    list.forEach((res: any) => {
      if (res.children) {
        res.children = groupData(res.children, 'groupNo', 'groupNo', null)
      }
      res.label = res.attributeName
    })
  }
  return list
}

/**
 * [groupingData 根据共同字段将数据分组]
 * @param {[type]} arr [数据源]
 * @param {[type]} field [字段名]
 */
  // 传入两个参数 一个是待分组的数据 一个是按照哪个字段进行分组
export const groupData = (data: any, filed: any, label: any, idx: any) => {
    // map用来保存存过的字段 为下边添加新对象或者将相同字段的数据保存到同一个list中
    let map = {}
    // dest主要保存分组后的数据
    let dest: any = []
    data.forEach((item: any, index: any) => {
      // 判断map对象中是否有遍历时data的key 如果没有则向dest数组中推入一个新的对象(包含两个属性，一个要分组的字段名，一个保存相同字段名数据的数组)
      if (!map[item[filed]]) {
        dest.push({
          idx: `${idx}-${index}`,
          [filed]: item[filed],
          label: item[label],
          childrenMaterial: item.productId == '0' ? [] : [item]
        })
        // 进行一次新添对象的记录
        map[item[filed]] = item
        // 如果在map中有data遍历的key(字段相同) 则向dest数组里面的相同字段的list下推入数据
      } else {
        dest.forEach((dItem: any) => {
          if (dItem[filed] == item[filed]) {
            dItem.childrenMaterial.push(item)
          }
        })
      }
    })

    return dest
  }
