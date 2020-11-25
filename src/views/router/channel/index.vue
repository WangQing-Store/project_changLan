<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.content"
        placeholder="通道名称或地址关键字"
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
      >
        <el-option
          v-for="item in hosts"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handlerSearch"
      />
      <el-button
        v-if="!$store.state.user.isUnitId"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
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
        label="通道名称"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="通道编号"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="长度"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.length+'m' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="主机"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.hostName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>-->
      <el-table-column
        label="撤/布防"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDisarm"
            @change="updateDisarm(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <!--      //v-if="editData"-->
        <template slot-scope="scope">
          <div style="display:flex;justify-content: center;align-items: center;">
            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              style="width:auto"
              type="primary"
              size="mini"
              @click="handleAlarmParam(scope.row)"
            >报警参数</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteData(scope.row)"
            >删除</el-button>
          </div>
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 60%;margin: 0 auto"
      >
        <el-form-item
          label="主机"
          prop="hostId"
        >
          <el-select
            v-model="temp.hostId"
            class="filter-item"
            placeholder="请选择"
            prop="category"
            style="width:100%"
            @click.native="findLists"
          >
            <el-option
              v-for="item in hosts"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="通道名称"
          prop="name"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          label="通道编号"
          prop="code"
        >
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item
          label="长度"
          prop="length"
        >
          <el-input v-model="temp.length" />
        </el-form-item>
        <el-form-item
          label="基准温度"
          prop="standardTemp"
        >
          <el-input
            v-model="temp.standardTemp"
            disabled
          />
          <el-button
            type="primary"
            @click="setTemp"
          >设置</el-button>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createData"
        >提交</el-button>
        <el-button
          v-else
          type="primary"
          @click="updateData"
        >提交</el-button>
      </div>
    </el-dialog>
    <!-- 设置基准温度 -->
    <el-dialog
      :visible.sync="setTempVisible"
      title="设置基准温度"
    >
      <div style="text-align: right;">
        <el-button
          type="primary"
          @click="addFiducialTemp"
        > 添加 </el-button>
      </div>
      <el-form ref="fiducialTemp">
        <div
          style="display:flex;justify-content: center;"
          v-for="(item,index) of fiducialTemp"
          :key="index"
          :id="index"
        >
          <el-form-item
            label="基准距离"
            style="margin-right:10px"
            prop="dist"
          >
            <el-input v-model="fiducialTemp[index].dist"></el-input>
          </el-form-item>
          <el-form-item
            label="基准温度"
            prop="temp"
          >
            <el-input v-model="fiducialTemp[index].temp"></el-input>
          </el-form-item>
          <el-button
            type='danger'
            style="height:100%"
            @click="deleteFiducialTemp(index)"
          > 删除 </el-button>
        </div>
      </el-form>
      <div
        slot="footer"
        style="text-align:right"
      >
        <el-button @click="setTempVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="fiducialTempConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 主机删除模态框 -->
    <el-dialog
      :visible.sync="deleteDialogVisible"
      title="删除警告"
      style="width:50%;margin:0 auto"
    >
      <div v-loading="deleteLoading">
        <div style="display:flex;align-items:center">
          <i
            class="el-icon-warning-outline"
            style="font-size:30px;color:#e6a23c;margin-right:20px"
          ></i>
          <div>
            <h4 style="font-size:16px">删除此通道会删除以下数据</h4>
            <p style="font-size:16px">下属节点<i style="color:red;font-size:16px">{{this.daleteChannelData.nodeCount}}</i>条</p>
            <p style="font-size:16px">报警记录<i style="color:red;font-size:16px">{{this.daleteChannelData.warningCount}}</i>条</p>
            <p style="font-size:16px">报警数据<i style="color:red;font-size:16px">{{this.daleteChannelData.warningDataCount}}</i>条</p>
            <p style="font-size:16px">及其他相关数据是否确认删除</p>
          </div>
        </div>
        <div style="text-align:right">
          <el-button @click="deleteDialogVisible=false">取消</el-button>
          <el-button
            type="primary"
            @click="dalectConfirm"
          >确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 报警参数一级模态框 -->
    <el-dialog
      :visible.sync="AlarmParamsFirstModeBox"
      title="报警参数"
    >
      <div style="display:flex;justify-content: space-around;align-items: center;padding: 50px;">
        <el-card
          :body-style="{ padding: '0px' }"
          class="noSelect hands"
          shadow="hover"
          @click.native="setWildfireParam"
        >
          <div style="width:189px;height:126px">
            <img
              style="width:100%;height:100%"
              src="@/assets/Alarm_Type/wildfire.jpg"
              class="noSelect"
            >
          </div>

          <div style="padding: 14px;text-align:center">
            <span>山火</span>
          </div>
        </el-card>
        <el-card
          :body-style="{ padding: '0px' }"
          class="noSelect hands"
          shadow="hover"
          @click.native="setIcingParam"
        >
          <div style="width:189px;height:126px">
            <img
              style="width:100%;height:100%"
              src="@/assets/Alarm_Type/icing.jpg"
              class="noSelect"
            >
          </div>

          <div style="padding: 14px;text-align:center">
            <span>覆冰</span>
          </div>
        </el-card>
      </div>
    </el-dialog>
    <!-- 报警参数二级模态框 山火 -->
    <el-dialog
      :visible.sync="wildfireModeBox"
      title="山火"
    >
      <el-form
        :model="temp"
        label-position="left"
        label-width="120px"
        :rules="wildfireRules"
        ref="wildfireForm"
        style="width: 60%;margin: 0 auto"
      >
        <el-form-item
          label="升温阈值"
          prop="heatingThreshold"
        >
          <el-input v-model="temp.heatingThreshold" /><span>℃</span>
        </el-form-item>
        <el-form-item
          label="合并间隔"
          prop="heatingInterval"
        >
          <el-input v-model="temp.heatingInterval" /><span>m</span>
        </el-form-item>
        <el-form-item
          label="最小长度"
          prop="heatingLength"
        >
          <el-input v-model="temp.heatingLength" /><span>m</span>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        style="text-align:right"
      >
        <el-button @click="wildfireModeBox = false">取消</el-button>
        <el-button
          type="primary"
          @click="wildfireConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 报警参数二级模态框 覆冰 -->
    <el-dialog
      :visible.sync="icingModeBox"
      title="覆冰"
    >
      <el-form
        :model="temp"
        label-position="left"
        label-width="120px"
        ref="icingForm"
        :rules="icingRules"
        style="width: 60%;margin: 0 auto"
      >
        <el-form-item
          label="绝对温度阈值"
          prop="absoluteTempThreshold"
        >
          <el-input v-model="temp.absoluteTempThreshold" /><span>℃</span>
        </el-form-item>
        <el-form-item
          label="温差最小阈值"
          prop="differenceMinimum"
        >
          <el-input v-model="temp.differenceMinimum" /><span>℃</span>
        </el-form-item>
        <el-form-item
          label="温差最大阈值"
          prop="differenceMaximum"
        >
          <el-input v-model="temp.differenceMaximum" /><span>℃</span>
        </el-form-item>
        <el-form-item
          label="合并间隔"
          prop="icingInterval"
        >
          <el-input v-model="temp.icingInterval" /><span>m</span>
        </el-form-item>
        <el-form-item
          label="最小长度"
          prop="icingLength"
        >
          <el-input v-model="temp.icingLength" /><span>m</span>
        </el-form-item>
        <el-form-item
          label="最小差异值"
          prop="icingDifferent"
        >
          <el-input v-model="temp.icingDifferent" /><span>℃</span>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        style="text-align:right"
      >
        <el-button @click="icingModeBox = false">取消</el-button>
        <el-button
          type="primary"
          @click="icingConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findByCode,
  findList,
  fetchList,
  fetchHosts,
  fetchDict,
  createChannel,
  updateChannel,
  deleteChannel,
  search,
  updateDisarm,
  fetchChannel,
  findChannel,
  findChannelData
} from '@/api/router/channel'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'
import { getRoleType } from '@/utils/auth'
import { getDictName } from '@/utils/dictFilter'

const isDisarmOptions=[
  { key: true,display_name: '布防' },
  { key: false,display_name: '撤防' }
]

export default {
  name: 'Channel',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      return getDictName(status,'t_router_type')
    },
    formatDate(time) {
      var date=new Date(time)
      return formatDate(date,'yyyy-MM-dd hh:mm')
    }
  },
  data() {
    const validateIsEqual=(rule,value,callback) => {
      // console.log(value)
      var hid=this.temp.hostId;
      var code=this.iscodeObj.code;
      var hostId=this.iscodeObj.hostId;
      if(this.dialogStatus==='update') {
        if(value=="") {
          callback(new Error("通道编号不能为空"))
        } else {
          if(value!=code||hid!=hostId) {
            findByCode(value,hid).then(response => {
              if(response.data.code==500) {
                callback(new Error('该主机下通道编号已存在'))
              } else {
                callback()
              }
            })
          } else {
            callback()
          }
        }
        // fetchChannel(this.temp.id).then(response => {
        //   this.current = response.data.data;
        //   findChannel(value, hid).then(response => {
        //     this.find = response.data.data
        //     if (this.current.code !== value) {
        //       if (this.find !== null) {
        //         callback(new Error('该主机通道编号已存在'))
        //       } else {
        //         callback()
        //       }
        //     } else {
        //       callback()
        //     }
        //   })
        // })
      } else if(this.dialogStatus==='create') {
        if(value=="") {
          callback(new Error("通道编号不能为空"))
        } else {
          findByCode(value,hid).then(response => {
            if(response.data.code==500) {
              callback(new Error('该主机下通道编号已存在'))
            } else {
              callback()
            }
          })
        }
      }
    }
    const validateIsChinese=(rule,value,callback) => {
      if(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正数数字'))
      }
    }
    const validateIsDistance=(rules,value,callback) => {
      if(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正数数字'))
      }
    }
    const validateIsTemp=(rules,value,callback) => {
      if(/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    }
    return {
      editData: false,
      channelTable: 0,
      list: null,
      total: null,
      hosts: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        content: '',
        hostId: '',
        type: '',
        isDisarm: ''
      },
      roleType: getRoleType(),
      typeOptions: null,
      isDisarmOptions: isDisarmOptions,
      temp: {
        id: undefined,
        name: '',
        code: '',
        type: '',
        hostId: '',
        length: '',
        isDisarm: '',
        standardTemp: '',
        isEnable: true,
        heatingThreshold: 25,//山火升温阈值
        heatingInterval: 5,//山火合并间隔
        heatingLength: 100,//山火最小长度
        absoluteTempThreshold: -2,//覆冰绝对温度阈值
        differenceMaximum: 5,//覆冰温差最大阈值
        differenceMinimum: 10,//覆冰温差最小阈值
        icingInterval: 10,//覆冰合并间隔
        icingLength: 100,//覆冰最小长度
        icingDifferent: 5,//覆冰最小差异值
        createTime: undefined,
        updateTime: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        hostId: [{ required: true,message: '主机不能为空',trigger: 'change' }],
        name: [{ required: true,message: '通道名称不能为空',trigger: 'blur' }],
        type: [{ required: true,message: '类型不能为空',trigger: 'blur' }],
        code: [{ required: true,message: '通道编号不能为空',trigger: 'blur' },{ validator: validateIsEqual,trigger: 'blur' }],
        length: [{ required: true,message: '长度不能为空',trigger: 'blur' },{ validator: validateIsChinese,trigger: 'blur' }]
      },
      wildfireRules: {
        heatingThreshold: [{ required: true,message: '升温阈值不能为空',trigger: 'blur' },{ validator: validateIsChinese,trigger: 'blur' }],
        heatingInterval: [{ required: true,message: '合并间隔不能为空',trigger: 'blur' },{ validator: validateIsChinese,trigger: 'blur' }],
        heatingLength: [{ required: true,message: '最小长度不能为空',trigger: 'blur' },{ validator: validateIsChinese,trigger: 'blur' }]
      },
      icingRules: {
        absoluteTempThreshold: [{ required: true,message: '升温阈值不能为空',trigger: 'blur' },{ validator: validateIsTemp,trigger: 'blur' }],
        differenceMinimum: [{ required: true,message: '温差最小阈值不能为空',trigger: 'blur' },{ validator: validateIsTemp,trigger: 'blur' }],
        differenceMaximum: [{ required: true,message: '温差最大阈值不能为空',trigger: 'blur' },{ validator: validateIsTemp,trigger: 'blur' }],
        icingInterval: [{ required: true,message: '合并间隔不能为空',trigger: 'blur' },{ validator: validateIsChinese,trigger: 'blur' }],
        icingLength: [{ required: true,message: '最小长度不能为空',trigger: 'blur' },{ validator: validateIsChinese,trigger: 'blur' }],
        icingDifferent: [{ required: true,message: '最小差异值不能为空',trigger: 'blur' },{ validator: validateIsChinese,trigger: 'blur' }],
      },
      iscodeObj: {},
      isCerateStatus: true,
      setTempVisible: false,
      fiducialTemp: [],
      distanceArr: [],
      deleteDialogVisible: false,
      deleteLoading: false,
      daleteChannelData: {},
      channelId: "",
      AlarmParamsFirstModeBox: false,
      wildfireModeBox: false,
      icingModeBox: false,
      AlarmParamData: {}
    }
  },
  created() {
    this.getList()
    this.findLists()
  },
  methods: {
    findLists() {
      findList().then(res => {
        if(res.data.code==200) {
          this.hosts=res.data.data
        }
      })
    },
    getList() {
      this.listLoading=true
      fetchList(this.listQuery).then(response => {
        if(response.data.code==200) {
          this.list=response.data.data.records
          this.total=parseInt(response.data.data.total)
          this.listLoading=false
        }
      })
    },
    handlerSearch() {
      this.listLoading=true
      this.listQuery.page=1
      this.getList()
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
      this.listQuery.page=val
      this.getList()
    },
    updateDisarm(row) {
      if(row.isDisarm) {
        updateDisarm(row.id).then(response => {
          if(response.data.code==200) {
            this.$notify({
              title: '成功',
              message: '恢复布防',
              type: 'success',
              duration: 2000
            });
          }
        })
      } else {
        updateDisarm(row.id).then(response => {
          if(response.data.code==200) {
            this.$notify({
              title: '成功',
              message: '成功撤防',
              type: 'success',
              duration: 2000
            })
          }
        })
      }
    },
    resetTemp() {
      this.temp={
        id: undefined,
        name: '',
        code: '',
        type: '',
        hostId: '',
        length: '',
        isDisarm: '',
        standardTemp: '',
        isEnable: true,
        heatingThreshold: 25,//山火升温阈值
        heatingInterval: 5,//山火合并间隔
        heatingLength: 100,//山火最小长度
        absoluteTempThreshold: -2,//覆冰绝对温度阈值
        differenceMaximum: 5,//覆冰温差最大阈值
        differenceMinimum: 10,//覆冰温差最小阈值
        icingInterval: 10,//覆冰合并间隔
        icingLength: 100,//覆冰最小长度
        icingDifferent: 5,//覆冰最小差异值
        createTime: undefined,
        updateTime: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus='create'
      this.dialogFormVisible=true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if(valid) {
          if(this.isCerateStatus) {
            this.isCerateStatus=false;
            delete this.temp.createTime;
            delete this.temp.updateTime;
            console.log('this.temp: ',this.temp);
            createChannel(this.temp).then(response => {
              if(response.data.code==200) {
                this.getList()
                this.dialogFormVisible=false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.isCerateStatus=true;
              } else {
                this.$notify({
                  title: '失败',
                  message: '创建失败',
                  type: 'error',
                  duration: 2000
                });
                this.isCerateStatus=true;
              }
            })
          }
        }
      })
    },
    handleUpdate(row) {
      this.iscodeObj=row;
      this.temp=Object.assign({},row) // copy obj
      this.dialogStatus='update'
      this.dialogFormVisible=true
      this.initFiducialTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        delete this.temp.createTime;
        delete this.temp.updateTime;
        if(valid) {
          updateChannel(this.temp).then(response => {
            if(response.data.code==200) {
              this.getList()
              this.dialogFormVisible=false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 点击删除
    async deleteData(row) {
      this.channelId=row.id;
      this.deleteDialogVisible=true;
      this.deleteLoading=true;
      this.daleteChannelData={};
      let { data }=await findChannelData(row.id);
      if(data.code==200) {
        this.deleteLoading=false;
        this.daleteChannelData=data.data;
      }
    },
    // 确认删除
    async dalectConfirm() {
      let res=await deleteChannel(this.channelId);
      if(200==res.data.code) {
        this.deleteDialogVisible=false;
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      } else {
        this.deleteDialogVisible=false;
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 初始化基准温度
    initFiducialTemp() {
      this.fiducialTemp=this.temp.standardTemp!=""? JSON.parse(this.temp.standardTemp):[{ dist: "",temp: "" }]
    },
    // 设置基准温度
    setTemp() {
      this.setTempVisible=true;
      if(this.temp.standardTemp==""||this.temp.standardTemp==null) {
        this.fiducialTemp=[{ dist: "",temp: "" }]
      } else {
        this.fiducialTemp=JSON.parse(this.temp.standardTemp);
      }
      // localStorage.setItem("fiducialTemp", JSON.stringify(this.fiducialTemp))
    },
    // 添加基准温度
    addFiducialTemp() {
      this.fiducialTemp.push({
        dist: "",
        temp: ""
      });
      // localStorage.setItem("fiducialTemp", JSON.stringify(this.fiducialTemp))
    },
    // 删除基准温度
    deleteFiducialTemp(index) {
      this.fiducialTemp.splice(index,1);
      // localStorage.setItem("fiducialTemp", JSON.stringify(this.fiducialTemp))
    },
    // 保存基准温度设置
    fiducialTempConfirm() {
      this.distanceArr=[];
      for(let item of this.fiducialTemp) {
        this.distanceArr.push(item.dist)
        if(!item.dist=="") {
          if(!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(item.dist)) {
            this.$message({
              type: 'info',
              message: "基准距离请输入正数"
            })
            return;
          }
        } else {
          this.$message({
            type: 'info',
            message: "基准距离不能为空"
          })
          return;
        }
        if(!item.temp=="") {
          if(!/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(item.temp)) {
            this.$message({
              type: 'info',
              message: "基准温度请输入数字"
            })
            return;
          }
        } else {
          this.$message({
            type: 'info',
            message: "基准温度不能为空"
          })
          return;
        }
      }
      let newArr=this.distanceArr.slice().sort();
      for(let i=0;i<this.distanceArr.length;i++) {
        if(newArr[i]==newArr[i+1]) {
          this.$message({
            type: 'info',
            message: "基准距离不能重复"
          })
          return;
        }
      }
      if(this.fiducialTemp.length==0) {
        this.temp.standardTemp=""
      } else {
        this.temp.standardTemp=JSON.stringify(this.fiducialTemp);
      }
      this.setTempVisible=false;
    },
    // 点击报警参数
    handleAlarmParam(row) {
      this.AlarmParamData=Object.assign({},row);
      this.AlarmParamsFirstModeBox=true;
    },
    // 设置山火参数
    setWildfireParam() {
      this.wildfireModeBox=true;
      this.temp=Object.assign({},this.AlarmParamData);
      this.$nextTick(() => {
        this.$refs['wildfireForm'].clearValidate();
      })
    },
    // 设置覆冰参数
    setIcingParam() {
      this.icingModeBox=true;
      this.temp=Object.assign({},this.AlarmParamData);
      this.$nextTick(() => {
        this.$refs['icingForm'].clearValidate();
      })
    },
    //确认山火参数
    wildfireConfirm() {
      this.$refs['wildfireForm'].validate((valid) => {
        if(valid) {
          delete this.temp.createTime;
          delete this.temp.updateTime;
          updateChannel(this.temp).then(response => {
            if(response.data.code==200) {
              this.getList()
              this.AlarmParamData=this.temp;
              this.wildfireModeBox=false;
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      });
    },
    // 确认覆冰参数
    icingConfirm() {
      this.$refs['icingForm'].validate((valid) => {
        if(valid) {
          delete this.temp.createTime;
          delete this.temp.updateTime;
          updateChannel(this.temp).then(response => {
            if(response.data.code==200) {
              this.getList()
              this.AlarmParamData=this.temp;
              this.icingModeBox=false;
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      });
    }
  },
  mounted() {
    var editPid=[];
    editPid=JSON.parse(localStorage.getItem("editPidData"));
    var pagesId=localStorage.getItem("pageId");
    //默认没有权限
    var flag=1;
    if(editPid!=null) {
      for(let i=0;i<editPid.length;i++) {
        if(editPid[i]==pagesId) {
          flag=0;
        }
      }
    }
    if(flag==0) {
      //有权限
      this.editData=true;
    } else {
      this.editData=false;
    }
  }
}
</script>

<style scoped>
.el-form-item /deep/ .el-form-item__content {
  display: flex;
}
.el-input {
  margin-right: 3px;
}
.el-dialog__wrapper /deep/ .el-dialog__body {
  padding: 0px 20px 30px 20px !important;
}
.card {
  width: 30%;
  background-color: #169bd5;
  text-align: center;
  color: #fff;
  font-size: 14px;
}
.card:hover {
  box-shadow: 0px 0px 3px 0 #169bd5;
}
.noSelect {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
}
.hands {
  cursor: pointer;
}
</style>