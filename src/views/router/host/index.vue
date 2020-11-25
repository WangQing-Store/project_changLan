<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.type"
        clearable
        class="filter-item"
        placeholder="全部类型"
        @click.native="getTypes"
      >
        <el-option
          v-for="item in allTypes"
          :key="item.id"
          :label="item.typeName"
          :value="item.type"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        clearable
        class="filter-item"
        placeholder="全部状态"
      >
        <el-option
          v-for="item in allStatus"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="listQuery.content"
        placeholder="主机名或地址"
        style="width: 300px;"
        class="filter-item"
      />
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
      :key="hostTable"
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
        label="主机名"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="主机唯一编号"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.uid}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="主机类型"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.typeName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="经度"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.longitude }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="纬度"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否在线"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.isOnline | statusFilter">{{ scope.row.isOnline | onlineFilter }}</el-tag>
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
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="deleteData(scope.row)"
          >删除</el-button>
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
      v-if="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 70%;margin: 0 auto"
      >
        <el-form-item
          label="主机名称"
          prop="name"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          label="主机唯一编号"
          prop="uid"
        >
          <el-input v-model="temp.uid" />
        </el-form-item>
        <el-form-item
          label="主机类型"
          prop="type"
        >
          <el-select
            v-model="temp.type"
            clearable
            filterable
            class="filter-item"
            placeholder="全部状态"
            @click.native="getTypes"
          >
            <el-option
              v-for="item in allTypes"
              :key="item.id"
              :label="item.typeName"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否在线">
          <el-switch
            v-model="temp.isOnline"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>-->
        <!-- <el-form-item label="经度" prop="longitude">
          <el-input v-model="temp.longitude" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="temp.latitude" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLngLat">选取坐标</el-button>
        </el-form-item> -->
        <map-take
          :longitude="temp.longitude"
          :latitude="temp.latitude"
          @setLongitudeLatitude="setLongitudeLatitude"
          @setLongitude="setLongitude"
          @setLatitude="setLatitude"
        ></map-take>
        <el-form-item>
          <div
            slot="label"
            style="margin-left:10px;"
          >地区</div>
          <el-col :span="7">
            <el-select
              v-model="temp.provinceCode"
              placeholder="省份"
              filterable
              clearable
              @change="fetchCity"
            >
              <el-option
                v-for="item in provinces"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="7">
            <el-select
              v-model="temp.cityCode"
              placeholder="市"
              filterable
              clearable
              @change="fetchCounty"
            >
              <el-option
                v-for="item in cities"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="8">
            <el-select
              v-model="temp.countyCode"
              filterable
              placeholder="区/县"
              clearable
            >
              <el-option
                v-for="item in counties"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item prop="address">
          <div
            slot="label"
            style="margin-left:10px;"
          >地址</div>
          <el-input v-model="temp.address" />
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
            <h4 style="font-size:16px">删除此主机会删除以下数据</h4>
            <p style="font-size:16px">下属通道<i style="color:red;font-size:16px">{{this.daleteHostData.channelCount}}</i>条</p>
            <p style="font-size:16px">下属节点<i style="color:red;font-size:16px">{{this.daleteHostData.nodeCount}}</i>条</p>
            <p style="font-size:16px">报警记录<i style="color:red;font-size:16px">{{this.daleteHostData.warningCount}}</i>条</p>
            <p style="font-size:16px">报警数据<i style="color:red;font-size:16px">{{this.daleteHostData.warningDataCount}}</i>条</p>
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

    <!--坐标选取-->
    <!-- <el-dialog :visible.sync="dialogVisible" title="选择坐标">
      <el-row>
        <div class="amap-page-container">
          <el-amap :zoom="zoom" :center="center" :events="events" vid="vamap" />
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        当前选取坐标: {{ lng }}, {{ lat }} {{ currentAddress }}
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="lngLatSubmit">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<style scoped>
.amap-page-container {
  margin-top: -10px;
  width: 100%;
  height: 500px;
}
</style>
<script>
import mapTake from "@/components/MapTake"
import {
  findHostType,
  findByUid,
  createHost,
  findByPage,
  fetchList,
  fetchProvince,
  fetchCity,
  fetchCounty,
  updateHost,
  deleteHost,
  search,
  fetchHost,
  findHost,
  findHostData
} from '@/api/router/host'
import waves from '@/directive/waves'
import VueAMap from 'vue-amap'
import { formatDate } from '@/utils'
import { getRoleType } from '@/utils/auth'
import { getByKey } from "@/api/dictionary"

export default {
  name: 'Host',
  directives: {
    waves
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    statusFilter(status) {
      const statusMap = {
        'false': 'danger',
        'true': 'success',
      }
      return statusMap[status]
    },
    onlineFilter(status) {
      const statusMap = {
        'false': '离线',
        'true': '在线',
      }
      return statusMap[status]
    },
  },
  data() {
    const validateIsEqual = (rule, value, callback) => {
      // var hid = this.tempUidObj.uid
      if (this.dialogStatus === 'create') {
        findByUid(value).then(response => {
          if (response.data.code == 500) {
            callback(new Error('该主机编号已存在'))
          } else {
            callback()
          }
        })
      } else {
        if (value !== this.tempUidObj.uid) {
          findByUid(value).then(response => {
            if (response.data.code == 500) {
              this.isSameName = response.data;
              callback(new Error('该主机编号已存在'))
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }
    }
    const validateLongitude = (rules, value, callback) => {
      if (/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(value)) {
        if (/((^[-]?[0-9])|(^[-]?[2-9]([0-9])?)|(^[-]?[1](([0-7])?)(([0-9])?)))(([.]\d{1,})?)$/.test(value)) {
          callback()
        } else {
          callback(new Error("经度在-180~180之间"))
        }
      } else {
        callback(new Error("输入数字"))
      }
    }
    const validateLatitude = (rules, value, callback) => {
      if (/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(value)) {
        if (/((^[-]?[0-9])|(^[-]?[1-8]([0-9])?))(([.]\d{1,})?)$/.test(value)) {
          callback()
        } else {
          callback(new Error("纬度在-90~90之间"))
        }
      } else {
        callback(new Error("输入数字"))
      }
    }
    const self = this
    return {
      allStatus: [
        { id: 1, name: '在线', value: '1' },
        { id: 2, name: '离线', value: '0' },
      ],
      allTypes: [],
      editData: false,
      hostTable: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        content: '',
        status: '',
        type: ''
      },
      find: null,
      current: null,
      roleType: getRoleType(),
      provinces: null,
      cities: null,
      counties: null,
      temp: {
        id: undefined,
        name: '',
        uid: '',
        isOnline: '1',
        isEnable: '1',
        latitude: undefined,
        longitude: undefined,
        provinceCode: undefined,
        cityCode: undefined,
        countyCode: undefined,
        address: '',
        createTime: null,
        updateTime: null,
        type: ''
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
        name: [{ required: true, message: '主机名不能为空', trigger: 'blur' }],
        uid: [{ required: true, message: '编号不能为空', trigger: 'blur' }, { validator: validateIsEqual, trigger: 'blur' }],
        type: [{ required: true, message: '主机类型不能为空', trigger: 'change' }],
        // uid: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
        latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }, { required: true, validator: validateLatitude, trigger: "blur" },],
        longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }, { required: true, validator: validateLongitude, trigger: "blur" },]
      },
      zoom: 15,
      center: [113.31609, 23.04072],
      lng: '',
      lat: '',
      currentAddress: '',
      dialogVisible: false,
      events: {
        click(e) {
          const { lng, lat } = e.lnglat
          self.lng = lng
          self.lat = lat

          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.currentAddress = result.regeocode.formattedAddress
                self.$nextTick()
              }
            }
          })
        }
      },
      tempUidObj: {},
      isSameName: "",
      isCerateStatus: true,
      deleteHostWarningVisible: false,
      daleteHostData: {},
      deleteDialogVisible: false,
      hostId: '',
      deleteLoading: false,
    }
  },
  created() {
    this.getList()
    this.fetchProvince()
    this.getTypes()
  },
  methods: {
    getTypes() {
      findHostType().then(res => {
        if (200 == res.data.code) {
          this.allTypes = res.data.data;
        }
      })
    },
    getList() {
      this.listLoading = true
      findByPage(this.listQuery).then(response => {
        this.list = response.data.data.records
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    fetchProvince() {
      fetchProvince().then(response => {
        this.provinces = response.data.data
      })
    },
    fetchCity() {
      this.temp.cityCode = ''
      this.temp.countyCode = ''
      fetchCity(this.temp.provinceCode).then(response => {
        this.cities = response.data.data
      })
      fetchCounty(this.temp.cityCode).then(response => {
        this.counties = response.data.data
      })
    },
    fetchCounty() {
      this.temp.countyCode = ''
      fetchCounty(this.temp.cityCode).then(response => {
        this.counties = response.data.data
      })
    },
    async handlerSearch() {
      this.listLoading = true;
      this.listQuery.page = 1;
      await findByPage(this.listQuery).then(response => {
        this.list = response.data.data.records;
        this.total = response.data.data.total;
        this.listLoading = false;
      });
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
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        code: '',
        isEnable: '',
        latitude: undefined,
        longitude: undefined,
        provinceCode: undefined,
        cityCode: undefined,
        countyCode: undefined,
        address: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isCerateStatus) {
            this.isCerateStatus = false;
            createHost(this.temp).then(response => {
              if (response.data.code == 200) {
                this.getList()
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.isCerateStatus = true;
              } else {
                this.$notify({
                  title: '失败',
                  message: '创建失败',
                  type: 'error',
                  duration: 2000
                });
                this.isCerateStatus = true;
              }
            })
          }
        }
      })
    },
    handleUpdate(row) {
      this.tempUidObj = row;
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.isOnline == true) {
        this.temp.isOnline = '1'
      } else {
        this.temp.isOnline = '0'
      }
      if (this.temp.provinceCode != null) {
        fetchCity(this.temp.provinceCode).then(response => {
          this.cities = response.data.data
        });
      }
      if (this.temp.cityCode != null) {
        fetchCounty(this.temp.cityCode).then(response => {
          this.counties = response.data.data
        });
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      delete this.temp.createTime;
      delete this.temp.updateTime;
      // this.temp.type = this.temp.type.toString();
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.type = this.temp.type.toString()
          updateHost(this.temp).then(response => {
            if (response.data.code == 200) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '更新失败,' + response.data.msg,
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
      this.hostId = row.id;
      this.deleteDialogVisible = true;
      this.deleteLoading = true;
      this.daleteHostData = {};
      let res = await findHostData(row.id);
      if (res.data.code == 200) {
        this.deleteLoading = false;
        this.daleteHostData = res.data.data;
      }
    },
    // 确认删除
    async dalectConfirm() {
      let res = await deleteHost(this.hostId);
      if (res.data.code == 200) {
        this.deleteDialogVisible = false;
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      } else {
        this.deleteDialogVisible = false;
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    // handleLngLat() {
    //   this.lng = ''
    //   this.lat = ''
    //   this.currentAddress = ''
    //   this.dialogVisible = true
    // },
    // lngLatSubmit() {
    //   this.temp.longitude = this.lng
    //   this.temp.latitude = this.lat
    //   this.temp.address = this.currentAddress
    //   this.dialogVisible = false
    //   this.lng = ''
    //   this.lat = ''
    //   this.currentAddress = ''
    // },
    setLongitudeLatitude(longitude, latitude, currentAddress) {
      this.temp.longitude = longitude;
      this.temp.latitude = latitude;
      this.temp.address = currentAddress;
    },
    // 修改经纬度
    setLongitude(longitude) {
      this.temp.longitude = longitude;
    },
    setLatitude(latitude) {
      this.temp.latitude = latitude;
    },
  },
  mounted() {
    var editPid = [];
    editPid = JSON.parse(localStorage.getItem("editPidData"));
    var pagesId = localStorage.getItem("pageId");
    //默认没有权限
    var flag = 1;
    if (editPid != null) {
      for (let i = 0; i < editPid.length; i++) {
        if (editPid[i] == pagesId) {
          flag = 0;
        }
      }
    }
    if (flag == 0) {
      //有权限
      this.editData = true;
    } else {
      this.editData = false;
    }
  },
  components: {
    mapTake
  },
}
</script>

<style  scoped>
.el-dialog__wrapper /deep/ .el-dialog__body {
  padding: 0px 20px 30px 20px !important;
}
</style>
