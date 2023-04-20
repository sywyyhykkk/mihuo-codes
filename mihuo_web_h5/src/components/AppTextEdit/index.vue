<template>
  <div class="decoration-edit">
    <div class="addContent">
      <ul class="icon-list">
        <li
          v-if="buttons.includes('word') && isEditable"
          class="icon-item"
          @click="() => addItem('word')"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="段落文字"
            placement="top-start"
          >
            <el-icon :size="20">
              <Edit />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('images') && isEditable"
          class="icon-item"
          @click="() => addItem('images', 1)"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="图片素材"
            placement="top-start"
          >
            <el-icon :size="20">
              <Picture />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('listItem') && isEditable"
          class="icon-item"
          @click="() => addItem('listItem', 1)"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="自定义列表项"
            placement="top-start"
          >
            <el-icon :size="20">
              <Expand />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('productItem') && isEditable"
          class="icon-item"
          @click="() => addItem('productItem', 1)"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="商品列表项"
            placement="top-start"
          >
            <el-icon :size="20">
              <Apple />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('caseItem') && isEditable"
          class="icon-item"
          @click="() => addItem('caseItem', 1)"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="案例列表项"
            placement="top-start"
          >
            <el-icon :size="20">
              <PictureRounded />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('imageGrid') && isEditable"
          class="icon-item"
          @click="() => addItem('imageGrid')"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="九宫格"
            placement="top-start"
          >
            <el-icon :size="20">
              <Grid />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('video') && isEditable"
          class="icon-item"
          @click="() => addItem('video', 2)"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="视频素材"
            placement="top-start"
          >
            <el-icon :size="20">
              <video-camera-filled />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('audio') && isEditable"
          class="icon-item"
          @click="() => addItem('audio', 3)"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="音频素材"
            placement="top-start"
          >
            <el-icon size="20">
              <service />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('imageandtext') && isEditable"
          class="icon-item"
          @click="() => addItem('imageandtext', 4)"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="图文素材"
            placement="top-start"
          >
            <el-icon size="20">
              <picture-filled />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('sorted') && isEditable"
          class="icon-item"
          @click="() => addItem('sorted')"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="有序列表"
            placement="top-start"
          >
            <el-icon size="20">
              <management />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('unsorted') && isEditable"
          class="icon-item"
          @click="() => addItem('unsorted')"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="无序列表"
            placement="top-start"
          >
            <el-icon size="20">
              <operation />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('icontitle') && isEditable"
          class="icon-item"
          @click="() => addItem('icontitle')"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="图标标题"
            placement="top-start"
          >
            <el-icon size="20">
              <ticket />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('link') && isEditable"
          class="icon-item"
          @click="() => addItem('link')"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="链接"
            placement="top-start"
          >
            <el-icon size="20">
              <Link />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('product') && isEditable"
          class="icon-item"
          @click="() => addItem('product')"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="商品"
            placement="top-start"
          >
            <el-icon size="20">
              <Goods />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('divider') && isEditable"
          class="icon-item"
          @click="() => addItem('divider')"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="分割线"
            placement="top-start"
          >
            <el-icon size="20">
              <minus />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('notInclude') && isEditable"
          class="icon-item"
          @click="() => addItem('notInclude')"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="不包含"
            placement="top-start"
          >
            <el-icon size="20">
              <FolderDelete />
            </el-icon>
          </el-tooltip>
        </li>
        <li
          v-if="buttons.includes('gridImageText') && isEditable"
          class="icon-item"
          @click="() => addItem('gridImageText')"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="网格图文"
            placement="top-start"
          >
            <el-icon size="20">
              <Menu />
            </el-icon>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <section class="c">
      <!-- header 不可拖拽 -->
      <div>
        <div class="top-nav" data-index="0" @click="selectType(0)">
          <img src="@/assets/img/appNavBlack.jpg">
        </div>
        <div
          :style="{ backgroundColor: info.backgroundColor }"
          class="view-content"
        >
          <draggable v-model="view.listdata" tag="ul" draggable="li">
            <li
              v-for="(item, index) in view.listdata"
              :key="item.name"
              :class="{ selectedDom: item.name == selectIndex }"
              :data-index="index"
              class="item"
            >
              <div>
                <el-popover
                  placement="right"
                  :width="400"
                  trigger="click"
                  @show="selectType(index, item)"
                >
                  <template #reference>
                    <div v-if="item" :style="getStyle(item)">
                      <component
                        :is="typeList[item.type]['component']"
                        :class-name="className[item.tabType]"
                        :data="item"
                      />
                      <el-icon
                        class="el-icon-delete-solid"
                        @click="deleteItem($event, index)"
                      >
                        <delete />
                      </el-icon>
                      <el-icon class="el-icon-menu-solid">
                        <Grid />
                      </el-icon>
                    </div>
                  </template>
                  <!-- 工具栏 -->
                  <section v-if="item.options && item.style">
                    <div
                      v-if="checkToolBar('fontSize', item.type)"
                      class="toolbar-item"
                    >
                      <el-radio-group v-model="item.options.classname">
                        <el-radio-button label="small">小</el-radio-button>
                        <el-radio-button label="default">默认</el-radio-button>
                        <el-radio-button label="middle">中等</el-radio-button>
                        <el-radio-button label="large">大</el-radio-button>
                      </el-radio-group>
                    </div>
                    <div
                      v-if="checkToolBar('fontWeight', item.type)"
                      class="toolbar-item"
                    >
                      <el-radio-group v-model="item.style.size.fontWeight">
                        <el-radio-button label="400">默认</el-radio-button>
                        <el-radio-button label="700">加粗</el-radio-button>
                      </el-radio-group>
                    </div>
                    <div
                      v-if="checkToolBar('textAlign', item.type)"
                      class="toolbar-item"
                    >
                      <el-radio-group v-model="item.style.size.textAlign">
                        <el-radio-button label="left">靠左</el-radio-button>
                        <el-radio-button label="center">居中</el-radio-button>
                        <el-radio-button label="right">靠右</el-radio-button>
                      </el-radio-group>
                    </div>
                    <div
                      v-if="checkToolBar('gridType', item.type)"
                      class="toolbar-item"
                    >
                      <el-radio-group v-model="item.data.gridType">
                        <el-radio-button
                          disabled
                          label=""
                        >形状</el-radio-button>
                        <el-radio-button label="four">田字格</el-radio-button>
                        <el-radio-button label="nine">九宫格</el-radio-button>
                      </el-radio-group>
                      <br>
                      <el-radio-group
                        v-model="item.data.gridSrc"
                        style="margin-top: 10px"
                      >
                        <el-radio-button
                          disabled
                          label=""
                        >数据类型</el-radio-button>
                        <el-radio-button label="category">分类</el-radio-button>
                      </el-radio-group>
                    </div>
                    <div
                      v-if="checkToolBar('gridNum', item.type)"
                      class="toolbar-item"
                    >
                      <el-radio-group v-model="item.data.gridNum">
                        <el-radio-button
                          disabled
                          label=""
                        >形状</el-radio-button>
                        <el-radio-button label="1">单列图文</el-radio-button>
                        <el-radio-button label="2">双列图文</el-radio-button>
                        <el-radio-button label="3">三列图文</el-radio-button>
                      </el-radio-group>
                      <br>
                      <el-radio-group
                        v-model="item.data.titleShow"
                        style="margin-top: 2rem"
                      >
                        <el-radio-button
                          disabled
                          label=""
                        >标题</el-radio-button>
                        <el-radio-button label="0">不显示</el-radio-button>
                        <el-radio-button label="1">显示</el-radio-button>
                      </el-radio-group>
                      <br>
                      <el-radio-group
                        v-model="item.data.subtitleShow"
                        style="margin-top: 2rem"
                      >
                        <el-radio-button
                          disabled
                          label=""
                        >副标题</el-radio-button>
                        <el-radio-button label="0">不显示</el-radio-button>
                        <el-radio-button label="1">显示</el-radio-button>
                      </el-radio-group>
                      <editGridImageText v-if="item" v-model="item.data" />
                    </div>
                    <div
                      v-if="checkToolBar('listContent', item.type)"
                      class="toolbar-item"
                    >
                      <el-input
                        v-if="isShowInput"
                        v-model="currentInputValue"
                        style="width: 50%; margin-right: 10px"
                        :maxlength="
                          currentTextContentType === 'title' ? 10 : 20
                        "
                        type="text"
                        placeholder="请输入内容"
                      />
                      <el-button
                        v-if="isShowInput"
                        size="small"
                        style="margin-left: 10px"
                        @click="confirmAddText"
                      >确认添加
                      </el-button>
                      <el-button
                        v-if="isShowInput"
                        size="small"
                        style="margin-left: 10px"
                        @click="cancelInput"
                      >取消
                      </el-button>
                      <el-button
                        size="small"
                        :type="
                          currentTextContentType === 'title' ? 'primary' : ''
                        "
                        style="margin-bottom: 10px"
                        @click="addTextContent('title')"
                      >添加标题
                      </el-button>
                      <el-button
                        size="small"
                        :type="
                          currentTextContentType === 'price-title'
                            ? 'primary'
                            : ''
                        "
                        @click="addTextContent('price-title')"
                      >添加价格
                      </el-button>
                      <el-button
                        size="small"
                        :type="
                          currentTextContentType === 'des' ? 'primary' : ''
                        "
                        @click="addTextContent('des')"
                      >添加描述
                      </el-button>
                      <el-button
                        size="small"
                        :type="
                          currentTextContentType === 'delete-line'
                            ? 'primary'
                            : ''
                        "
                        @click="addTextContent('delete-line')"
                      >添加删除线
                      </el-button>
                      <el-button
                        size="small"
                        @click="addTextContent('delete-all')"
                      >清空内容
                      </el-button>
                      <uploadImage
                        v-model="item.data.imgUrl"
                        style="margin-bottom: 0 !important; margin-top: 10px"
                        :max-count="1"
                        :is-edits="true"
                      />
                    </div>
                    <div
                      v-if="checkToolBar('iconUrl', item.type)"
                      class="toolbar-item"
                    >
                      <el-radio-group v-model="item.style.iconUrl">
                        <el-radio-button label="icon_title1">
                          <el-image
                            style="width: 15px; height: 15px"
                            fit="cover"
                            :src="require('@/assets/img/icon_title.png')"
                          />
                        </el-radio-button>
                        <el-radio-button label="icon_title2">
                          <el-image
                            style="width: 15px; height: 15px"
                            fit="cover"
                            :src="require('@/assets/img/icon_title2.png')"
                          />
                        </el-radio-button>
                        <el-radio-button label="icon_title3">
                          <el-image
                            style="width: 15px; height: 15px"
                            fit="cover"
                            :src="require('@/assets/img/icon_title3.png')"
                          />
                        </el-radio-button>
                        <el-radio-button label="no_title">
                          <span style="line-height: 15px">空</span>
                        </el-radio-button>
                        <el-radio-button label="under_line">
                          <span style="line-height: 15px">标题下划线</span>
                        </el-radio-button>
                      </el-radio-group>

                      <uploadImage
                        v-model="currentIconUrl"
                        style="margin-bottom: 0 !important; margin-top: 5px"
                        :max-count="1"
                        :is-edits="true"
                      />
                    </div>
                    <div
                      v-if="checkToolBar('textColor', item.type)"
                      class="toolbar-item"
                      style="display: inline-block"
                    >
                      <div
                        v-for="(color, i) in colors"
                        :key="i"
                        class="colorbox"
                        :class="{ active: item.style.color.color == color }"
                        :style="{ backgroundColor: color }"
                        @click="chooseColor(item, color)"
                      />
                      <div style="width: 80px; display: inline-block">
                        <el-input
                          v-model="item.style.color.color"
                          style="display: inline-block; width: 120px"
                        />
                      </div>
                    </div>
                    <div
                      v-if="checkToolBar('textMargin', item.type)"
                      class="toolbar-item"
                    >
                      <el-form label-width="0" label-position="left">
                        <div class="cententbox" />
                        <div class="boxtop">
                          <el-form-item>
                            <el-input
                              v-model="item.layout.spacing.paddingTop"
                              type="number"
                            />
                          </el-form-item>
                        </div>
                        <div class="boxbottom">
                          <el-form-item>
                            <el-input
                              v-model="item.layout.spacing.paddingBottom"
                              type="number"
                            />
                          </el-form-item>
                        </div>
                        <div class="boxleft">
                          <el-form-item>
                            <el-input
                              v-model="item.layout.spacing.paddingLeft"
                              type="number"
                            />
                          </el-form-item>
                        </div>
                        <div class="boxright">
                          <el-form-item>
                            <el-input
                              v-model="item.layout.spacing.paddingRight"
                              type="number"
                            />
                          </el-form-item>
                        </div>
                      </el-form>
                    </div>
                  </section>
                </el-popover>
              </div>
            </li>
          </draggable>
        </div>
      </div>
      <div style="display: none">
        <el-button :disabled="isCanAdd" type="primary" />
        <el-button
          :disabled="isCanAdd"
          icon="el-icon-minus"
          style="margin: 0"
        />
      </div>
    </section>
    <ChooseGeneralMaterial
      v-model="showMaterial"
      :title="materialType"
      platform-type="3"
      @getGeneralMaterial="getGeneralMaterial"
    />
    <ChooseProduct
      v-model="showProduct"
      :single="single"
      @getGeneralMaterial="getGeneralMaterial"
    />
    <ChooseCms
      v-model="showCms"
      :city-operator-id="+cityOperatorId"
      @getGeneralMaterial="getGeneralMaterial"
    />
    <el-dialog
      v-model="innerVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
      title="链接"
      append-to-body
    >
      <el-form label-width="9rem" style="width: 100%">
        <el-form-item label="链接名称">
          <el-input v-model="newLink.form.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="内容类型">
          <el-radio-group v-model="newLink.form.linkType">
            <el-radio label="0">文本</el-radio>
            <el-radio label="1">素材</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="newLink.form.linkType == 0" label="文本内容">
          <el-input
            v-model="newLink.form.textContent"
            type="text"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item v-if="newLink.form.linkType == 1" label="选取素材">
          <ul class="el-upload-list el-upload-list--picture-card">
            <li
              v-for="(item, index) in linkPics"
              :key="index"
              tabindex="0"
              class="el-upload-list__item is-success"
            >
              <img
                style="width: 100%; height: 100%"
                :src="$getUrl.getPicUrl(item)"
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="removeMaterial(index)"
                >
                  <el-icon color="#ffffff"><Delete /></el-icon>
                </span>
              </span>
            </li>
          </ul>
          <div
            class="el-upload el-upload--picture-card"
            @click="addMaterial('images', 1)"
          >
            <el-icon color="#ffffff">
              <plus />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item label="app页面">
          <el-select v-model="newLink.form.appPage" placeholder="请选择">
            <el-option
              v-for="pname in appPages"
              :key="pname"
              :label="pname.name"
              :value="pname.path"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="newLink.form.appPage === appPages[10].path"
          label="活动页面"
        >
          <el-select v-model="newLink.form.link" placeholder="请选择活动页面">
            <el-option
              v-for="activity in appActivityPages"
              :key="activity"
              :label="activity.title"
              :value="activity.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="newLink.form.appPage === appPages[2].path || newLink.form.appPage === appPages[3].path || newLink.form.appPage === appPages[8].path"
          label="链接分类"
        >
          <el-cascader
            v-model="newLink.form.link"
            :options="productCateOptions"
            :props="{
              children: 'children',
              label: 'name',
              value: 'treeCode',
              checkStrictly: true
            }"
            @change="handleChangeCategory"
          />
        </el-form-item>
        <el-form-item
          v-if="newLink.form.appPage === appPages[0].path"
          label="链接商品"
        >
          <ul class="el-upload-list el-upload-list--picture-card">
            <li
              v-for="(item, index) in linkProduct"
              :key="index"
              tabindex="0"
              class="el-upload-list__item is-success"
            >
              <img
                style="width: 100%; height: 100%"
                :src="$getUrl.getPicUrl(item.coverImg)"
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="removeProduct(index)"
                >
                  <el-icon color="#ffffff"><Delete /></el-icon>
                </span>
              </span>
            </li>
          </ul>
          <div
            class="el-upload el-upload--picture-card"
            @click="chooseLinkProduct"
          >
            <el-icon color="#fff">
              <plus />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item
          v-if="newLink.form.appPage === appPages[1].path"
          label="链接文案"
        >
          <ul class="el-upload-list el-upload-list--picture-card">
            <li
              v-for="(item, index) in linkCms"
              :key="index"
              tabindex="0"
              class="el-upload-list__item is-success"
            >
              <img
                style="width: 100%; height: 100%"
                :src="$getUrl.getPicUrl(item.facePic)"
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="removeProduct(index)"
                >
                  <el-icon color="#ffffff"> <delete /> </el-icon></span>
              </span>
            </li>
          </ul>
          <div class="el-upload el-upload--picture-card" @click="chooseCms">
            <el-icon color="#ffffff">
              <plus />
            </el-icon>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="addLinkMaterial">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  markRaw,
  computed,
  watch,
  toRaw
} from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { ElMessage } from 'element-plus'
import { allMiniItem } from '@/allMiniItem'
import Product from '@/components/EditView/Product'
import Images from '@/components/EditView/Images'
import Banner from '@/components/EditView/Banner'
import ChooseGeneralMaterial from '@/components/ChooseGeneralMaterial/index'
import ChooseProduct from '@/components/ChooseProduct/index'
import ChooseCms from '@/components/ChooseCms/index'
import NotInclude from '@/components/EditView/NotInclude'
import GridImageText from '@/components/EditView/GridImageText'
import { getGuid } from '@/components/util/utils'
import { useStore } from 'vuex'
import { Expand } from '@element-plus/icons-vue'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  name: 'AppTextEdit',
  components: {
    Expand,
    draggable: VueDraggableNext,
    Product,
    NotInclude,
    Images,
    Banner,
    ChooseGeneralMaterial,
    ChooseProduct,
    ChooseCms,
    GridImageText
  },
  props: {
    modelValue: {
      type: String,
      default: JSON.stringify([])
    },
    buttons: {
      type: Array,
      default: () => [
        'word',
        'images',
        'video',
        'audio',
        'divider',
        'link',
        'imageandtext',
        'icontitle',
        'product',
        'listItem',
        'unsorted',
        'sorted',
        'productItem',
        'caseItem',
        'imageGrid',
        'notInclude',
        'gridImageText'
      ]
    },
    isEditable: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const store = useStore()
    const loading = computed(() => store.showLoading)
    const appActivityPages = ref([])
    const productCateOptions = ref([])
    // 注意appPages数组的顺序不要改
    const appPages = markRaw([
      {
        name: '客户端-商品详情',
        path: '/pages-mall/productDetail/productDetail'
      },
      { name: '客户端-文案详情', path: '/pages/home/article' },
      { name: '客户端-分类页面', path: '/pages/category/category' },
      { name: '客户端-分类页面-关联品牌', path: '/pages/category/category?brandId=' },
      { name: '服务端-注册页面', path: '/pages-user/register' },
      { name: '服务端-找人页面', path: '/pages/home/morePeople' },
      { name: '服务端-找活页面', path: '/pages/home/moreWork' },
      {
        name: '客户端-装修案例',
        path: '/pages-common/case/design/details'
      },
      { name: '客户端-分类列表', path: '/pages-mall/cateList/cateList' },
      { name: '客户端-品牌专区', path: '/pages-common/brandZone/brandZone' },
      {
        name: '客户端-活动报名',
        path: '/pages-mine/mihuoActivityPoster/mihuoActivityPoster'
      }
    ])
    const cityOperatorId = ref(wsCache.get('cityOperator')?.id)
    const showMaterial = ref(false)
    const innerVisible = ref(false)
    const showProduct = ref(false)
    const single = ref(false)
    const isCanAdd = ref(true)
    const showCms = ref(false)
    const newLink = reactive({ form: {}})
    const linkPics = ref([])
    const linkProduct = ref([])
    const linkCms = ref([])
    const colors = reactive(['#909199', '#303133', '#606166'])
    const chooseMaterialType = ref('')
    const typeList = markRaw(allMiniItem)
    // 这里有问题 如果直接用代理的数据进去绑定v-model的话。拖动组件更新的时候会有问题
    const viewData = ref(JSON.parse(props.modelValue || []))
    const filterdata = viewData.value.filter((item) => item && item.name)

    const view = reactive({
      listdata: filterdata
    })
    const materialType = ref(0)
    const currentIndex = ref(0)
    const selectIndex = ref('')
    const className = {
      1: 'one',
      2: 'two',
      3: 'three'
    }
    const info = toRaw({
      type: 'info',
      title: '页面标题'
    })
    const currentIconUrl = ref('')
    const isShowInput = ref(false)
    const currentInputValue = ref('')
    const currentTextContentType = ref('')
    // 工具栏
    const toolbar = markRaw({
      // 文字大小
      fontSize: {
        isAll: false,
        include: ['word', 'sorted'],
        exclude: []
      },
      // 文字加粗
      fontWeight: {
        isAll: false,
        include: ['word', 'icontitle'],
        exclude: []
      },
      // 文字对齐
      textAlign: {
        isAll: false,
        include: ['word', 'icontitle'],
        exclude: []
      },
      // 图标标题的url
      iconUrl: {
        isAll: false,
        include: ['icontitle'],
        exclude: []
      },
      // 自定义列表
      listContent: {
        isAll: false,
        include: ['listItem'],
        exclude: []
      },
      // 文字颜色
      textColor: {
        isAll: false,
        include: ['word', 'icontitle', 'productItem', 'caseItem'],
        exclude: []
      },
      // 外边距
      textMargin: {
        isAll: false,
        include: [],
        exclude: [
          'icontitle',
          'productItem',
          'listItem',
          'caseItem',
          'imageGrid',
          'gridImageText'
        ]
      },
      // 九宫格或者田字格选择
      gridType: {
        isAll: false,
        include: ['imageGrid'],
        exclude: []
      },
      // 网格列数
      gridNum: {
        isAll: false,
        include: ['gridImageText'],
        exclude: []
      }
    })

    onMounted(() => {
      productcategoryPlat()
      getAppActivity()
      // watch(() => props.modelValue, () => {
      //   const viewData = ref(JSON.parse(props.modelValue || []))
      //   const filterdata = viewData.value.filter((item) => item && item.name)
      //   view.listdata = filterdata
      // })
    })

    watch(currentIconUrl, (val) => {
      if (val) {
        view.listdata[currentIndex.value].style.iconUrl = val
        currentIconUrl.value = ''
      }
    })

    watch(
      view,
      (v, v2) => {
        emit('update:modelValue', JSON.stringify(view.listdata))
      },
      { deep: true, immediate: true }
    )

    const getAppActivity = async () => {
      await fetch({
        url: `/basic/basicevents/page`,
        method: 'get'
      }).then((res) => {
        appActivityPages.value = res.data.records
      })
    }

    const productcategoryPlat = async () => {
      await fetch({
        url: `/mall/platformcategory/tree`,
        method: 'get'
      }).then((res) => {
        productCateOptions.value = res.data
      })
    }

    const handleChangeCategory = (val) => {
      newLink.form.link = val?.length > 0 ? val[val?.length - 1] : ''
    }

    const checkToolBar = (checkType, type) => {
      let result = false
      if (toolbar[checkType]?.isAll) {
        result = true
      } else if (toolbar[checkType]?.include.length > 0) {
        result = toolbar[checkType]?.include.indexOf(type) !== -1
      } else if (toolbar[checkType]?.exclude.length > 0) {
        result = toolbar[checkType]?.exclude.indexOf(type) === -1
      }
      return result
    }

    const addTextContent = (type) => {
      if (type === 'delete-all') {
        view.listdata[currentIndex.value].data.textContent = []
        return
      }
      if (view.listdata[currentIndex.value].data.textContent.length === 3) {
        ElMessage.warning('最多只能添加3个文本内容')
        return
      }
      if (isShowInput.value) {
        currentTextContentType.value = type
      } else {
        isShowInput.value = !isShowInput.value
        currentTextContentType.value = type
      }
    }

    const cancelInput = () => {
      isShowInput.value = false
      currentInputValue.value = ''
      currentTextContentType.value = ''
    }

    const confirmAddText = () => {
      if (currentInputValue.value) {
        view.listdata[currentIndex.value].data.textContent.push({
          text: currentInputValue.value,
          type: currentTextContentType.value
        })
        currentTextContentType.value = ''
        currentInputValue.value = ''
        isShowInput.value = false
      }
    }

    // 切换视图组件
    const selectType = (index, item) => {
      currentIndex.value = index
      selectIndex.value = item.name
      isShowInput.value = false
      currentTextContentType.value = ''
      if (
        view.listdata[index].type === 'sorted' ||
        view.listdata[index].type === 'unsorted'
      ) {
        isCanAdd.value = false
      } else {
        isCanAdd.value = true
      }
    }

    // 素材添加到链接
    const addMaterial = (mtype, titleText = 0) => {
      materialType.value = titleText
      showMaterial.value = true
    }

    // 移除
    const removeMaterial = (index) => {
      linkPics.value.splice(index, 1)
    }

    // 移除链接选择的商品
    const removeProduct = () => {
      linkProduct.value = []
    }

    // 选择链接商品
    const chooseLinkProduct = () => {
      single.value = true
      showProduct.value = true
    }

    // 选择文案
    const chooseCms = () => {
      showCms.value = true
      single.value = true
    }

    // 添加链接到view
    const addLinkMaterial = () => {
      if (Number(newLink.form.linkType) === 0 && !newLink.form.textContent) {
        ElMessage.info('文字链接文本不能为空')
        return
      }
      if (Number(newLink.form.linkType) === 1) {
        if (
          !linkProduct.value.length &&
          !newLink.form.link &&
          !linkCms.value.length
        ) {
          ElMessage.info('请为您的链接添加内容')
          return
        }
      }

      const listdata = linkPics.value.length
        ? linkPics.value.map((item) => ({
          ...newLink.form,
          url: item,
          linkCms: linkCms.value,
          linkProduct: linkProduct.value
        }))
        : [
          {
            ...newLink.form,
            linkCms: linkCms.value,
            linkProduct: linkProduct.value
          }
        ]

      const defaultData = {
        name: getGuid(),
        type: chooseMaterialType.value, // 组件类型
        status: 0, // 默认状态
        data: {
          textContent: [],
          gridType: '',
          gridSrc: ''
        }, // 对象数据
        listdata: listdata, // list数据
        content: '',
        options: { classname: 'default' },
        layout: {
          spacing: {}
        },
        style: {
          size: {},
          iconUrl: '',
          fontType: '',
          color: {
            color: '#141414'
          }
        } // 选项操作
      }
      view.listdata.push(defaultData)
      innerVisible.value = false
      newLink.form = {}
      linkCms.value = []
      linkProduct.value = []
      linkPics.value = []
      selectIndex.value = view.listdata.length - 1
    }

    // 添加组件
    const addItem = (mtype, titleText = 0) => {
      if (!props.isEditable) {
        return
      }
      chooseMaterialType.value = mtype
      materialType.value = titleText
      if (mtype === 'product') {
        showProduct.value = true
        return
      }
      if (
        mtype === 'images' ||
        mtype === 'video' ||
        mtype === 'audio' ||
        mtype === 'imageandtext'
      ) {
        showMaterial.value = true
        return
      }
      if (mtype === 'link') {
        innerVisible.value = true
        return
      }
      getGeneralMaterial()
    }

    const deleteItem = (e, index) => {
      if (props.isEditable) {
        e.preventDefault()
        e.stopPropagation()
        view.listdata.splice(index, 1)
      }
    }

    const handleClose = () => {
      newLink.form = {}
      linkCms.value = []
      linkProduct.value = []
      linkPics.value = []
      innerVisible.value = false
    }

    const getGeneralMaterial = (data = ref([])) => {
      if (chooseMaterialType.value === 'imageandtext') {
        view.listdata.push(...data.value)
        return
      }
      if (chooseMaterialType.value === 'link') {
        if (
          newLink.form.appPage === '/pages-mall/productDetail/productDetail' &&
          single.value
        ) {
          linkProduct.value = []
          linkProduct.value.push(...data.value)
          single.value = false
          return
        }
        if (newLink.form.appPage === '/pages/home/article' && single.value) {
          linkCms.value = []
          linkCms.value.push(...data.value)
          single.value = false
          return
        }
        linkPics.value.push(...data.value)
        return
      }
      let listItemData
      if (chooseMaterialType.value === 'product') {
        listItemData = data.value[0]
      } else {
        listItemData = data.value.map((item) => ({
          url: item
        }))
      }

      const defaultData = {
        name: getGuid(),
        type: chooseMaterialType.value, // 组件类型
        status: 0, // 默认状态
        data: {
          textContent: [],
          gridType: '',
          gridSrc: '',
          gridNum: 1,
          titleShow: 1,
          subtitleShow: 1
        }, // 对象数据
        listdata: listItemData, // list数据
        content: '',
        options: { classname: 'default' },
        layout: {
          spacing: {}
        },
        style: {
          iconUrl: '',
          fontType: '',
          size: {},
          color: {
            color: '#141414'
          }
        } // 选项操作
      }
      view.listdata.push(defaultData)
      selectIndex.value = view.listdata.length - 1
    }

    const getStyle = (item) => {
      const layoutStyle = {}
      if (!item.layout) return
      for (const key in item.layout.spacing) {
        layoutStyle[key] = item.layout.spacing[key] + 'px'
      }
      return layoutStyle
    }

    const chooseColor = (item, color) => {
      item.style.color.color = color
    }

    return {
      appActivityPages,
      cityOperatorId,
      typeList,
      view,
      getStyle,
      removeMaterial,
      addMaterial,
      addLinkMaterial,
      linkPics,
      innerVisible,
      colors,
      materialType,
      currentIndex, // 当前组件的索引
      className,
      currentIconUrl,
      currentInputValue,
      isShowInput,
      currentTextContentType,
      toolbar,
      deleteItem,
      selectType,
      info,
      chooseCms,
      showCms,
      handleClose,
      newLink,
      addItem,
      loading,
      selectIndex,
      isCanAdd,
      showMaterial,
      showProduct,
      chooseColor,
      linkProduct,
      linkCms,
      removeProduct,
      single,
      chooseLinkProduct,
      appPages,
      getGeneralMaterial,
      addTextContent,
      confirmAddText,
      cancelInput,
      checkToolBar,
      handleChangeCategory,
      productCateOptions
    }
  }
})
</script>
<style scoped lang="less">
:deep(.el-button) {
  margin-left: 0 !important;
  margin-right: 10px !important;
  margin-bottom: 10px !important;
}

.colorbox {
  &.active {
    border: 1px solid @topSMenuHover;
    width: 18px;
    height: 18px;
  }

  width: 20px;
  height: 20px;
  cursor: pointer;
  display: inline-block;
  margin: -5px 5px;
}

.selectedDom {
  border: 1px dashed #1b8bff;
}

.spacType {
  background: #999;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.setStyle {
  background: #409eff;
  color: #ffffff;
  font-size: 14px;
  padding: 10px 15px;
  border-radius: 2px;
  margin: 15px 0;
}

.block {
  font-size: 15px;
  margin: 20px;
}

.toolbar-item {
  width: 100%;
  display: inline-block;
  margin-bottom: 10px;

  .cententbox {
    width: 80px;
    height: 80px;
    margin: 50px auto;
    border: 1px dashed #333333;
  }

  .boxtop {
    width: 80px;
    position: relative;
    top: -180px;
    left: calc(50% - 40px);
  }

  .boxleft {
    width: 80px;
    position: relative;
    top: -230px;
    left: 100px;
  }

  .boxbottom {
    width: 80px;
    position: relative;
    top: -105px;
    left: calc(50% - 40px);
  }

  .boxright {
    width: 80px;
    position: relative;
    top: -295px;
    left: 280px;
  }
}

.decoration-edit {
  max-width: 36rem;

  .el-upload-list__item:hover {
    .el-upload-list__item-actions {
      opacity: 0.9;
    }
  }

  :deep(.el-textarea__inner) {
    box-shadow: none;
  }

  .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
  }

  .icon-list {
    overflow: hidden;
    list-style: none;
    padding: 0 !important;
    //border-top: 1px solid var(--el-border-color-base);
    //border-left: 1px solid var(--el-border-color-base);
    border-radius: 4px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    width: 360px;

    .icon-item {
      text-align: center;
      color: var(--el-text-color-regular);
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 25px;
      //border-right: 1px solid var(--el-border-color-base);
      //border-bottom: 1px solid var(--el-border-color-base);
      transition: background-color var(--el-transition-duration);

      &:hover {
        background: #f5f5f5;
        color: #1b8bff;
      }
    }
  }

  .c {
    width: auto;
    max-width: 400px;
    height: 580px;
    overflow-y: auto;
    align-items: center;
    position: relative;
    background: #f5f5f5;
    box-shadow: 0px 5px 5px #e6e6e6;

    .top-nav {
      position: absolute;
      top: 0;
      height: 50px;
      background: #fff;
      z-index: 999;
      transition: all 0.3s;

      &:hover {
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 10px #afafaf;
      }

      .tit {
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translateX(-50%);
      }

      img {
        max-width: 100%;
        image-rendering: -moz-crisp-edges;
        image-rendering: -o-crisp-edges;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
      }
    }

    .addContent {
      display: flex;
      margin: 15px 0;
      align-content: center;
      justify-content: center;
      flex-wrap: wrap;

      .el-button {
        margin-bottom: 10px;
      }
    }

    .view-content {
      width: 355px;
      height: 500px;
      overflow-y: auto;
      overflow-x: hidden;
      //padding-top: 50px;
      position: absolute;
      top: 50px;

      box-shadow: 0 2px 6px #f5f5f5;

      &::-webkit-scrollbar {
        width: 1rem;
      }

      &::-webkit-scrollbar-thumb {
        background: #dbdbdb;
      }

      &::-webkit-scrollbar-track {
        background: #f6f6f6;
      }

      .item {
        transition: all 0.3s;
        background: #fff;
        min-height: 14px;
        line-height: 0;
        list-style: none;

        &:hover {
          border-radius: 10px;
          box-shadow: 0 0 10px #afafaf;
          transform: scale(0.95);
          margin: 0px 0 10px 0;

          .el-icon-delete-solid,
          .el-icon-menu-solid {
            display: block;
          }
        }

        .el-icon-delete-solid {
          position: absolute;
          right: -10px;
          top: -5px;
          font-size: 20px;
          cursor: pointer;
          display: none;
          color: @errorColor;
          z-index: 9999;
        }

        .el-icon-menu-solid {
          position: absolute;
          left: -10px;
          bottom: -5px;
          font-size: 20px;
          cursor: pointer;
          display: none;
          // color: @errorColor;
          z-index: 9999;
        }

        .el-icon-menu {
          position: absolute;
          left: -10px;
          bottom: -15px;
          font-size: 25px;
          cursor: pointer;
          display: none;
          z-index: 9999;
        }
      }
    }
  }

  .submit-btn {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
