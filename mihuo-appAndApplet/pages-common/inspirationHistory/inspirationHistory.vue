<template>
  <view>
    <z-nav-bar backState="1000">
      <view class="nav-bar"> 历史记录 </view>
    </z-nav-bar>
    <u-tabs
      active-color="#000"
      inactive-color="#808080"
      :list="list"
      :is-scroll="false"
      :current="current"
      @change="change"
    ></u-tabs>
    <view class="imageContent collect" v-if="current == 0">
      <view v-for="item in collectList" class="imageView" :key="item.id">
        <image
          @click="preView(item)"
          class="image"
          :src="basepathurl + item.name + params"
          mode="scaleToFill"
        ></image>
      </view>
      <view
        class="imageView"
        v-for="(mini, index) in collectList.length % 4"
        :key="mini"
        :class="[index === 0 ? '' : 'image-view-no-first']"
      ></view>
      <mh-empty
        v-if="!collectList.length"
        text="还没有收藏内容"
        style="flex: 1"
      ></mh-empty>
    </view>
    <view class="imageContent intrus" v-if="current == 1">
      <view v-for="item in intruList" class="imageView" :key="item.id">
        <image
          @click="preView(item)"
          class="image"
          :src="basepathurl + item.name + params"
          mode="scaleToFill"
        ></image>
      </view>
      <view
        class="imageView"
        v-for="mini in intruList.length % 4"
        :key="mini"
      ></view>
      <mh-empty
        v-if="!intruList.length"
        text="还没有收藏内容"
        style="flex: 1"
      ></mh-empty>
    </view>
    <view class="imageContent his" v-if="current == 2">
      <view v-for="item in allList" class="imageView" :key="item.id">
        <image
          @click="preView(item)"
          class="image"
          :src="basepathurl + item.name + params"
          mode="scaleToFill"
        ></image>
      </view>
      <view
        class="imageView"
        v-for="mini in allList.length % 4"
        :key="mini"
      ></view>
      <mh-empty
        v-if="!allList.length"
        text="还没有收藏内容"
        style="flex: 1"
      ></mh-empty>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      test: "",
      list: [
        {
          name: "收藏",
        },
        {
          name: "感兴趣",
        },
        {
          name: "足迹",
        },
      ],
      collectList: [],
      intruList: [],
      allList: [],
      basepathurl: "https://mihuo-ai.obs.cn-east-3.myhuaweicloud.com/",
      params: "?x-image-process=image/resize,m_fixed,w_300/marker,u_plus",
    };
  },
  onLoad() {
    this.getCollect();
    this.getIntru();
    this.getAll();
  },
  methods: {
    //预览
    preView(item) {
      uni.previewImage({
        urls: [this.basepathurl + item.name],
        current: this.basepathurl + item.name,
      });
    },
    change(index) {
      this.current = index;
    },
    getCollect() {
      this.$http.get("admin/ai/my/favorites").then((res) => {
        console.log(res);
        this.collectList = res.map((item) => ({
          ...item,
          name: item.fileName,
        }));
      });
    },
    getIntru() {
      this.$http.get("admin/ai/my/likes").then((res) => {
        this.intruList = res.map((item) => ({
          ...item,
          name: item.fileName,
        }));
      });
    },
    getAll() {
      this.$http.get("admin/ai/my/footprint").then((res) => {
        this.allList = res.map((item) => ({
          ...item,
          name: item.fileName,
        }));
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.imageContent {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx 30rpx 0rpx 30rpx;
  justify-content: space-between;

  .imageView {
    width: 24%;
    margin-top: 20rpx;
    height: 160rpx;
    border-radius: 10rpx;
  }

  .image-view-no-first {
    margin: 20rpx;
    height: 160rpx;
  }

  .image {
    border-radius: 10rpx;
    height: 160rpx;
  }
}
</style>
