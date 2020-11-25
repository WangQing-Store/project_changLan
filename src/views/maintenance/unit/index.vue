<template>
  <div>
    <!-- 非联保单位 -->
    <div v-if="!$store.state.user.isUnitId" class="app-container">
      <div class="filter-container">
        <el-input
          v-model="listQuery.content"
          placeholder="单位名称或地址关键字"
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
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >添加</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :key="unitTable"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" align="center" width="80">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="单位名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.principal }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="showInfo(scope.row)">节点</el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
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
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="100px"
          style="width: 70%;margin: 0 auto"
        >
          <el-form-item label="单位名称" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item label="负责人" prop="principal">
            <el-input v-model="temp.principal" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="temp.phone" />
          </el-form-item>
          <el-form-item>
            <div slot="label" style="margin-left:10px;">地区</div>
            <el-col :span="7">
              <el-select
                v-model="temp.provinceCode"
                placeholder="省份"
                filterable
                clearable
                @change="fetchCity"
                @clear="clearProvince"
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
                @clear="clearCity"
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
                @clear="clearCounty"
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
            <div slot="label" style="margin-left:10px;">地 址</div>
            <el-input v-model="temp.address" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
          <el-button v-else type="primary" @click="updateData">提交</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogInfoVisible" title="节点权限" :close-on-click-modal="false">
        <el-tree
          ref="tree"
          :default-expand-all="true"
          show-checkbox
          node-key="id"
          check-on-click-node
          :data="treeData"
          :props="defaultProps"
          :default-checked-keys="checkedList"
          :expand-on-click-node="false"
        ></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogInfoVisible = false">取消</el-button>
          <el-button type="primary" @click="submitTree">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 联保单位 -->
    <div v-if="$store.state.user.isUnitId">
      <el-card>
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="100px"
          style="padding: 20px;width: 60%;margin: 0 auto;"
        >
          <el-form-item label="单位名称" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item label="负责人" prop="principal">
            <el-input v-model="temp.principal" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="temp.phone" />
          </el-form-item>
          <el-form-item label="地区">
            <div slot="label" style="margin-left:10px;">地区</div>
            <el-col :span="7">
              <el-select
                v-model="temp.provinceCode"
                placeholder="省份"
                filterable
                clearable
                @change="fetchCity"
                @clear="clearProvince"
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
                @clear="clearCity"
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
                @clear="clearCounty"
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
            <div slot="label" style="margin-left:10px;">地 址</div>
            <el-input v-model="temp.address" />
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button type="primary" style="width:100px" @click="updateData">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { setDataunitNode, findHostNode, fetchList, fetchProvince, fetchCity, fetchCounty, createUnit, updateUnit, deleteUnit, search } from '@/api/maintenance/unit'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'
import { getRoleType } from '@/utils/auth'
import { getToken } from '../../../utils/auth'
import qs from 'qs'

export default {
  name: 'Unit',
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
      submitTreeArr: {
        addList: [],
        delList: [],
        unitId: []
      },
      checkedList: [],
      defaultProps: {
        children: "nodeList",
        label: "name"
      },
      treeData: [],
      editData: false,
      unitTable: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        content: ''
      },
      roleType: getRoleType(),
      provinces: null,
      cities: null,
      counties: null,
      temp: {
        id: undefined,
        name: '',
        address: '',
        principal: '',
        phone: '',
        privinceCode: undefined,
        cityCode: undefined,
        countyCode: undefined,
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
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        principal: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.fetchList()
    this.fetchProvince()
  },
  methods: {
    submitTree() {
      var data = this.$refs.tree.getCheckedNodes();
      //先把勾选的权限转成id数组里面
      let arrId = []
      for (let item of data) {
        arrId.push(item.id)
      }
      this.submitTreeArr.addList = arrId.filter(item => !this.checkedList.some(e => e === item))//添加的数组
      this.submitTreeArr.delList = this.checkedList.filter(item => !arrId.some(e => e === item))//删除的数组
      // console.log(this.submitTreeArr)
      // setDataunitNode(this.submitTreeArr).then(res=>{
      //   console.log(res.data)
      // })
      this.$axios.defaults.headers.common['Authorization'] = getToken();
      this.$axios.post('/unitNode/setData', qs.stringify(this.submitTreeArr))
        .then(res => {
          if (200 == res.data.code) {
            this.$message({
              type: 'success',
              message: '编辑成功',
            });
            this.dialogInfoVisible = false;
          }
        })
    },
    fetchList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        if (response.data.code == 200) {
          if (this.$store.state.user.isUnitId) {
            this.temp = response.data.data.records[0];
            fetchCity(this.temp.provinceCode).then(response => {
              this.cities = response.data.data
            });
            fetchCounty(this.temp.cityCode).then(response => {
              this.counties = response.data.data
            });
          }
          this.list = response.data.data.records;
          this.total = response.data.data.total;
          this.listLoading = false;
        }
      })
    },
    fetchProvince() {
      fetchProvince().then(response => {
        this.provinces = response.data.data
      })
    },
    clearProvince() {
      this.temp.cityCode = "";
      this.temp.countyCode = '';
      this.temp.privinceCode = "";
    },
    clearCity() {
      this.temp.cityCode = "";
      this.temp.countyCode = "";
    },
    clearCounty() {
      this.temp.countyCode = "";
    },
    fetchCity() {
      this.temp.cityCode = "";
      this.temp.countyCode = "";
      fetchCity(this.temp.provinceCode).then(response => {
        this.cities = response.data.data
      })
      fetchCounty(this.temp.cityCode).then(response => {
        this.counties = response.data.data
      })
    },
    fetchCounty() {
      this.temp.countyCode = "";
      fetchCounty(this.temp.cityCode).then(response => {
        this.counties = response.data.data
      })
    },
    handlerSearch() {
      this.listLoading = true
      this.listQuery.page = 1
      fetchList(this.listQuery).then(response => {
        if (response.data.code == 200) {
          this.list = response.data.data.records;
          this.total = response.data.data.total;
          this.listLoading = false;
        }
      })
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
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        address: '',
        principal: '',
        phone: '',
        privinceCode: undefined,
        cityCode: undefined,
        countyCode: undefined,
        createTime: null,
        updateTime: null
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
          delete this.temp.createTime;
          delete this.temp.updateTime;
          createUnit(this.temp).then(response => {
            if (response.data.code == 200) {
              this.fetchList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '创建失败,' + response.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      fetchCity(this.temp.provinceCode).then(response => {
        this.cities = response.data.data
      })
      fetchCounty(this.temp.cityCode).then(response => {
        this.counties = response.data.data
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        delete this.temp.createTime;
        delete this.temp.updateTime;
        if (valid) {
          updateUnit(this.temp).then(response => {
            if (response.data.code == 200) {
              this.fetchList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '编辑成功',
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
    deleteData(row) {
      this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUnit(row.id).then((res) => {
          if (res.data.code == 200) {
            this.fetchList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }

        })
      }).catch(err => { })
    },
    showInfo(row) {
      this.checkedList = [];
      this.submitTreeArr.unitId = row.id
      // this.temp = Object.assign({}, row) // copy obj
      this.dialogInfoVisible = true
      findHostNode(row.id).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data)
          this.treeData = res.data.data;
          for (let item of this.treeData) {
            if (item.nodeList !== null && item.nodeList.length !== 0) {
              for (let itemchr of item.nodeList) {
                if (itemchr.disable == true) {
                  this.checkedList.push(itemchr.id)
                }
              }
            };
            if (item.nodeList == null || item.nodeList.length == 0 ) {
              item.disabled = true
            };
          }
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.checkedList);
          });
        }
      })
    }
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
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
