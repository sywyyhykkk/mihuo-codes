<template>
  <div class="main">
    <div class="mains">
      <div class="img" />
      <div class="forms">
        <LoginComponeV v-if="!register" @sendRegister="jumpRegister" />
        <RegisterCompone v-if="register" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, computed } from 'vue'
import LoginComponeV from '_c/form/login/LoginComponeV.vue'
import RegisterCompone from '_c/form/register/RegisterCompone.vue'
export default defineComponent({
  components: { LoginComponeV, RegisterCompone },
  setup() {
    const store = useStore()
    const register = computed(() => store.getters['form/getRegister'])
    return {
      register
    }
  }
})
</script>
<style></style>
