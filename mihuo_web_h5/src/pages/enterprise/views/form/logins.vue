<!--<template>-->
<!--    <div v-if="pageType===1&&!register">-->
<!--      <div class="mainTo">-->
<!--        <div class="titleTop">-->
<!--          <el-steps :space="300" :active="1" finish-status="success" align-center class="stepStyle">-->
<!--            <el-step title="已完成" />-->
<!--            <el-step title="进行中" />-->
<!--            <el-step title="步骤 3" />-->
<!--          </el-steps>-->

<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  <div class="main">-->
<!--    <div class="mains">-->
<!--      <div class="img" />-->
<!--      <div class="forms">-->
<!--        <LoginComponeV v-if="!register" @sendRegister="jumpRegister" />-->
<!--        <RegisterCompone v-if="register" @eidtPage="eidtPage" />-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->

<!--</template>-->
<!--<script lang="ts">-->
<!--import { useStore } from 'vuex'-->
<!--import { defineComponent, reactive, computed, ref, onMounted, watchEffect, watch, inject } from 'vue'-->
<!--import LoginComponeV from '_c/form/login/LoginComponeV.vue'-->
<!--import RegisterCompone from '_c/form/register/RegisterCompone.vue'-->
<!--// import RegisterNext from '_c/form/register/registerNext.vue'-->
<!--// import wsCache from '@/cache'-->
<!--export default defineComponent({-->
<!--  components: { LoginComponeV, RegisterCompone },-->
<!--  props: ['register'],-->
<!--  setup(props) {-->
<!--    const pageType = ref<number>(0)-->
<!--    const stepWidth = ref<string>('400px')-->
<!--    // wsCache.get('pageType')===1-->
<!--    const store = useStore()-->
<!--    // const register = computed(() => store.getters['form/getRegister'])-->
<!--    const eidtPage = () => {-->
<!--      pageType.value = 1-->
<!--    }-->
<!--    return {-->
<!--      // register,-->
<!--      pageType,-->
<!--      stepWidth,-->
<!--      eidtPage-->
<!--    }-->
<!--  }-->
<!--})-->
<!--</script>-->
<!--<style></style>-->
<template></template>
