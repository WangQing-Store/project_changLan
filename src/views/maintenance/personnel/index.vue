<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.content" placeholder="用户名或名称" style="width: 300px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handlerSearch"/>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        v-if="editData"
        @click="handleCreate">添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="personnelTable"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUser.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUser.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sysRole.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUser.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width" width="400">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleUpdate(scope.row)">详情</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" :disabled="scope.row.sysRole.type == 'MANAGER'">编辑</el-button>
          <el-button type="warning" size="mini" @click="resetPass(scope.row)">重置密码</el-button>
          <el-button type="danger" size="mini" @click="deleteData(scope.row)" :disabled="scope.row.sysRole.type == 'MANAGER'">删除</el-button>
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
        @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 60%; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="确认密码" prop="confirmPwd">
          <el-input v-model="temp.confirmPwd"/>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="temp.roleId" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.remark"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="temp.mobile"/>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone"/>
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
import { fetchList, fetchRoles, createPersonnel, updatePersonnel, deletePersonnel, search, resetPass } from '@/api/maintenance/personnel'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'
import md5 from 'js-md5'

export default {
  name: 'Personnel',
  directives: {
    waves
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  data() {
    const validateIsEqual = (rule, value, callback) => {
      console.log(value)
      if (value === '' || value === null) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      editData:false,
      personnelTable: 0,
      list: null,
      total: null,
      listLoading: true,
      roles: null,
      listQuery: {
        page: 1,
        limit: 10,
        content: ''
      },
      temp: {
        id: undefined,
        username: '',
        password: '',
        confirmPwd: '',
        roleId: '',
        name: '',
        isEnable: true,
        email: '',
        mobile: '',
        phone: '',
        createTime: null,
        updateTime: null
      },
      reset: {
        id: undefined,
        password: ''
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
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        confirmPwd: [{ required: true, validator: validateIsEqual, trigger: 'blur' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        roleId: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchList()
    this.fetchRoles()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    fetchRoles() {
      fetchRoles().then(response => {
        this.roles = response.data.data
      })
    },
    handlerSearch() {
      this.listLoading = true
      this.listQuery.page = 1
      search(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        password: '',
        confirmPwd: '',
        roleId: '',
        name: '',
        isEnable: true,
        email: '',
        mobile: '',
        phone: '',
        createTime: null,
        updateTime: null
      }
    },
    resetPass(row){
      this.$confirm('重置密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reset.id = row.sysUser.id
        this,reset.password = md5('123456')
        resetPass(this.reset).then(response=>{
          if (response.data.msg = 'success') {
            this.$notify({
              title: '成功',
              message: '密码已重置',
              type: 'success',
              duration: 2000
            })
          }else {
            this.$notify({
              title: '失败',
              message: '重置失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      })
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
        this.temp.password = md5(this.temp.password)
        if (valid) {
          createPersonnel(this.temp, this.temp.roleId).then(response => {
            if (response.data.msg == 'success') {
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
      this.temp = Object.assign({}, row.sysUser) // copy obj
      this.temp.roleId = row.sysRole.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        this.temp.createTime = null
        this.temp.updateTime = null
        if (valid) {
          updatePersonnel(this.temp, this.temp.roleId).then(response => {
            if (response.data.msg == "success") {
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
        deletePersonnel(row.sysUser.id).then(() => {
          this.fetchList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    }
  },
  mounted () {
   var editPid =[];
   editPid =JSON.parse(localStorage.getItem("editPidData"));
   var pagesId=localStorage.getItem("pageId");
  //默认没有权限
  var flag = 1;
  for(let i =0 ; i < editPid.length ; i++){
      if(editPid[i] == pagesId){
          flag = 0;
      }
  }
  if (flag ==0) {
    //有权限
    this.editData=true;
  }else{
    this.editData=false;
  }
  }
}
</script>
