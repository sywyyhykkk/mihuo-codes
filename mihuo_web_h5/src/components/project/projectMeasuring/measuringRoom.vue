<template>
  <div class="measuring">
    <template v-if="data.status>0">
      <div class="measuring_content">
        <div class="col">
          <div>量房日期</div>
          <div>{{ props.data.realEndTime || '' }}</div>
        </div>
        <div class="measuring_content-info">
          <div style="padding-left:1.5rem">量房人</div>
          <div>
            <img v-if="formData.user.avatar" style="border-radius:50%" :src="thumbnailImage(formData.user.avatar)">
            <p>{{ props.data.executePersonName || '' }}</p>
            <i>{{ props.data.executeSkillName || '' }}</i>
          </div>
        </div>
        <div class="measuring-info">
          <img :src="require('@/assets/img/project/house_type_icon.png')">
          <span v-for="(v,i) in spaceName" :key="i">{{ v.num + v.name }}</span>
        </div>
        <div v-if="roomQuery.val.length" class="measuring-query">
          <span v-for="(item,index) in roomQuery.val" :key="index">
            <p>{{ item.attributeName }}</p>
            <span>{{ item.attributeValue || 0 }}{{ item.attributeUnit }}</span>
          </span>
        </div>
        <div v-if="formData.roomInfo.roomImg" class="measuring-img" style="padding-left:1.5rem">
          <el-image
            v-for="(item,index) in formData.roomInfo.roomImg"
            :key="index"
            class="measuring-img_image"
            :preview-src-list="srcList"
            :src="thumbnailImage(item.url)"
            fit="fit"
          />
        </div>
        <p v-if="formData.roomInfo.roomRemark" class="measuring-remark">
          {{ formData.roomInfo.roomRemark }}
        </p>
      </div>
      <div class="measuring-tabs">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="空间信息" name="0">
            <space-info v-if="activeName==0" />
          </el-tab-pane>
          <el-tab-pane label="房屋信息" name="1">
            <room-info v-if="activeName==1" :data="data" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
    <el-empty
      v-else
      :image-size="130"
      description="正在进行中~"
      :image="require('@/assets/img/empty/no_data.png')"
    />
  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref, defineProps, provide, getCurrentInstance, inject } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { thumbnailImage } from '@/components/project/projectItem/projectDetailNewData'

const { proxy } = getCurrentInstance() as any

const props = defineProps({
  data: {
    type: Object,
    default: () => {
    }
  }
})
const activeName = ref(0)
const formData = reactive({
  company: {} as any,
  user: {} as any,
  roomInfo: {}
})
provide('formData', formData)
const projectId: any = inject('projectId')
const roomQuery = reactive({
  val: []
})
const spaceName: any = ref([])
const spaceNameList = ref(
  [{
    label: '卧室',
    value: '室'
  },
  {
    label: '客厅',
    value: '厅'
  },
  {
    label: '厨房',
    value: '厨'
  },
  {
    label: '卫生间',
    value: '卫'
  },
  {
    label: '阳台',
    value: '阳台'
  }
  ])
const surveyTemplate: any = ref([])
const srcList: any = ref([])
const json = JSON as any
const getQuery = async () => {
  const res: any = await fetch({ url: `/order/bizroombulid/getBuildTypeList?id=${projectId}`, method: 'get' })
  if (res.code == '0') {
    roomQuery.val = res.data
  }
}
const getSpaceData = async () => {
  const roomQuery: any = []
  await fetch({
    url: `/order/bizroomareaattribute/getRoomTypeAndSpaceList`,
    method: 'get',
    params: {
      id: projectId
    }
  }).then((res: any) => {
    if (res.data && res.data.length) {
      res.data.some((item: any, index: number) => {
        roomQuery.push({
          name: item.attributeName,
          num: Number(item.attributeValue)
        })
      })
    }
    roomQuery.forEach((v: any, i: number) => {
      spaceNameList.value.map(el => {
        if (v.name.includes(el.label)) {
          v.name = el.value
        }
      })
    })
    spaceName.value = removeDuplicatedItem(roomQuery)
  })
}
const removeDuplicatedItem = (arr: any) => {
  const newArr: any = Array.from(arr)
  for (var i = 0; i < newArr.length - 1; i++) {
    for (var j = i + 1; j < newArr.length; j++) {
      if (newArr[i].name == newArr[j].name) {
        newArr[i].num += 1
        newArr.splice(j, 1)// 将重复元素删掉
        j--// 删掉重复元素后下一位元素向前移动一位所以j--
      }
    }
  }
  return newArr
}
// 获取基本信息
const getBasic = async () => {
  const images: any = []
  await fetch({ url: `/order/bizproject/${projectId}`, method: 'get' })
    .then((res: any) => {
      if (res.data) {
        if (res.data.roomImg) {
          res.data.roomImg = JSON.parse(res.data.roomImg)
          if (res.data.roomImg.length) {
            res.data.roomImg.map((item: any) => {
              images.push(thumbnailImage(item.url))
            })
          }
        }
      }
      srcList.value = images
      formData.roomInfo = res.data
    })
}
const handleClick = (tabs: any) => {
}
watchEffect(() => {
  if (props.data) {
    proxy.$getUserById([props.data.executePersonId], (respones: any) => {
      formData.user = respones.data
    })
  }
})
onMounted(() => {
  if (sessionStorage.getItem('detailFrom')) {
    formData.company = json.parse(sessionStorage.getItem('detailFrom'))
  }
  getQuery()
  getSpaceData()
  getBasic()
})
</script>

<style scoped lang="less">
.measuring {
  margin: 0 4rem;

  .el-empty {
    position: absolute;
    top: 40%;
    left: 40%;
    transform: translateY(-50%, -50%);
  }

  .measuring_content {
    border-bottom: 1px solid #F3F4F8;
    padding-top: 2rem;

    .measuring_content-info {
      color: #909399;
      font-size: 1.6rem;
      display: flex;
      justify-content: start;
      align-items: center;

      & > div {
        padding-bottom: 1rem;

        &:first-child {
          text-align: right;
        }

        &:last-child {
          flex: 1;
          color: #1A1A1A;
          padding-left: 2rem;
          display: flex;
          align-items: center;

          img {
            width: 2.4rem;
            height: 2.4rem;
            margin-right: 1rem;
          }

          p {
            margin-right: 1rem;
            padding: 0;
          }

          i {
            font-style: normal;
            color: #67C23A;
            font-size: 1.4rem;
            border: 1px solid #E1F3D8;
            background: #F0F9EB;
            border-radius: .6rem;
            padding: .3rem;
          }
        }
      }
    }

    .col {
      color: #909399;
      font-size: 1.6rem;
      display: flex;
      align-items: center;

      & > div {
        padding-bottom: 1rem;

        &:first-child {
          text-align: right;
        }

        &:last-child {
          flex: 1;
          color: #1A1A1A;
          padding-left: 2rem;
        }
      }
    }
  }

  .measuring-info {
    display: flex;
    align-items: center;
    margin: 1.5rem 0 1rem;

    img {
      width: 2rem;
      height: 2rem;
      padding-right: 1rem;
    }

    span {
      color: #1A1A1A;
      font-size: 2rem;
      font-family: MicrosoftYaHei;
    }
  }

  .measuring-query {
    display: flex;
    flex-flow: row wrap;
    padding-top: 1rem;
    padding-left: 1.5rem;
    span {
      width: 20%;
      font-size: 1.6rem;
      margin-bottom: 2rem;
      p {
        padding-bottom: 1rem;
        color: #909399;
      }
    }
  }

  .measuring-img {
    display: flex;
    flex-flow: row wrap;

    .measuring-img_image {
      height: 10rem;
      width: 10rem;
      border-radius: 1rem;
      background: #0969DA;
      margin: 0 1.5rem 1rem 0;
    }
  }

  .measuring-remark {
    color: #909399;
    padding-top: 1rem;
    margin-bottom: 2rem;
    margin-left: 1.5rem;
  }

  .measuring-tabs {
    margin-top: 2rem;
  }
}
</style>
