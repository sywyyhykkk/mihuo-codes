<template>
  <i :class="_class"></i>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    _class () {
      return {
        [this.$style.iconfont]: true,
        [this.$style[this.type]]: true
      }
    }
  }
}
</script>

<style module>
@font-face {font-family: "iconfont";
  src: url('./fonts/iconfont.eot?t=1605881625638'); /* IE9 */
  src: url('./fonts/iconfont.eot?t=1605881625638#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('./fonts/iconfont.woff?t=1605881625638') format('woff'),
  url('./fonts/iconfont.ttf?t=1605881625638') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('./fonts/iconfont.svg?t=1605881625638#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-jiantou:before {
  content: "\e656";
}

.icon-jiantou_xiangzuoliangci:before {
  content: "\eb0a";
}

.icon-jiantou_xiangyouliangci:before {
  content: "\e6e7";
}

.icon-jiantou-xiangzuo:before {
  content: "\e672";
}

.icon-jiantou-xiangyou:before {
  content: "\e673";
}

.icon-look:before {
  content: "\e603";
}

.icon-zyj_unlooked:before {
  content: "\e6e9";
}

.icon-empty:before {
  content: "\e699";
}

.icon-empty1:before {
  content: "\e604";
}

.icon-gengduo:before {
  content: "\e60a";
}

.icon-all:before {
  content: "\e6ef";
}

.icon-QRcode1:before {
  content: "\e75e";
}

.icon-comments:before {
  content: "\e7b2";
}

.icon-comment-single:before {
  content: "\e601";
}

.icon-email:before {
  content: "\e602";
}

.icon-ditu:before {
  content: "\e635";
}

.icon-lishi:before {
  content: "\e64e";
}

.icon-zhangdan:before {
  content: "\e65a";
}

.icon-xiangce:before {
  content: "\e65b";
}

.icon-hongbao:before {
  content: "\e623";
}

.icon-shipin:before {
  content: "\e64f";
}

.icon-dizhi:before {
  content: "\e658";
}

.icon-wenjian:before {
  content: "\e73e";
}

.icon-xiaolian:before {
  content: "\edb8";
}
</style>
