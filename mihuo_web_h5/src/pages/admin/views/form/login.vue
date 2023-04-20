<template>
  <!--login  -->
  <div class="login">
    <div class="tops">
      <div class="top">
        <div class="top_left">
          <img :src="require('@/assets/img/logo2.png')">
          <span v-if="!register" class="account">登录账号</span>
          <span v-if="register" class="account">注册账号</span>
        </div>
        <!--        <div v-if="!register" class="top_right" @click="jumpRegister">-->
        <!--          没有账号？<span class="r">立即注册</span>-->
        <!--        </div>-->
        <div v-if="register" class="top_right" @click="jumpRegister">
          已有账号？<span class="r">立即登录</span>
        </div>
      </div>
    </div>
    <router-view />
    <FootersVue />
  </div>
</template>
<script lang="ts">
import FootersVue from '_c/form/footer/Footers.vue'
import { useStore } from 'vuex'
import { defineComponent, ref, reactive, computed } from 'vue'

export default defineComponent({
  components: { FootersVue },
  setup() {
    const store = useStore()
    const register = computed(() => store.getters['form/getRegister'])
    const jumpRegister = () => {
      const registers = computed(() => store.getters['form/getRegister'])
      store.commit('form/setRegister', !registers.value)
    }
    const checked = ref<boolean>(false)
    const radio = ref<number>(2)
    const addClass = (x: number) => {
      current.value = x
      console.log('x :>> ', x)
    }
    const current = ref<number>(0)
    const formClass = reactive(['登录账号', '验证码登录'])

    return {
      register,
      jumpRegister,
      current,
      formClass,
      addClass,
      checked,
      radio
    }
  }
})
</script>
<style>
.addClass {
  border-bottom: 2px solid #ff5d35;
  color: #ff5d35 !important;
}
</style>
