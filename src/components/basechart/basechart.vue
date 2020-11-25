<template>
  <div :id="id" :data="data"></div>
</template>

<script>
export default {
  name: "basechart",
  data() {
    return {
      ChartLineGraph: null,
      start: "",
      end: ""
    };
  },
  //  深度监听 父组件刚开始没有值，只有图标的配置项
  //  父组件ajax请求后改变数据的值，传递过来，图标已生成，监听传过来的值的改变
  watch: {
    data: {
      handler(newvalue, oldvalue) {
        // console.log(newvalue);
        this.drawLineGraph(this.id, newvalue);
      }
    },
    deep: true
  },
  props: ["id", "data"],
  mounted() {
    this.drawLineGraph(this.id, this.data);
  },
  methods: {
    drawLineGraph(id, data) {
      let _this = this;
      let myChart = document.getElementById(id);
      this.ChartLineGraph = this.$echarts.init(myChart);
      this.ChartLineGraph.setOption(data,true);
      window.addEventListener("resize", function() {
        _this.ChartLineGraph.resize();
      });
      this.ChartLineGraph.on("dataZoom", function(event) {
        if (event.batch) {
          this.start = event.batch[0].start;
          this.end = event.batch[0].end;
          _this.$emit("setDataZoom",this.start,this.end)
        } else {
          this.start = event.start;
          this.end = event.end;
          _this.$emit("setDataZoom",this.start,this.end)
        }
      });
    }
  },
  beforeDestroy() {
    if (this.ChartLineGraph) {
      this.ChartLineGraph.clear();
    }
  }
};
</script>

<style scoped>
</style>
