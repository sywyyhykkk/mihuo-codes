<template>
  <div style="height: 70vh;overflow-y: auto;position: relative">
    <div style="display: flex;align-items: center;" id="data_#">
      <el-input
        v-model="state.searchValue"
        id="input_id"
        placeholder="请输入城市名"
        prefix-icon="Search"
        class="my-search"
        @change="handelClick"
      />
      <el-button type="text" style="margin-left: 20px" @click="handelClick">搜索</el-button>
    </div>
    <div class="history-city">
      当前/历史：{{ props.modelValue }}
    </div>

    <div class="scroll-data">
      <div class="hot-citys-title">热门城市</div>
      <div class="hot-citys">
        <el-button v-for="(item,index) in state.hotCitys" :key="index" @click="handelSelect(addressCity(item.address))">
          {{ addressCity(item.address) }}
        </el-button>
      </div>

      <div class="city-data" id="scrollCity">
        <div v-for="(item,index) in state.cityData" :key="index">
          <div class="city-id" :class="state.activeId == `data_${item._id}` ? 'blinking' : ''" :id="`data_${item._id}`">
            {{ item._id }}
          </div>
          <div class="city-item" v-for="(item2,index2) in item.data" :key="index2"
               @click="handelSelect(addressCity(item2.address))">
            {{ addressCity(item2.address) }}
          </div>
        </div>

      </div>
    </div>
    <div class="anchor-arr">
      <div class="arr-item" :class="state.activeId == `data_#`?'active-arr':''" @click="handelClickArr('#')">#</div>
      <div class="arr-item" v-for="(item,index) in state.anchorArr" :key="index">
        <span :class="state.activeId == `data_${item}`?'active-arr':''" @click="handelClickArr(item)">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { fetch } from '../../pages/admin/axios-config/axios'
import { onMounted, ref, reactive, defineEmits, defineProps, computed, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }, visible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'update:visible'])

const state = reactive({
  anchorArr: [] as any,
  cityData: [] as any,
  tempCityData: [] as any,
  hotCitys: [] as any,
  searchValue: '',
  activeId: 'data_#'

})


let anchorArr: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X',
  'Y', 'Z'
]
let kList: any = [{
  sort: 1,
  _id: 'A',
  data: []
}, {
  sort: 2,
  _id: 'B',
  data: []
}, {
  sort: 3,
  _id: 'C',
  data: []
},
  {
    sort: 4,
    _id: 'D',
    data: []
  }, {
    sort: 5,
    _id: 'E',
    data: []
  }, {
    sort: 6,
    _id: 'F',
    data: []
  },
  {
    sort: 7,
    _id: 'G',
    data: []
  }, {
    sort: 8,
    _id: 'H',
    data: []
  }, {
    sort: 9,
    _id: 'I',
    data: []
  },
  {
    sort: 10,
    _id: 'J',
    data: []
  }, {
    sort: 11,
    _id: 'K',
    data: []
  }, {
    sort: 12,
    _id: 'L',
    data: []
  },
  {
    sort: 13,
    _id: 'M',
    data: []
  }, {
    sort: 14,
    _id: 'N',
    data: []
  }, {
    sort: 15,
    _id: 'O',
    data: []
  },
  {
    sort: 16,
    _id: 'P',
    data: []
  }, {
    sort: 17,
    _id: 'Q',
    data: []
  }, {
    sort: 18,
    _id: 'R',
    data: []
  },
  {
    sort: 19,
    _id: 'S',
    data: []
  }, {
    sort: 20,
    _id: 'T',
    data: []
  }, {
    sort: 21,
    _id: 'U',
    data: []
  },
  {
    sort: 22,
    _id: 'V',
    data: []
  }, {
    sort: 23,
    _id: 'W',
    data: []
  }, {
    sort: 24,
    _id: 'X',
    data: []
  },
  {
    sort: 25,
    _id: 'Y',
    data: []
  }, {
    sort: 26,
    _id: 'Z',
    data: []
  }
]

const handelSelect = (val: any) => {
  emit('update:modelValue', val)
  emit('update:visible', false)
}

const handelClickArr = (val: string) => {
  state.activeId = `data_${val}`
  //滚动到指定dom的位置
  let dom: any = document.getElementById(state.activeId)
  dom.scrollIntoView(true)
}

const handelClick = () => {
  let res: any = []
  state.tempCityData.forEach((item: any) => {
      let list: any = item.data.filter((item2: any) => item2.address.includes(state.searchValue))
      let obj = {
        ...item
      }
      if (list.length > 0) {
        obj.data = list
        res.push(obj)
      }
    }
  )
  state.cityData = res
}

//运营商城市名处理
const addressCity = (operatorName: any) => {
  if (!operatorName) return ' '
  let cities = ['北京市', '天津市', '上海市', '重庆市']
  let province = operatorName.split(' ')[0] // 省份名称
  let city = operatorName.split(' ')[1] // 城市名称
  if (cities.indexOf(province) !== -1) {
    // 如果是直辖市, 则使用省份名称
    return province
  }
  return city
}

//获取运营商所在的城市列表
const getCityList = async () => {
  await fetch({
    url: '/admin/cityoperator/list',
    method: 'get'
  }).then((res: any) => {
    state.hotCitys = res.data.slice(0, 4)
    let dataList = JSON.parse(JSON.stringify(kList))
    let dataCityLetter: any = []
    res.data.forEach((item: any) => {
      let index = dataList.findIndex((value: any) => {
        return value._id === item.letter.toUpperCase()
      })
      if (!dataCityLetter.find((mitem: any) => mitem == item.letter.toUpperCase())) {
        dataCityLetter.push(item.letter.toUpperCase())
      }
      if (index !== -1) {
        dataList[index].data.push(item)
      }
    })

    state.anchorArr = dataCityLetter.sort()
    state.cityData = dataList.filter((item: any) => item.data.length > 0)
    state.tempCityData = state.cityData
  })
}

const handleScroll = () => {
  //获取元素高度
  let scrollTop = document.querySelector('#scrollCity').scrollTop
  //获取滚动条所在位置的元素
  var sections: any = document.getElementsByClassName('city-id')
  if (scrollTop == 0) {
    state.activeId = 'data_#'
    return
  }
  for (var i = sections.length - 1; i >= 0; i--) {
    if (scrollTop >= sections[i].offsetTop) {
      state.activeId = sections[i].id
      break
    }
  }
}


onMounted(() => {
  getCityList()
  // console.log(domScroll.value)
  addEventListener('scroll', handleScroll, true)
})


onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="less">

.my-search {
  width: 35rem !important;
  margin-left: 20px;

  :deep(.el-input__inner) {
    border-radius: 36px !important;
  }
}

.active-arr {
  color: @mainColor !important;
}

.blinking {
  background-color: #F6F6F6;
  animation: blinking-animation 2s linear;
}

@keyframes blinking-animation {
  from {
    background-color: #F6F6F6;
  }

  50% {
    background-color: rgba(102, 102, 102, .2);
  }

  to {
    background-color: #F6F6F6;
  }
}

.anchor-arr {
  position: fixed;
  right: 20px;
  bottom: 0;
  top: 12rem;

  .arr-item {
    width: 30px;
    font-size: 12px;
    color: #606266;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
}

.history-city {
  font-size: 14px;
  color: #909399;
  margin-left: 20px;
  line-height: 60px;
  border-bottom: solid 1px #F5F7FA;
}

.scroll-data {
  margin-top: 20px;
}

.city-data {
  margin-top: 20px;
  position: absolute;
  width: 100%;
  height: calc(100% - 25rem);
  overflow-y: auto;


  .city-id {
    font-size: 12px;
    color: #4c4c4c;
    line-height: 40px;
    background: #F6F6F6;
    padding-left: 10px;
  }

  .city-item {
    font-size: 12px;
    color: #909399;
    line-height: 40px;
    padding-left: 30px;
    cursor: pointer;

    &:active {
      color: @mainColor;
    }
  }
}

.hot-citys-title {
  font-size: 16px;
  font-weight: bold;
  color: #4c4c4c;
}

.hot-citys {
  margin-top: 20px;
  margin-right: 30px;
  display: flex;
  flex-wrap: wrap;
}

</style>
