<template>
  <div class="order-table">
    <el-table
      stripe
      style="height: calc(100vh - 28rem) !important;"
      :data="tableData"
      :height="'0'"
      v-loading="loading"
      empty-text="暂无订单"
      border
    >
      <el-table-column label="商品" width="300" header-align="center">
        <template #default="scope">
          <div class="goods">
            <el-image
              :src="require('@/assets/img/safety-setting.png')"
              :preview-src-list="['@/assets/img/safety-setting.png']"
              :preview-teleported="true"
              :fit="fit"></el-image>
            <div class="goods-info">
              <div>水电服务包水电服务包水电服务包 水电服务包</div>
              <div class="goods-tag">
                <el-tag type="info">Tag 3</el-tag>
                <el-tag type="info">Tag 3</el-tag>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="180" align="center" />
      <el-table-column label="创建时间" width="180" align="center" />
      <el-table-column label="规格" width="180" align="center" />
      <el-table-column label="单价（元）" header-align="center" width="180" align="right" />
      <el-table-column label="数量" header-align="center" align="right" />
      <el-table-column label="买家" header-align="center" align="center" width="200">
        <template #default="scope">
          <div class="user">
            <div class="people">
              <i></i>
              <span>{{ scope.row.createByName }}</span>
            </div>
            <img @click="openChat" src="@/assets/img/message.png" class="message-avatar" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="180" align="center" show-overflow-tooltip />
      <el-table-column label="实收金额" header-align="center" width="180" align="right" />
      <el-table-column label="变更金额" header-align="center" width="180" align="right" />
      <el-table-column label="合计金额" header-align="center" width="180" align="right" />
      <el-table-column label="工种" align="center" />
      <el-table-column label="提交验收时间" align="center" />
      <el-table-column label="验收状态" align="center" />
      <el-table-column label="验收时间" align="center" />
      <el-table-column label="客户确认状态" align="center" />
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <el-button
            icon="view"
            type="text"
            style="color: #67C23A"
            @click="handelClick('查看',scope.row)"
          >查看
          </el-button>
          <el-button
            type="text"
            icon="document"
            @click="handelClick('验收',scope.row)"
          >验收
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!--    //验收查看？-->
    <acceptCheckDrawer v-model="checkVisible" />
    <!--去验收-->
    <surveyPreview
      v-model="surveyPreviewShow"
      surveyId="8"
      :disabled="false"
      :surveyName="'验收'"
      @saveSurvey="saveSurvey"
    />
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { ImStore } from '_@/store/modules/im'
import wsCache from '@/cache'
import { ElMessage } from 'element-plus'

const tableData = ref([
  { orderSn: 123, createByName: '张三' },
  { orderSn: 123, createByName: '李四' }
])
const loading = ref<boolean>(false)
const checkVisible = ref<boolean>(false)//
const surveyPreviewShow = ref<boolean>(false)//


const handelClick = (val: string, data: any) => {
  switch (val) {
    case '验收':
      surveyPreviewShow.value = true
      break
    case '查看':
      checkVisible.value = true
      break

  }
}
const openChat = () => {
  let user = wsCache.get('imUserInfo')
  if (!user) {
    ElMessage.info('您还不能使用聊天功能')
    return
  }
  ImStore.SetImShow(true)
}
</script>

<style scoped lang="less">
@import "../orderTable";

</style>
