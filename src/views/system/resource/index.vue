<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.content" style="width: 300px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handlerSearch"/>
    </div>
    <el-table
      v-loading="listLoading"
      :key="resourceTable"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
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
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="maintenanceNode(scope.row)">节点</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" @close="closeDialog()">
      <el-tree
        ref="tree"
        show-checkbox="true"
        node-key="id"
        default-expand-all="true"
        :data="treeDate"
        :props="defaultProps"
        @node-click="handleNodeClick">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitData">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList,search,findByUnit,getHostNode,addDelUnitNode} from '@/api/system/resource'
  import waves from '@/directive/waves'

  export default {
    name: 'Resource',
    directives: {
      waves
    },
    data() {
      return {
        treeDate:[],
        defaultProps: {
          label: 'name',
          children: 'children',
          disabled:'disabled'
        },
        nodes:[],
        unitNode:{
          unitId:'',
          nodeId:''
        },
        resourceTable: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          content: ''
        },
        textMap: {
          node: '添加关联节点',
        },
        dialogVisible:false,
        dialogStatus: '',
        dialogPvVisible: false,
        nodeQuery:{
          addList:[],
          deleteList:[],
          unit:''
        }
      }
    },
    created() {
      this.fetchList()
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
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.fetchList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.fetchList()
      },
      handlerSearch(){
        this.listLoading = true
        this.listQuery.page = 1
        search(this.listQuery).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
      },
      closeDialog(){
        this.$refs.tree.setCheckedKeys([]);
      },
      maintenanceNode(row){
        this.dialogVisible = true
        this.dialogStatus = 'node'
        this.unitNode.unitId = row.id
        getHostNode(this.unitNode.unitId).then(response=>{
          this.treeDate = response.data.data
          for(var i = 0;i<this.treeDate.length;i++){
            this.treeDate[i].id = 0
          }
          this.dialogVisible = true
          this.getNode()
        })
      },
      getNode(){
        findByUnit(this.unitNode.unitId).then(response=>{
          this.nodes = response.data.data
          if (this.nodes.length == 0){
            this.$refs.tree.setCheckedKeys([]);
          }else{
            this.$refs.tree.setCheckedKeys(this.nodes);
          }
        })
      },
      submitData(){
        var data = this.$refs.tree.getCheckedNodes();
        var checked = []
        var cancel = []
        var nodes = this.nodes
        var addList = []
        var deleteList = []
        for (var i = 0;i<data.length;i++){
          checked.push(data[i].id)
        }
        for(var a = 0;a<checked.length;a++){
          if (nodes.indexOf(checked[a]) == -1 && checked[a] != 0){
            addList.push(checked[a])
          }else if(checked[a] != 0){
            cancel.push(checked[a])
          }
        }
        for (var k = 0;k<nodes.length;k++){
          if (cancel.indexOf(nodes[k]) == -1){
            deleteList.push(nodes[k])
          }
        }
        this.nodeQuery.addList = addList
        this.nodeQuery.deleteList = deleteList
        this.nodeQuery.unit = this.unitNode.unitId
        this.createUnitNode()
      },
      createUnitNode(){
        addDelUnitNode(this.nodeQuery).then(response=>{
          this.dialogVisible = false
          if (response.data.msg == 'success'){
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          }else{
            this.$notify({
              title: '失败',
              message: '操作失败,' + response.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      }
 /*     createUnitNode(data){
        this.unitNode.nodeId = data.id
        if (this.nodes.indexOf(data.id) == -1){
          addUnitNode(this.unitNode).then(response=>{
            this.getNode()
            if (response.data.msg == 'success'){
              this.$notify({
                title: '添加成功',
                message: '添加节点成功',
                type: 'success',
                duration: 2000
              })
            }else{
              this.$notify({
                title: '失败',
                message: '此节点已被其他单位关联',
                type: 'error',
                duration: 2000
              })
            }
          })
        }else{
          deleteUnitNode(this.unitNode).then(response=>{
            this.getNode()
            if (response.data.msg == 'success'){
              this.$notify({
                title: '删除成功',
                message: '删除节点成功',
                type: 'success',
                duration: 2000
              })
            }else{
              this.$notify({
                title: '失败',
                message: '删除节点失败,' + response.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      }*/
    }
  }
</script>
