<template>
    <div class="keyword">
        <el-button type="primary" @click="addKeword" v-if="$getPression('basic_searchkeywords_add')">新增分类</el-button>
        <div class="keyword-content">
            <!-- <view v-for="item in 100" :key="item">{{item}}</view> -->
            <view v-if="keywordList && keywordList.length">
                <view class="keyword-item" 
                v-for="(item,index) in keywordList"
                :key="index">
                    <view class="keyword-item_content">
                        <view class="keyword-pat">
                            <el-tag type="success" effect="dark" size="large">{{ item.groupName || ''}}</el-tag>
                            <view>
                                <el-button
                                    size="small"
                                    type="text"
                                    class="primary"
                                    icon="Edit"
                                    @click="updatakeywords(item)"
                                    >
                                    编辑
                                </el-button>
                                <el-button
                                size="small"
                                type="text"
                                class="danger"
                                icon="delete"
                                @click="delkeywords(item.id)"
                                >
                                删除
                                </el-button>
                                
                            </view>
                        </view>
                        <view class="keyword-keywords">
                            <el-tag v-for="(dax,idx) in item.keywords" :key="idx" type="success">{{ dax || ''}}</el-tag>
                        </view>
                    </view>
                </view>
            </view>
            <el-empty
                v-else
                :image-size="130"
                description="暂无搜索关键词~"
                :image="require('@/assets/img/empty/no_data.png')"
            />
        </div>
    </div>
    <el-dialog
      v-if="keywordShow"
      v-model="keywordShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="关键词配置"
      @close="closeDialog"
    >
      <div class="form-keyword">
        <el-form
          ref="keywordRef"
          :rules="rules"
          :model="keywordForm"
          label-width="9rem"
        >
          <el-form-item label="分类名称" prop="groupName">
            <el-input v-model="keywordForm.groupName" />
          </el-form-item>
          <el-form-item label="关键词" prop="keywords">
            <el-select
                v-model="keywordForm.keywords"
                multiple
                filterable
                remote
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="请输入关键词"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleKeywords()">确 定</el-button>
          <el-button @click="keywordShow = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import { Message } from '../Message'
const keywordList = ref<any>([])
const keywordRef = ref<any>(null)
const options = ref<any>([])
const keywordType = ref<any>('add')
const keywordShow = ref<boolean>(false)
const keywordForm = ref<any>({})
const rules = reactive({
    groupName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
    ],
    keywords: [
        { required: true, message: '请输入关键词', trigger: 'blur' }
    ],
})

const addKeword =()=>{
    keywordType.value = 'add';
    keywordShow.value = true;
} 
const getkeywordList = async() =>{
    await fetch({
    url: `/basic/basicsearchkeywords/list`,
    method: 'get'
    }).then((res:any) => {
        if(res){
            keywordList.value = res.data
        }
    })
}
const handleKeywords = () =>{
    let url = '' as any
    if (keywordType.value == 'add'){
        url = '/basic/basicsearchkeywords/create'
    }
    if (keywordType.value == 'update'){
        url = '/basic/basicsearchkeywords/modify'
    }
    keywordRef.value.validate(async(valid: any) => {
        if (valid) {
            await fetch({
            url: url,
            data:keywordForm.value,
            method: 'post'
            }).then((res:any) => {
                if(res){
                    ElMessage.success('操作成功');
                    keywordShow.value = false;
                    getkeywordList();
                }
            })
        }
    })
}
const delkeywords = async(id:any) =>{
    ElMessageBox.confirm('此操作将永久删除该搜索词组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        await fetch({
        url: `/basic/basicsearchkeywords/delete/${id}`,
        method: 'get'
        }).then((res:any) => {
            if(res.code == 0){
                ElMessage.success('删除成功')
                getkeywordList()
            }
        })
    })
    
}
const updatakeywords =(data:any)=>{
    keywordForm.value = Object.assign({},data);
    keywordType.value = 'update';
    keywordShow.value = true;
}
const closeDialog=()=>{
    keywordForm.value = {}
    keywordRef.value.resetFields();
}
onMounted(()=>{
    getkeywordList()
})
</script>

<style scoped lang="less">
.keyword{
    padding: 2rem 0;
    height: calc(100vh - 12rem);
    .keyword-content{
        display: flex;
        flex-direction: column;
        height: calc(100% - 4rem);
        overflow-y: auto;
        margin-top: 1rem;
        .keyword-item{
            display: flex;
            flex-direction: column;
            // border-bottom: .1rem Dashed #dcdfe6 ;
            margin-bottom: 2rem;
            padding: 1rem;
            border-radius: .4rem;
            box-shadow: var(--el-box-shadow-light);
            .keyword-item_content{
                .keyword-pat{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .el-tag{
                    margin: 1rem 2rem 1rem 0;
                }
                .keyword-keywords{
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    border: .1rem Dashed #dcdfe6 ;
                    padding: 1rem;
                }
            }
        }
        .el-empty{
            margin-top: 20rem;
        }
    }
}
.flex-center{
    display: flex;
    align-items: center;
}
</style>
