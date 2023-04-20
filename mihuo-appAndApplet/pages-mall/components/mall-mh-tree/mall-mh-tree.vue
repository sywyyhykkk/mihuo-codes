<template>
    <div class="tree">
        <!-- 第一级 -->
        <view class="tree-item" v-if="data && data.length >0">
            <view class="tree-title_item" v-for="(item,index) in data" :key="index">
                <view class="tree-item_label" :class="{curActive:curCode==item.treeCode}" @click="nodeClick(item,1)">
                    <view class="tree-item_title">{{ item.name }}</view>
                    <u-icon v-if="(curCode==item.treeCode) && !item.children" name="checkbox-mark" color="#FE6E32"></u-icon>
                </view>
            </view>
        </view>
        <!-- 第二级 -->
        <view class="tree-item tree-item_bg" v-if="secondLevel && secondLevel.length >0">
            <view class="tree-title_item" v-for="(item,index) in secondLevel" :key="index">
                <view class="tree-item_label" :class="{curActive:curSecondCode==item.treeCode}" @click="nodeClick(item,2)">
                    <view class="tree-item_title">{{ item.name }}</view>
                    <u-icon v-if="(curSecondCode==item.treeCode) && !item.children" name="checkbox-mark" color="#FE6E32"></u-icon>
                </view>
            </view>
        </view>
        <!-- 第三级 -->
        <view class="tree-item tree-item_bg" v-if="thirdLevel && thirdLevel.length >0">
            <view class="tree-title_item" v-for="(item,index) in thirdLevel" :key="index">
                <view class="tree-item_label" :class="{curActive:curThirdCode==item.treeCode}" @click="nodeClick(item,3)">
                    <view class="tree-item_title">{{ item.name }}</view>
                    <u-icon v-if="curThirdCode==item.treeCode" name="checkbox-mark" color="#FE6E32"></u-icon>
                </view>
            </view>
        </view>
    </div>
</template>

<script>
export default {
    data() {
        return {
           curCode:'',
           curSecondCode:'',
           curThirdCode:'',
           isSelected:[],
           secondLevel:[],
           thirdLevel:[],
        };
    },
    props:{
        data:{
            type:Array,
            default:()=>[]
        }
    },
    methods: {
        // type代表层级数
        nodeClick(node,type){
            switch (type) {
                case 1:
                    this.curCode = node.treeCode;
                    this.curSecondCode = ''
                    this.curThirdCode = ''
                    this.secondLevel = [];
                    this.thirdLevel = [];
                    if(node.children && node.children.length){
                        this.secondLevel = node.children
                    }else{
                        this.$emit('click',node)
                    }
                    break;
                case 2:
                    this.curSecondCode = node.treeCode;
                    this.thirdLevel = [];
                    this.curThirdCode = ''
                    if(node.children && node.children.length){
                        this.thirdLevel = node.children
                    }else{
                        this.$emit('click',node)
                    }
                    break;
                case 3:
                    this.curThirdCode = node.treeCode;
                    this.$emit('click',node)
                    break;
            
                default:
                    break;
            }
        },
        // 遍历子节点
        mapChildrenNode(nodeItem,data){
            nodeItem.some((item,index)=>{
                if(this.currentCode.indexOf(item.treeCode) != -1){
                    this.currentCode.splice(index,1)
                    if(item.children && item.children.length){
                        this.mapChildrenNode(item.children,data)
                    }
                }else{
                    this.currentCode.push(data.treeCode)
                }
            })
            this.currentCode = Array.from(new Set(this.currentCode))
        },
    },
};
</script>

<style scoped lang="scss">
.tree{
    display: flex;
    // padding: 0 30rpx;
    .tree-item{
         flex: 1;
        .tree-title_item{
            .tree-item_label{
                padding: 20rpx 30rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .tree-item_title{
                    font-size: 28rpx;
                    color: #606266;
                }
                // width: 50%;
                // .tree-item_label{
                //     padding: 20rpx 30rpx;
                //     display: flex;
                //     // align-items: center;
                //     flex: 1;
                // }
            }
        }
    }
}
.curActive{
    background: #F4F6F8;
    // border-left: 6rpx solid #FE6E32;
    box-sizing: border-box;
    position: relative;
    &::before{
        content: '';
        position: absolute;
        width: 6rpx;
        top: 20rpx;
        bottom: 20rpx;
        background: #FE6E32;
        left: 0;
    }
    .tree-item_title{
        color: #FE6E32 !important;
    }
}
.tree-item_bg{
    background: #F4F6F8;
}
</style>
