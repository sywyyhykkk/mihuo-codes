<template>
  <div>
    <template v-if="data.listdata && data.listdata.length > 0">
      <div v-for="item in data.listdata" :key="item.name" class="audioContent" @click="playAudio(item)">
        <img v-if="item.name!=plaid" class="playIcon" src="@/assets/img/play-audio.png">
        <img v-else class="playIcon" src="@/assets/img/audio-play-rich.gif">
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, ref } from 'vue'
export default defineComponent({
  name: 'Audio',
  props: ['data'],
  setup() {
    // 测试
    const { ctx, proxy } = getCurrentInstance()
    const plaid = ref('')
    const playAudio = (data) => {
      const audio = new Audio()
      audio.src = `${ctx.$imageGlobal}${data.url}`
      plaid.value = data.name
      audio.play()
    }
    return {
      playAudio,
      plaid
    }
  }
})
</script>

<style scoped lang="less">
.audioContent{
  background: #fbf0e9;
  border-radius: 5px;
  padding: 10px;
  .playIcon{
    width: 30px;
    height: 30px;
  }
}
</style>
