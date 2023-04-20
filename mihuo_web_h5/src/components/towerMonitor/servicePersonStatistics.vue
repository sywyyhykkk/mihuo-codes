<template>
  <div class="service-person-statistics">
    <my-title title="服务人员统计">
      <template #content>
        <div class="statis-title">
          <div class="punch-card">今日打卡</div>
          <div class="active">活跃</div>
          <div class="sign-in">注册</div>
        </div>
      </template>
    </my-title>
    <div class="service-person">
      <div v-for="item in state.chartsData" class="person-item">
        <div :class="`skill-name_${pageType}`">{{ item.skillName }}</div>
        <div class="statis-data">
          <div
            class="data-value"
            :style="`width:${item.registerNum/state.allNum}%;--progress-width:${item.registerNum/state.allNum}%;--page-type:${pageType==2?'#F3F4F8':''}`"
          />
          <div
            class="data-value2"
            :style="`width:${item.activeNum/state.allNum}%;--progress-width:${item.activeNum/state.allNum}%;`"
          />
          <div
            class="data-value3"
            :style="`width:${item.punchTodayNum/state.allNum}%;--progress-width:${item.punchTodayNum/state.allNum}%;`"
          />
        </div>
        <div class="statis-title">
          <div class="punch-card">{{ item.punchTodayNum }}</div>
          <div class="active">{{ item.activeNum }}</div>
          <div class="sign-in">{{ item.registerNum }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, inject } from 'vue'
import { fetch } from '_@/axios-config/axios'

const pageType = inject('pageType')
const state = reactive({
  allNum: 0,
  chartsData: [{
    label: '工人',
    value: 300,
    value2: 180,
    value3: 90
  }, {
    label: '项目经理',
    value: 240,
    value2: 160,
    value3: 90
  }, {
    label: '项目监理',
    value: 210,
    value2: 180,
    value3: 30
  }, {
    label: '水电工',
    value: 270,
    value2: 10,
    value3: 90
  }, {
    label: '木工',
    value: 220,
    value2: 100,
    value3: 10
  }]
})

onMounted(() => {
})
</script>

<style scoped lang="less">
@import "tower";

.service-person-statistics {
  height: auto;
  //position: absolute;
  //bottom: 0;
  //left: 0;
  //right: 0;
}

.service-person {
  padding: 0rem 0 0rem 3rem;
  height: auto;
  overflow-y: auto;

  .person-item {
    margin-bottom: 2.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .statis-data {
      width: calc(100% - 25rem);
      height: 14px;
      position: relative;

      .data-value {
        --progress-width: 0%;
        --page-type: #051C48;
        background: var(--page-type);

        height: 14px;
        position: absolute;
        .keyframesFunction(my-progress-content, {
          0% {
            width: 0%;
          }
          100% {
            width: var(--progress-width);
          }
        });
        -webkit-animation: my-progress-content 1s linear 1;
        animation: my-progress-content 1s linear 1;
      }

      .data-value2 {
        --progress-width: 0%;
        background: #409EFF;
        height: 12px;
        position: absolute;
        top: 1px;
        .keyframesFunction(my-progress-content, {
          0% {
            width: 0%;
          }
          100% {
            width: var(--progress-width);
          }
        });
        -webkit-animation: my-progress-content 1s linear 1;
        animation: my-progress-content 1s linear 1;
      }

      .data-value3 {
        --progress-width: 0%;
        background: #67C23A;
        height: 10px;
        position: absolute;
        top: 2px;
        .keyframesFunction(my-progress-content, {
          0% {
            width: 0%;
          }
          100% {
            width: var(--progress-width);
          }
        });
        -webkit-animation: my-progress-content 1s linear 1;
        animation: my-progress-content 1s linear 1;
      }
    }

    .skill-name_1 {
      font-size: 14px;
      color: #0969DA;
      line-height: 25px;
      width: 9rem;
    }

    .skill-name_2 {
      font-size: 14px;
      color: #303133;
      line-height: 25px;
      width: 9rem;
    }
  }
}

.statis-title {
  font-size: 12px;
  line-height: 25px;
  display: flex;
  width: 15rem;
  justify-content: space-between;

  .punch-card {
    color: #67C23A;
    width: 6rem;
    text-align: center;
  }

  .active {
    color: #409EFF;
    width: 3rem;
    text-align: center;
  }

  .sign-in {
    color: #909399;
    width: 3rem;
    text-align: center;
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
