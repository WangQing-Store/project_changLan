<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.content"
        placeholder="节点名称或者地址"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.hostId"
        placeholder="主机"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="getChannels(listQuery.hostId)"
      >
        <el-option
          v-for="item in hosts"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.channelId"
        placeholder="通道"
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
      <!--      <el-button-->
      <!--        class="filter-item"-->
      <!--        style="margin-left: 10px;"-->
      <!--        type="primary"-->
      <!--        icon="el-icon-edit"-->
      <!--        @click="handleImport">导入-->
      <!--      </el-button>-->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleExport"
      >导出</el-button>
      <!--      v-if="roleType === 'ADMIN'"-->
    </div>
    <el-table
      v-loading="listLoading"
      :key="nodeTable"
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
        label="节点名称"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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
        label="通道"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        align="center"
        width="300"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
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
            prop="hostId"
            style="width: 100%;"
            @change="getChannels(temp.hostId)"
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
          label="通道"
          prop="channelId"
        >
          <el-select
            v-model="temp.channelId"
            placeholder="请选择"
            prop="channelId"
            style="width: 100%;"
          >
            <el-option
              v-for="item in allChannels"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
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
        <el-form-item
          label="光纤距离"
          prop="fiberDistance"
        >
          <el-input v-model="temp.fiberDistance" />
        </el-form-item>
        <el-form-item
          label="地理距离"
          prop="geoDistance"
        >
          <el-input v-model="temp.geoDistance" />
        </el-form-item>
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
    <!--坐标选取-->
    <!-- <el-dialog :visible.sync="dialogVisible" title="选择坐标">
      <el-row>
        <div class="amap-page-container">
          <el-amap :zoom="zoom" :center="center" :events="events" vid="vamap" />
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        当前坐标: {{ lng }}, {{ lat }} {{ currentAddress }}
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="coordinateSubmit">确 定</el-button>
      </div>
    </el-dialog> -->
    <!--详情信息-->
    <el-dialog
      :visible.sync="dialogInfoVisible"
      title="详细信息"
    >
      <span>节点名称: {{ temp.name }}</span>
      <br />
      <br />
      <span>所处经纬: {{ temp.longitude }}, {{ temp.latitude }}</span>
      <br />
      <br />
      <span>具体地址: {{ temp.address }}</span>
      <br />
      <br />
      <span>报警距离: {{ temp.alarmDistance }}</span>
      <br />
      <br />
      <span>实际距离: {{ temp.distance }}</span>
      <br />
      <br />
      <span>创建时间: {{ temp.createTime | formatDate }}</span>
      <br />
      <br />
      <span>最后更新时间: {{ temp.updateTime | formatDate }}</span>
      <br />
      <br />
    </el-dialog>
    <el-dialog
      :visible.sync="dialogExportVisible"
      title="导出方式"
      width="30%"
    >
      <div>
        <el-button
          type="primary"
          @click="exportExcels"
        >导出execl</el-button>
        <!--<el-button type="primary" @click="exportPdfs">导出pdf</el-button>-->
      </div>
    </el-dialog>
    <!-- 节点删除模态框 -->
    <el-dialog
      :visible.sync="deleteDialogVisible"
      title="删除警告"
      style="width:50%;margin:0 auto"
      class="deleteInfo"
    >
      <div>
        <div style="display:flex;align-items:center">
          <i
            class="el-icon-warning-outline"
            style="font-size:30px;color:#e6a23c;margin-right:20px"
          ></i>
          <div>
            <h4 style="font-size:16px">删除此节点将会删除该节点数据的关联记录</h4>
            <p style="font-size:16px">是否确认删除</p>
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
import { exportPdf,exportExcel,findListchannel,fetchList,fetchDict,fetchProvince,fetchCity,fetchCounty,fetchHost,fetchAllChannel,fetchAllHost,createNode,updateNode,deleteNode,search,findNodeData } from '@/api/router/node'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'
import { getRoleType } from '@/utils/auth'
import VueAMap from 'vue-amap'
import mapTake from "@/components/MapTake"
import { findList } from '@/api/router/channel'

export default {
  name: 'Node',
  directives: {
    waves
  },
  filters: {
    formatDate(time) {
      if(time==null) return ''
      const date=new Date(time)
      return formatDate(date,'yyyy-MM-dd hh:mm')
    }
  },
  data() {
    const self=this
    const validateLongitude=(rules,value,callback) => {
      if(/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(value)) {
        if(/((^[-]?[0-9])|(^[-]?[2-9]([0-9])?)|(^[-]?[1](([0-7])?)(([0-9])?)))(([.]\d{1,})?)$/.test(value)) {
          callback()
        } else {
          callback(new Error("经度在-180~180之间"))
        }
      } else {
        callback(new Error("输入数字"))
      }
    }
    const validateLatitude=(rules,value,callback) => {
      if(/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(value)) {
        if(/((^[-]?[0-9])|(^[-]?[1-8]([0-9])?))(([.]\d{1,})?)$/.test(value)) {
          callback()
        } else {
          callback(new Error("纬度在-90~90之间"))
        }
      } else {
        callback(new Error("输入数字"))
      }
    }
    const validateAlarmDistance=(rules,value,callback) => {
      if(/^[1-9]\d*$/.test(value)) {
        callback();
      } else {
        callback(new Error("输入正整数"))
      }
    }
    const validateDistance=(rules,value,callback) => {
      if(/^[1-9]\d*$/.test(value)) {
        callback();
      } else {
        callback(new Error("输入正整数"))
      }
    }
    return {
      dialogExportVisible: false,
      hosts: [],
      editData: false,
      nodeTable: 0,
      list: [],
      total: 0,
      listLoading: true,
      channels: null,
      allChannels: [],
      allHosts: null,
      roleType: getRoleType(),
      provinces: null,
      cities: null,
      counties: null,
      listQuery: {
        page: 1,
        limit: 10,
        content: '',
        hostId: '',
        channelId: ''
      },
      queryChannel: {
        hostId: ''
      },
      typeOptions: null,
      temp: {
        id: undefined,
        name: '',
        isEnable: '1',
        latitude: undefined,
        longitude: undefined,
        fiberDistance: undefined,
        geoDistance: undefined,
        provinceCode: undefined,
        cityCode: undefined,
        countyCode: undefined,
        address: '',
        channelId: '',
        hostId: '',
        createTime: null,
        updateTime: null
      },
      dialogFormVisible: false,
      dialogInfoVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true,message: '名称不能为空',trigger: 'blur' }],
        hostId: [{ required: true,message: '主机为不能为空',trigger: 'change' }],
        channelId: [{ required: true,message: '通道不能为空',trigger: 'change' }],
        latitude: [{ required: true,message: '纬度不能为空',trigger: 'blur' },{ validator: validateLatitude,trigger: 'blur' }],
        longitude: [{ required: true,message: '经度不能为空',trigger: 'blur' },{ validator: validateLongitude,trigger: 'blur' }],
        fiberDistance: [{ required: true,message: '报警距离不能为空',trigger: 'blur' },{ validator: validateAlarmDistance,trigger: 'blur' }],
        geoDistance: [{ required: true,message: '实际距离不能为空',trigger: 'blur' },{ validator: validateDistance,trigger: 'blur' }]
      },
      zoom: 15,
      center: [113.31609,23.04072],
      lng: 0,
      lat: 0,
      currentAddress: '',
      dialogVisible: false,
      events: {
        click(e) {
          const { lng,lat }=e.lnglat
          self.lng=lng
          self.lat=lat
          // 这里通过高德 SDK 完成。
          var geocoder=new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([lng,lat],function(status,result) {
            if(status==='complete'&&result.info==='OK') {
              if(result&&result.regeocode) {
                self.currentAddress=result.regeocode.formattedAddress
                self.$nextTick()
              }
            }
          })
        }
      },
      deleteDialogVisible: false,
      nodeId: ""
    }
  },
  created() {
    this.fetchList()
    this.fetchProvince()
    this.findLists()
    // this.fetchAllHost()
    // this.getDict()
  },
  methods: {
    exportExcels() {
      if(this.list.length>0) {
        exportExcel().then(res => {
          let blob=new Blob([res.data],{
            type: "application/vnd.ms-excel"
          }); // 2.获取请求返回的response对象中的blob 设置文件类型，这里以excel为例
          let url=window.URL.createObjectURL(blob); // 3.创建一个临时的url指向blob对象
          // 4.创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
          let a=document.createElement("a");
          a.href=url;
          a.download="节点数据表格.xls";
          a.click();
          // 5.释放这个临时的对象url
          window.URL.revokeObjectURL(url);
        })
      } else {
        this.$message({
          type: "info",
          message: "没有数据"
        })
      }
      this.dialogExportVisible=false
    },
    exportPdfs() {

    },
    handleExport() {
      this.dialogExportVisible=true
    },
    handleImport() {

    },
    findLists() {
      findList().then(res => {
        if(res.data.code==200) {
          this.hosts=res.data.data
        }
      })
    },
    fetchList() {
      this.listLoading=true
      fetchList(this.listQuery).then(response => {
        if(response.data.code==200) {
          this.list=response.data.data.records
          this.total=parseInt(response.data.data.total)
          this.listLoading=false
        }
      })
    },
    fetchProvince() {
      fetchProvince().then(response => {
        this.provinces=response.data.data
      })
    },
    fetchCity() {
      this.temp.cityCode=''
      this.temp.countyCode=''
      fetchCity(this.temp.provinceCode).then(response => {
        this.cities=response.data.data
      })
      fetchCounty(this.temp.cityCode).then(response => {
        this.counties=response.data.data
      })
    },
    fetchCounty() {
      this.temp.countyCode=''
      fetchCounty(this.temp.cityCode).then(response => {
        this.counties=response.data.data
      })
    },
    fetchAllHost() {
      fetchAllHost().then(response => {
        this.allHosts=response.data.data
      })
    },
    handlerSearch() {
      this.listLoading=true
      this.listQuery.page=1
      this.fetchList()
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
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.listQuery.page=val
      this.fetchList()
    },
    resetTemp() {
      this.temp={
        id: undefined,
        name: '',
        isEnable: '1',
        latitude: undefined,
        longitude: undefined,
        fiberDistance: undefined,
        geoDistance: undefined,
        provinceCode: undefined,
        cityCode: undefined,
        countyCode: undefined,
        address: '',
        channelId: '',
        hostId: '',
        createTime: null,
        updateTime: null
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
          delete this.temp.createTime;
          delete this.temp.updateTime;
          createNode(this.temp).then(response => {
            if(response.data.code==200) {
              this.fetchList()
              this.dialogFormVisible=false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '创建失败,'+response.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    getChannels(id) {
      this.listQuery.channelId=''
      this.temp.channelId=''
      findListchannel(id).then(response => {
        if(response.data.code==200) {
          this.allChannels=response.data.data
        }
      })
    },
    async handleUpdate(row) {
      this.temp=Object.assign({},row) // copy obj
      this.getChannels(this.temp.hostId);
      this.temp.channelId=row.channelId
      if(this.temp.provinceCode!=null) {
        const city=await fetchCity(this.temp.provinceCode);
        if(city.data.code==200) {
          this.cities=city.data.data;
        }
      }
      if(this.temp.cityCode!=null) {
        const county=await fetchCounty(this.temp.cityCode);
        if(county.data.code==200) {
          this.counties=county.data.data
        }
      }
      this.dialogStatus='update'
      this.dialogFormVisible=true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        delete this.temp.createTime;
        delete this.temp.updateTime;
        if(valid) {
          updateNode(this.temp).then(response => {
            if(response.data.code==200) {
              this.fetchList()
              this.dialogFormVisible=false
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '更新失败,'+response.data.msg,
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
      this.deleteDialogVisible=true;
      this.nodeId=row.id;
    },
    // 确认删除
    async dalectConfirm() {
      let res=await deleteNode(this.nodeId);
      if(res.data.code==200) {
        this.deleteDialogVisible=false;
        this.fetchList()
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
    // handleLngLat() {
    //   this.lng = ''
    //   this.lat = ''
    //   this.currentAddress = ''
    //   this.dialogVisible = true
    // },
    // coordinateSubmit() {
    //   this.temp.longitude = this.lng
    //   this.temp.latitude = this.lat
    //   this.temp.address = this.currentAddress
    //   this.dialogVisible = false
    //   this.lng = ''
    //   this.lat = ''
    //   this.currentAddress = ''
    // },
    setLongitudeLatitude(longitude,latitude,currentAddress) {
      this.temp.longitude=longitude;
      this.temp.latitude=latitude;
      this.temp.address=currentAddress;
    },
    // 修改经纬度
    setLongitude(longitude) {
      this.temp.longitude=longitude;
    },
    setLatitude(latitude) {
      this.temp.latitude=latitude;
    },
  },
  components: {
    mapTake
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

<style  scoped>
.el-dialog__wrapper /deep/ .el-dialog__body {
  padding: 0px 20px 30px 20px !important;
}
</style>
