<template>
  <div class="app-container">
    <div class="filter-container">
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="基本信息" name="1">
        <table>
          <tr>
            <td>单位名称</td>
            <td>{{unit.name}}</td>
          </tr>
          <tr>
            <td>单位负责人</td>
            <td>{{unit.principal}}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{unit.phone}}</td>
          </tr>
        </table>
      </el-collapse-item>
      <el-collapse-item title="附件信息" name="2">
        <div>简化流程：设计简洁直观的操作流程；</div>
        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
      </el-collapse-item>
      <el-collapse-item title="可控 Controllability" name="3">
        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { fetchInfo } from '@/api/maintenance/unit'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'

export default {
  name: 'UnitInfo',
  directives: {
    waves
  },
  filters: {
    formatDate(time) {
      if (time == null) return ''
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd HH:mm')
    }
  },
  data() {
    return {
      unitTable: 0,
      listLoading: true,
      activeName: '1',
      unit: null,
      dialogPvVisible: false,
      pvData: []
    }
  },
  created() {
    this.fetchInfo()
  },
  methods: {
    fetchInfo() {
      this.listLoading = true
      fetchInfo().then(response => {
        this.unit = response.data.data
        this.listLoading = false
      })
    }
  }
}
</script>
