<template>
  <div class="main-container" v-if="data && data.data">
    <!-- 变更报告 -->
    <ChangeReport v-if="reportType === 1" :data="data.data" :dict="dictData.data" :isShowLog="isShowLog" />
    <!-- 交底报告 -->
    <DisclosureReport v-if="reportType === 2" :data="data.data" :isShowLog="isShowLog" />
    <!-- 验收报告 -->
    <AcceptanceReport v-if="reportType === 3" :data="data.data" :isShowLog="isShowLog" />
    <!-- 巡检报告 -->
    <InspectionReport v-if="reportType === 4" :data="data.data" :isShowLog="isShowLog" />
    <!-- B端变更报告 -->
    <ChangeRecordReport v-if="reportType === 5" :data="data.data" :isShowLog="isShowLog" />
  </div>
</template>

<script setup>
const route = useRoute()
const reportType = +route?.query?.type
const dataId = route?.query?.id
const urlEnv = +route?.query?.urlEnv
// 是否显示数据日志 0=显示 1=不显示
const isShowLog = +route?.query?.log === 0 ? true : false
const data = ref(null)
const baseUrl = ref('')
const headers = useRequestHeaders(['authorization'])
let url = ''
const dictData = ref(null)

// urlEnv 1=dev 2=test 3=uat 4=prod
switch (urlEnv) {
  case 1:
    baseUrl.value = 'http://dev.51mihuo.com:9999/'
    break
  case 2:
    baseUrl.value = 'https://api-test.51mihuo.com/'
    break
  case 3:
    baseUrl.value = 'https://api-uat.51mihuo.com/'
    break
  case 4:
    baseUrl.value = 'https://api.51mihuo.com/'
    break
  default:
    break
}

console.log('------------BASE URL------------', baseUrl.value)

switch (reportType) {
  case 1:
    // 变更报告
    url += `order/bizorderalteration/alterationById?id=${dataId}`
    break
  case 2:
    // 交底报告
    url += `order/order_disclose/disclose/get/${dataId}`
    break
  case 3:
    // 验收报告
    url += `order/bizorderacceptance/getAcceptance/${dataId}`
    break
  case 4:
    // 巡检报告
    url += `order/sopinspect/${dataId}`
    break
  case 5:
    // B端变更报告
    url += `order/projectalterationrecord/queryDetailByPrint/${dataId}`
    break
  default:
    break
}

// 获取字典
const getDictType = async (type) => {
  dictData.value = await useFetch(
    baseUrl.value + `admin/dict/type?type=${type}`,
    {
      server: true,
      headers: {
        Authorization: headers['authorization']
      }
    }
  )
}

getDictType('order_alteration_type')

if (headers['authorization']) {
  console.log('------------数据接口------------', baseUrl.value + url)
  data.value = await useFetch(baseUrl.value + url, {
    server: true,
    headers: {
      Authorization: headers['authorization']
    }
  })
}
</script>
