<template>
  <div>
    <div class="remind-model"
         ref="dom"
         id="test"
         contenteditable="true"
         spellcheck="true"
         @mouseup="handelMouseup"
         @keydown="handleKeydown"
         @keyup="handelKeyup"
         @blur="onBlur"
         @input="changeText"
    >

    </div>

    <div class="remind-comment">
      <div v-for="(item,key,index) in state.remindContentList" :key="index" class="remind-item"
           @click.stop="addRemindItemNew(item,key,'select')">
        #{{ item }}#
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import { defineProps, reactive, watchEffect, ref, onMounted, watch } from 'vue'

const props = defineProps({
  remindParam: {
    type: String,
    default: ''
  },
  businessCode: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Object || String || Number,
    default: {}
  }
})
const emit = defineEmits(['update:modelValue', 'getParam'])
const modelList = ref<any>([])
const innerText = ref<any>()
const dom = ref<any>()
const isChange = ref<boolean>(false)
const state = reactive({
  remindContentKey: [] as any,
  remindContentList: {} as any,
  selection: '' as any,//定义光标对象
  range: '' as any,//光标对象
  textNode: '' as any, // 获取光标对象的范围界定对象
  rangeStartOffset: '' as any,//获取光标位置
  selectKey: []//选中的key
})


//new


//数据更新
const updateData = () => {
  state.selectKey = []
  let remindCenter: any = dom.value.innerText
  state.remindContentKey.forEach((res: any) => {
    if (dom.value.innerText.indexOf(`#${state.remindContentList[res]}#`) != -1) {
      remindCenter = remindCenter.replaceAll(`#${state.remindContentList[res]}#`, '${' + res + '}')
    }
  })
  let replaceRegex = /(\n\r|\r\n|\r|\n)/g
  if (dom.value.innerText.replaceAll(replaceRegex, '').replaceAll(/\u200B/g, '').replaceAll('<br/>', '') == '') {
    dom.value.innerHTML = ''
  }

  // return=
  emit('update:modelValue', dom.value.innerHTML)
  emit('getParam', remindCenter, dom.value.innerText)
}

let sel: any = getSelection()

//获取键盘弹起事件
const handelKeyup = (val: any) => {
  // console.log('val')
  // if (dom.value.innerHTML.indexOf('><') != 0) {
  //   dom.value.innerHTML = dom.value.innerHTML.replaceAll('><', '>\u200b<')
  // }
}


//获取键盘按下事件
const handleKeydown = (val: any) => {
  let range: any = sel.getRangeAt(0)
  let domV: string = dom.value.innerHTML.toString()

  // console.log('dom', dom.value.innerHTML.toString())
  if (val.key == 'Backspace') {//键盘删除事件
    if (!range.collapsed) {
      val.preventDefault()//取消该事件阻止其删除，然后手动删除
    }
    // range.deleteContents()//删除光标选中的内容
  }
  if (val.keyCode == '13') {//键盘回车键事件//换行,阻止其换行事件，使用自己的方法//重点啊，坑啊
    val.preventDefault()//取消该事件阻止其换行，然后手动换行
    let br = document.createElement('br')
    br.contentEditable = 'false'
    br.style.fontSize = '0'
    const bSpaceNode = document.createTextNode('\u200b') // 不可见字符，为了放光标方便
    insertHtmlAtCaret([bSpaceNode, br, bSpaceNode], sel, range)
  }
  updateData()
}


//在富文本失去焦点时的事件，记录光标位置，合适时回复光标位置
const onBlur = () => {
  state.range = sel.getRangeAt(0).cloneRange()
}


//添加标签时的事件
const addRemindItemNew = (item: any, key: any, val: any) => {
  if (!state.range) {
    return
  }
  const bSpaceNode = document.createTextNode('\u200b') // 不可见字符，为了放光标方便
  sel.removeAllRanges()      //把没用的Ranges删除
  sel.addRange(state.range)     //恢复Range
  if (!state.range.collapsed) {//如果光标起始位置和结束位置不相同
    state.range.deleteContents()
  }
  insertHtmlAtCaret([bSpaceNode, parseDom(item), bSpaceNode], sel, state.range)

  //数据更新
  updateData()

}

//鼠标释放时的事件
const handelMouseup = () => {
  state.range = sel.getRangeAt(0)//光标位置信息

}

const changeText = (val: any) => {
  state.range = sel.getRangeAt(0)//获取光标对象的范围界定对象
  let du: any = document.getElementById('test')
  // console.log(document.getElementById('test').contents()[0].data)
  //数据更新
  updateData()
}


//转dom对象
const parseDom = (arg: any) => {
  let objE = document.createElement('span')
  objE.style.color = '#67C23A'
  objE.style.fontSize = '1.4rem'
  objE.innerText = `#${arg}#`
  objE.contentEditable = 'false'
  return objE
}

//添加标签元素
const insertHtmlAtCaret = (html: any, selection: any, range: any) => {
  if (range && selection) {
    // range.deleteContents()
    const el = document.createElement('span')
    if (typeof html === 'string') {
      el.innerHTML = html
    } else if (Array.isArray(html)) {
      html.forEach(item => {
        el.appendChild(item)
      })
    } else {
      el.appendChild(html)
    }
    const frag = document.createDocumentFragment()//创建一个虚拟的 节点对象
    let node
    let lastNode
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node)
    }
    range.insertNode(frag)
    if (lastNode) {
      selection.extend(lastNode, 1)//移动选中区的焦点到指定的点。选中区的锚点不会移动。选中区将从锚点开始到新的焦点，不管方向。
      selection.collapseToEnd()//取消当前选区，并把光标定位在原选区的最末尾处，如果此时光标所处的位置是可编辑的，且它获得了焦点，则光标会在原地闪烁。
    }
  }
}

//获取标签
const getRemindContent = async () => {
  await fetch({
    url: `/order/remindtemplate/getByCode/${props.businessCode}`,
    method: 'get'
  }).then((res: any) => {
    state.remindContentKey = []
    state.remindContentList = res.data
    for (var i in res.data) {
      state.remindContentKey.push(i)
    }
    // console.log(state.remindContentKey)

  })
}

onMounted(() => {
  // getRemindContent()
  dom.value.innerHTML = props.modelValue ? props.modelValue.replaceAll('<span ', '<span contenteditable="false" ').replaceAll('<br', '<br contenteditable="false"').replaceAll('><', '>\u200B<') : ''
})
watchEffect(() => {
  if (props.businessCode) {
    getRemindContent()
  }
})

</script>

<style scoped lang="less">
[contenteditable]:focus {
  outline: none;
}

.remind-lable {
  color: #67C23A;
  font-size: 14px;
}

.remind-model {
  width: 34.5rem;
  min-height: 5rem;
  background: #FFFFFF;
  border: 1px solid #E4E7ED;
  border-radius: 4px;
  padding: 1rem 2rem 1rem 1.5rem;

  .content-edit {
    min-width: 1rem;
    color: #1A1A1A;
    font-weight: 600;
    font-size: 14px;
  }

}

.remind-comment {
  display: flex;
  flex-wrap: wrap-reverse;
  padding-top: 0.6rem;
  cursor: pointer;


  .remind-item {
    height: 3.2rem;
    line-height: 3.2rem;
    background: #F0F9EB;
    border: 1px solid #E1F3D8;
    border-radius: 4px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #67C23A;
    margin-right: 0.8rem;
    margin-top: 0.8rem;
    padding: 0 1.3rem;
  }
}
</style>
