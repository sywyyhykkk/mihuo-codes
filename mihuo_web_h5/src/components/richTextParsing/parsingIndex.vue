<template>
  <div>
    <div v-for="(item,index) in dataList" :key="index">
      <edit-icontitle v-if="item.type=='icontitle'" :jsondata="item" />
      <edit-sorted v-if="item.type=='sorted'" :jsondata="item" />
      <edit-images v-if="item.type=='images'" :jsondata="item" />
      <edit-word v-if="item.type=='word'" :jsondata="item" />
      <edit-unsorted v-if="item.type=='unsorted'" :jsondata="item" />
      <edit-notInclude v-if="item.type=='notInclude'" :jsondata="item" />
    </div>
  </div>
</template>

<script>


export default {
  name: 'parsingIndex',
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataList: []
    }
  },
  methods: {},
  mounted() {
    this.dataList = this.data ? JSON.parse(this.data) : []
    // console.log(this.dataList)
  },
  watch: {
    data(newval, oldVal) {
      this.dataList = newval ? JSON.parse(newval) : []
      console.log(this.dataList)
    }
  }
}
</script>

<style scoped lang="less">

</style>
