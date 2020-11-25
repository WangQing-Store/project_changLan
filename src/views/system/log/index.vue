<template>
  <div>
    <div style="text-align:right;padding:5px">
      <el-date-picker
        v-model="timeObj.startTime"
        type="datetime"
        format="yyyy/MM/dd HH:mm:ss"
        value-format="yyyy/MM/dd HH:mm:ss"
        placeholder="选择开始日期时间"
      ></el-date-picker>
      <el-date-picker
        v-model="timeObj.endTime"
        type="datetime"
        format="yyyy/MM/dd HH:mm:ss"
        value-format="yyyy/MM/dd HH:mm:ss"
        placeholder="选择结束日期时间"
      ></el-date-picker>
      <el-input v-model="initObj.content" style="width: 200px;" placeholder="用户名称、操作或IP关键字" />
      <el-button type="primary" icon="el-icon-search" @click="handlerSearch" />
    </div>
    <table-list v-if="isTableData" :data="tableData" :columns="columns" :loading="loading"></table-list>
    <pagination
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :total="total"
      :currentPage="initObj.page"
      :pageSize="initObj.limit"
    ></pagination>
  </div>
</template>

<script>
import tableList from '@/components/elementTable'
import pagination from '@/components/elementPagination'
import { getPagelog } from '@/api/log'
export default {
  name: 'index',
  data() {
    return {
      total: 0,
      initObj: {
        content: '',
        page: 1,
        limit: 10,
      },
      timeObj: {
        endTime: '',
        startTime: ''
      },
      isTableData: false,
      tableData: [],
      columns: [
        {
          label: "序号",
          index: true,
          formatter: (row, column, cellValue, index) => {
            return index + 1;
          }
        },
        {
          label: "用户名",
          prop: "username"
        },
        {
          label: "用户操作",
          prop: "operation"
        },
        {
          label: "用户ip",
          prop: "ip"
        },
        {
          label: "操作时间",
          prop: "createTime",
          formatter: row => {
            if (row.createTime == null) {
              return ''
            }
            let d = new Date(row.createTime);
            if (d.getHours() < 10) {
              var Hours = "0" + d.getHours()
            } else {
              var Hours = d.getHours()
            }
            if (d.getMinutes() < 10) {
              var Minutes = "0" + d.getMinutes()
            } else {
              var Minutes = d.getMinutes()
            }
            if (d.getSeconds() < 10) {
              var Seconds = "0" + d.getSeconds()
            } else {
              var Seconds = d.getSeconds()
            }
            let installtime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "   " + Hours + ':' + Minutes + ':' + Seconds;
            return installtime;
          }
        },
      ], //表格列字段
      loading: true,

    }
  },
  components: {
    tableList,
    pagination
  },
  methods: {
    handleSizeChange(val) {
      var aggregate = this.initObj.page * this.initObj.limit;
      if (aggregate > this.total) {
        aggregate = this.total;
      }
      this.initObj.limit = val;
      var size = Math.ceil(aggregate / this.initObj.limit);
      if (size <= 0) {
        this.initObj.page = 1;
      } else {
        this.initObj.page = size;
      }
      this.initData()
    },
    handleCurrentChange(val) {
      this.initObj.page = val
      this.initData()
    },
    handlerSearch() {
      if (this.timeObj.startTime !== '') {
        this.initObj.startTime = this.timeObj.startTime
      }
      if (this.timeObj.endTime !== '') {
        this.initObj.endTime = this.timeObj.endTime
      }
      this.initData()

    },
    initData() {
      getPagelog(this.initObj).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data.records
          this.total = parseInt(res.data.data.total)
          this.isTableData = true
          this.loading = false
        }
      })
    }
  },
  mounted() {
    this.initData()
  }
}
</script>

<style scoped>
</style>
