<template>
  <div class="pagination-container">
    <el-pagination
      v-show="total>0"
      :current-page="currentPage"
      :page-sizes="[5,10,20,50]"
      :page-size="pageSize"
      :total="total"
      class="pull-right"
      background
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'index',
    props:["total","currentPage","pageSize"],
    methods:{
      handleSizeChange(val){
        this.$emit('handleSizeChange',val)
      },
      handleCurrentChange(val){
        this.$emit('handleCurrentChange',val)
      }
    }
  }
</script>

<style scoped>

</style>
