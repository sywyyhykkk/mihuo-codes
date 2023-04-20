<template>
  <div>
    <div id="container" />
    <div class="info">
      <div class="input-item">
        <input
          id="input_id"
          v-model="searchValue"
          class="map-input"
          type="text"
          placeholder="请输入关键字搜索"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { ElMessageBox } from 'element-plus/es'

// @ts-ignore
window._AMapSecurityConfig = {
  securityJsCode: process.env.VUE_APP_MAP_JSCODE
}

export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      searchValue: '',
      map: null as any
    })

    onMounted(async () => {
      initMap()
    })

    onUnmounted(() => {
      state.map.destroy()
    })

    // key：fc56433012cdbbfa584037c87c87baf2  JS_CODE：8ad4a5e2f9494e28176172a06ca78910

    const initMap = () => {
      AMapLoader.load({
        // @ts-ignore
        key: process.env.VUE_APP_MAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.ToolBar, AMap.Scale', 'AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.CitySearch', 'AMap.Geolocation', 'AMap.Geocoder'] // 需要使用的的插件列表，如比例尺'AMap.Scale等
      }).then((AMap: any) => {
        state.map = new AMap.Map('container', { // 设置地图容器id
          viewMode: '3D', // 是否为3D地图模式
          zoom: 14 // 初始化地图级别
        })

        // 工具栏
        state.map.plugin('AMap.ToolBar', function() {
          state.map.addControl(new AMap.ToolBar())
        })
        // // 比例尺
        state.map.plugin('AMap.Scale', function() {
          state.map.addControl(new AMap.Scale())
        })
        if (props.modelValue.latitude && props.modelValue.longitude) {
          // 设置地图中心点
          var marker: any = new AMap.Marker({
            icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
            position: [props.modelValue.longitude, props.modelValue.latitude] // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          })

          state.map.add(marker)

          AMap.plugin('AMap.Geocoder', function() {
            const geocoder = new AMap.Geocoder({
              // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
              city: '010'
            })

            const lnglat = [props.modelValue.longitude, props.modelValue.latitude]

            geocoder.getAddress(lnglat, (status: any, result: any) => {
              if (status === 'complete' && result.info === 'OK') {
                // result为对应的地理位置详细信息
                console.log(result)
                var infoWindow = new AMap.InfoWindow({
                  anchor: 'bottom-right',
                  content: props.modelValue.latAddress || result.regeocode.formattedAddress, // 使用默认信息窗体框样式，显示信息内容
                  position: [props.modelValue.longitude, props.modelValue.latitude]
                })

                infoWindow.open(state.map, state.map.setCenter([props.modelValue.longitude, props.modelValue.latitude]))
              }
            })
          })
        } else {
          // 不知道为啥官方的地图初始中心出不来，只能这种搞了
          AMap.plugin('AMap.CitySearch', function() {
            const citySearch = new AMap.CitySearch()
            citySearch.getLocalCity(function(status: any, result: any) {
              if (status === 'complete' && result.info === 'OK') {
                // 查询成功，result即为当前所在城市信息
                console.log(result)
                AMap.plugin('AMap.Geocoder', function() {
                  const geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                    city: result.city
                  })

                  geocoder.getLocation(result.city, function(status: any, result: any) {
                    if (status === 'complete' && result.info === 'OK') {
                      // result中对应详细地理坐标信息
                      console.log(result)
                      state.map.setCenter(result.geocodes[0].location)
                    }
                  })
                })
              }
            })
          })
        }
        // 先定位当前所在城市
        AMap.plugin('AMap.CitySearch', function() {
          const citySearch = new AMap.CitySearch()
          citySearch.getLocalCity(function(status: any, result: any) {
            if (status === 'complete' && result.info === 'OK') {
              // 搜索补全提示
              AMap.plugin('AMap.AutoComplete', function() {
                // 实例化AutoComplete
                const autoOptions = {
                  // input 为绑定输入提示功能的input的DOM ID
                  input: 'input_id',
                  city: result.city,
                  citylimit: true
                }

                const autoComplete = new AMap.AutoComplete(autoOptions)
                // 无需再手动执行search方法，autoComplete会根据传入input对应的DOM动态触发search
                const placeSearch = new AMap.PlaceSearch({
                  map: state.map
                })

                // 点击搜索提示时在地图上显示标记点
                autoComplete.on('select', (res: any) => {
                  placeSearch.setCity(res.poi.adcode)
                  placeSearch.search(res.poi.name)
                })
                // 点击标记点时获取标记点位置
                placeSearch.on('markerClick', (e: any) => {
                  ElMessageBox.confirm(`是否选择${e.data.name}?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    emit('getLocation', e.data)
                  })
                })
              })
            }
          })
        })
      })
    }

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.map-input {
  &:focus {
    border: none;
  }
}

#container {
  padding: 0 !important;
  margin: 0 !important;
  width: 100%;
  height: 40rem;
}

.info {
  width: 30rem;
  border-radius: 2rem;
  background-color: #FFF0EB;
  position: absolute;
  color: #fff;
  top: 0;
  left: 1rem;
  padding: 1.5rem;
  margin: 1rem 0 0 0;

  .input-item {
    width: 100%;
  }
}
</style>
