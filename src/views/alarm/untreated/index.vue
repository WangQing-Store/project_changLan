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
        v-model="listQuery.host"
        placeholder="全部主机"
        clearable
        class="filter-item"
        style="width: 130px"
        @click.native="gethosts"
        @change="getChannels"
      >
        <el-option
          v-for="item in hosts"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.channel"
        placeholder="全部通道"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in allChannels"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="全部报警"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in warningArr"
          :key="item.id"
          :label="item.typeName"
          :value="item.type"
        />
      </el-select>
      <el-select
        v-model="listQuery.handle"
        placeholder="全部状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusArr"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        />
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
      :key="warningTable"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="序号"
        align="center"
        width="80"
      >
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column
        label="主机"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.hostName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="通道"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="节点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nodeName }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="报警类型"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag>{{ statusDeal(scope.row.handle)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="报警时间"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | filterTime}} - {{ scope.row.endTime | filterTime}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="showInfo(scope.row)"
          >详情</el-button>
          <el-button
            :disabled="scope.row.handle == 1"
            :type="scope.row.handle | statusFilter"
            size="small"
            @click="handleStart(scope.row)"
          >{{scope.row.handle | buttonStyle}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit"
        :total="total"
        class="pull-right"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :visible.sync="dialogInfoVisible"
      title="详情"
      top="3vh"
    >
      <div style="margin-bottom:10px">处理流程</div>
      <el-table
        :data="detailsArr"
        label-position="left"
        label-width="70px"
        border
        style="width: 80%; margin-left:50px;"
      >
        <el-table-column
          label="报警状态"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ statusDeal(scope.row.handle) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | filterTime}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="经纬" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.longitude && scope.row.latitude"
            >{{ scope.row.longitude}},{{ scope.row.latitude}}</span>
          </template>
        </el-table-column> -->
      </el-table>
      <div style="margin-top:20px;margin-bottom:10px">报警详情·{{ warningTypeName }}</div>
      <el-table
        :data="warningDataArrs.slice((warningQuery.page-1)*warningQuery.limit,warningQuery.page*warningQuery.limit)"
        label-position="left"
        label-width="70px"
        border
        style="width: 80%; margin-left:50px;margin-bottom:10px"
      >
        <el-table-column
          label="报警距离(光纤)"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.startDistance + ' - ' + scope.row.endDistance }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="温度"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.startTemp+' ℃ ' + ' - ' + scope.row.endTemp+" ℃ " }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | filterTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- warningDataArrs-->
      <el-pagination
        style="width:100%; overflow: hidden;text-align:right"
        v-show="warningTotal>0"
        :current-page="warningQuery.page"
        :page-sizes="[5,10,20,50]"
        :page-size="warningQuery.limit"
        :total="warningTotal"
        class="pull-right"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlewarningSizeChange"
        @current-change="handlewarningCurrentChange"
      />
    </el-dialog>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      @close="closeDialog"
    >
      <el-form
        ref="dataForm"
        :model="report"
        label-position="left"
        label-width="70px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item
          label="内容"
          prop="content"
        >
          <el-input
            type="textarea"
            rows="5"
            cols="20"
            v-model="workflow.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="reportData"
        >提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="reportInfoVisible"
      :title="textMap[dialogStatus]"
      @close="closeDialog"
    >
      <div v-if="report">
        报警ID:
        <el-tag>{{ report.warningId }}</el-tag>
        <!--      <div v-for="o in warningDataArrs.warningProcesses">-->
        <!--       {{o.handleName}}:-->
        <!--       {{o.createTime | filterTime }}-->
        <!--      </div>-->
        内容：
        <el-tag>{{ report.content }}</el-tag>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="isTrueVisible"
      :title="textMap[dialogStatus]"
      align="center"
      width="20%"
    >
      <el-button
        type="primary"
        @click="decide(0)"
      >是</el-button>
      <el-button
        type="primary"
        @click="decide(1)"
      >否</el-button>
    </el-dialog>
  </div>
</template>

<script>
import {
  getReportWarning,
  detailsWarning,
  fetchList,
  fetchChannel,
  fetchNode,
  fetchHost,
  search,
  reportData,
  fetchDict,
  handleWarning,
  getWorkFlow,
  getWorkFlowDict,
  check,
  findWarningType
} from "@/api/alarm/untreated";
import waves from "@/directive/waves";
import { formatDate } from "@/utils";
import { getDictName } from "@/utils/dictFilter";
import ECharts from "vue-echarts";
import "echarts/lib/chart/pie";
import { analysis } from "@/utils/pie";
import { getByKey } from "../../../api/dictionary";
import { findList,findListChannel } from "@/api/router/channel";
export default {
  components: {
    "v-chart": ECharts
  },
  name: "history",
  directives: {
    waves,
  },
  computed: {
    statusDeal() {
      return function(status) {
        for(let item of this.statusArr) {
          if(status==item.value) {
            return item.name;
          }
        }
      };
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap={
        "1": "primary",
        "2": "danger",
        "3": "success",
        "4": "warning",
        "5": "primary",
        "6": "primary"
      };
      return statusMap[status];
    },
    buttonStyle(handle) {
      const statusMap={
        "1": "开始处理",
        "2": "开始处理",
        "3": "完成处理",
        "4": "提交报告",
        "5": "查看报告",
        "6": "查看报告"
      };
      return statusMap[handle];
    },
    handleMap(status) {
      return getWorkFlow(status,"t_warning_handle");
    },
    warningType(type) {
      return getDictName(type,"t_warning_type");
    },
  },
  data() {
    return {
      warningTotal: 0,
      warningQuery: {
        limit: 10,
        page: 1
      },
      hosts: [],
      list: null,
      total: null,
      dict: null,
      editData: false,
      listLoading: false,
      warningTable: 0,
      listQuery: {
        page: 1,
        limit: 10,
        content: "",
        host: "",
        channel: "",
        type: "",
        handle: ""
      },
      queryChannel: {
        hostId: ""
      },
      queryNode: {
        channelId: ""
      },
      handleStatus: null,
      allHosts: [],
      allChannels: [],
      allNodes: [],
      dialogInfoVisible: false,
      dialogFormVisible: false,
      reportInfoVisible: false,
      isTrueVisible: false,
      infoVisible: false,
      temp: {
        chn: "",
        alarmVoltage: "",
        alarmThreshold: "",
        lightVoltage: "",
        lightThreshold: ""
      },
      workflow: {
        warningId: "",
        dictValue: "",
        handle: "",
        content: ""
      },
      report: {
        id: "",
        warningProcesses: [],
        content: ""
      },
      textMap: {
        write: "填写报告",
        check: "报告内容",
        istrue: "是否属实"
      },
      dialogStatus: "",
      rules: {
        contents: [{ required: true,message: "内容不能为空",trigger: "blur" }]
      },
      polar: [],
      statusArr: [],
      warningArr: [],
      detailsArr: [],
      warningDataDistanceArr: [],
      warningDataTempArr: [],
      warningDataTempChangeArr: [],
      warningDataArrs: [], //汇总这个数组对象里面
      warningTypeName: ""
    };
  },
  created() {
    this.getList();
    this.getStatusByKey();
    this.getWarningByKey();
  },
  methods: {
    handlewarningSizeChange(val) {
      this.warningQuery.limit=val;
    },
    handlewarningCurrentChange(val) {
      this.warningQuery.page=val;
    },
    getChannels() {
      findListChannel(this.listQuery.host).then(res => {
        if(200==res.data.code) {
          this.allChannels=res.data.data;
        }
      });
    },
    gethosts() {
      findList().then(res => {
        if(200==res.data.code) {
          this.hosts=res.data.data;
        }
      });
    },
    getWarningByKey() {
      findWarningType().then(res => {
        if(res.data.code==200) {
          this.warningArr=res.data.data;
        }
      });
    },
    getStatusByKey() {
      getByKey("t_handle_type").then(res => {
        if(res.data.code==200) {
          this.statusArr=res.data.data;
        }
      });
    },
    getList() {
      this.listLoading=true;
      fetchList(this.listQuery).then(response => {
        if(response.data.code===200) {
          this.list=response.data.data.records;
          this.total=parseInt(response.data.data.total);
          this.listLoading=false;
        }

      });
    },
    handleSizeChange(val) {
      var aggregate=this.listQuery.page*this.listQuery.limit;
      if(aggregate>this.total) {
        aggregate=this.total;
      }
      this.listQuery.limit=val;
      var size=Math.ceil(aggregate/this.listQuery.limit);
      if(size<=0) {
        this.listQuery.page=1;
      } else {
        this.listQuery.page=size;
      }
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page=val;
      this.getList();
    },
    showInfo(row) {
      // console.log(row)
      this.warningQuery=this.$options.data().warningQuery;
      this.temp=Object.assign({},row); // copy obj
      this.dialogInfoVisible=true;
      if(row.handle==1) {
        this.workflow.warningId=row.warningId;
        this.workflow.handle=row.handle;
        handleWarning(this.workflow).then(res => {
          if(res.data.code==200) {
            // console.log(res.data)
            for(let item of this.list) {
              if(item.warningId==res.data.data.warningId) {
                item.handle=res.data.data.handle;
                // console.log(item)
                this.$message({
                  message: "该行记录已修改报警状态了",
                  type: "success"
                });
              }
            }
          }
        });
      }
      detailsWarning(row.warningId).then(res => {
        // console.log(res.data)
        if(200==res.data.code) {
          this.detailsArr=res.data.data.warningProcesses;
          let datas=res.data.data;
          // 判断对象是否为空
          if(datas.warningDataTemp!==null) {
            this.warningDataArrs=datas.warningDataTemp;
          }
          // if (datas.warningDataTempChange !== null) {
          //   this.warningDataArrs = datas.warningDataTempChange
          // }
          // if (datas.warningDataDistance !== null) {
          //   this.warningDataArrs = datas.warningDataDistance
          // }
          this.warningTotal=parseInt(this.warningDataArrs.length);
          this.warningTypeName=datas.warningTypeName;
        }
      });
    },
    handlerSearch() {
      this.listLoading=true;
      this.listQuery.page=1;
      this.getList();
    },
    getWorkFlowDict() {
      getWorkFlowDict("t_warning_handle").then(response => {
        this.handleStatus=response.data.data;
      });
    },
    handleStart(row) {
      // console.log(row)
      this.workflow.warningId=row.warningId;
      this.workflow.handle=row.handle;
      switch(row.handle) {
        case 2:
          // this.dialogStatus = 'istrue'
          // this.isTrueVisible = true;
          handleWarning(this.workflow).then(response => {
            if(response.data.code==200) {
              this.success();
              this.getList();
            }
          });
          break;
        case 3:
          this.dialogStatus="istrue";
          this.isTrueVisible=true;
          break;
        case 4:
          this.dialogStatus="write";
          this.dialogFormVisible=true;
          break;
        case 5:
          this.checkReport();
          this.dialogStatus="check";
          this.reportInfoVisible=true;
          break;
        case 6:
          this.checkReport();
          this.dialogStatus="check";
          this.reportInfoVisible=true;
          break;
        default:
          handleWarning(this.workflow).then(response => {
            if(response.data.code==200) {
              this.success();
              this.getList();
            } else {
              this.fail();
            }
          });
          break;
      }
    },
    decide(val) {
      this.workflow.dictValue=val;
      // console.log(this.workflow)
      handleWarning(this.workflow).then(response => {
        this.workflow.dictValue="";
        this.isTrueVisible=false;
        this.getList();
      });
    },
    success() {
      this.$notify({
        title: "成功",
        message: "操作成功",
        type: "success",
        duration: 2000
      });
    },
    fail() {
      this.$notify({
        title: "失败",
        message: "操作失败,"+response.data.msg,
        type: "error",
        duration: 2000
      });
    },
    checkReport() {
      check(this.workflow.warningId).then(response => {
        if(response.data.code==200) {
          var data=response.data.data;
          this.report=data;
        }
      });
    },
    reportData() {
      handleWarning(this.workflow).then(response => {
        this.dialogFormVisible=false;
        if(response.data.code==200) {
          this.success();
        } else {
          this.fail();
        }
        this.getList();
      });
    },
    test() {
      var editPid=[];
      editPid=JSON.parse(localStorage.getItem("editPidData"));
      var pagesId=localStorage.getItem("pageId");
      //默认没有权限
      var flag=1;
      for(let i=0;i<editPid.length;i++) {
        if(editPid[i]==pagesId) {
          flag=0;
        }
      }
      if(flag==0) {
        //有权限
        this.editData=true;
      } else {
        this.editData=false;
      }
    },
    closeDialog() {
      this.report={};
      this.workflow.content="";
    }
  }
};
</script>

<style scoped>
.el-dialog__wrapper /deep/ .el-dialog__body {
  padding: 45px 20px;
}
</style>
