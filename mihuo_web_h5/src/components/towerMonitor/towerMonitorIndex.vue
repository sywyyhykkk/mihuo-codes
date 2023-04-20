<template>
  <div class="tower-monitor">
    <div class="tower-title">
      <img class="tower-head-left" :src="require('@/assets/img/tower/tower_head_left.png')">
      <div class="tower-title-text">
        <div>塔台监测</div>
        <div class="tower-title-eng">Tower Monitoring</div>
      </div>
      <img class="tower-head-right" :src="require('@/assets/img/tower/tower_head_right.png')">
      <div class="right-button-set">
        <div class="setting-button" @click="handelChange">
          <svg-icon icon-class="exit-fullscreen" style="color:#303133;margin: 0 " />
        </div>
      </div>
    </div>
    <div class="tower-conter">
      <div class="tower-conter-left">
        <div class="my-carousel" v-if="carouselIndex==1">
          <!--        今日工地概况-->
          <site-profile />
          <!--        工地评分-->
          <site-score />
          <!--        服务人员统计-->
          <service-person-statistics />

        </div>
        <div class="my-carousel" v-if="carouselIndex==2">
          <!--        在建工地延期情况-->
          <site-delay />
          <!--        工地无人情况-->
          <site-no-one />
        </div>
        <div class="my-carousel" v-if="carouselIndex==3">
          <!--        定制品异常工地排行-->
          <fixed-product-anomaly />

        </div>
      </div>
      <div class="tower-conter-centre">
        <!--        //城市geo-->
        <city-geo />
      </div>
      <div class="tower-conter-right">
        <div class="my-carousel" v-if="carouselIndex==1">
          <!--        工地按期交付统计-->
          <siteDeliveryStatistics />
          <!--        工序/阶段验收统计-->
          <stageStatistics />
        </div>
        <div class="my-carousel" v-if="carouselIndex==2">
          <!--        今日巡检验收？？？-->
          <inspection-today />

          <!--        工地收款预警？-->
          <site-collection-warning />
        </div>
        <div class="my-carousel" v-if="carouselIndex==3">
          <!--        主材配合异常-->
          <advocate-material-abnormal />
          <!--        辅材配合异常-->
          <auxiliary-material-abnormal />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, provide, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:modelValue'])
const carouselIndex = ref<number>(1)
const pageType = ref<number>(1)

provide('pageType', pageType.value)

const handelChange = () => {
  emit('update:modelValue', 2)
}


//轮播图事件
const carouselFun = () => {
  setInterval(() => {
    carouselIndex.value++
    if (carouselIndex.value > 3) carouselIndex.value = 1
  }, 10000)
}

onMounted(() => {
  carouselFun()
})
</script>

<style scoped lang="less">

@import "tower";


.right-button-set {
  position: absolute;
  right: 0;
  cursor: pointer;


  .setting-button {
    margin: 0 20px 0 -10px;
    height: 36px;
    background: #E4E7ED;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    color: #0969DA;
    font-size: 12px;
  }
}

.tower-monitor {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #020D32;
  //background: #ffffff;
  z-index: 2000;

  .tower-conter {
    display: flex;
    justify-content: space-between;
    padding: 4rem 0 2rem 0;
    position: absolute;
    margin-top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    top: 10rem;

    .tower-conter-left {
      width: 30%;
      color: white;
      position: relative;
    }

    .tower-conter-right {
      width: 30%;
      color: white;
      position: relative;
    }

    .tower-conter-centre {
      width: 40%;
      color: white;
      position: relative;
    }
  }

  .tower-title {
    font-size: 40px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #0969DA;
    text-align: center;
    margin-top: 25px;
    height: 10rem;
    display: flex;
    justify-content: space-between;
    position: relative;


    .tower-title-text {
      width: 30%;
    }

    .tower-head-left {
      width: 35%;
    }

    .tower-head-right {
      width: 35%;
    }

    .tower-title-eng {
      font-size: 13px;
      margin-top: 20px;
    }
  }
}

</style>
