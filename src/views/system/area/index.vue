<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <tree-table v-loading="listLoading" :data="list" :key="areaTree" :expand-all="expandAll" border>
      <el-table-column label="区域" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地区" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province | region }} {{ scope.row.city | region }} {{ scope.row.county | region }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width:600px;margin-left:50px;">

        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="上级区域" prop="parent">
          <div class="block">
            <el-cascader
              v-model="temp.parent"
              :options="areaOptions"
              expand-trigger="hover"
              placeholder="地区"
              clearable="true"
              filterable
              change-on-select
              style="width: 100%;"
            />
          </div>
        </el-form-item>
        <el-form-item label="地区">
          <el-col :span="7">
            <el-select v-model="temp.province" placeholder="省份" filterable clearable @change="fetchCity">
              <el-option
                v-for="item in provinces"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="7">
            <el-select v-model="temp.city" placeholder="市" filterable clearable @change="fetchCounty">
              <el-option
                v-for="item in cities"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="8">
            <el-select v-model="temp.county" filterable placeholder="区/县" clearable >
              <el-option
                v-for="item in counties"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address"/>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="temp.longitude"/>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="temp.latitude"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
        <el-button v-else type="primary" @click="updateData">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchRegion, fetchAreaOptions, createArea, deleteArea, updateArea } from '@/api/system/area'
import waves from '@/directive/waves'
import treeTable from '@/components/TreeTable'
import { formatDate } from '@/utils'

export default {
  name: 'Area',
  components: { treeTable },
  directives: {
    waves
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    region(value) {
      return value == null ? '' : value.name
    }
  },
  data() {
    return {
      areaTree: 0,
      listLoading: true,
      expandAll: true,
      list: null,
      provinces: null,
      cities: null,
      counties: null,
      areaOptions: null,
      region: {
        level: 0,
        parent: 0
      },
      temp: {
        id: undefined,
        no: '',
        name: '',
        parent: [],
        latitude: undefined,
        longitude: undefined,
        province: undefined,
        city: undefined,
        county: undefined,
        address: ''
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
        name: [{ required: true, message: '区域名称不能为空', trigger: 'blur' }],
        region: [{ required: true, message: '地区不能为空', trigger: 'change' }],
        latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
        longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchProvince()
    this.getList()
    this.getAreaOptions()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    fetchProvince() {
      fetchRegion(this.region).then(response => {
        this.provinces = response.data
      })
    },
    fetchCity() {
      this.region.parent = this.temp.province
      this.region.level = 1
      fetchRegion(this.region).then(response => {
        this.cities = response.data
      })
    },
    fetchCounty() {
      this.region.parent = this.temp.city
      this.region.level = 2
      fetchRegion(this.region).then(response => {
        this.counties = response.data
      })
    },
    getAreaOptions() {
      fetchAreaOptions().then(response => {
        this.areaOptions = response.data
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        no: '',
        name: '',
        parent: [],
        latitude: undefined,
        longitude: undefined,
        province: undefined,
        city: undefined,
        county: undefined,
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
          createArea(this.temp).then(() => {
            this.getList()
            this.getAreaOptions()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
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
        deleteArea(row.no).then(response => {
          if (response.data.success) {
            this.getList()
            this.getAreaOptions()
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '编辑失败,' + response.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.province = row.province != null ? row.province.id : undefined
      if (row.city != null) {
        this.region.parent = this.temp.province
        this.region.level = 1
        fetchRegion(this.region).then(response => {
          this.cities = response.data
          this.temp.city = row.city.id
          if (row.county != null) {
            this.fetchCounty()
            this.temp.county = row.county.id
          }
        })
      }
      this.temp.parent = []
      if (row.parent != null) {
        this.temp.parent.push(row.parent)
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateArea(this.temp).then(response => {
            if (response.data.success) {
              this.getList()
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
    }
  }
}
</script>
