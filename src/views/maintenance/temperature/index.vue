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
          placeholder="请选择"
          clearable
          @clear="clearHost"
        >
          <el-option
            :label="item.name"
            @click.native="AccessChannel(item.id,item.uid)"
            v-for="item of resultHosts"
            :key="item.id"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.ChannelName"
          placeholder="请选择"
          clearable
          @clear="clearChannel"
        >
          <el-option
            :label="item.name"
            :value="item.name"
            v-for="item of PassList"
            :key="item.id"
            @click.native="Passage(item.id,item.code)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="check"
        >查看</el-button>
      </el-form-item>
    </el-form>
    <!-- 折线图 -->
    <!-- <div v-for="item of resultHosts" :key="item.id">
      <basechart
        :ref="'refobj'+item.uid"
        v-if="'name'+item.uid+PassageId === tabItem"
        :id="'nameid'+item.uid"
        :data="chartoption"
        style="height:800px;margin: 20px 0"
        @setDataZoom="setDataZoom"
      ></basechart>
    </div>-->
    <basechart
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
  getChannelFindList
} from "@/api/temperature";
import basechart from "@/components/basechart/basechart";
import { getByKey } from "@/api/dictionary";
export default {
  name: "index",
  data() {
    return {
      typeId: "",
      allTypes: [], //主机类型
      datay: [],
      sensorid: "",
      echartlist: [],
      resultHosts: [],
      tabItem: 0,
      tabPosition: "left",
      chartoption: {
        backgroundColor: "",
        title: {
          text: "实时温度折线图",
          left: "center"
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "value",
          splitLine: {
            show: false
          }
          // data: this.datax
        },
        yAxis: {
          type: "value",
          min: this.min,
          max: this.max,
          scale: true,
          axisLabel: {
            formatter: "{value}℃"
          },
          axisPointer: {
            snap: true
          }
        },
        legend: {
          left: "center",
          data: ["本年"],
          bottom: 0
        },
        // grid: {
        //   left: "10",
        //   right: "10",
        //   bottom: "8%",
        //   containLabel: true,
        //   height: "97%"
        // },
        grid: {
          x: 80,
          x2: 20,
          y: 40,
        },
        tooltip: {
          axisPointer: {
            type: "cross"
          },
          trigger: "item",
          formatter: function(params,ticket,callback) {
            // console.log(params);
            var htmlStr="";
            // if (i === 0) {
            //   htmlStr += xName + "<br/>"; //x轴的名称
            // }
            htmlStr+="<div>";
            //为了保证和原来的效果一样，这里自己实现了一个点的效果
            htmlStr+=
              '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+
              params.color+
              ';"></span>';
            if(/([0-9]+\.[0-9]{3})[0-9]*/.test(Number(params.value[1]))) {
              params.value[1]=Number(params.value[1].toFixed(3))
            }
            htmlStr+="温度"+`:${params.value[1]}<br/>`;
            htmlStr+=
              '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+
              params.color+
              ';"></span>';
            if(/([0-9]+\.[0-9]{3})[0-9]*/.test(Number(params.value[0]))) {
              params.value[0]=Number(params.value[0].toFixed(3))
            }
            htmlStr+="距离"+`:${params.value[0]}<br/>`;
            htmlStr+="</div>";
            return htmlStr;
          },
          borderWidth: 1
        },
        dataZoom: [
          //X轴滑动条
          {
            type: "slider", //滑动条
            show: true, //开启
            xAxisIndex: [0],
            filterMode: "none",
            left: "4.5%", //滑动条位置
            start: 0, //初始化时，滑动条宽度开始标度
            end: 100 //初始化时，滑动条宽度结束标度
          }, //X轴内置滑动
          {
            type: "inside", //内置滑动，随鼠标滚轮展示
            xAxisIndex: [0],
            filterMode: "none",
            start: 0, //初始化时，滑动条宽度开始标度
            end: 100 //初始化时，滑动条宽度结束标度
          },
          //Y轴滑动条
          {
            type: "slider", //滑动条
            show: true, //开启
            yAxisIndex: [0],
            filterMode: "none",
            left: "0.5%", //滑动条位置
            top: "5%",
            start: 0, //初始化时，滑动条宽度开始标度
            end: 100 //初始化时，滑动条宽度结束标度
          },
          //y轴内置滑动
          {
            type: "inside", //内置滑动，随鼠标滚轮展示
            yAxisIndex: [0],
            filterMode: "none",
            start: 0, //初始化时，滑动条宽度开始标度
            end: 100 //初始化时，滑动条宽度结束标度
          }
        ],
        // dataZoom: [{
        //   show: true,
        //   type: 'inside',
        //   filterMode: 'none',
        //   xAxisIndex: [0],
        //   startValue: -20,
        //   endValue: 20
        // }, {
        //   show: true,
        //   type: 'inside',
        //   filterMode: 'none',
        //   yAxisIndex: [0],
        //   startValue: -20,
        //   endValue: 20
        // }],
        visualMap: {
          show: false,
          dimension: 0
        },
        series: [
          {
            name: "本年",
            smooth: true,
            clip: true,
            data: this.datay,
            type: "line",
            barWidth: 30
          }
        ]
      },
      form: {
        Rate: 2,
        hostname: "",
        ChannelName: ""
      },
      min: null,
      max: null,
      start: null,
      end: null,
      // ChannelUid: "",
      PassList: [],
      PassageId: "",
      PassageCode: "",
      websocketsendId: "",
      maxDistance: null,
      minDistance: null
    };
  },
  components: { basechart },
  methods: {
    initWebSocket() {
      // console.log(this.$store.state.user.userId)
      // 47.112.167.239:8189/websocket/{userId}
      // console.log(process.env.API_WS)
      // let socketapi = process.env.API_WS+this.$store.state.user.userId
      // let socketapi = 'ws://' + location.host + '/socket/websocket/rt/'+this.$store.state.user.userId
      let socketapi=
        "ws://"+
        location.host+
        "/socket/websocket/"+
        this.$store.state.user.userId;
      // console.log(socketapi)
      this.websocket=new WebSocket(socketapi);
      this.websocket.onerror=this.setErrorMessage;
      // 连接成功
      this.websocket.onopen=this.setOnopenMessage;
      // 收到消息的回调
      this.websocket.onmessage=this.setOnmessageMessage;
      // 连接关闭的回调
      // this.websocket.onclose = this.setOncloseMessage
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      // window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage() {
      // console.log('WebSocket连接发生错误   状态码：' + this.websocket.readyState)
    },
    setOnopenMessage() {
      // console.log('WebSocket连接成功    状态码：' + this.websocket.readyState)
      // let actions = {uid:this.sensorid};     //请根据实际项目需要进行修改
      // this.websocketsend(JSON.stringify(actions));
      this.websocketsend();
    },
    setOnmessageMessage(resultdata) {
      // 根据服务器推送的消息做自己的业务处理
      if(resultdata.data.indexOf("temp")!==-1&&resultdata.data.indexOf("dash")==-1) {
        this.realdata=JSON.parse(resultdata.data.substr(4));
        if(this.realdata==null) {
          this.chartoption.title.text="没有实时温度数据";
          this.$message({
            type: "info",
            message: "该主机没有数据"
          });
          return;
        }
        // if(this.datay.length>600){
        //   this.datay.shift()
        // }
        if(this.realdata["channelId"]==this.websocketsendId) {
          if(this.start!=null&&this.end!=null) {
            this.chartoption.dataZoom[0].start=this.start;
            this.chartoption.dataZoom[0].end=this.end;
            this.chartoption.dataZoom[2].start=this.start;
            this.chartoption.dataZoom[2].end=this.end;
          }
          this.datay=[];
          for(let item of this.realdata["distanceAndTemps"]) {
            let obj={
              // name: item.temp,
              value: [
                item.distance, //x轴
                item.temp //y轴
              ]
            };
            if(item.temp!==null&&item.distance!==null) {
              this.datay.push(obj);
              this.chartoption.series[0].data=this.datay;
            }
          }
          if(this.realdata.maxTemp!==null) {
            //hostName
            this.max=this.realdata["maxTemp"];
          }
          if(this.realdata.minTemp!==null) {
            //hostName
            this.min=this.realdata["minTemp"];
          }
          if(this.max&&this.min) {
            this.chartoption.yAxis.min=Number(((this.max+this.min-(this.max-this.min)*this.form.Rate)/2).toFixed(2));
            this.chartoption.yAxis.max=(this.max+this.min+(this.max-this.min)*this.form.Rate)/2;
          }
          // this.chartoption.dataZoom[0].startValue = this.realdata["distanceAndTemps"][0].distance;
          // this.chartoption.dataZoom[0].endValue = this.realdata["distanceAndTemps"][this.realdata["distanceAndTemps"].length - 1].distance;
          this.$nextTick(() => {
            if(this.$refs["refobj"]!==undefined) {
              this.$refs["refobj"].drawLineGraph("nameid",this.chartoption);
            }
          });
        }
      }
    },
    setOncloseMessage() {
      // console.log('WebSocket连接关闭    状态码：' + this.websocket.readyState)
    },
    onbeforeunload() {
      this.closeWebSocket();
    },
    websocketsend(val) {
      //数据发送
      // console.log(this.sensorid)
      let actions=val||this.websocketsendId;
      this.websocket.send("temp"+actions);
    },
    closeWebSocket() {
      if(this.websocket) {
        this.websocket.close();
      }
    },
    setDataZoom(start,end) {
      this.start=start;
      this.end=end;
    },
    async getHosts() {
      const res=await findTempHost();
      if(res.data.code==200) {
        this.resultHosts=res.data.data;
        // this.resultHosts = this.resultHosts.filter(item => item.type == 3||item.type==4)
        if(this.resultHosts.length>0) {
          this.form.hostname=this.resultHosts[0].name;
          const Passage=await getChannelFindList(this.resultHosts[0].id);
          // this.ChannelUid = this.resultHosts[0].uid;
          if(Passage.data.code==200&&Passage.data.data.length>0) {
            this.form.ChannelName=Passage.data.data[0].name;
            this.PassList=Passage.data.data;
            this.PassageId=Passage.data.data[0].id;
            this.PassageCode=Passage.data.data[0].code;
            this.websocketsendId=this.PassageId;
          }
        }
      }
    },
    // 获取通道列表
    AccessChannel(id,uid) {
      this.form.ChannelName="";
      this.PassageId="";
      getChannelFindList(id).then(res => {
        if(res.data.code==200) {
          this.PassList=res.data.data;
        }
      });
    },
    Passage(id,code) {
      this.PassageId=id;
      this.PassageCode=code;
    },
    //修改倍率查看数据
    check() {
      if(!/^([1-9]\d*.?|0.)\d*$/.test(this.form.Rate)) {
        this.$message({
          type: "info",
          message: "倍率格式不正确"
        });
        return;
      }
      if(!this.PassageId) {
        this.$message({
          type: "info",
          message: "请选择通道"
        });
        return;
      }
      this.chartoption.series[0].data=[];
      this.datay=[];
      this.websocketsendId=this.PassageId;
      // this.chartoption.yAxis.max = this.max;
      // this.chartoption.yAxis.min = this.min;
      if(this.max&&this.min) {
        this.chartoption.yAxis.max=(this.max+this.min+(this.max-this.min)*this.form.Rate)/2;
        this.chartoption.yAxis.min=Number(((this.max+this.min-(this.max-this.min)*this.form.Rate)/2).toFixed(2));
      }
      localStorage.setItem("tempRate",this.form.Rate);
      var str=this.form.ChannelName? this.form.ChannelName:"";
      this.chartoption.title.text=
        this.form.hostname+"-"+str+"实时温度分布";
      if(this.$refs["refobj"]!==undefined) {
        this.$refs["refobj"].drawLineGraph("nameid",this.chartoption);
      }
      if(this.websocket.readyState==1) {
        this.websocketsend(this.websocketsendId);
      } else {
        this.$message.info('数据服务未连接或数据服务已关闭');
      }
    },
    clearHost() {
      this.form.ChannelName="";
      this.PassageId="";
      this.PassList=[];
    },
    clearChannel() {
      this.form.ChannelName="";
      this.PassageId="";
    }
  },
  watch: {},
  async mounted() {
    await this.getHosts();
    await this.initWebSocket();
  },
  created() {
    if(localStorage.getItem("tempRate")) {
      this.form.Rate=localStorage.getItem("tempRate");
    }
  },
  beforeDestroy() {
    this.onbeforeunload();
  }
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
