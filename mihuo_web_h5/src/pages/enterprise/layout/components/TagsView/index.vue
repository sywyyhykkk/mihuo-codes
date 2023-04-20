<template>
  <div v-if="visitedViews.length > 1" ref="wrapper" class="tags-view-container">
    <el-button
      v-if="visitedViews.length > 15"
      class="move-btn prev-btn"
      icon="arrow-left-bold"
      @click="move(-200)"
    />
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <div class="link-wrapper">
        <div
          v-for="tag in visitedViews"
          :key="tag.path"
          class="tags-view-item-content"
        >
          <router-link
            v-if="tag.path != '/guide'"
            :ref="setTagRef"
            :class="isActive(tag) ? 'active' : ''"
            :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
            tag="span"
            class="tags-view-item"
            @click.middle="closeSelectedTag(tag)"
            @contextmenu.prevent="openMenu(tag, $event)"
          >
            <img class="menu-icon" :src="tag.meta.icon">
            <span>{{ tag.title }}</span>
            <el-icon
              v-if="!tag.meta.affix"
              class="el-icon-close"
              @click.prevent.stop="closeSelectedTag(tag)"
            >
              <close />
            </el-icon>
          </router-link>
        </div>
        <div class="tags-view-item-content-bottom" />
      </div>
    </scroll-pane>
    <div class="next-btn-boder">
      <el-button
        v-if="visitedViews.length > 15"
        class="move-btn next-btn"
        icon="arrow-right-bold"
        @click="move(200)"
      />
    </div>

    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li
        v-if="!(selectedTag.meta && selectedTag.meta.affix)"
        @click="closeSelectedTag(selectedTag)"
      >
        关闭
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>

<script lang="ts">
import ScrollPane from './ScrollPane.vue'
import path from 'path'
import {
  defineComponent,
  ref,
  unref,
  computed,
  watch,
  onMounted,
  nextTick
} from 'vue'
import { tagsViewStore } from '_@/store/modules/tagsView'
import { permissionStore } from '_@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { baseEncode } from '@/utils/utils'

export default defineComponent({
  name: 'TagsView',
  components: {
    ScrollPane
  },
  setup() {
    const { currentRoute, push, replace } = useRouter()
    const wrapper = ref<HTMLElement | null>(null)
    const scrollPane = ref<HTMLElement | null>(null)
    const visible = ref<boolean>(false)
    const top = ref<number>(0)
    const left = ref<number>(0)
    const selectedTag = ref<any>({})
    const affixTags = ref<any[]>([])
    const visitedViews = computed(() => tagsViewStore.visitedViews)

    const routers = computed(() => permissionStore.routers)
    const tagRefs = ref<any[]>([])

    function setTagRef(el: any): void {
      tagRefs.value.push(el)
    }

    function isActive(route: RouteLocationNormalizedLoaded): boolean {
      return route.path === currentRoute.value.path
    }

    function filterAffixTags(routes: RouteRecordRaw[], basePath = '/'): any[] {
      let tags: any[] = []
      routes.forEach((route: RouteRecordRaw) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags: any[] = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })

      return tags
    }

    function initTags(): void {
      affixTags.value = filterAffixTags(routers.value)
      const affixTagArr: any[] = affixTags.value
      for (const tag of affixTagArr) {
        // Must have tag name
        if (tag.name) {
          tagsViewStore.addVisitedView(tag)
        }
      }
    }

    function addTags(): void | boolean {
      const { name } = currentRoute.value
      if (name) {
        tagsViewStore.addView(currentRoute.value)
      }
      return false
    }

    function moveToCurrentTag() {
      // TODO 要手动清除tagRefs，不然会一直重复，后续看看有没有什么解决办法
      tagRefs.value = []
      const tags = unref(tagRefs)
      nextTick(() => {
        for (const tag of tags) {
          if (tag && tag.to.path === currentRoute.value.path) {
            (unref(scrollPane) as any).moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== currentRoute.value.fullPath) {
              tagsViewStore.updateVisitedView(currentRoute.value)
            }

            break
          }
        }
      })
    }

    async function refreshSelectedTag(view: RouteLocationNormalizedLoaded) {
      await tagsViewStore.delCachedView()
      const { fullPath } = view
      nextTick(() => {
        replace({
          path: '/redirect' + fullPath
        })
      })
    }

    async function closeSelectedTag(view: RouteLocationNormalizedLoaded) {
      const views: any = await tagsViewStore.delView(view)
      if (isActive(view)) {
        toLastView(views.visitedViews)
      }
    }

    function closeOthersTags() {
      push(selectedTag.value)
      tagsViewStore.delOthersViews(selectedTag.value).then(() => {
        moveToCurrentTag()
      })
    }

    async function closeAllTags() {
      const views: any = await tagsViewStore.delAllViews()
      // console.log(affixTags.value.some(tag => tag.path === view.path))
      // if (affixTags.value.some(tag => tag.path === view.path)) {
      //   return
      // }
      toLastView(views.visitedViews)
    }

    function toLastView(visitedViews: RouteLocationNormalizedLoaded[]) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        push(latestView)
      } else {
        // You can set another route
        push('/')
      }
    }

    function openMenu(tag: RouteLocationNormalizedLoaded, e: any) {
      const menuMinWidth = 105
      const offsetLeft: number = (unref(wrapper) as any).getBoundingClientRect()
        .left // container margin left
      const offsetWidth: number = (unref(wrapper) as any).offsetWidth // container width
      const maxLeft: number = offsetWidth - menuMinWidth // left boundary
      const itemLeft: number = e.clientX - offsetLeft + 4

      if (itemLeft > maxLeft) {
        left.value = maxLeft
      } else {
        left.value = itemLeft
      }
      top.value = e.offsetY

      visible.value = true
      selectedTag.value = tag
    }

    function closeMenu() {
      visible.value = false
    }

    function move(to: number) {
      console.log(unref(scrollPane) as any)
      ;(unref(scrollPane) as any).moveTo(to)
    }

    onMounted(() => {
      initTags()
      addTags()
    })

    watch(
      () => currentRoute.value,
      () => {
        addTags()
        moveToCurrentTag()
      }
    )
    watch(() => visitedViews.value, () => {
      console.log(visitedViews.value)
    })

    watch(
      () => visible.value,
      (visible: boolean) => {
        if (visible) {
          document.body.addEventListener('click', closeMenu)
        } else {
          document.body.removeEventListener('click', closeMenu)
        }
      }
    )

    return {
      wrapper,
      scrollPane,
      visible,
      top,
      left,
      selectedTag,
      affixTags,
      visitedViews,
      routers,
      tagRefs,
      baseEncode,
      setTagRef,
      isActive,
      filterAffixTags,
      initTags,
      addTags,
      moveToCurrentTag,
      refreshSelectedTag,
      closeSelectedTag,
      closeOthersTags,
      closeAllTags,
      toLastView,
      openMenu,
      closeMenu,
      move
    }
  }
})
</script>

<style lang="less" scoped>
.el-icon-close {
  display: none;
}

.tags-view-container {
  height: @tagsViewHeight;
  width: 100%;
  background: #fff;
  //border-bottom: 1px solid @tagDividerColor;
  position: relative;
  display: flex;
  z-index: 1;

  .tags-view-item-content-bottom {
    height: 4.1rem;
    width: 100%;
    flex: 1;
    text-align: right;
    border-bottom: 1px solid @tagDividerColor;
    position: relative;
    z-index: 1;
  }

  .next-btn-boder {
    height: 4.1rem;
    border-bottom: 1px solid @tagDividerColor;
    width: 78px;
  }

  .menu-icon {
    height: 1.8rem;
    width: 1.8rem;
    margin: 0 0.8rem 0 0;
    vertical-align: middle;
  }

  &::after {
    content: '';
    width: 100%;
    height: 1px;
    border-top: #d8dce5;
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .move-btn {
    display: inline-block;
    width: @tagsViewHeight;
    height: @tagsViewHeight;
    line-height: @tagsViewHeight;
    text-align: center;
    padding: 0;
    border-radius: 0;
    z-index: 10;
  }

  .tags-view-wrapper {
    width: calc(~'100% - 78px');

    .link-wrapper {
      display: flex;
    }

    .tags-view-item {
      list-style: none;
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      height: @tagsViewHeight;
      line-height: @tagsViewHeight;
      background: @subMenuHover;
      border: 1px solid @tagDividerColor;
      border-top: 0;
      //border-bottom: 0;
      border-left: none;
      color: @topMenuText;
      padding: 0 15px;
      font-size: 12px;
      z-index: 10;

      &:hover {
        color: @mainColor;

        .el-icon-close {
          display: inline-block;
          height: 1.3rem;
          width: 1.3rem;
          line-height: 1.3rem;
          color: #000;
          margin-left: 0.6rem;
          vertical-align: baseline;
        }
      }

      &.active {
        background: #fff;
        color: @contentBg2;
        display: flex;
        text-align: center;
        align-items: center;
        border-bottom: 0 !important;

        .el-icon-close {
          display: inline-block;
          height: 1.3rem;
          width: 1.3rem;
          line-height: 1.3rem;
          color: #000;
          margin-left: 0.6rem;
          vertical-align: baseline;
        }

        &:hover .el-icon-close {
          display: inline-block;
          background: @subMenuActiveText;
          color: #fff;
          text-align: center;
          align-items: center;
          justify-content: center;
        }

        &::after {
          content: '';
          width: 100%;
          background: rgb(255, 255, 255);
          display: block;
          height: 2px;
          position: absolute;
          left: 0;
          bottom: -1px;
          z-index: 10;
        }
      }

    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 200;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}

:deep(.scrollbar__view) {
  height: @tagsViewHeight;
  line-height: @tagsViewHeight;
}
</style>
