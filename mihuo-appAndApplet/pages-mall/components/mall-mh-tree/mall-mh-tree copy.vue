<template>
    <div class="tree">
        <view class="tree-item" v-if="data && data.length >0">
            <view class="tree-title_item" v-for="(item,index) in data" :key="index">
                <view class="tree-item-content" style="width:33%">
                    <view class="tree-item_label" :class="{curActive:currentCode==item.treeCode}" @click="nodeClick(item)">
                        <view class="tree-item_title">{{ item.name }}</view>
                    </view>
                </view>
                <view class="tree-item-content" style="flex: 1">
                    <view class="tree-item_label tree-item_bg" v-for="item1,index1 in item.children" :key="index1" @click="nodeClick(item1)">
                        <view class="tree-item_children" :class="{curActive:currentCode.indexOf(item1.treeCode) != -1}" v-if="currentCode.indexOf(item.treeCode) != -1">
                            <view class="tree-item_title">{{ item1.name }}</view>
                        </view>
                        <view class="tree-item-content" style=" flex: 1;background: #F4F6F8" >
                            <view class="tree-item_bg" v-for="item2,index2 in item1.children" :key="index2" @click="nodeClick(item2)">
                                <view class="tree-item_children item_children-last" :class="{curActive:currentCode.indexOf(item2.treeCode) != -1}" v-if="currentCode.indexOf(item1.treeCode) != -1">
                                    <view class="tree-item_title">{{ item2.name }}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-else class="tree-item">
            <view class="tree-title_item" v-for="(item,index) in data" :key="index">
                <view class="tree-item_label" :class="{curActive:currentCode.indexOf(item.treeCode) != -1}" @click="nodeClick(item)">
                    <!-- <u-checkbox 
                        class="checkbox" 
                        style="width: 40rpx; height: 40rpx;"
                        @change="radioChange(item)" 
                        shape="circle"
                        v-model="item.isCheck">
                    </u-checkbox> -->
                    <view class="tree-item_title">{{ item.name }}</view>
                </view>
            </view>
        </view>
    </div>
</template>

<script>
export default {
    data() {
        return {
           currentCode:'',
           isSelected:[]
        };
    },
    props:{
        data:{
            type:Array,
            default:()=>[]
        }
    },
    methods: {
        nodeClick(node){
            this.currentCode = node.treeCode;
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
    .tree-title_item{
        border-top: 2rpx solid #F4F6F8;
        display: flex;
        .tree-item-content{
            // width: 50%;
            .tree-item_label{
                padding: 20rpx 30rpx;
                display: flex;
                // align-items: center;
                flex: 1;
            }
        }
    }
}
.tree-item_title{
    flex-shrink: 0;
    font-size: 28rpx;
    padding-left: 10rpx;
}
.curActive{
    background: #F4F6F8;
    &::before{
        content: '';
        position: absolute;
        width: 6rpx;
        height: 40rpx;
        background: #FE6E32;
        left: 10rpx;
    }
    .tree-item_title{
        color: #FE6E32;
        font-weight: bold;
        position: relative;
        
    }
}
.tree-item_bg{
    padding: 0 !important;
}
.tree-item_children{
    background: #F4F6F8;
    padding: 20rpx 30rpx;
    flex: 1;
    display: flex;
}
.item_children-last{
    padding: 20rpx 30rpx 20rpx 0 !important;
}
</style>
