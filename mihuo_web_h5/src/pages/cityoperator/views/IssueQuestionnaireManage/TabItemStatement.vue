<template>
  <div class="questionnaire-statement">
    <el-card>
      <el-space :size="60">
        <el-space :size="20">
          <p class="collection-label">日收集数</p>
          <span class="collection-num">33</span>
        </el-space>
        <el-space :size="20">
          <p class="collection-label">月收集数</p>
          <span class="collection-num">33</span>
        </el-space>
      </el-space>
    </el-card>
    <el-empty
      v-if="!tableData.length"
      key="questionnaire-empty"
      description="暂无数据"
    />
    <div v-else key="questionnaire-results" class="topic-wrapper">
      <div class="topic-list">
        <div class="topic-content">
          <p class="topic-title">
            [<em>题目</em>] <strong>您想怎么装？</strong>
          </p>
        </div>
        <div class="topic-stat">
          <div class="topic-chart">
            <TopicBar />
          </div>
          <div class="topic-table">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="option" label="选项" />
              <el-table-column
                sortable
                prop="volume"
                label="数据量"
                width="120"
              />
              <el-table-column
                sortable
                prop="proportion"
                label="占比"
                width="120"
              />
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopicBar from './components/TopicBar.vue'

const tableData = [
  {
    option: '整装',
    volume: '0',
    proportion: '0%'
  },
  {
    option: '局改',
    volume: '0',
    proportion: '0%'
  },
  {
    option: '翻新',
    volume: '0',
    proportion: '0%'
  },
  {
    option: '维修',
    volume: '0',
    proportion: '0%'
  }
]
</script>

<style scoped lang="less">
.questionnaire-statement {
  .collection-label {
    font-size: 18px;
  }

  .collection-num {
    font-size: 22px;
    font-weight: bold;
  }

  .topic-wrapper {
    margin-top: 2rem;

    .topic-title {
      margin-bottom: 2.6rem;
      margin-left: 1rem;
    }

    .topic-stat {
      display: flex;
      align-items: flex-start;
      gap: 6rem;

      .topic-chart {
        height: 200px;
        max-width: 600px;
      }

      .topic-table {
        flex: 1;
        height: 240px;
        max-width: 600px;
      }
    }
  }
}
</style>
