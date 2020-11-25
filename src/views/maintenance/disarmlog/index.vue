<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.content"
        placeholder="主机名称、通道名称、或地址关键字"
        style="width: 300px;"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.hostId"
        placeholder="主机"
        clearable
        class="filter-item"
        style="width: 130px"
        @click.native="findLists"
        @change="changeChannel(listQuery.hostId)"
      >
        <el-option v-for="item in hosts" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select
        v-model="listQuery.channelId"
        placeholder="通道"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
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
      <el-table-column label="通道名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通道编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hostType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="长度" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelLength + "m" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="撤防时间" align="center" width="400">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | filterTime }} — {{ scope.row.endTime | filterTime }}</span>
        </template>
      </el-table-column>
    </el-table>

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
import { fetchList, fetchDict, fetchAllHost, search } from '@/api/maintenance/disarmlog'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'
import { getDictName } from '@/utils/dictFilter'
import { findList, findListChannel } from '@/api/router/channel'

export default {
  name: 'Removal',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      return getDictName(status, 't_router_type')
    }
  },
  data() {
    return {
      removalTable: 0,
      list: null,
      total: null,
      listLoading: true,
      allHosts: null,
      listQuery: {
        page: 1,
        limit: 10,
        content: '',
        hostId: '',
        channelId: ''
      },
      typeOptions: null,
      dialogPvVisible: false,
      pvData: [],
      hosts: [],
      channels: []
    }
  },
  created() {
    this.fetchList()
    // this.fetchAllHost()
    // this.getDict()
  },
  methods: {
    changeChannel(id) {
      // console.log(this.listQuery.hostId)
      findListChannel(id).then(res => {
        if (res.data.code == 200) {
          this.channels = res.data.data
        }
      })
    },
    // channels
    findLists() {
      findList().then(res => {
        if (res.data.code == 200) {
          this.hosts = res.data.data
        }
      })
    },
    fetchList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.records
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    getDict() {
      fetchDict("t_router_type").then(response => {
        console.log(response.data.data)
        this.typeOptions = response.data.data
      })
    },
    fetchAllHost() {
      fetchAllHost().then(response => {
        this.allHosts = response.data.data
      })
    },
    handlerSearch() {
      this.listLoading = true
      this.listQuery.page = 1
      this.fetchList()
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
      this.fetchList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchList()
    },
  }
}
</script>
