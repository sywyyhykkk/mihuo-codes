<template>
    <div 
        v-if="visible"
        class="preview-image">
        <span class="preview-image_close" @click="onClose"> 
            <el-icon><close-bold /></el-icon>
        </span>
        <template v-if="srcList.length>1">
            <span class="preview-image_arrow preview-image_left" @click="onArrow('left')">
                <el-icon><arrow-left-bold /></el-icon>
            </span>
            <span class="preview-image_arrow preview-image_right" @click="onArrow('right')">
                <el-icon><arrow-right-bold /></el-icon>
            </span>
        </template>
        <div class="preview-image_flexd">
            <img 
                class="preview-image_img"
                :src="state.srcImage" 
                alt="" 
                srcset=""
                ref="preview"
                @wheel="wheel($event)"
                @mousedown.prevent="mouseStart($event)"
                @mousemove.prevent="mouseMove($event)"
                @mouseup.prevent="mouseEnd()"
                >
            <div class="preview-image_icon">
                <el-icon @click="zoom('in')"><zoom-in /></el-icon>
                <el-icon @click="zoom('out')"><zoom-out /></el-icon>
                <el-icon @click="tranfrom('left')"><refresh-left /></el-icon>
                <el-icon @click="tranfrom('right')"><refresh-right /></el-icon>
                <el-icon v-show="downFile" @click="downloadFile()"><download /></el-icon>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { onMounted, defineProps, watchEffect, reactive, ref, defineEmits } from 'vue'
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: ()=> false
    },
    srcList: {
        type: Array,
        default: ()=> []
    },
    current: {
        type: [Number,String],
        default: ()=> 0
    },
    loop: {
        type: Boolean,
        default: ()=> true
    },
    downFile: {
        type: Boolean,
        default: ()=> true
    },
})
const state = reactive({
    srcList:[],
    srcImage:null,
    isMove:false
} as any);
const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});
const preview:any = ref(null);
// 定义变量
let zooms = 1;
let rotate = 0;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;
let lastX = 0;
let lastY = 0;
const emit = defineEmits(['onClose','update:modelValue']);
// 图片缩放
const zoom = (type:string) =>{
    if(type == 'in'){
        zooms += 0.1
    }else if(type == 'out'){
        if(zooms>0.4){
            zooms -= 0.1
        }
    }
    preview.value.style.transform = `scale(${zooms})  translate(${translateX}px,${translateY}px)`
}
// 控制鼠标缩放事件
const wheel = (event:any) =>{
    if(event.wheelDelta>0){
        zoom('in')
    }else{
        zoom('out')
    }
}
const onClose = () =>{
    visible.value = false;
    emit('onClose',visible.value)
}
const onArrow = (type:string) => {
    if(type == 'right'){
        state.srcList.some((v:any,i:number)=>{
            if(v == state.srcImage){
                state.srcImage = state.srcList[i+1];
                if(i === state.srcList.length - 1){
                    state.srcImage = state.srcList[0]
                    return true
                }
                return true
            }
        })
    }else{
        state.srcList.some((v:any,i:number)=>{
            if(v == state.srcImage){
                state.srcImage = state.srcList[i-1];
                if(i === 0){
                    state.srcImage = state.srcList[state.srcList.length-1]
                    return true
                }
                return true
            }
        })
    }
}
const tranfrom = (type:string) =>{
    if(type=='left'){
        rotate -=90
    }else{
        rotate +=90
    }
    preview.value.style.transform = `rotate(${rotate}deg)`
}
const downloadFile = () =>{
    window.open(state.srcImage,'_self')
}
// 鼠标移入目标事件
const mouseStart =(event:any) =>{
    state.isMove = true;
    startX = event.pageX;
    startY = event.pageY;
}
// 鼠标拖动目标事件
const mouseMove =(event:any) =>{
    if(state.isMove){
        translateX = lastX + event.pageX - startX;
        translateY = lastY + event.pageY - startY;
        zoom('')
    }
}
// 鼠标停止拖动目标事件
const mouseEnd =() =>{
    state.isMove = false;
    lastX = translateX;
    lastY = translateY;
}
watchEffect(()=>{
    state.visible = props.modelValue;
    state.srcList = props.srcList;
    if(props.current){
        if(typeof(props.current) == 'number'){
            state.srcImage = state.srcList[props.current - 1];
        }else{
            state.srcImage = props.current;
        }
    }else{
        state.srcImage = state.srcList[0];
    }

})
onMounted(()=>{
    
})
</script>

<style scoped lang="less">
.preview-image{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, .5);
    overflow: hidden;
    z-index: 9999999;
    .preview-image_flexd{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        .preview-image_img{
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
            image-rendering: -moz-crisp-edges;
            image-rendering: -o-crisp-edges;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            -ms-interpolation-mode: nearest-neighbor;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .preview-image_close{
        z-index: 99;
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: #606266;
        padding: 1rem;
        border-radius: 50%;
        cursor: pointer;
        &:hover{
            background: #909399;
        }
        .el-icon{
            color: #fff;
            font-size: 1.6rem;
        }
    }
    .preview-image_icon{
        position: absolute;
        bottom: 3rem;
        height: 4.4rem;
        border-radius: 2.2rem;
        background: #606266;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        padding: 0 1rem;
        .el-icon{
            margin: 0 1rem;
            cursor: pointer;
            color: #fff;
            font-size: 2.3rem;
        }
    }
    .preview-image_arrow{
        z-index: 99;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        background: #606266;
        border-radius: 50%;
        padding: 1.5rem;
        margin: 2rem;
        &:hover{
            background: #909399;
        }
        .el-icon{
            color: #fff;
            font-size: 1.6rem;
        }
        &.preview-image_right{
            right: 0;
        }
    }
}
</style>
