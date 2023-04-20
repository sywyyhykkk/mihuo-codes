<template>
  <div class="main">
    <div class="mains">
      <div class="img" />
      <div class="forms">
        <LoginComponentV2 v-if="!register" @sendRegister="jumpRegister" />
        <RegisterComponent v-if="register" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, computed } from 'vue'
import LoginComponentV2 from '_c/formPlatform/login/LoginComponeV.vue'
import RegisterComponent from '_c/form/register/RegisterCompone.vue'
export default defineComponent({
  components: { LoginComponentV2, RegisterComponent },
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
