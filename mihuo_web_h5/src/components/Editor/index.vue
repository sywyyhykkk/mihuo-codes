<template>
  <div ref="editorRef" />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  unref,
  watch,
} from 'vue'
import { editorProps } from './props'
import E from 'wangeditor'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'Editor',
  props: editorProps,
  emits: ['change', 'focus', 'blur', 'update:modelValue'],
  setup(props, { emit }) {
    const editorRef = ref<HTMLElement | null>(null)
    const editor = ref<E | null>(null)

    onMounted(() => {
      createdEditor()
    })

    onBeforeUnmount(() => {
      if (editor.value) {
        editor.value.destroy()
        editor.value = null
      }
    })

    watch(
      () => props.value,
      (value: string) => {
        if (editor.value) {
          editor.value.txt.html(value)
        }
      },
      {
        immediate: true,
      }
    )

    function createdEditor(): void {
      editor.value = new E(unref(editorRef) as any)
      initConfig(editor.value)
      editor.value.create()
      editor.value.txt.html(props.value)
    }

    function initConfig(editor: any): void {
      const {
        height,
        zIndex,
        placeholder,
        focus,
        customAlert,
        menus,
        colors,
        fontNames,
        lineHeights,
        showFullScreen,
        onchangeTimeout,
      } = props.config
      editor.config.customUploadImg = (resultFiles: any, insertImgFn: any) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        const formData = new FormData()
        formData.append('file', resultFiles[0])
        fetch({
          url: '/admin/sys-file/upload',
          method: 'post',
          data: formData,
        }).then((res) => {
          if (res.data.fileName) {
            insertImgFn(res.data.url)
            // ElMessage.success('添加成功')
          } else {
            ElMessage.error('添加图片失败')
          }
        })
      }
      // 视频
      editor.config.customUploadVideo = (
        resultFiles: any,
        insertVideoFn: any
      ) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        const formData = new FormData()
        formData.append('file', resultFiles[0])
        fetch({
          url: '/admin/sys-file/upload',
          method: 'post',
          data: formData,
        }).then((res) => {
          if (res.data.fileName) {
            insertVideoFn(res.data.url)
            // ElMessage.success('添加成功')
          } else {
            ElMessage.error('添加图片失败')
          }
        })
      }
      // 设置编辑区域高度为 500px
      editor.config.height = height

      // 设置zIndex
      editor.config.zIndex = zIndex

      // 设置 placeholder 提示文字
      editor.config.placeholder = placeholder

      // 设置是否自动聚焦
      editor.config.focus = focus

      // 配置菜单
      editor.config.menus = menus

      // 配置颜色（文字颜色、背景色）
      editor.config.colors = [
        '#000000',
        '#eeece0',
        '#1c487f',
        'yellow',
        '#4d80bf',
      ]

      // 配置字体
      editor.config.fontNames = fontNames

      // 配置行高
      editor.config.lineHeights = lineHeights

      // 代码高亮
      editor.highlight = hljs

      // 配置全屏
      editor.config.showFullScreen = showFullScreen

      // 编辑器 customAlert 是对全局的alert做了统一处理，默认为 window.alert。
      // 如觉得浏览器自带的alert体验不佳，可自定义 alert，以便于达到与自身项目统一的alert效果。
      editor.config.customAlert = customAlert

      // 图片上传默认使用base64
      editor.config.uploadImgShowBase64 = true

      // 配置 onchange 回调函数
      editor.config.onchange = (html: string) => {
        const text = editor.txt.text()
        emitFun(editor, props.valueType === 'html' ? html : text, 'change')
        // emit('update:modelValue', props.valueType === 'html' ? html : text)
      }
      // 配置触发 onchange 的时间频率，默认为 200ms
      editor.config.onchangeTimeout = onchangeTimeout

      // 编辑区域 focus（聚焦）和 blur（失焦）时触发的回调函数。
      editor.config.onblur = (html: string) => {
        emitFun(editor, html, 'blur')
      }
      editor.config.onfocus = (html: string) => {
        emitFun(editor, html, 'focus')
      }
    }

    function emitFun(
      editor: any,
      html: string,
      type: 'change' | 'focus' | 'blur'
    ): void {
      const text = editor.txt.text()
      emit(type, props.valueType === 'html' ? html : text)
    }

    function getHtml() {
      if (editor.value) {
        return unref(editor.value as any).txt.html()
      }
    }
    function append(html: any) {
      if (editor.value) {
        return unref(editor.value as any).txt.append(html)
      }
    }
    function getText() {
      if (editor.value) {
        return unref(editor.value as any).txt.text()
      }
    }
    function clear() {
      if (editor.value) {
        return unref(editor.value as any).txt.clear()
      }
    }

    return {
      editorRef,
      getHtml,
      getText,
      append,
      clear,
    }
  },
})
</script>

<style>
</style>
