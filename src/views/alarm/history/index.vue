<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.content"
        style="width: 300px;"
        class="filter-item"
        placeholder="主机名称、通道名称或地址关键字"
      />
      <el-select
        v-model="listQuery.hostId"
        placeholder="主机"
        clearable
        class="filter-item"
        style="width: 130px"
        @click.native="findLists"
      >
        <el-option v-for="item in hosts" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handlerSearch"
      />
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="主机名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hostName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"></el-table-column>
      <el-table-column label="主机类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hostType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="离线时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | filterTime}} - {{ scope.row.endTime | filterTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleRemark(scope.row)">备注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="备注" :visible.sync="remarkFormVisible" :close-on-click-modal="false">
      <el-form :model="remarkForms" label-width="100px">
        <div class="disflex">
          <div class="childflex">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="remarkForms.remark"></el-input>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="remarkFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="handremarksubmit">提交</el-button>
      </div>
    </el-dialog>
    <div class="pagination-container">
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        :total="total"
        class="pull-right"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { fetchList, fetchChannel, fetchNode, fetchHost, search, searchTable, addRemark } from '@/api/alarm/history'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'
import { getDictName } from '@/utils/dictFilter'
import { findList } from '@/api/router/channel'
const warningTypes = [
  { key: '1', name: '温感' },
  { key: '2', name: '传感' },
]
export default {
  name: 'history',
  directives: {
    waves
  },
  filters: {
    warningType(type) {
      return getDictName(type, 't_warning_type')
    },
  },
  data() {
    return {
      hosts: [],
      remarkForms: {
        remark: '',
        id: ''
      },
      remarkFormVisible: false,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        content: '',
        hostId: ""
      },
      queryChannel: {
        hostId: ''
      },
      queryNode: {
        channelId: ''
      },
      warningTypes: warningTypes,
      allHosts: [],
      allChannels: [],
      allNodes: [],
    }
  },

  created() {
    this.getList()
    // this.getHost()
  },
  methods: {
    findLists() {
      findList().then(res => {
        if (res.data.code == 200) {
          this.hosts = res.data.data
        }
      })
    },
    handremarksubmit() {
      addRemark(this.remarkForms).then(res => {
        if (res.data.code == 200) {
          // this.searchContent = ''
          this.$message({
            type: 'success',
            message: '备注成功!'
          });
          this.remarkFormVisible = false;
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '备注失败!'
          });
        }
      })
    },
    handleRemark(row) {
      this.remarkFormVisible = true;
      this.remarkForms.remark = row.remark;
      this.remarkForms.id = row.id;
    },

    getList() {
      this.listLoading = true
      searchTable(this.listQuery).then(response => {
        this.list = response.data.data.records
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    getHost() {
      fetchHost().then(response => {
        this.allHosts = response.data.data
      })
    },
    getChannels() {
      this.listQuery.channel = ''
      this.listQuery.node = ''
      this.queryChannel.hostId = this.listQuery.hostId
      fetchChannel(this.queryChannel).then(response => {
        this.allChannels = response.data.data
      })
    },
    getNodes() {
      this.listQuery.node = ''
      this.queryNode.channelId = this.listQuery.channel
      fetchNode(this.queryNode).then(response => {
        this.allNodes = response.data.data
      })
    },
    handlerSearch() {
      this.listLoading = true
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      var aggregate = this.listQuery.page * this.listQuery.limit;
      if (aggregate > this.total) {
        aggregate = this.total;
      }
      this.listQuery.limit = val;
      var size = Math.ceil(aggregate / this.listQuery.limit);
      if (size <= 0) {
        this.listQuery.page = 1;
      } else {
        this.listQuery.page = size;
      }
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
  }
}
</script>

<style scoped>
.el-textarea /deep/ .el-textarea__inner {
  height: 200px;
}
</style>
