<template>
  <el-table v-loading="loading" :data="data">
    <!--    非开关字段DOM-->
    <el-table-column
      v-for="(item,index) in columns"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      v-if="!item.switch&&!item.image"
      :formatter="item.formatter"
    ></el-table-column>
    <!--    开关DOM-->
    <el-table-column
      v-for="(item,index) in columns"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      v-if="item.switch"
    >
      <template slot-scope="scope">
        <el-switch
          @change="changeswitch($event,scope.row)"
          v-model="scope.row.isEnable"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </template>
    </el-table-column>
    <!-- 图片 -->
    <el-table-column
      v-for="(item,index) in columns"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      v-if="item.image"
    >
      <template slot-scope="scope">
        <img style="width: 110px" :src="item.getImgFile+scope.row.filePath" alt />
      </template>
    </el-table-column>
    <!-- 按钮 -->
    <el-table-column v-if="tableButtons" align="center">
      <template slot-scope="scope">
        <div style="margin-bottom: 10px" v-for="(btn,index) of tableButtons">
          <el-button
            v-if="!btn.isSlot"
            @click="handleButton(scope.row,btn.methods)"
            :type="btn.type"
            size="small"
          >{{ btn.label }}</el-button>
          <template v-if="btn.isSlot">
            <slot :name="'form-' + btn.value" />
          </template>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ["data", "columns", "loading", "tableButtons"],
  mounted() {
    // console.log(this.data);
    // console.log(this.columns);
  },
  methods: {
    init(row) {
      // console.log(row);
    },
    handleSafeEdit(scope, row, item) {
      // console.log(scope, row, item);
    },
    changeswitch($event, row) {
      //点击开关传handSwitch事件给父组件
      this.$emit("handSwitch", row);
    },
    handleButton(row, methods) {
      //点击按钮传actionButton事件给父组件
      this.$emit("actionButton", { row: row, methods: methods });
    }
  }
};
</script>

<style scoped>
</style>
