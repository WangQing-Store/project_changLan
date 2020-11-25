<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.content"
        style="width: 300px;"
        class="filter-item"
        placeholder="用户名关键词"
      />

      <el-select
        v-model="listQuery.roleId"
        placeholder="角色"
        clearable
        class="filter-item"
        style="width: 230px"
        @click.native="searchRoles"
      >
        <el-option
          v-for="item in roleArr"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          :disabled="item.disabled"
        />
      </el-select>
      <el-select
        v-model="listQuery.unitId"
        placeholder="单位"
        clearable
        class="filter-item"
        style="width: 230px"
        @click.native="getUnits"
        @clear="clearUnitId"
      >
        <el-option v-for="item in getUnitArr" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
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
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" align="center" width="100">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="用户名" align="center" width="100">
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
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unitName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.sysUser.isEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="scope.row.type == 'ADMIN'"
            @change="updateEnables(scope.row.sysUser.id,scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div style="display: flex;justify-content: space-evenly;">
            <div style="margin-bottom: 10px">
              <el-button @click="getInfo(scope.row)">详情</el-button>
            </div>
            <div style="margin-bottom: 10px">
              <el-button type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
            </div>
            <div style="margin-bottom: 10px">
              <el-button type="danger" @click="resetPass(scope.row)">重置密码</el-button>
            </div>
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

      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        v-if="textMap[dialogStatus]=='创建'"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="80px"
          style="width: 60%;margin: 0 auto"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="temp.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="temp.password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="temp.checkPass" />
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select
              v-model="temp.roleId"
              placeholder="角色"
              style="width: 100%"
              @click.native="searchRoles"
            >
              <el-option
                v-for="item in roleArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="unitId">
            <div slot="label" style="margin-left:10px;">单位</div>
            <el-select
              v-model="temp.unitId"
              placeholder="单位"
              style="width: 100%"
              @click.native="getUnits"
              :disabled="$store.state.user.isUnitId"
            >
              <el-option
                v-for="item in getUnitArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item prop="email">
            <div slot="label" style="margin-left:10px">邮箱</div>
            <el-input v-model="temp.email" />
          </el-form-item>
          <el-form-item prop="phone">
            <div slot="label" style="margin-left:10px;">联系方式</div>
            <el-input v-model="temp.phone" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createData">提交</el-button>
        </div>
      </el-dialog>

      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="updateFormVisible"
        :close-on-click-modal="false"
        v-if="textMap[dialogStatus]=='编辑'"
      >
        <el-form
          ref="dataForm"
          :rules="updateRule"
          :model="temp"
          label-position="left"
          label-width="80px"
          style="width: 60%;margin: 0 auto"
        >
          <!--     <el-form-item label="用户名" prop="username">
            <el-input v-model="temp.username"/>
          </el-form-item>-->
          <el-form-item label="角色" prop="roleId">
            <el-select
              v-model="temp.roleId"
              placeholder="角色"
              style="width: 100%"
              @click.native="searchRoles"
            >
              <el-option
                v-for="item in roleArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="unitId">
            <div slot="label" style="margin-left:10px;">单位</div>
            <el-select
              v-model="temp.unitId"
              clearable
              placeholder="单位"
              style="width: 100%"
              @click.native="getUnits"
              @clear="clearUnitId"
              :disabled="$store.state.user.isUnitId"
            >
              <el-option
                v-for="item in getUnitArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item prop="email">
            <div slot="label" style="margin-left:10px">邮箱</div>
            <el-input v-model="temp.email" />
          </el-form-item>
          <el-form-item prop="phone">
            <div slot="label" style="margin-left:10px;">联系方式</div>
            <el-input v-model="temp.phone" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateData">提交</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogInfoVisible" title="详情">
        <span>邮箱:{{ temp.email }}</span>
        <br />
        <br />
        <span>电话:{{ temp.phone }}</span>
        <br />
        <br />
        <span>更改时间:{{ temp.updateTime | formatDate }}</span>
        <br />
        <br />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getUnit, fetchListUser, getEnableRoles, updateEnable, createUser, checkRepeat, resetPassword, updateUser } from '@/api/system/account'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'
import md5 from 'js-md5'
export default {
  name: 'User',
  directives: {
    waves
  },
  filters: {
    formatDate(time) {
      if (time == null) return ''
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.temp.checkPass !== '') {
          this.$refs.dataForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === undefined) {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var repeatName = (rule, value, callback) => {
      // this.checkRepeats(value)
      if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
        checkRepeat(value).then(res => {
          if (res.data.code == 500) {
            callback(new Error('用户名重复，请重新输入'));
          } else {
            callback()
          }
        })
      } else {
        callback(new Error("用户名仅支持英文和数字且开头为英文"))
      }
    }
    var validateType = (rules, value, callback) => {
      if (!value) {
        callback(new Error("角色为空"))
      } else {
        callback()
      }
    }
    const validateEmail = (rules, value, callback) => {
      if (value === "") {
        callback()
      } else {
        if (/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)) {
          callback()
        } else {
          callback(new Error("邮箱格式不正确"))
        }
      }
    }
    return {
      getUnitArr: [],
      roleQuery: {
        content: '',
        limit: 10,
        page: 1
      },
      roleArr: [],
      unitArr: [],
      accountTable: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        content: '',
        roleId: '',
        unitId: ''
      },
      temp: {
        username: '',
        password: '',
        name: '',
        email: '',
        mobile: '',
        phone: '',
        isEnable: '',
        unitId: '',
        roleId: '',
        createTime: '',
        updateTime: ''
      },
      reset: {
        id: '',
        password: ''
      },
      units: [],
      roles: [],
      dialogFormVisible: false,
      dialogInfoVisible: false,
      updateFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      roleVal: '',
      pvData: [],
      check: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: repeatName, trigger: 'blur', required: true },
          { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' },
          /*{ pattern: /^[a-zA-Z]\w{4,19}$/, message: '字母开头，长度在 3 到 18 个字符' },*/
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入特殊符号' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur', required: true },
          { min: 8, message: '长度至少要8个字符' },
          { pattern: /^(?=.*[a-z\d])(?=.*[a-z!@#$%^&*])(?=.*[!@#$%^&*\d]).{8,}$/gi, message: '密码至少选择数字,字母,特殊符号两种规则' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        roleId: [
          { validator: validateType, trigger: 'change', required: true }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }]
      },
      updateRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        roleId: [
          { validator: validateType, trigger: 'change', required: true }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }]
      },
      isCreateStatus: true
    }
  },
  created() {
    this.getList()
    this.searchRoles()
    this.getUnits()
  },
  mounted() {

  },
  methods: {
    getUnits() {
      getUnit().then(res => {
        if (res.data.code == 200) {
          this.getUnitArr = res.data.data
        }
      })
    },
    searchRoles() {
      getEnableRoles().then(res => {
        if (res.data.code == 200) {
          this.roleArr = res.data.data;
          for (let item of this.roleArr) {
            if (item.isEnable == false) {
              item.disabled = true;
            }
          }
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchListUser(this.listQuery).then(response => {
        if (response.data.code == 200) {
          this.list = response.data.data.records
          this.total = response.data.data.total
          this.listLoading = false
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
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row.sysRole, row.sysUser) // copy obj
      this.roleVal = this.temp.type
      this.dialogStatus = 'update'
      this.updateFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    fetchUnit() {
      getUnit(this.listQuery).then(response => {
        this.units = response.data.data.list
      })
    },
    fetchRole() {
      getRole().then(response => {
        this.roles = response.data.data
      })
    },
    checkRepeats(val) {
      checkRepeat(val).then(response => {
        if (response.data.code == 200) {
          this.check = false
        } else {
          this.check = true
        }
      })
    },
    getInfo(row) {
      this.temp = Object.assign({}, row.sysUser) // copy obj
      this.dialogInfoVisible = true
    },
    handleCreate() {
      this.resetTemp()
      if (this.$store.state.user.isUnitId) {
        if (this.getUnitArr.length > 0) {
          this.temp.unitId = this.getUnitArr[0].id;
        }
      }
      // this.temp = this.$options.data().temp;
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
        // this.$refs["dataForm"].resetFields();
      })
    },
    resetPass(row) {
      this.$confirm('重置密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(row.sysUser.id).then(response => {
          if (response.data.code = 200) {
            this.$notify({
              title: '成功',
              message: '密码已重置',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '成功',
              message: '已经关闭',
              type: 'error',
              duration: 2000
            })
          }
        })
      }).catch(() => {

      })
    },
    resetTemp() {
      this.temp = {
        username: '',
        password: '',
        name: '',
        email: '',
        mobile: '',
        phone: '',
        isEnable: true,
        unitId: '',
        type: '',
      }
    },
    clearUnitId() {
      this.temp.unitId = null;
    },
    handlerSearch() {
      this.listLoading = true
      this.listQuery.page = 1
      fetchListUser(this.listQuery).then(response => {
        this.list = response.data.data.records
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    updateEnables(id, row) {
      if (row.sysUser.isEnable) {
        updateEnable(id).then(response => {
          if (response.data.code == 200) {
            this.$notify({
              title: '成功',
              message: '已经启用',
              type: 'success',
              duration: 2000
            })
          }
        })
      } else {
        updateEnable(id).then(response => {
          if (response.data.code == 200) {
            this.$notify({
              title: '成功',
              message: '已经关闭',
              type: 'error',
              duration: 2000
            })
          }
        })
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.password = md5(this.temp.password);
          if (this.isCreateStatus) {
            this.isCreateStatus = false;
            createUser(this.temp).then(response => {
              if (response.data.code == 200) {
                this.getList()
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.isCreateStatus = true;
              } else {
                this.$notify({
                  title: '失败',
                  message: '创建失败,' + response.data.msg,
                  type: 'error',
                  duration: 2000
                });
                this.isCreateStatus = true;
              }
            })
          }
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        delete this.temp.createTime;
        delete this.temp.updateTime;
        delete this.temp.updatePwdTime;
        delete this.temp.loginFailTime;
        if (valid) {
          if (this.roleVal == this.temp.type) {
            this.temp.type = 0
          }
          updateUser(this.temp).then(response => {
            if (response.data.code == 200) {
              if (response.data.data.id === this.$store.state.user.userId) {
                if (response.data.data.unitId !== null) {
                  this.$store.commit("SET_ISUNITID", true)
                } else {
                  this.$store.commit("SET_ISUNITID", false)
                }
              }
              this.getList()
              this.updateFormVisible = false
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
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
