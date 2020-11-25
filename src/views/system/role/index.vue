<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.content"
        style="width: 300px;"
        placeholder="角色名称关键字"
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
      :key="roleTable"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <!--      <el-table-column label="类型" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.sysRole.type }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center">
        <template slot-scope="scope">
          <!--          <span v-if="scope.row.sysUser == null"></span>-->
          <span>{{scope.row.createName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateEnable(scope.row.id,scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleModule(scope.row)">权限</el-button>
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
        label-width="70px"
        style="width: 60%;margin: 0 auto"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" />
        </el-form-item>
        <el-form-item label="是否启用" prop="describe">
          <el-switch
            v-model="temp.isEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
        <el-button v-else type="primary" @click="updateData">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" @close="closeDialog" :close-on-click-modal="false">
      <el-tree
        ref="tree"
        :default-expand-all="true"
        show-checkbox
        node-key="id"
        check-on-click-node
        :data="treeDate"
        :props="defaultProps"
        :default-checked-keys="checkedList"
        :expand-on-click-node="false"
        @node-click="nodeClick"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitData">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createRole,
  updateRole,
  deleteRole,
  search,
  fetchModule,
  fetchTree,
  updateEnable,
  addDelModule,
  getRoleModule,
  getAllModule,
  addRole,
  sysRoleIsEnable
} from "@/api/system/role";
import { getToken } from '../../../utils/auth'
import waves from "@/directive/waves";
import { formatDate } from "@/utils";
import { mapActions } from 'vuex'
import qs from 'qs'
const calendarCodeOptions = [
  { key: "ADMIN", display_name: "超级管理员" },
  { key: "MANAGER", display_name: "管理人员" },
  { key: "WORKER", display_name: "工作人员" }
];
export default {
  // inject:['reload'],
  name: "Role",
  directives: {
    waves
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  data() {
    return {
      checkedList: [],
      treeDate: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      dialogVisible: false,
      module: [],
      roleTable: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        content: ""
      },
      calendarCodeOptions: calendarCodeOptions,
      statusOptions: [true, false],
      temp: {
        name: "",
        remark: "",
        isEnable: "0",
        createTime: "",
        updateTime: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改角色信息",
        create: "添加角色",
        module: "权限"
      },
      moduleQuery: {
        addList: [],
        deleteList: [],
        roleId: ""
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    ...mapActions({
      'GenerateRoutes': 'GenerateRoutes'
    }),
    clickDeal(currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中

      //当前节点不是编辑
      if (currentObj.name !== "编辑") {
        // 选中
        if (selected !== -1) {
          // 子节点只要被选中父节点就被选中
          this.selectedParent(currentObj);
          // 统一处理子节点为相同的勾选状态
          this.unitechildrename(currentObj, true);
        } else {
          // 子节点未选中
          if (currentObj.parentId != null) {
            this.selectedParent(currentObj);
          }

          // 未选中 处理子节点全部未选中
          if (currentObj.children.length > 0) {
            this.unitechildrename(currentObj, false);
          }
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    unitechildrename(treeList, isSelected) {
      if (treeList.name !== "编辑") {
        this.$refs.tree.setChecked(treeList.id, isSelected);
        var a = treeList.children.length;
        for (let i = 0; i < a; i++) {
          this.unitechildrename(treeList.children[i], isSelected);
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      if (currentObj.name !== "编辑") {
        let currentNode = this.$refs.tree.getNode(currentObj);
        //如果当前节点有父节点
        if (currentNode.parent.key !== undefined) {
          //自定义的一个标识符 默认是认为父节点的“所有子节点有其中一个为选中状态(如果有其中一个子节点选中，则父节点也要选中)”
          var falg = 0; // 0为选中  1为未选中
          //存放父节点的所有子节点的选中状态 0为选中  1为未选中
          var falgArr = [];
          //如果父节点的 子节点对象不为空
          if (currentNode.parent.childNodes.length > 0) {
            //遍历父节点的所有子节点 获取子节点选中状态 存到数组中
            for (let a in currentNode.parent.childNodes) {
              //打印子节点对象
              // console.log(currentNode.parent.childNodes[a]);
              //打印子节点是否选中
              // console.log(currentNode.parent.childNodes[a].checked);
              //每一个子节点的选中状态存到数组中 0为选中  1为未选中
              falgArr.push(
                currentNode.parent.childNodes[a].checked == true ? 0 : 1
              );
            }
          }
          //打印子节点的选中状态数组
          // console.log(falgArr);
          //判断是不是所有子节点都未选中(0为选中， 如果在数组中匹配不到0 则代表所有节点都未选中，所以父节点不选中)
          if (falgArr.indexOf(falg) == -1) {
            this.$refs.tree.setChecked(currentNode.parent, false);
            this.selectedParent(currentNode.parent);
          } else {
            //如果有其中之一为选中  那么父节点也要选中
            this.$refs.tree.setChecked(currentNode.parent, true);
            this.selectedParent(currentNode.parent);
          }
        }
      }
    },
    nodeClick(data, node) {
      this.childNodesChange(node);
      this.parentNodesChange(node);
    },
    //判断子节点方法
    childNodesChange(node) {
      //获取childNodes子节点长度 ---- 选中的当前节点下有几个子节点
      let len = node.childNodes.length;
      for (let i = 0; i < len; i++) {
        //当子节点为编辑时不对其做选中操作
        if (node.childNodes[i].data.name == "编辑") {
          node.childNodes[i].checked = false;
        } else {
          //当子节点不为编辑时对其做选中操作
          node.childNodes[i].checked = node.checked;
          this.childNodesChange(node.childNodes[i]);
        }
      }
    },
    //判断父节点方法
    parentNodesChange(node) {
      //如果当前节点不是编辑节点。则对其父节点做操作
      if (node.label != "编辑") {
        //如果当前节点有父节点
        if (node.parent) {
          //遍历node对象里面的所有KEY
          for (let key in node) {
            //node 节点里面的praent对象 也就是当前节点的父类对象
            if (key == "parent") {
              //自定义的一个标识符 默认是认为父节点的“所有子节点有其中一个为选中状态(如果有其中一个子节点选中，则父节点也要选中)”
              var falg = 0; // 0为选中  1为未选中
              //存放父节点的所有子节点的选中状态 0为选中  1为未选中
              var falgArr = [];
              //如果父节点的 子节点对象不为空
              if (node[key].childNodes.length > 0) {
                //遍历父节点的所有子节点 获取子节点选中状态 存到数组中
                for (let a in node[key].childNodes) {
                  //打印子节点对象
                  // console.log(node[key].childNodes[a]);
                  //打印子节点是否选中
                  // console.log(node[key].childNodes[a].checked);
                  //每一个子节点的选中状态存到数组中 0为选中  1为未选中
                  falgArr.push(node[key].childNodes[a].checked == true ? 0 : 1);
                }
              }
              //打印子节点的选中状态数组
              // console.log(falgArr);
              //判断是不是所有子节点都未选中(0为选中， 如果在数组中匹配不到0 则代表所有节点都未选中，所以父节点不选中)
              if (falgArr.indexOf(falg) == -1) {
                node[key].checked = false;
                this.parentNodesChange(node[key]);
              } else {
                //如果有其中之一为选中  那么父节点也要选中
                node[key].checked = true;
                this.parentNodesChange(node[key]);
              }
            }
          }
        }
      } else {
        //如果当前节点是编辑节点。则不对其父节点做任何操作
        console.log("选中的编辑不走父节点");
      }
    },

    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        // console.log(response.data.data.records)
        this.list = response.data.data.records;
        this.total = parseInt(response.data.data.total);
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
      this.listQuery.page = val;
      this.getList();
    },
    resetTemp() {
      // this.temp = {
      //   type: "",
      //   name: "",
      //   remark: "",
      //   isEnable: true
      // };
      this.temp = this.$options.data().temp;//初始化响应式对象
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      if (this.$store.state.user.isUnitId == false) {
        this.temp.isEnable = '0'
      } else {
        this.temp.isEnable = '1'
      }
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.temp.createTime = null
      this.temp.updateTime = null
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addRole(this.temp).then((response) => {
            this.getList();
            this.dialogFormVisible = false;
            // console.log(response)
            if (response.data.code == 200) {
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "失败",
                message: "创建失败",
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      // console.log(this.temp)
      if (this.temp.isEnable == false) {
        this.temp.isEnable = '0'
      } else {
        this.temp.isEnable = '1'
      }
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    closeDialog() {
      // location.reload();
      // this.$router.options.routes = this.GenerateRoutes();
      // this.$router.addRoutes(this.$router.options.routes);
      this.$refs.tree.setCheckedKeys([]);
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        this.temp.createTime = null;
        this.temp.updateTime = null;
        if (valid) {
          updateRole(this.temp).then(response => {
            if (response.data.code == 200) {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "编辑成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "",
                message: "更新失败",
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },
    updateEnable(id, row) {
      if (row.isEnable) {
        sysRoleIsEnable(id).then(response => {
          if (response.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "已启用",
              type: "success",
              duration: 2000
            });
          }
        });
      } else {
        sysRoleIsEnable(id).then(response => {
          if (response.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "已禁用",
              type: "success",
              duration: 2000
            });
          }
        });
      }

    },
    handlerSearch() {
      this.listLoading = true;
      this.listQuery.page = 1;
      search(this.listQuery).then(response => {
        this.list = response.data.data.records;
        this.total = response.data.data.total;
        this.listLoading = false;
      });
    },
    handleModule(row) {
      // console.log(row)
      this.role = row.id;
      this.moduleQuery.roleId = row.id
      getAllModule().then(response => {
        this.dialogStatus = "module";
        this.treeDate = response.data.data;
        this.dialogVisible = true;
        this.getModule(row);
      });
    },
    getModule(row) {
      getRoleModule(row.id).then(response => {
        this.checkedList = []
        this.module = response.data.data;
        if (this.module.length > 0) {
          for (let item of this.module) {
            this.checkedList.push(item.moduleId)
          }
        } else {
          this.checkedList = []
        }
        // console.log(this.checkedList)
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.checkedList);
        })
      });
    },
    submitData() {
      //存储所有具有编辑权限的节点ID
      // var edit = [];
      // //存储所有具有编辑权限的父节点ID
      // var editPid = [];
      // //树形菜单选中节点的结果集
      // var data = this.$refs.tree.getCheckedNodes();
      // //获取所有具有编辑权限的节点ID
      // for (let c = 0; c < data.length; c++) {
      //   if (data[c].name === "编辑") {
      //     edit.push(data[c].id);
      //   }
      // }
      // //获取所有具有编辑权限的父节点ID
      // for (let d = 0; d < data.length; d++) {
      //   //判断选中节点是否有children属性
      //   if (data[d].children.length > 0) {
      //     //接收children数组
      //     var dataChildren = [];
      //     dataChildren = data[d].children;
      //     //遍历children数组，判断ID是否存在于编辑权限节点ID数组中
      //     for (let e = 0; e < dataChildren.length; e++) {
      //       if (edit.indexOf(dataChildren[e].id) === -1) {
      //         continue;
      //       } else {
      //         if (editPid.indexOf(data[d].id) === -1) {
      //           editPid.push(data[d].id);
      //         }
      //       }
      //     }
      //   }
      // }
      // localStorage.setItem("editPidData", JSON.stringify(editPid));
      // var checked = [];
      // var cancel = [];
      // var addList = [];
      // var deleteList = [];
      // var module = this.module;
      // for (var i = 0; i < data.length; i++) {
      //   checked.push(data[i].id);
      // }
      // for (var k = 0; k < checked.length; k++) {
      //   if (module.indexOf(checked[k]) == -1) {
      //     addList.push(checked[k]);
      //   } else {
      //     cancel.push(checked[k]);
      //   }
      // }
      // for (var j = 0; j < module.length; j++) {
      //   if (cancel.indexOf(module[j]) == -1) {
      //     deleteList.push(module[j]);
      //   }
      // }
      // this.moduleQuery.addList = addList;
      // this.moduleQuery.deleteList = deleteList;
      // this.moduleQuery.role = this.role;
      // this.addModule();
      // this.$store.dispatch('GenerateRoutes',false)
      var data = this.$refs.tree.getCheckedNodes();
      //先把勾选的权限转成id数组里面
      let arrId = []
      for (let item of data) {
        arrId.push(item.id)
      }
      // console.log(arrId) arrId 是现在勾选好的id
      // console.log(this.checkedList) checkedList是一开始的id
      //es6 过滤
      // let a = [a, b, c, d, e];
      // let b = [c, d, f, g, h];
      // let result = b.filter(item => !a.some(e => e === item));
      //result: [f, g, h]
      this.moduleQuery.addList = arrId.filter(item => !this.checkedList.some(e => e === item))//添加的数组
      this.moduleQuery.delList = this.checkedList.filter(item => !arrId.some(e => e === item))//删除的数组
      this.addModule()
    },
    addModule() {
      // addDelModule(this.moduleQuery).then(response => {
      //   if (response.data.code == 200) {
      //     this.dialogVisible = false;
      //     this.$notify({
      //       title: "成功",
      //       message: "操作成功",
      //       type: "success",
      //       duration: 2000
      //     });
      //   } else {
      //     this.$notify({
      //       title: "失败",
      //       message: "操作失败," + response.data.msg,
      //       type: "error",
      //       duration: 2000
      //     });
      //   }
      // });
      this.$axios.defaults.headers.common['Authorization'] = getToken();
      this.$axios.post('/roleModule/adddel', qs.stringify(this.moduleQuery))
        .then(res => {
          if (200 == res.data.code) {
            this.$message({
              type: 'success',
              message: '编辑成功',
            });
            this.dialogVisible = false;
            this.getList()
          }
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tree-node__label {
  position: relative;
}
.el-tree-node__label:before {
  content: '';
  width: 20px;
  height: 20px;
  display: block;
  position: absolute;
  top: 0px;
  left: -24px;
  z-index: 999;
}
.el-checkbox__inner {
  top: 0;
}
</style>
