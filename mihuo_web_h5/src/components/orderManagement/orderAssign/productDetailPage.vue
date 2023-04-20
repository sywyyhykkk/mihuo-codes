<template>
  <div class="product-page">
    <img class="preferred-services" src="~@/assets/img/product/preferred_services.png" />
    <div class="product-name">
      <div class="product-name-text">{{productData.name}}</div>
      <!--      <img class="mi-huo-icon" src="~@/assets/img/product/mi_huo.png" />-->
      <div class="mi-huo-icon">觅活</div>
    </div>
    <div class="product-desc">行业精英认证工匠 · 服务有保障</div>
    <div class="product-img">
      <img class="person-icon1" src="~@/assets/img/product/person_icon1.png" />
      <img class="img-data" :src="$getUrl.getPicUrl(productData.coverImg)" />
      <img class="person-icon2" src="~@/assets/img/product/person_icon2.png" />
    </div>
    <!--//商品详情-->
    <div class="build-content" v-if="productData.detailDesc&&JSON.parse(productData.detailDesc).length>0">
<!--      <img class="build-content-img" src="~@/assets/img/product/build_content.png">-->
      <parsing-index :data="productData.detailDesc" />
    </div>
    <!--//施工内容,服务内容-->
    <div class="build-content" v-if="productProcess.buildContent&&JSON.parse(productProcess.buildContent).length>0">
      <img class="build-content-img" src="~@/assets/img/product/build_content.png">
      <parsing-index :data="productProcess.buildContent" />
    </div>
    <!--    //施工流程？-->
    <div class="build-process" v-if="buildProcess.length > 0 && (buildProcess[0].title||buildProcess[0].processPic)">
      <img class="build-content-img" src="~@/assets/img/product/build_process.png">
      <img class="build-content-img" style="margin-top: 20px" src="~@/assets/img/product/build_process_title.png">
      <div class="build-process-content-back" />
      <div class="build-process-content" v-for="(item,index) in buildProcess" :key="index">
        <div v-if="index<2||arrowType">
          <div class="content-title">
            <div class="title-index">
              <div>Step{{ index < 9 ? `0${index + 1}` : index + 1 }}</div>
              <div class="index-bottom" />
            </div>
            <div class="title-text">{{ item.title }}</div>
          </div>
          <div class="content-desc">{{ item.description }}</div>
          <img class="process-img" v-if="item.processPic" :src="$getUrl.getPicUrl(item.processPic)" />
        </div>
      </div>
      <div class="complete-process" @click="handelClick">
        <span>{{ arrowTitle }}</span>
        <img :class="arrowType?'arrow-img-up':'arrow-img'" :src="require('@/assets/img/product/arrow.png')">
      </div>
    </div>
    <!--//施工标准？-->
    <div class="build-standard"
         v-if="productProcess.buildStandard&&JSON.parse(productProcess.buildStandard).length>0">
      <img class="build-content-img" src="~@/assets/img/product/build_standard.png">
      <img class="build-content-img" style="margin-top: 20px" src="~@/assets/img/product/build_standard_title.png">
      <div class="standard-content">
        <parsing-index :data="productProcess.buildStandard" />
      </div>
    </div>
    <!--    //验收标准？-->
    <div class="build-process acceptance-standard" v-if="checkStandard.length > 0 && (checkStandard[0].title||checkStandard[0].processPic)">
      <img class="build-content-img" src="~@/assets/img/product/check_standard.png">
      <img class="build-content-img" style="margin-top: 20px" src="~@/assets/img/product/check_standard_title.png">
      <div class="check-standard-back" />
      <div class="check-standard-content" v-for="(item,index) in checkStandard" :key="index">
        <div class="check-index">
          <div>验收</div>
          <div>{{ index < 9 ? `0${index + 1}` : `${index + 1}` }}</div>
        </div>
        <img class="check-standard-img" :src="$getUrl.getPicUrl(item.processPic)">
        <div class="check-standard-title">{{ item.title }}</div>
      </div>
    </div>
    <!--    //施工现场展示-->
    <div class="build-content" v-if="constructionScene.length > 0 && (constructionScene[0].title||constructionScene[0].processPic)">
      <img class="build-content-img" src="~@/assets/img/product/construction_scene.png">
      <div class="check-standard-content" v-for="(item,index) in constructionScene" :key="index">
        <img class="check-standard-img" :src="$getUrl.getPicUrl(item.processPic)">
        <div class="check-standard-title">{{ item.title }}</div>
        <!--        <div class="check-standard-desc">{{ item.description }}</div>-->
      </div>
    </div>
    <!--    //注意事项-->
    <div class="build-content" v-if="productProcess.prompt&&JSON.parse(productProcess.prompt).length>0">
      <img class="build-content-img" src="~@/assets/img/product/prompt_title.png">
      <parsing-index :data="productProcess.prompt" />
    </div>
    <!--    //适用范围-->
    <div class="build-content" v-if="productProcess.scope&&JSON.parse(productProcess.scope).length>0">
      <img class="build-content-img" src="~@/assets/img/product/scope_title.png">
      <parsing-index :data="productProcess.scope" />
    </div>
    <!--    //报价说明-->
    <div class="build-content"
         v-if="productProcess.priceDescription&&JSON.parse(productProcess.priceDescription).length>0">
      <img class="build-content-img" src="~@/assets/img/product/tender_clarification_title.png">
      <parsing-index :data="productProcess.priceDescription" />
    </div>
    <!--    //质保权益-->
    <div class="build-content" v-if="productProcess.qualityRight&&JSON.parse(productProcess.qualityRight).length>0">
      <img class="build-content-img" src="~@/assets/img/product/quality_right_title.png">
      <parsing-index :data="productProcess.qualityRight" />
    </div>
  </div>
</template>

<script>
import { fetch } from '../../util/axios-config/axios'
import ParsingIndex from '../../richTextParsing/parsingIndex'

export default {
  name: 'productDetailPage',
  components: { ParsingIndex },
  props: {
    productId: {
      type: String || Number,
      default: 0
    }
  },
  data() {
    return {
      productData: {},
      productProcess: {},
      buildProcess: [],
      constructionScene: [],
      checkStandard: [],
      arrowType: false,
      arrowTitle: '查看完整施工流程'
    }
  },
  methods: {
    getProductData() {
      fetch({
        url: `mall/product/updateInfo/${this.productId}`,
        method: 'get'
      }).then((res) => {
        this.productData = res.data
        this.productProcess = res.data.productProcess
        this.buildProcess = res.data.productProcess.buildProcess ? JSON.parse(res.data.productProcess.buildProcess) : []
        this.checkStandard = res.data.productProcess.checkStandard ? JSON.parse(res.data.productProcess.checkStandard) : []
        this.constructionScene = res.data.productProcess.constructionScene ? JSON.parse(res.data.productProcess.constructionScene) : []
        console.log(this.buildProcess)
      })
    },
    handelClick() {
      this.arrowType = !this.arrowType
      this.arrowTitle = this.arrowType ? '收起完整施工流程' : '查看完整施工流程'
    }
  },
  mounted() {
    console.log(this.productId)
    this.getProductData()
  }
}
</script>

<style scoped lang="less">
.product-page {
  width: 650px;
  transform: translateX(-20%) translateY(-20%) scale(0.6);
  max-height: 70%;
  padding: 40px 50px;
}

.check-standard-title {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #141414;
  line-height: 46px;
  text-align: center;
  margin-top: 16px;
}

.check-standard-desc {
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #808080;
  text-align: center;
  margin-top: 10px;
}

.check-standard-content {
  margin: 30px 0;
  position: relative;

  .check-index {
    width: 76px;
    height: 93px;
    position: absolute;
    right: 20px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
    text-align: center;
    line-height: 30px;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    background: url('~@/assets/img/product/check_index.png');
    background-size: 100% 100%;
  }

  .check-standard-img {
    width: 100%;
    height: 420px;
    background: #141414;
    border: 6px solid #FFFFFF;
    border-radius: 12px;
  }
}

.build-standard {
  padding: 40px 0;

  .standard-content {
    //height: 500px;
    border: 5px solid #FFEDAB;
    border-radius: 6px;
    margin-top: 25px;
    padding: 20px;
  }
}

.build-content-img {
  width: calc(100% - 100px);
  margin-left: 50px;
}

.acceptance-standard {

}

.build-process {
  background: #F5F5F5;
  margin: 0 -50px;
  padding: 60px 50px;
  position: relative;
  display: flex;
  flex-flow: column;

  .build-process-content-back {
    background: url('~@/assets/img/product/back_ip.png');
    background-size: 100% 100%;
    width: 480px;
    height: 665px;
    position: absolute;
    margin-right: -156px;
    right: 0;
    top: 150px;

  }

  .check-standard-back {
    //width: auto;
    background: url('~@/assets/img/product/back_ip.png') no-repeat;
    background-size: 100% 100%;
    width: 480px;
    height: 665px;
    margin-left: -156px;
    position: absolute;
    left: 0;
    top: 150px;
  }

  .complete-process {
    height: 69px;
    border: 3px solid #FE6E32;
    border-radius: 35px;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #FE6E32;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 70px;
    cursor: pointer;

    .arrow-img {
      width: 20px;
      height: 20px;
      margin-left: 20px;
    }

    .arrow-img-up {
      width: 20px;
      height: 20px;
      margin-left: 20px;
      transform: rotate(180deg);
    }
  }

  .build-process-content {
    margin-top: 40px;
    width: 100%;
    z-index: 20;

    .process-img {
      width: 100%;
      height: 414px;
      background: #92859F;
      border: 6px solid #FFFFFF;
      border-radius: 24px;
      margin-top: 36px;

    }

    .content-desc {
      margin-top: 25px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #141414;
    }

    .content-title {
      display: flex;
      align-items: center;

      .title-index {
        font-size: 34px;
        font-family: FZGDCTiS;
        font-weight: 500;
        color: #333333;

        .index-bottom {
          height: 10px;
          background: linear-gradient(90deg, #FFFFFF, #FE6E32, #FFDED1);
          border-radius: 5px;
          margin: -2px -5px;
        }

      }

      .title-text {
        font-size: 28px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #141414;
        margin-left: 20px;
      }
    }
  }

}

.build-content {
  margin-top: 57px;
  padding-bottom: 30px;

}

.product-img {
  background: rgb(#92859F, 0.24);
  box-shadow: 0px 13px 27px 0px rgba(0, 0, 0, 0.19);
  border-radius: 24px;
  margin-top: 47px;
  width: calc(100% - 20px);
  margin-left: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  position: relative;

  .person-icon1 {
    position: absolute;
    width: 149px;
    right: 144px;
    height: 67px;
    top: -40px;
  }

  .person-icon2 {
    position: absolute;
    width: 87px;
    right: 20px;
    height: 167px;
    bottom: -45px;
  }

  .img-data {
    margin-top: 10px;
    width: calc(100% + 20px);
    //background: #92859F;
    box-shadow: 0px 13px 27px 0px rgba(0, 0, 0, 0.19);
    border-radius: 24px;
  }
}

.product-desc {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #141414;
  margin-top: 26px;
}

.product-name {
  display: flex;
  margin-top: 20px;

  .product-name-text {
    font-size: 48px;
    font-family: FZRuiZhengHei_GBK;
    font-weight: 800;
    color: #141414;
  }

  .mi-huo-icon {
    width: 56px;
    height: 28px;
    color: #FFFFFF;
    background: #FE6E32;
    border-radius: 10px 2px 10px 0px;
    line-height: 28px;
    text-align: center;
    font-size: 18px;
    font-family: FZRuiZhengHei_GBK;
    font-weight: 800;
    margin-left: 20px;
    margin-top: -20px;
  }
}

.preferred-services {
  width: 176px;
  height: 40px;
  font-size: 43px;
  font-family: Edwardian Script ITC;
  font-weight: 400;
  color: #141414;
  line-height: 62px;
  opacity: 0.58;
}

</style>
