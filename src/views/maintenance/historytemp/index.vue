<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      style="display:flex; justify-content: flex-end;align-items: center;padding:10px"
    >
      <el-form-item
        label="温度显示范围倍率"
        style="display:flex"
      >
        <el-input v-model="form.Rate"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.hostname"
          placeholder="请选择主机"
        >
          <el-option
            :label="item.name"
            @click.native="AccessChannel(item.id,item.uid,item.name)"
            v-for="item of resultHosts"
            :key="item.id"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.ChannelName"
          placeholder="请选择通道"
        >
          <el-option
            :label="item.name"
            :value="item.name"
            v-for="item of PassList"
            :key="item.id"
            @click.native="Passage(item.id,item.code,item.name)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.createTime"
          placeholder="请选择时间"
        >
          <el-option
            v-for="(item,index) of dateList"
            :value="item"
            :key="index"
            :label="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="check"
          :loading="fullscreenLoading"
        >查看</el-button>
      </el-form-item>
    </el-form>
    <!-- 历史温度折线图 -->
    <basechart
      v-loading="fullscreenLoading"
      element-loading-text="loading..."
      ref="refobj"
      id="nameid"
      :data="chartoption"
      style="width:100%;height:800px;margin: 20px 0"
      @setDataZoom="setDataZoom"
    ></basechart>
  </div>
</template>

<script>
import {
  getListHosts,
  findTempHost,
  getChannelFindList,
} from '@/api/temperature';
import { getDate, getHistory } from '@/api/maintenance/historytemp';
import basechart from '@/components/basechart/basechart';
import { getByKey } from '@/api/dictionary';
export default {
  data() {
    return {
      chartoption: {
        backgroundColor: '',
        title: {
          text: '历史温度曲线',
          left: 'center',
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          min: this.min,
          max: this.max,
          scale: true,
          axisLabel: {
            formatter: '{value}℃',
          },
          axisPointer: {
            snap: true,
          },
        },
        legend: {
          left: 'center',
          data: ['本年'],
          bottom: 0,
        },
        grid: {
          // left: '10',
          // right: '10',
          // bottom: '8%',
          // containLabel: true,
          // height: '97%',
          x: 80,
          x2: 20,
          y: 40
        },
        tooltip: {
          axisPointer: {
            type: 'cross',
          },
          trigger: 'item',
          formatter: function (params, ticket, callback) {
            var htmlStr = '';
            // if (i === 0) {
            //   htmlStr += xName + "<br/>"; //x轴的名称
            // }
            htmlStr += '<div>';
            //为了保证和原来的效果一样，这里自己实现了一个点的效果
            htmlStr +=
              '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
              params.color +
              ';"></span>';
            htmlStr += '温度' + `:${params.value[1]}<br/>`;
            htmlStr +=
              '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
              params.color +
              ';"></span>';
            htmlStr += '距离' + `:${params.value[0]}<br/>`;
            htmlStr += '</div>';
            return htmlStr;
          },
          borderWidth: 1,
        },
        dataZoom: [
          //X轴滑动条
          {
            type: 'slider', //滑动条
            show: true, //开启
            xAxisIndex: [0],
            filterMode: 'none',
            left: '4.5%', //滑动条位置
            start: 0, //初始化时，滑动条宽度开始标度
            end: 100, //初始化时，滑动条宽度结束标度
          }, //X轴内置滑动
          {
            type: 'inside', //内置滑动，随鼠标滚轮展示
            xAxisIndex: [0],
            filterMode: 'none',
            start: 0, //初始化时，滑动条宽度开始标度
            end: 100, //初始化时，滑动条宽度结束标度
          },
          //Y轴滑动条
          {
            type: 'slider', //滑动条
            show: true, //开启
            yAxisIndex: [0],
            filterMode: 'none',
            left: '0.5%', //滑动条位置
            top: '5%',
            start: 0, //初始化时，滑动条宽度开始标度
            end: 100, //初始化时，滑动条宽度结束标度
          },
          //y轴内置滑动
          {
            type: 'inside', //内置滑动，随鼠标滚轮展示
            yAxisIndex: [0],
            filterMode: 'none',
            start: 0, //初始化时，滑动条宽度开始标度
            end: 100, //初始化时，滑动条宽度结束标度
          },
        ],
        visualMap: {
          show: false,
          dimension: 0,
        },
        series: [
          {
            name: '本年',
            smooth: true,
            clip: true,
            data: this.datay,
            type: 'line',
            barWidth: 30,
          },
        ],
      },
      form: {
        Rate: localStorage.getItem("historyRate") != null ? localStorage.getItem("historyRate") : 2,
        hostname: sessionStorage.getItem("hostName") != null ? sessionStorage.getItem("hostName") : '',
        ChannelName: sessionStorage.getItem("channelName") != null ? sessionStorage.getItem("channelName") : '',
        createTime: sessionStorage.getItem("createTimeData") != null ? sessionStorage.getItem("createTimeData") : '',
      },
      resultHosts: [], //主机列表
      PassList: sessionStorage.getItem("passList") != null ? JSON.parse(sessionStorage.getItem("passList")) : [], //通道列表
      PassageId: sessionStorage.getItem("passageId") != null ? sessionStorage.getItem("passageId") : '', //通道id
      PassageCode: '',
      datay: [],
      min: null,
      max: null,
      start: null,
      end: null,
      dateList: sessionStorage.getItem("dateList") != null ? JSON.parse(sessionStorage.getItem("dateList")) : [],
      historyTempData: [],
      fullscreenLoading: false
    };
  },
  methods: {
    async getHosts() {
      const res = await findTempHost();
      if (res.data.code == 200) {
        this.resultHosts = res.data.data;
        // if (this.resultHosts.length > 0) {
        //   this.form.hostname = this.resultHosts[0].name;
        //   const Passage = await getChannelFindList(this.resultHosts[0].id);
        //   if (Passage.data.code == 200 && Passage.data.data.length > 0) {
        //     this.form.ChannelName = Passage.data.data[0].name;
        //     this.PassList = Passage.data.data;
        //     this.PassageId = Passage.data.data[0].id;
        //     this.PassageCode = Passage.data.data[0].code;
        //   }
        // }
      }
    },
    // 获取通道列表
    async AccessChannel(id, uid, name) {
      this.form.ChannelName = '';
      this.form.createTime = '';
      this.PassageId = '';
      this.dateList = [];
      this.form.hostname = name;
      const res = await getChannelFindList(id);
      if (res.data.code == 200) {
        this.PassList = res.data.data;
      }
    },
    // 获取时间列表
    Passage(id, code, name) {
      this.form.createTime = '';
      this.PassageId = id;
      this.PassageCode = code;
      this.form.ChannelName = name;
      this.getDate(id);
    },
    // 根据通道ID获取温度历史数据时间
    async getDate(id) {
      const res = await getDate(id);
      if (res.data.code == 200) {
        this.dateList = res.data.data;
        this.dateList.forEach((item, index, arr) => {
          this.dateList[index] = this.FormattingTime(item);
        });
      }
    },
    // 格式化时间
    FormattingTime(time) {
      let d = new Date(time);
      if (d.getHours() < 10) {
        var Hours = '0' + d.getHours();
      } else {
        var Hours = d.getHours();
      }
      if (d.getMinutes() < 10) {
        var Minutes = '0' + d.getMinutes();
      } else {
        var Minutes = d.getMinutes();
      }
      if (d.getSeconds() < 10) {
        var Seconds = '0' + d.getSeconds();
      } else {
        var Seconds = d.getSeconds();
      }
      let installtime = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + Hours + ':' + Minutes + ':' + Seconds;
      return installtime;
    },
    // 查看数据
    async check() {
      if (!/^([1-9]\d*.?|0.)\d*$/.test(this.form.Rate)) {
        this.$message({
          type: 'info',
          message: '倍率格式不正确',
        });
        return;
      }
      if (!this.PassageId) {
        this.$message({
          type: 'info',
          message: '请选择通道',
        });
        return;
      }
      if (!this.form.createTime) {
        this.$message({
          type: 'info',
          message: '请选择时间',
        });
        return;
      }
      this.chartoption.series[0].data = [];
      this.datay = [];
      this.fullscreenLoading = true;
      // 缓存数据
      sessionStorage.setItem("hostName", this.form.hostname);
      sessionStorage.setItem("channelName", this.form.ChannelName);
      sessionStorage.setItem("passageId", this.PassageId);
      sessionStorage.setItem("createTimeData", this.form.createTime);
      sessionStorage.setItem("passList", JSON.stringify(this.PassList));
      sessionStorage.setItem("dateList", JSON.stringify(this.dateList));
      // 根据通道ID、时间获取历史温度数据
      const historyTemp = await getHistory(this.PassageId, this.form.createTime);
      if (historyTemp.data.code == 200) {
        this.min = historyTemp.data.data.minTemp;
        this.max = historyTemp.data.data.maxTemp;
        this.historyTempData = historyTemp.data.data.distanceAndTemps;
        if (this.historyTempData != null && this.historyTempData.length > 0) {
          for (let item of this.historyTempData) {
            let obj = {
              // name: item.temp,
              value: [
                item.distance, //x轴
                item.temp //y轴
              ]
            };
            this.datay.push(obj);
          }
        } else {
          this.$message({
            type: "info",
            message: "该通道没有数据"
          })
        }
      }
      this.chartoption.series[0].data = this.datay;
      // if (this.start != null && this.end != null) {
      //   this.chartoption.dataZoom[0].start = this.start;
      //   this.chartoption.dataZoom[0].end = this.end;
      //   this.chartoption.dataZoom[2].start = this.start;
      //   this.chartoption.dataZoom[2].end = this.end;
      // }
      if (this.max && this.min) {
        this.chartoption.yAxis.max = (this.max + this.min + (this.max - this.min) * this.form.Rate) / 2;
        this.chartoption.yAxis.min = Number(((this.max + this.min - (this.max - this.min) * this.form.Rate) / 2).toFixed(2));
      }
      localStorage.setItem('historyRate', this.form.Rate);
      var str = this.form.ChannelName ? this.form.ChannelName : '';
      this.chartoption.title.text = this.form.hostname + '-' + str + '历史温度分布';
      if (this.$refs['refobj'] !== undefined) {
        this.$refs['refobj'].drawLineGraph('nameid', this.chartoption);
        this.fullscreenLoading = false;
      }
    },
    // 保存滚轴的位置
    setDataZoom(start, end) {
      this.start = start;
      this.end = end;
    },
  },
  components: {
    basechart,
  },
  mounted() {
    this.getHosts();
    if (this.PassageId && this.form.createTime) {
      this.check()
    }
  },
};
</script>

<style scoped>
.el-form-item >>> .el-form-item__label {
  width: 180px !important;
}
.el-form >>> .el-form-item__content {
  margin-left: 0 !important;
}
.el-form /deep/ .el-form-item__content {
  margin-left: 10px !important;
}
</style>
