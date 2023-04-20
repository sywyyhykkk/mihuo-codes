<template>
  <div style="position: relative">
    <el-card>
      <el-input
        v-model="keyword.name" prefix-icon="Search"
        placeholder="案例名称"
      />
      <el-select
        v-model="keyword.model" filterable
        placeholder="请选择户型"
      >
        <el-option
          v-for="(item, index) in modelList"
          :key="index"
          :label="item.name"
          :value="item.name"
        />
      </el-select>

      <el-select
        v-model="keyword.roomType" filterable
        placeholder="请选择房型"
      >
        <el-option
          v-for="(item, index) in roomTypeList"
          :key="index"
          :label="item.name"
          :value="item.name"
        />
      </el-select>

      <el-select
        v-model="keyword.area" filterable
        placeholder="请选择面积"
      >
        <el-option
          v-for="(item, index) in areaList"
          :key="index"
          :label="item.name"
          :value="item.name"
        />
      </el-select>

      <el-select
        v-model="keyword.style"
        filterable
        placeholder="请选择装修风格"
      >
        <el-option
          v-for="(item, index) in styleList"
          :key="index"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-button
        icon="Search" :type="buttonType"
        @click="getData"
      >
        查询
      </el-button>
      <el-button icon="refreshLeft" @click="refreshData"> 重置</el-button>
      <div class="el-card-right" v-if="!single">
        <el-button
          icon="plus" :type="buttonType"
          @click="addProductAttrCate()"
        >添加
        </el-button>
      </div>
    </el-card>

    <div>
      <el-table
        ref="productAttrCateTable"
        v-loading="loading"
        stripe
        :highlight-current-row="single"
        @current-change="handleSelectionChange"
        :data="tableData"
        :height="single?'55vh':'calc(100vh - 19rem)'"
        row-key="id"
        border
      >
        <el-table-column
          type="index" width="50"
          align="center" label="序号"
        />
        <el-table-column
          label="案例名称"
          align="center"
          prop="name"
          width="200"
        />
        <el-table-column
          label="装修造价(万元)"
          align="center"
          prop="cost"
          width="150"
        />
        <el-table-column
          label="户型" align="center"
          prop="model"
        />
        <el-table-column
          label="房型" align="center"
          prop="roomType"
        />
        <el-table-column
          label="面积(m²)" align="center"
          prop="area"
        />
        <el-table-column
          label="装修风格" align="center"
          prop="style"
        />
        <el-table-column
          label="装修方式" align="center"
          prop="way"
        />

        <el-table-column label="封面图片" align="center">
          <template #default="scope">
            <el-image
              preview-teleported
              :src="$getUrl.getPicUrl(scope.row.coverPic, true)"
              :preview-src-list="$getUrl.getPicUrl(scope.row.coverPic)"
            />
          </template>
        </el-table-column>
        <el-table-column label="户型图" align="center">
          <template #default="scope">
            <el-image
              preview-teleported
              :src="$getUrl.getPicUrl(scope.row.roomPic, true)"
              :preview-src-list="$getUrl.getPicUrl(scope.row.roomPic)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="推荐状态" align="center"
          width="100"
        >
          <template #default="scope">
            <el-tag
              style="
                margin-left: 5px;
                margin-top: 5px;
                background: linear-gradient(to right, #fd8e4b, #fd6d34);
                color: white;
              "
              type="primary"
              size="mini"
              disable-transitions
            >{{ scope.row.recommandStatus == 0 ? '不推荐' : '推荐' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否显示" align="center"
          width="100"
        >
          <template #default="scope">
            <el-tag
              style="
                margin-left: 5px;
                margin-top: 5px;
                background: linear-gradient(to right, #fd8e4b, #fd6d34);
                color: white;
              "
              type="primary"
              size="mini"
              disable-transitions
            >{{ scope.row.showStatus == 0 ? '不显示' : '显示' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="描述" align="center"
          prop="description"
        />
        <el-table-column
          label="收藏数" align="center"
          prop="holdNum"
        />
        <el-table-column
          label="点赞数" align="center"
          prop="likeNum"
        />
        <el-table-column
          label="排序" align="center"
          prop="sort"
        />
        <el-table-column
          label="操作" fixed="right"
          width="200" align="center"
        >
          <template #default="scope">
            <el-button
              :disabled="single"
              type="text"
              size="mini"
              icon="edit"
              @click="handleUpdate(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              :disabled="single"
              type="text"
              size="mini"
              class="danger"
              icon="delete"
              :loading="loading"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination-new
      style="position: absolute;bottom: 0;margin-bottom: -5.5rem"
      :current-page="currentPage"
      :page-size="pagesize"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="128rem"
    >
      <el-form
        ref="ruleForms"
        :model="form"
        :rules="rules"
        label-width="13rem"
      >
        <div style="display: flex">
          <div style="padding-right:4rem;border-right:0.1rem solid  #F3F4F8 ">
            <el-form-item label="案例名称" prop="name">
              <el-input
                v-model="form.name" placeholder=""
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="装修造价(万元)" prop="dsType">
              <el-input
                v-model="form.cost" placeholder=""
                type="number"
              />
            </el-form-item>
            <el-form-item label="户型">
              <el-select
                v-model="form.model" filterable
                placeholder="请选择户型"
              >
                <el-option
                  v-for="(item, index) in modelList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="房型">
              <el-select
                v-model="form.roomType"
                filterable
                placeholder="请选择房型"
              >
                <el-option
                  v-for="(item, index) in roomTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="面积(m²)">
              <el-select
                v-model="form.area" filterable
                placeholder="请选择面积"
              >
                <el-option
                  v-for="(item, index) in areaList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="装修风格" prop="dsType">
              <el-select
                v-model="form.style"
                filterable
                placeholder="请选择装修风格"
              >
                <el-option
                  v-for="(item, index) in styleList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="装修方式" prop="dsType">
              <el-select
                v-model="form.way"
                filterable
                placeholder="请选择装修方式"
              >
                <el-option
                  v-for="(item, index) in wayList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设计师名称" prop="designerName">
              <el-input
                v-model="form.designerName"
                placeholder=""
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="设计师头像" prop="designerAvatar">
              <uploadImage
                v-if="dialogVisible"
                v-model="form.designerAvatar"
                :max-count="1"
                :is-edits="isEdit"
              />
            </el-form-item>
            <el-form-item label="关联工地">
              <el-input
                v-model="form.construction"
                placeholder=""
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="推荐状态" prop="dsType">
              <el-radio-group v-model="form.recommandStatus">
                <el-radio :label="0">不推荐</el-radio>
                <el-radio :label="1">推荐</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否显示" prop="dsType">
              <el-radio-group v-model="form.showStatus">
                <el-radio :label="0">不显示</el-radio>
                <el-radio :label="1">显示</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="封面图片" prop="dsType">
              <uploadImage
                v-if="dialogVisible"
                v-model="form.coverPic"
                :max-count="6"
                :is-edits="isEdit"
              />
            </el-form-item>
            <el-form-item label="户型图" prop="dsType">
              <uploadImage
                v-if="dialogVisible"
                v-model="form.roomPic"
                :max-count="6"
                :is-edits="isEdit"
              />
            </el-form-item>
            <el-form-item label="描述" prop="dsType">
              <el-input v-model="form.description" placeholder="" />
            </el-form-item>
            <el-form-item label="收藏数" prop="dsType">
              <el-input
                v-model="form.holdNum"
                placeholder=""
                type="number"
                min="0"
              />
            </el-form-item>
            <el-form-item label="点赞数" prop="dsType">
              <el-input
                v-model="form.likeNum"
                placeholder=""
                type="number"
                min="0"
              />
            </el-form-item>
            <el-form-item label="排序" prop="dsType">
              <el-input
                v-model="form.sort"
                placeholder=""
                type="number"
                min="0"
              />
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="详情内容" label-width="11rem"
              prop="dsType"
            >
              <title-add
                v-model="form.content" :max-count="9"
                title="添加节点"
              />
            </el-form-item>
          </div>
        </div>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary" :loading="loading"
            @click="handleConfirm()"
          >确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
  watchEffect
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import titleAdd from '_c/mall/addProduct/titleAdd.vue'

export default defineComponent({
  components: { uploadFile, titleAdd },
  props: {
    protType: {
      //	type=1平台分类，type=2企业分类
      type: Number,
      default: 2
    },
    companyId: {
      // 企业编号(type=2必传)
      type: Number || String,
      default: 0
    },
    buttonType: {
      type: String,
      default: 'primary'
    }, single: {
      type: Boolean,
      default: false
    }
  },
  emits: ['currentChange'],
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const single = ref<boolean>(props.single)
    const state = reactive({
      keyword: {
        name: '',
        model: '',
        area: '',
        style: '',
        roomType: ''
      },
      buttonType: props.buttonType,
      caseName: '',
      tableType: 0,
      tableData: [],
      loading: false,
      tableHeight: 0,
      currentPage: 1,
      total: 0,
      pagesize: 10,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      imageType: true,
      content: [
        {
          title: '',
          description: '',
          processPic: ''
        }
      ] as any,
      form: {
        type: props.protType,
        area: '',
        companyName: '',
        construction: '',
        cost: '',
        coverPic: '',
        roomPic: '',
        created: '',
        description: '',
        holdNum: 0,
        id: 0,
        latitude: 0,
        likeNum: 0,
        longitude: 0,
        model: '',
        name: '',
        recommandStatus: 0,
        roomType: '',
        showStatus: 0,
        sort: 0,
        style: '',
        way: '',
        updated: '',
        list: [],
        content: '',
        designerName: '',
        designerAvatar: ''
      },
      modelList: [
        {
          name: '不限'
        },
        {
          name: '一室'
        },
        {
          name: '二室'
        },
        {
          name: '三室'
        },
        {
          name: '四室'
        },
        {
          name: '五室以上'
        }
      ],
      areaList: [
        {
          name: '60以下'
        },
        {
          name: '60-80'
        },
        {
          name: '80-100'
        },
        {
          name: '100-120'
        },
        {
          name: '120-150'
        },
        {
          name: '150-200'
        },
        {
          name: '200以上'
        }
      ],
      styleList: [
        {
          name: '尊贵典雅欧式风'
        },
        {
          name: '现代智能简约风'
        },
        {
          name: '清新自然田园风'
        },
        {
          name: '清爽静谧地中海风'
        },
        {
          name: '自由激情美式风'
        },
        {
          name: '古典高雅中式风'
        },
        {
          name: '旖旎迷情东南亚风'
        },
        {
          name: '其他'
        }
      ],
      wayList: [
        {
          name: '清包'
        },
        {
          name: '半包'
        },
        {
          name: '全包'
        },
        {
          name: '整装'
        }
      ],
      roomTypeList: [
        {
          name: '平层'
        },
        {
          name: '跃层'
        },
        {
          name: '别墅'
        },
        {
          name: '复式'
        }
      ]
    })

    const addProductAttrCate = () => {
      Object.keys(state.form).map((key: any) => {
        if (key !== 'companyId' && key !== 'type') {
          switch (typeof state.form[key]) {
            case 'string':
              state.form[key] = ''
              break
            case 'boolean':
              state.form[key] = false
              break
            case 'number':
              state.form[key] = 0
              break
          }
        }
      })
      state.dialogVisible = true
      state.isEdit = false
      state.dialogTitle = '添加装修案例'
    }

    const rules = reactive({
      name: [{ required: true, message: '请输入案例名称', trigger: 'blur' }]
    })

    const handleUpdate = (row: any) => {
      state.dialogVisible = true
      state.dialogTitle = '编辑装修案例'
      state.isEdit = true
      state.form = { ...row }
      // state.form.content = row.content
    }

    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.id)
      })
    }

    const handleConfirm = () => {
      console.log(state.form)
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          if (!state.isEdit) {
            addData()
          }
          if (state.isEdit) {
            editData()
          }
        } else {
          alert('请完善信息')
          return false
        }
      })
    }

    const addData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/projectcase/create',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('案例添加成功')
          state.loading = false
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/projectcase/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          // companyId: props.companyId,
          type: props.protType,
          ...state.keyword
        }
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
      })
    }

    const editData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/projectcase/update',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('案例编辑成功')
          state.loading = false
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    const deleteData = async (id: any) => {
      await fetch({
        url: '/mall/projectcase/delete/' + id,
        method: 'post'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const refreshData = () => {
      Object.keys(state.keyword).forEach(
        (key: any) => (state.keyword[key] = '')
      )
      getData()
    }


    //表格单选事件
    const handleSelectionChange = (val: any) => {
      emit('currentChange', val)
    }

    onMounted(() => {
      getData()
    })

    return {
      single,
      rules,
      ruleForms,
      handleSelectionChange,
      addProductAttrCate,
      handleCurrentChange,
      refreshData,
      handleConfirm,
      handleUpdate,
      handleDelete,
      addData,
      getData,
      editData,
      deleteData,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
