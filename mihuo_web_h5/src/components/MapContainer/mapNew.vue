<template>
  <el-dialog
    v-model="mapDialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="true"
    title="地图"
    width="60rem"
    @close="handelClose"
  >
    <div>
      <div v-if="mapDialogVisible" id="container" />
      <div class="search-map">
        <el-popover
          v-model:visible="visible" placement="right"
          :width="400" trigger="click"
        >
          <template #reference>
            <div class="search-city" @click="visible=true">
              <span>{{ state.city }}</span>
              <el-icon>
                <ArrowDownBold />
              </el-icon>
            </div>
          </template>
          <citySelect v-model="state.city" v-model:visible="visible" />
        </el-popover>
        <el-input
          id="input_id"
          v-model="state.searchValue"
          placeholder="请输入关键字"
          prefix-icon="Search"
          class="my-search"
          @change="handelClick"
        />
        <el-button type="text" @click="handelClick">搜索</el-button>
      </div>
      <ul>
        <el-radio-group v-model="state.radio">
          <li v-for="(item,index) in state.addressList" :key="index">
            <div class="item-group">
              <!--              <div v-for="(item2,index2) in item.photos" :key="index2">-->
              <!--                <el-image-->
              <!--                  v-if="index2==0"-->
              <!--                  class="item-image"-->
              <!--                  preview-teleported-->
              <!--                  lazy-->
              <!--                  :src="item2.url"-->
              <!--                  :preview-src-list="item2.url"-->
              <!--                />-->
              <!--              </div>-->
              <div>
                <div class="item-name">
                  {{ item.name }}
                </div>
                <div class="item-address">
                  {{ item.address }}
                </div>
              </div>
            </div>
            <el-radio
              class="item-radio" :label="item.id"
              @change="handelChange(item)"
            >{{ '' }}</el-radio>
          </li>
        </el-radio-group>
      </ul>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
        <el-button @click="handelClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>

import { defineProps, defineEmits, onMounted, ref, reactive, watchEffect, onUnmounted } from 'vue'

import AMapLoader from '@amap/amap-jsapi-loader'
import { ElMessageBox } from 'element-plus/es'
import { fetch } from '_@/axios-config/axios'
import request from '@/utils/request'
import { delObj } from '_c/util/api/banner'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['update:modelValue', 'update:formData','newAddress'])

const mapDialogVisible = ref<boolean>(false)
const visible = ref<boolean>(false)
const state = reactive({
  searchValue: '',
  map: null as any,
  city: '',
  addressList: [] as any,
  radio: '' as any,
  position: [] as any,
  positionData: {} as any,
  markers: [] as any,// 标记好的点
  cneter: [] as any//坐标地点
})

const handelClose = () => {
  mapDialogVisible.value = false
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  props.formData.adcode = state.positionData.adcode || props.formData.adcode
  props.formData.province = state.positionData.pname || props.formData.province
  props.formData.provinceName = state.positionData.pname || props.formData.provinceName
  props.formData.city = state.positionData.cityname || props.formData.city
  props.formData.cityName = state.positionData.cityname || props.formData.cityName
  props.formData.region = state.positionData.adname || props.formData.region
  props.formData.districtName = state.positionData.adname || props.formData.districtName
  props.formData.latitude = state.positionData.location?.lat || props.formData.latitude
  props.formData.longitude = state.positionData.location?.lng || props.formData.longitude
  props.formData.latAddress = state.positionData.address || props.formData.latAddress
  props.formData.poiName = state.positionData.name || props.formData.poiName
  props.formData.projectAddress = (state.positionData.address || props.formData.latAddress) + (state.positionData.name || props.formData.poiName)

  emit('update:formData', props.formData)
  emit('newAddress',props.formData)
  handelClose()
}

// 搜索
const handelClick = async () => {
  // 无需再手动执行search方法，autoComplete会根据传入input对应的DOM动态触发search
  var placeSearch = new AMap.PlaceSearch({
    city: state.city || '全国'
  })

  placeSearch.search(state.searchValue, (status: any, result: any) => {
    // 搜索成功时，result即是对应的匹配数据
    state.addressList = result.poiList.pois
  })
}

// 选中时查询详情
const handelChange = (data: any) => {
  removeMarkers()
  var placeSearch = new AMap.PlaceSearch({
    city: state.city, // 兴趣点城市
    citylimit: true, // 是否强制限制在设置的城市内搜索
    pageSize: 10, // 单页显示结果条数
    children: 1, // 展示子节点数据
    pageIndex: 1, // 页码
    extensions: 'base' // 返回基本地址信息
  })
  // 详情查询
  placeSearch.getDetails(data.id, (status: any, result: any) => {
    if (status === 'complete' && result.info === 'OK') {
      console.log(result)
      state.positionData = result.poiList.pois[0]
      placeSearch_CallBack(result)
    }
  })
  var infoWindow = new AMap.InfoWindow({
    autoMove: true,
    offset: { x: 0, y: -30 }
  })
  // 回调函数
  const placeSearch_CallBack = (data: any) => {
    var poiArr = data.poiList.pois
    // 添加marker
    var marker = new AMap.Marker({
      map: state.map,
      position: poiArr[0].location
    })
    state.map.setCenter(marker.getPosition())
    infoWindow.setContent(createContent(poiArr[0]))
    infoWindow.open(state.map, marker.getPosition())
    state.markers.push(marker)
  }
  const createContent = (poi: any) => { // 信息窗体内容
    var s = []
    s.push('<b>名称：' + poi.name + '</b>')
    s.push('地址：' + poi.address)
    s.push('电话：' + poi.tel)
    s.push('类型：' + poi.type)
    return s.join('<br>')
  }
}
// 删除点标记
const removeMarkers = () => {
  if (state.markers.length > 0) {
    state.map.remove(state.markers)
  }
}

// 地图初始化
const initMap = () => {
  AMapLoader.load({
    // @ts-ignore
    key: process.env.VUE_APP_MAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.ToolBar, AMap.Scale', 'AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.CitySearch', 'AMap.Geolocation', 'AMap.Geocoder'] // 需要使用的的插件列表，如比例尺'AMap.Scale等
  }).then((AMap: any) => {
    state.map = new AMap.Map('container', { // 设置地图容器id
      viewMode: '3D', // 是否为3D地图模式
      zoom: 14, // 初始化地图级别
      resizeEnable: true, // 初始化地图时，若center属性缺省，地图默认定位到用户所在城市的中心
      center:state.cneter
    })
    AMap.plugin('AMap.CitySearch', function() {
      const citySearch = new AMap.CitySearch()
      citySearch.getLocalCity(function(status: any, result: any) {
        if (status === 'complete' && result.info === 'OK') {
          // 查询成功，result即为当前所在城市信息
          if (!state.city) state.city = sessionStorage.getItem('mapCity') || ''
          if (state.city !== result.city) {
            ElMessageBox.confirm(`检测到您当前所在城市为${result.city},是否定位到当前所在城市`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then((res) => {
              state.city = result.city
              sessionStorage.setItem('mapCity', state.city)
            })
          }
        }
      })
    })

    if (props.formData.latitude && props.formData.longitude) {
      var infoWindow = new AMap.InfoWindow({
        autoMove: true,
        offset: { x: 0, y: -30 }
      })
      const createContent = () => { // 信息窗体内容
        var s = []
        s.push('<b>名称：' + props.formData.poiName || '' + '</b>')
        s.push('地址：' + props.formData.latAddress || '')
        return s.join('<br>')
      }
      var marker = new AMap.Marker({
        map: state.map,
        position: [props.formData.longitude, props.formData.latitude]

      })
      state.map.setCenter(marker.getPosition())
      infoWindow.setContent(createContent())
      infoWindow.open(state.map, marker.getPosition())
      state.markers.push(marker)
      if(state.searchValue) handelClick()
    }
  })
}

watchEffect(() => {
  mapDialogVisible.value = props.modelValue
  if (mapDialogVisible.value) {
    state.city = props.formData.cityName
    if(props.formData.longitude && props.formData.latitude){
      state.cneter=[props.formData.longitude,props.formData.latitude]
    }
    state.searchValue = props.formData?.poiName
    initMap()
  }
})

</script>

<style scoped lang="less">
:deep(.el-radio__inner) {
  border: solid 1px #909399;
}

#container {
  width: calc(100% - 2rem);
  height: 40rem;
}

ul {
  height: calc(75vh - 48rem);
  overflow-y: auto;
  padding: 0 2rem 0 0;

  li {
    display: flex;
    height: auto;
    min-height: 60px;
    width: 100%;
    border-bottom: 1px solid #F5F7FA;
    align-items: center;
    justify-content: space-between;

    .item-group {
      display: flex;

    }

    .item-image {
      height: 60px;
      width: 60px;
      margin-right: 10px;
    }

    .item-name {
      font-size: 16px;
      color: #4c4c4c;
      line-height: 30px;
    }

    .item-address {
      font-size: 14px;
      color: #909399;
      line-height: 30px;
    }

  }
}

.search-map {
  display: flex;
  margin: 10px 20px 10px 0;
  justify-content: space-between;

  .search-city {
    width: 100px;
    display: flex;
    align-items: center;
    cursor: pointer;

    span {
      width: 80px;
      font-size: 14px;
    }
  }

  .my-search {
    width: 35rem !important;

    :deep(.el-input__inner) {
      border-radius: 36px !important;
    }
  }

}

</style>
