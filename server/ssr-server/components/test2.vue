<template>
  <div class="pdf-container" v-if="props.data.data">
    <img
      src="https://www.51mihuo.com/static/images/mihuo-logo-dark.png"
      class="mihuo-logo"
    />
    <img
      src="https://www.51mihuo.com/static/images/mihuo-applet.png"
      class="mihuo-applet"
    />
    <h2 id="acceptance-title" class="main-title" style="margin-top: 25px">
      {{ props.data.data.name }}
    </h2>
    <div class="header-info flex-center">
      <div>
        <span id="label">地址：</span
        ><span id="address">{{ getProjectAddress }}</span>
      </div>
      <div>
        <span id="label">报告人：</span
        ><span id="name"
          >{{ props.data.data.acceptanceCreatePersonName }}-{{
            props.data.data.acceptanceCreatePersonTel
          }}</span
        >
        <span id="label">报告日期：</span
        ><span id="time">{{ props.data.data.acceptanceCreateTime }}</span>
      </div>
    </div>
    <div
      class="acceptance-result flex-center"
      :style="{
        backgroundColor:
          props.data.data.statusFlag === '1'
            ? 'rgb(126, 171, 85)'
            : 'rgb(196, 85, 80)'
      }"
    >
      <div class="acceptance-result-text">验收结果</div>
      <div class="acceptance-result-text" id="acceptance-result">
        {{ props.data.data.statusFlag === '1' ? '通过' : '未通过' }}
      </div>
    </div>
    <div id="acceptance-des" v-if="props.data.data.checkDesc">
      {{ props.data.data.checkDesc }}
    </div>
    <div class="acceptance-table flex-center">
      <div class="acceptance-table-header acc-header-1">序号</div>
      <div class="acceptance-table-header acc-header-2">验收项目</div>
      <div class="acceptance-table-header acc-header-4">验收标准</div>
      <div class="acceptance-table-header acc-header-3">结果</div>
    </div>
    <div
      id="acceptance-table-contents"
      v-for="(item, index) in props.data.data.items"
      :key="index"
      :style="{
        backgroundColor:
          index % 2 !== 0 ? 'rgb(245, 245, 245)' : 'rgb(255, 255, 255)',
        borderBottom:
          index === props.data.data.items.length - 1
            ? '1px solid #e5e5e5'
            : 'none'
      }"
    >
      <div
        id="acceptance-item"
        class="flex-center"
        style="align-items: stretch"
      >
        <div class="acc-item-1" id="item-index">{{ index + 1 }}</div>
        <div class="acc-item-2 text-overflow-hidden" id="item-name">
          {{ item.itemName }}
        </div>
        <!-- 验收标准 -->
        <div class="acc-item-4">
          {{ item.standard }}
          <div class="flex-center acc-item-imgs">
            <img
              v-for="(img, imgIndex) in getImage(item.standardImg)"
              :key="imgIndex"
              :src="img.url"
              class="item-img"
            />
          </div>
        </div>
        <div
          class="acc-item-3"
          id="item-result"
          :style="{
            color: item.passFlag == 1 ? 'rgb(126, 171, 85)' : 'rgb(196, 85, 80)'
          }"
        >
          {{ item.passFlag == 1 ? '通过' : '不通过' }}
        </div>
      </div>
      <div
        class="acc-item-problem"
        v-if="item.appendQues && item.passFlag != 1"
      >
        存在问题:{{ item.appendQues }}
        <div class="flex-center acc-item-imgs">
          <img
            v-for="(img, imgIndex) in getProblemImage(item.appendPicFiles)"
            :key="imgIndex"
            :src="img"
            class="item-img"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {
        data: {
          id: '892',
          projectId: '1947',
          districtName: '西山区',
          latAddress: '永昌办事处云兴路99号附3(螺蛳湾派出所旁)',
          poiName: '花溪村清汤鹅(永昌店)',
          address: '14',
          templateId: '40',
          checkType: '2',
          nodeId: '41421',
          name: '标准的验收模版',
          score: 60,
          unqualifiedCount: 0,
          qualifiedCount: 1,
          notCount: 0,
          checkDesc: null,
          picFiles: '[]',
          voiceFiles: null,
          acceptanceQues: null,
          acceptancePlan: null,
          items: [
            {
              templateItemId: '53',
              itemName: '设计师的验收模版',
              standard: '严格按照量房参数进行验收',
              score: 60,
              checkFlag: '1',
              standardImg: 'b0ce8856efc248a4afb4f4dedd104869.png',
              sort: 1,
              part: '1',
              dealJobIds: '11',
              passFlag: '1',
              appendPicFiles: '',
              appendVoiceFile: '',
              appendQues: '',
              appendPlan: ''
            }
          ],
          acceptanceCreateTime: '2023-03-21 17:28:46',
          acceptanceCreatePersonId: '693',
          acceptanceCreatePersonName: '顾尧',
          acceptanceCreateSkillName: '项目管家',
          acceptanceCreatePersonTel: '13769587647',
          applyPersonId: null,
          applyDesc: null,
          applyTime: null,
          times: 1,
          acceptancePicFiles: null,
          acceptanceVoiceFiles: null,
          statusFlag: '1'
        }
      }
    }
  },
  isShowLog: {
    type: Boolean,
    default: false
  }
})

const config = useRuntimeConfig()
const IMAGE_URL = config.public.IMAGE_URL
const IMAGE_THUMBNAIL =
  '?x-image-process=image/resize,m_fixed,w_100/marker,u_plus'

const getImage = (imgStr: string) => {
  if (!imgStr) return []
  const arr = imgStr.split(',').map((item) => {
    return {
      url: IMAGE_URL + item + IMAGE_THUMBNAIL
    }
  })
  return arr
}

console.log('------------文件服务器地址------------', IMAGE_URL)

const getProblemImage = (jsonStr: string) => {
  if (!jsonStr) return []
  const arr = JSON.parse(jsonStr).map(
    (item: any) =>
      (item.url =
        item.type === 'img'
          ? IMAGE_URL + item.url.replace(IMAGE_URL, '') + IMAGE_THUMBNAIL
          : '')
  )
  return arr
}

const getProjectAddress = computed(() => {
  const { districtName, latAddress, poiName, address } = props.data.data
  return (
    (districtName || '') +
    (latAddress || '') +
    (poiName || '') +
    (address || '')
  )
})

if (props.isShowLog) {
  console.log('-------------验收报告-------------', props.data.data)
}
</script>

<style scoped>
.acceptance-result {
  width: calc(100% - 20px);
  height: 60px;
  margin-top: 10px;
  justify-content: space-between;
  padding: 0 10px;
}

.acceptance-result-text {
  color: white;
  font-weight: bold;
}

#acceptance-des {
  width: calc(100% - 20px);
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  background-color: rgb(228, 239, 220);
  color: rgb(128, 128, 128);
  font-weight: bold;
}

.acceptance-table {
  width: 100%;
  height: max-content;
}

.acceptance-table-header {
  height: 40px;
  background-color: #e5e5e5;
  line-height: 40px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  margin-top: 20px;
}

.acc-header-1 {
  width: 10%;
}

.acc-header-2 {
  width: 30%;
}

.acc-header-3 {
  width: 20%;
}

.acc-header-4 {
  width: 40%;
}

#acceptance-table-contents {
  width: calc(100% - 2px);
  border: 1px #e5e5e5 solid;
}

#acceptance-item {
  width: 100%;
  line-height: 40px;
  font-size: 12px;
  border-bottom: 1px #e5e5e5 dashed;
}

#acceptance-table-contents > :last-of-type {
  border-bottom: none;
}

.acc-item-1 {
  width: 10%;
  min-height: 40px;
  height: max-content;
  text-align: center;
}

.acc-item-2 {
  width: 30%;
  border-left: 1px #e5e5e5 solid;
  padding-left: 5px;
}

.acc-item-3 {
  width: 20%;
  min-height: 40px;
  height: max-content;
  text-align: center;
}

.acc-item-4 {
  width: 40%;
  min-height: 40px;
  height: max-content;
  padding-left: 5px;
  text-align: left;
  border-left: 1px #e5e5e5 solid;
  border-right: 1px #e5e5e5 solid;
}

.acc-item-imgs {
  height: max-content;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 10px;
}

.acc-item-problem {
  min-height: 40px;
  height: max-content;
  padding-left: 10%;
  font-size: 12px;
  line-height: 40px;
  font-weight: bold;
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
