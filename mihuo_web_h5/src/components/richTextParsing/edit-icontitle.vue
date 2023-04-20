<template>
  <div>
    <div class="point" v-if="jsondata.style['iconUrl'] == 'under_line'">POINT</div>
    <div class="edit-icontitle">
      <!--    <text class="icon"></text>-->
      <img
        :class="jsondata.style['iconUrl']=='icon_title1'?'edit-icontitle-img':'icontitle-img-other'"
        v-if="jsondata.style['iconUrl'] !== 'no_title'&&jsondata.style['iconUrl'] !== 'under_line'"
        :src="getIconUrl(jsondata.style['iconUrl'])" />
      <div>
        <div
          :class="jsondata.style['iconUrl']=='icon_title1'?'icon_title1':jsondata.style['iconUrl']=='under_line'?'wordInput':'other-input'">
          {{ jsondata.content || jsondata.data.content }}
        </div>
        <div class="edit-sorted-bottom" v-if="jsondata.style['iconUrl'] == 'under_line'"></div>
      </div>
    </div>
  </div>
</template>

<script>
import getUrl from '@/getPic'

export default {
  name: 'edit-icontitle',
  props: {
    jsondata: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      iconTitle1: require('@/assets/img/icon_title.png'),
      iconTitle2: require('@/assets/img/icon_title2.png'),
      iconTitle3: require('@/assets/img/icon_title3.png')
    }
  },
  methods: {
    getIconUrl(data) {
      if (!data) {
        return this.iconTitle1
      }
      if (data?.indexOf('icon_title') > -1) {
        switch (data) {
          case 'icon_title1':
            return this.iconTitle1
            break
          case 'icon_title2':
            return this.iconTitle2
            break
          case 'icon_title3':
            return this.iconTitle3
            break
        }
      } else {
        return getUrl.getPicUrl(data)
      }
    }
  }
}
</script>

<style scoped lang="less">
.point {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #141414;
}

.icon_title1 {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #141414;
}

.edit-icontitle {
  display: flex;
  flex-flow: wrap;
  align-items: center;
  margin-top: 20px;

  .edit-sorted-bottom {
    position: relative;
    height: 10px;
    width: 100%;
    background: linear-gradient(90deg, #FFFFFF, #FE6E32, #FFDED1);
    border-radius: 5px;
  }

  .edit-icontitle-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 26px;
  }

  .icontitle-img-other {
    width: 28px;
    height: 28px;
    margin-right: 26px;
  }

}

.wordInput {
  font-size: 30px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #141414;
}

.other-input {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #141414;
}

</style>
