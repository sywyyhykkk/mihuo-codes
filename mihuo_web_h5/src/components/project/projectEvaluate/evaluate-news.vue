<template>
    <div class="evaluate">
        <template v-if="formData.val.length">
            <div class="evaluate-content" v-for="(item,index) in formData.val" :key="index">
                <div class="evaluate-content_header">
                    <div class="row evaluate-img">
                        <img v-if="item.avatar" :src="thumbnailImage(item.avatar)" />
                        <img v-else :src="require('@/assets/img/avatar.png')" />
                        <div class="people">
                            <span>{{item.name}}</span>
                            <span>{{item.skillName}}</span>
                        </div>
                    </div>
                    <div class="row evaluate-admin" v-if="item.orderReply">
                        <img :src="thumbnailImage(item.orderReply.avatar)" />
                        <span>{{item.orderReply.name + item.orderReply.skillName?'['+item.orderReply.skillName+']':''}}</span>
                        <i>{{item.orderReply.created}}</i>
                    </div>
                </div>
                <div class="evaluate-content_main" v-if="item.orderReply">
                    <el-rate v-model="item.orderReply.serveScore" disabled text-color="#ff9900"></el-rate>
                    <div class="evaluate-content_tags" v-if="item.orderReply.labels">
                        <el-tag  v-for="(v,i) in item.orderReply.labels.split(',')" :key="i">{{v}}</el-tag>
                    </div>
                    <div class="evaluate-content_remark row-common">
                        {{item.orderReply.contents}}
                    </div>
                    <div class="evaluate-content_img row-common" v-if="item.orderReply.pics && item.orderReply.pics.length">
                        <div class="evaluate-content_img-box" v-for="(itm,ind) in item.orderReply.pics" :key="ind">
                            <img
                                @click="previewLook(thumbnailImage(itm.url))"
                                v-if="itm.type == 'img'"
                                class="image"
                                :src="thumbnailImage(itm.url)"
                                />
                            <img v-else-if="itm.type == 'video'" @click="videoPlay(thumbnailImage(itm.url))" class="image-no" :src="require('@/assets/video/video.png')" alt="" srcset=""/>
                            <img fit="cover" class="image-no" v-else-if="getFileHouzhui(itm.url) == 'pdf'" :src="require('@/assets/img/pdf.png')" alt="" srcset=""  @click="dowm(itm)">
                            <img fit="cover" class="image-no" v-else-if="getFileHouzhui(itm.url) == 'doc' || getFileHouzhui(itm.url) == 'docx'" :src="require('@/assets/img/word.png')" alt="" srcset="">
                            <img fit="cover" class="image-no" v-else-if="getFileHouzhui(itm.url)== 'xlsx' || getFileHouzhui(itm.url) == 'xls'" :src="require('@/assets/img/excel.png')" alt="" srcset="">
                            <img fit="cover" class="image-no" v-else-if="getFileHouzhui(itm.url)== 'ppt' || getFileHouzhui(itm.url)== 'pptx'" :src="require('@/assets/img/ppt.png')" alt="" srcset="">
                            <img fit="cover" class="image-no" v-else-if="getFileHouzhui(itm.url)== 'cad'" :src="require('@/assets/img/cad.png')" alt="" srcset="">
                        </div>
                    </div>
                </div>
               <div class="evaluate-empty" v-else>
                   <div>
                        <img :src="require('@/assets/img/empty/no_data.png')" alt="" srcset="">
                        <span>暂无评价~</span>
                   </div>
                </div>
            </div>
        </template>
        <el-empty
            v-else
            :image-size="150"
            :description="props.data.cardType == 0 ? '该节点尚未开始~' : '暂无数据~'"
            :image="require('@/assets/img/empty/no_data.png')"
        />
        <!-- 预览图片 -->
      <preview-image
          v-model="showViewer"
          :current="initialIndex"
          :src-list="previewList"
          ></preview-image>
        <!-- 视频播放 -->
        <video-play-new v-model="dialogStatus" :videoSrc="videoSrc"></video-play-new>
</div>
</template>

<script lang='ts' setup>
import { ref, defineProps, inject } from 'vue';
import { fetch } from '_@/axios-config/axios';
import { thumbnailImage } from '@/components/project/projectItem/projectDetailNewData';
const { proxy } = getCurrentInstance() as any
const nodeINfo = ref()
const showViewer = ref<boolean>(false)
const dialogStatus = ref<boolean>(false)
const initialIndex = ref<any>('')
const videoSrc = ref<any>('')
const previewList = ref<any>([])
const props = defineProps({
    data: {
        type: Object,
        default:()=> {}
    }
})
const formData = reactive({
    val:[],
    company:{}
} as any)
const previewLook = (url:string) =>{
    initialIndex.value = url;
    showViewer.value = true;
}
const projectId = inject('projectId')
const videoPlay = (url:string) =>{
    videoSrc.value = url;
    dialogStatus.value = true;
}
// 获取图片上传信息
const getListData = async () =>{
    let params = {
        nodeId:nodeINfo.value.nodeId,
        status:-1,
        projectId:projectId
    }
    let previewLists:any = []
    let res:any = await fetch({url: `/order/bizorderreply/getList`,method: 'get',params: params})
    .then((res:any)=>{
        if(res.code == '0'){
            formData.val = res.data;
            if(formData.val.length){
                formData.val.forEach((item:any)=>{
                    if(item.orderReply && item.orderReply.pics){
                        item.orderReply.pics = JSON.parse(item.orderReply.pics);
                        item.orderReply.pics.map((v:any)=>{
                            if(v.type == 'img'){
                                previewLists.push(thumbnailImage(v.url))
                            }
                        })
                    }
                    if(item.orderReply && item.orderReply.dealPersonId){
                        proxy.$getUserById([item.orderReply.dealPersonId], (res: any) => {
                            let user = res.data || null
                            if(user.length){
                                item.orderReply.avatar = user[0].avatar;
                                item.orderReply.name = user[0].name;
                                item.orderReply.skillName = user[0].skillName;
                            }
                        })
                    }
                })
            }
            previewList.value = previewLists;
        }
    })
}

const json = JSON as any
const getFileHouzhui = (type:any) =>{
    if(type){
        return type.split('.')[1]
    }
}
onMounted(()=>{
    getListData()
})
watchEffect(()=>{
    if(props.data){
        nodeINfo.value = props.data;
        getListData()
    }
})
</script>

<style scoped lang="less">
.evaluate{
    padding: 2rem 4rem;
    box-sizing: border-box;
    .el-empty{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .evaluate-content{
        border-bottom: 1px solid #F3F4F8;
        padding: 2rem 0 1rem;
        &:first-child{
            padding-top: 0;
        }
        .evaluate-content_header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .row{
                display: flex;
                align-items: center;
                &.evaluate-img{
                    img{
                        width: 5rem;
                        height: 5rem;
                        border-radius: 50%;
                    }
                    .people{
                        display: flex;
                        flex-direction: column;
                        span{
                            padding-bottom:1rem ;
                            padding-left: 1rem;
                            &:first-child{
                                font-size: 1.8rem;
                                color: #1A1A1A;
                            }
                            &:last-child{
                                font-size: 1.4rem;
                                color: #909399;
                                padding-bottom: 0;
                            }
                        }
                    }
                }
                &.evaluate-admin{
                    font-size: 1.4rem;
                    display: flex;
                    align-items: center;
                    img{
                        width: 2.2rem;
                        height: 2.2rem;
                        border-radius: 50%;
                    }
                    span{
                        color: #1A1A1A;
                        padding: 0 1rem;
                    }
                    i{
                        color: #909399;
                        font-style: normal;
                    }
                }
            }
        }
        .evaluate-content_main{
            margin-left: 6rem;
            :deep(.el-rate__icon){
                font-size: 2rem;
            }
            .evaluate-content_tags{
                .el-tag{
                    margin-right: 1rem;
                }
            }
            .evaluate-content_remark{
                font-size: 1.4rem;
                color: #303133;
            }
            .row-common{
                margin-top: 1rem;
            }
            .evaluate-content_img{
                display: flex;
                flex-flow: row wrap;
                .evaluate-content_img-box{
                    height: 8rem;
                    width: 8rem;
                    border-radius: .6rem;
                    margin-right: 1.2rem;
                    margin-bottom: 1.2rem;
                    border: 1px solid #DCDFE6;
                    position: relative;
                    cursor: pointer;
                    .image{
                        border-radius: .6rem;
                        width: 100%;
                        height: 100%;
                    }
                    .image-no{
                        width: 50%;
                        height: 50%;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                    }
                }
            }
        }
    }
    .evaluate-empty{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem 0;
        div{
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        img{
            width: 11rem;
            height: 11rem;
        }
        span{
            font-size: 1.4rem;
            color: #909399;
            display: inline-block;
        }
    }
}
</style>
