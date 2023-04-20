<template>
  <div>
    <el-dialog
      v-if="isShow"
      v-model="isShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="生成小程序码"
      @close="closeDialog"
    >
      <div class="flex-center main-container">
        <div ref="qrCodeRef" class="qr-container">
          <div class="header-container flex-center">
            <div class="left flex-center">
              <img class="logo" src="@/assets/icons/client-logo.png">
              <span class="title">觅活</span>
            </div>
            <div class="right flex-center">
              <div class="date">
                DATE
              </div>
              <div class="date">
                {{ moment.utc().format('YYYY/MM/DD') }}
              </div>
            </div>
          </div>
          <div class="image-container">
            <canvas
              id="my-canvas"
              ref="canvasRef"
              width="630"
              :height="canvasHeight"
              class="img"
            />
            <!--            <img-->
            <!--              class="img"-->
            <!--              :src="$getUrl.getPicUrl(productInfo.coverImg) + '?time=' +-->
            <!--                new Date().getTime()"-->
            <!--            >-->
          </div>
          <div class="info-container">
            <div class="price">
              <span class="price-symbol">¥</span> {{ productInfo.price }}
            </div>
            <div class="name">
              {{ productInfo.name }}
            </div>
          </div>
          <div v-if="!isLoading" class="bottom-container flex-center">
            <div class="qr-code flex-center">
              <img class="code-img" :src="qrCode">
            </div>
            <div class="des">
              长按识别二维码<br>浏览该商品
            </div>
            <img class="bottom-logo" src="@/assets/icons/calculator.png">
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-preventRepeatClick
            type="primary"
            :loading="isLoading"
            @click="saveDialog"
          > {{ isLoading ? '生成小程序码中' : '下载图片' }} </el-button>
          <el-button @click="closeDialog">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import moment from 'moment'
import { fetch } from '_@/axios-config/axios'
import html2canvas from 'html2canvas'
import { imageGlobal } from '@/global'

const props = defineProps<{
  modelValue: boolean;
  productInfo: {
    id: number;
    coverImg: string;
    price: string;
    name: string;
  };
}>()

const emit = defineEmits<{(event: 'update:modelValue', value: boolean): void
}>()

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    isShow.value = props.modelValue
  }
)

const isShow = ref(props.modelValue)

const qrCodeRef = ref<HTMLElement>()

onMounted(() => {
  getQRCode()
})

const canvasRef = ref<HTMLCanvasElement>()
const canvasHeight = ref(630)

const getImageCanvas = () => {
  const image = new Image()
  const canvas = canvasRef.value as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  image.onload = () => {
    setTimeout(() => {
      // 改变canvas的高度后再绘制
      ctx!.drawImage(image, 0, 0, 630, 630)
    })
  }
  image.crossOrigin = 'anonymous'
  image.src = imageGlobal + props.productInfo.coverImg + '?time=' + new Date().getTime()
}

const qrCode = ref('')

const isLoading = ref(false)

// 获取小程序码
const getQRCode = async () => {
  isLoading.value = true
  const env = process.env.VUE_APP_API_ENV
  let type = 'release'
  if (env?.startsWith('dev')) {
    type = 'develop'
  } else if (env?.startsWith('test')) {
    type = 'trial'
  }
  await fetch({
    url: '/admin/weChat/wxMaQrcode',
    method: 'post',
    data: {
      clientId: 'cmini',
      page: 'pages-mall/productDetail/productDetail',
      scene: `id=${props.productInfo.id}&shareType=1`,
      envVersion: type,
      type: 'MINI'
    }
  }).then((res: any) => {
    if (res.code === 0) {
      isLoading.value = false
      qrCode.value = 'data:image/png;base64, ' + res.data
      getImageCanvas()
    }
  })
}

// 保存弹窗
const saveDialog = () => {
  isLoading.value = true
  html2canvas(qrCodeRef.value as HTMLElement, {
    allowTaint: true,
    useCORS: true
  }).then((canvas: any) => {
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${props.productInfo.name}.png`
    a.click()
    a.remove()
    isLoading.value = false
  })
}

// 关闭弹窗
const closeDialog = () => {
  isShow.value = false
  emit('update:modelValue', false)
}

</script>

<style lang="less" scoped>
.main-container {
  padding: 1rem;
}

.qr-container {
  width: 630px;
  height: max-content;
  max-height: 1152px;
  border-radius: 30px;
  overflow: hidden;

  .header-container{
    height: 120px;
    background-color: #000000;
    border-radius: 30px 30px 0 0;

    .left, .right {
      width: 50%;
      padding: 0 30px;
    }

    .left {
      .logo {
        width: 50px;
        height: 50px;
      }

      .title {
        font-size: 32px;
        font-weight: 400;
        color: #FF6B06;
        line-height: 36px;
        margin-left: 20px;
      }
    }

    .right {
      flex-direction: column;
      justify-content: flex-end;

      .date {
        width: 100%;
        text-align: right;
        font-size: 20px;
        color: white;
      }
    }
  }

  .image-container{
    height: max-content;

    .img {
      width: 100%;
    }
  }

  .info-container {
    height: max-content;
    max-height: 202px;
    padding: 40px 30px;

    .price-symbol {
      font-size: 26px;
      font-weight: 500;
      color: #ED3832;
      line-height: 30px;
      margin-right: -10px;
    }

    .price {
      font-size: 42px;
      font-weight: 500;
      color: #ED3832;
      line-height: 30px;
    }

    .name {
      font-size: 28px;
      font-weight: 400;
      color: #333333;
      line-height: 30px;
      margin-top: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .bottom-container {
    height: 200px;
    background-color: #F7F7F7;
    border-radius: 0 0 30px 30px;
    padding: 0 30px;

    .qr-code {
      width: 134px;
      height: 134px;
      border-radius: 10px;
      border: 1px solid #000000;
      justify-content: center;

      .code-img {
        width: 110px;
        height: 110px;
      }
    }

    .des {
      width: 140px;
      font-size: 16px;
      font-weight: 500;
      color: #808080;
      line-height: 36px;
      margin-left: 20px;
    }

    .bottom-logo {
      width: 126px;
      height: 126px;
    }
  }
}

:deep(.el-dialog__body) {
  padding: 0;
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
