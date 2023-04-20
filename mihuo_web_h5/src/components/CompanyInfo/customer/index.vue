<template>
  <div style="height:100%">
    <el-container style="height:100%">
      <el-header>
        <el-button type="primary" @click="add" v-if="$getPression('admin_syscompanycustomerservicestaffs_add')">
          <el-icon>
            <plus />
          </el-icon>
          添加
        </el-button>
      </el-header>
      <el-main>
        <el-table
          ref="factory_table"
          v-loading="loading"
          stripe
          :data="tableData"
          border
          style="width:100%"
          height="100%"
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="序号"
          />
          <el-table-column label="客服昵称" align="center" prop="serverName"></el-table-column>
          <el-table-column label="关联员工" align="center">
            <template #default="scope">
              <span :class="scope.row.employeeName?'employee':''">
                {{ scope.row.employeeName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200" align="center">
            <template #default="scope">
              <el-button
                type="text"
                size="mini"
                icon="edit"
                @click="edit(scope.row)"
                v-if="$getPression('admin_syscompanycustomerservicestaffs_edit')"
              > 编辑
              </el-button>
              <el-button
                type="text"
                size="mini"
                class="danger"
                icon="delete"
                @click="del(scope.row)"
                v-if="$getPression('admin_syscompanycustomerservicestaffs_del')"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <Dialog />
  </div>
</template>

<script lang='ts'>
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, onMounted, provide, reactive, ref, toRef, toRefs } from 'vue'
import Dialog from '../Dialog.vue'
import { getCustomer ,delCustomer, saveCustomer, updataCustomer } from '_@/api/companyInfo';
import { formFiled } from './FormSet';
export default defineComponent({
  components: {
    Dialog
  },
  setup(props: any, { emit }) {
    //form设定
    let {formSetting,formRules}= formFiled;
    provide('formSetting',formSetting);
    provide('formRules',formRules);
    let pageTitle = ref('')
    let dialogVisible = ref<boolean>(false)
    let loadingBtn = ref<boolean>(false)
    let formData = reactive({
      val:{
        employee: {
          employeeId: '',
          employeeName: '',
        }  as any
      }as any
    })
    provide('pageTitle', pageTitle)
    provide('dialogVisible', dialogVisible)
    provide('loadingBtn', loadingBtn)
    provide('formData', formData)
    let tableData = ref([])
    let loading = ref<boolean>(false)

    let add = () => {
      pageTitle.value = '添加客服';
      formData.val = {
          employee: {
            employeeId: '',
            employeeName: ''
          },
          flag:0
      }
      dialogVisible.value = true
    }
    let edit = (row:any) => {
      pageTitle.value = '编辑客服';
      formData.val = Object.assign({},row)
      formData.val.employee = {
        employeeId:row.employeeId,
        employeeName:row.employeeName
      }
      dialogVisible.value = true
    }
    let del = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除${row.serverName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          delCustomer(row.serverId).then((res:any)=>{
              if(res.code == '0'){
                  ElMessage.success('删除成功');
                  getTableList();
              }
          })
      })
    }
    let save = () => {
      formData.val.employeeId = formData.val.employee && formData.val.employee.employeeId ? formData.val.employee.employeeId:formData.val.employeeId;
      formData.val.employeeName =formData.val.employee && formData.val.employee.employeeName? formData.val.employee.employeeName:formData.val.employeeName;
      loadingBtn.value = true
      if(formData.val.flag == '0'){
          saveCustomer(formData.val).then((res:any)=>{
              if(res.code == '0'){
                  ElMessage.success('保存成功');
                  getTableList();
                  dialogVisible.value = false
              }
          }).finally(()=>{
            loadingBtn.value = false
          })
      }else{
          updataCustomer(formData.val).then((res:any)=>{
            if(res.code == '0'){
                ElMessage.success('更新成功');
                getTableList();
                dialogVisible.value = false
            }
          }).finally(()=>{
            loadingBtn.value = false
          })
      }
    }
    let getTableList = () =>{
        loading.value = true
        getCustomer().then((res:any)=>{
          if(res.code == '0'){
            tableData.value = res.data.records
          }
        }).finally(()=>{
            loading.value = false
        })
    }
    provide('save', save)
    onMounted(async() => {
      getTableList()
    })
    return {
      tableData,
      loading,
      formData,
      add,
      edit,
      del,
      getTableList
    }
  }
})
</script>

<style scoped lang="less">
.el-header {
  padding: 20px 0;
  width: 100%;

  .el-button {
    float: right;
  }
}

.el-main {
  .el-table {
    height: calc(100% - 10px) !important;
  }
}
.employee{
  background: #ECF5FF;
  padding: .3125rem;
  padding-left: 3rem;
  padding-right: .625rem;
  display: inline-block;
  border-radius: 14px;
  position: relative;
  &::before{
    content:'';
    position: absolute;
    background: #409EFF;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    left: .5rem;
  }
}
</style>
