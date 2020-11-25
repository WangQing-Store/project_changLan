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
          @clear="clearHostname"
        >
          <el-option
            :label="item.name"
            @click.native="AccessChannel(item.id,item.uid)"
            v-for="item of HostList"
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
          @clear="clearChannelName"
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
    <!-- Echars折线图 -->
    <!-- <basechart :id="'basechart'" :data="option" style="height:800px;margin: 20px 0"></basechart> -->
    <!-- <div v-for="item of HostList" :key="item.id">
      <basechart
        :ref="'refobj'+item.uid"
        v-if="'name'+item.uid+PassageId === tabItem"
        :id="'nameid'+item.uid"
        :data="option"
        style="height:800px;margin: 20px 0"
        @setDataZoom="setDataZoom"
      ></basechart>
    </div>-->
    <basechart
      ref="refobj"
      id="nameid"
      :data="option"
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
  warningDetails
} from "@/api/temperature";
import basechart from "../../components/basechart/basechart";
import {
  getMapStatus,
  fetchAll,
  getByJwsAndKey,
  findList,
  searchHomePage,
  imgfileUpload
} from "@/api/dashboard";
import { getToken } from "@/utils/auth";
import { fetchList } from "@/api/alarm/untreated";
import { getByKey } from "../../api/dictionary";
export default {
  name: "Dashboard",
  data() {
    return {
      optionsArr: [{ value: 1,label: "主机" },{ value: 2,label: "节点" }],
      zoom: 15,
      list: null,
      entry: null,
      warning: null,
      pathList: [],
      datay: [],
      markAreaData: [],
      piecesDeploy: [],
      option: {
        title: {
          text: "",
          left: "center"
        },
        legend: {
          left: "center",
          data: ["本年"],
          bottom: 0
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          x: 80,
          x2: 20,
          y: 40,
        },
        tooltip: {
          trigger: "axis", // axis
          backgroundColor: "rgba(0,0,0,0.8)", //rgba(255,0,0,0.8)
          axisPointer: {
            type: "cross"
          },
          formatter: function(params,ticket,callback) {
            // console.log(params);
            var htmlStr="";
            for(var i=0;i<params.length;i++) {
              var param=params[i];
              var xName=param.name; //x轴的名称
              var seriesName=param.seriesName; //图例名称
              var value=param.value[1]; //y轴值
              var color=param.color; //图例颜色

              // var warningType = "";
              // if (param.value[2]) {
              //  warningDetails(param.value[2].id).then(res => {
              //     console.log(res);
              //     if (res.data.code == 200) {
              //       warningType = res.data.data.warningTypeName;
              //       // console.log(warningType);
              //     }
              //   })
              // }

              if(i===0) {
                htmlStr+=xName+"<br/>"; //x轴的名称
              }
              htmlStr+="<div>";
              //为了保证和原来的效果一样，这里自己实现了一个点的效果
              htmlStr+=
                '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+
                color+
                ';"></span>';

              //圆点后面显示的文本
              if(param.value[1]||param.value[1]==0) {
                htmlStr+=`绝对温度:${param.value[1]}<br/>`;
                htmlStr+=
                  '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+
                  color+
                  ';"></span>';
              }
              if(param.value[0]||param.value[0]==0) {
                htmlStr+="距离"+`:${param.value[0]}<br/>`;
                htmlStr+=
                  '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+
                  color+
                  ';"></span>';
              }
              if(param.value[3]) {
                htmlStr+="节点"+`:${param.value[3]}<br/>`;
                htmlStr+=
                  '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+
                  color+
                  ';"></span>';
              }
              if(param.value[5]) {
                htmlStr+="主机名"+`:${param.value[5]}<br/>`;
                htmlStr+=
                  '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+
                  color+
                  ';"></span>';
              }
              if(param.value[4]) {
                htmlStr+="通道名"+`:${param.value[4]}<br/>`;
              }
              if(param.value[2]) {
                htmlStr+=
                  '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+
                  "red"+
                  ';"></span>';
                htmlStr+="报警";
              }
              htmlStr+="</div>";
            }
            return htmlStr;
          }
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          // type: "category",
          // boundaryGap: false,
          type: "value",
          splitLine: {
            show: false
          }
          // axisPointer: {
          //   snap: true
          // }
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
            end: 100, //初始化时，滑动条宽度结束标度
          },
          //y轴内置滑动
          {
            type: "inside", //内置滑动，随鼠标滚轮展示
            yAxisIndex: [0],
            filterMode: "none",
            start: 0, //初始化时，滑动条宽度开始标度
            end: 100, //初始化时，滑动条宽度结束标度
          }
        ],
        visualMap: {
          show: false,
          dimension: 0,
          pieces: this.piecesDeploy
        },
        series: [
          {
            name: "温度",
            type: "line",
            smooth: true,
            data: this.datay,
            // itemStyle: {
            //   normal: {
            //     color: "#9fb2b2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#c24034" //改变折线颜色
            //     }
            //   }
            // },
            markArea: {
              itemStyle: {
                //全局的
                normal: { color: "#ff3333" }
              },
              data: this.markAreaData
            }
          }
        ]
      },
      form: {
        Rate: 2,
        hostname: "",
        ChannelName: ""
      },
      max: null,
      min: null,
      HostList: [], //组件列表
      PassList: [], //通道列表
      tabItem: 0,
      sensorid: "",
      ChannelUid: "",
      PassageId: "",
      PassageCode: "",
      end: null,
      start: null,
      websocketsendId: "",
    };
  },
  components: {
    basechart
  },
  methods: {
    // 获取通道列表
    AccessChannel(id,uid) {
      // this.ChannelUid = uid;
      // this.sensorid = uid;
      this.form.ChannelName="";
      this.PassageId="";
      this.PassList=[];
      getChannelFindList(id).then(res => {
        this.PassList=res.data.data;
      });
    },
    // 获取选中通道id
    Passage(id,code) {
      this.PassageId=id;
      this.PassageCode=code;
    },
    // 查看
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
      this.option.series[0].data=[];
      this.datay=[];
      this.websocketsendId=this.PassageId;
      // this.option.yAxis.max = this.max;
      // this.option.yAxis.min = this.min;
      if(this.max&&this.min) {
        this.option.yAxis.max=(this.max+this.min+(this.max-this.min)*this.form.Rate)/2;
        this.option.yAxis.min=Number(((this.max+this.min-(this.max-this.min)*this.form.Rate)/2).toFixed(2));
      }
      localStorage.setItem("dashRate",this.form.Rate);
      // if (this.$refs["refobj" + this.sensorid].length > 0) {
      //   this.$refs["refobj" + this.sensorid][0].drawLineGraph(
      //     "nameid" + this.sensorid,
      //     this.option
      //   );
      // }
      var str=this.form.ChannelName? this.form.ChannelName:"";
      if(str==""&&this.form.hostname=="") {
        this.option.title.text="没有主机通道数据";
      } else {
        this.option.title.text=this.form.hostname+"-"+str+"温度分布";
      }
      if(this.$refs["refobj"]!==undefined) {
        this.$refs["refobj"].drawLineGraph("nameid",this.option);
      }
      // this.tabItem = "name" + this.ChannelUid + this.PassageId;
      if(this.websocket.readyState==1) {
        this.websocketsend(this.websocketsendId);
      } else {
        this.$message.info('数据服务未连接或数据服务已关闭');
      }
    },
    // 获取组机列表
    async getListHosts() {
      const res=await findTempHost();
      if(res.data.code==200) {
        this.HostList=res.data.data;
      }
      if(this.HostList.length>0) {
        this.ChannelUid=this.HostList[0].uid;
        this.form.hostname=this.HostList[0].name;
        const Passage=await getChannelFindList(this.HostList[0].id);
        if(Passage.data.code==200&&Passage.data.data.length>0) {
          this.PassList=Passage.data.data;
          this.form.ChannelName=Passage.data.data[0].name;
          this.PassageId=Passage.data.data[0].id;
          this.PassageCode=Passage.data.data[0].code;
          this.websocketsendId=this.PassageId;
        }
      }
      var str=this.form.ChannelName? this.form.ChannelName:"";
      if(str==""&&this.form.hostname=="") {
        this.option.title.text="没有主机通道数据";
      } else {
        this.option.title.text=this.form.hostname+"-"+str+"温度分布";
      }
      // if (this.$refs["refobj"] !== undefined) {
      //   this.$refs["refobj"].drawLineGraph("nameid", this.option);
      // }
    },
    warningDistanceSort(arr) {
      return arr.sort((a,b) => {
        return (a.minWarningDistance-b.minWarningDistance)
      })
    },
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
      // console.log(this.ChannelUid, this.PassageCode);
      this.websocketsend();
    },
    setOnmessageMessage(resultdata) {
      // console.log(resultdata.data.indexOf("dash"));
      // 根据服务器推送的消息做自己的业务处理
      // console.log(resultdata)
      if(resultdata.data.indexOf("dash")!==-1) {
        if(resultdata.data!=null) {
          // console.log(JSON.parse(resultdata.data.substr(4)));

          this.realdata=JSON.parse(resultdata.data.substr(4));
          // console.log(this.realdata);
        }
        if(this.realdata==null) {
          this.option.title.text="没有数据显示";
          this.$message({
            type: "info",
            message: "该主机没有数据"
          });
          return;
        }
        // if(this.datay.length>600){
        //   this.datay.shift()
        // }
        this.datay=[];
        this.markAreaData=[];
        if((this.start!=null)&(this.end!=null)) {
          this.option.dataZoom[0].start=this.start;
          this.option.dataZoom[0].end=this.end;
          this.option.dataZoom[2].start=this.start;
          this.option.dataZoom[2].end=this.end;
        }
        if(this.realdata["channelId"]==this.websocketsendId) {
          if(this.realdata["warningDetails"]!==null&&this.realdata["warningDetails"]!==undefined) {
            this.realdata["warningDetails"]=this.warningDistanceSort(this.realdata["warningDetails"]);
            this.piecesDeploy[0]={ lte: 0,color: 'green' };
            this.piecesDeploy.push({
              gt: 0,
              lte: this.realdata["warningDetails"][0].minWarningDistance,
              color: 'green'
            })
            this.piecesDeploy.push(
              {
                gt: this.realdata["warningDetails"][this.realdata["warningDetails"].length-1].maxWarningDistance,
                color: 'green'
              }
            )
            for(let item of this.realdata["warningDetails"]) {
              if(item.type===3) {
                var markAreaDataArr=[];
                if(item.minWarningDistance) {
                  markAreaDataArr[0]={
                    name: "山火",
                    xAxis: item.minWarningDistance,
                    itemStyle: {
                      color: "#dba6a6"
                    }
                  };
                } else if(item.maxWarningDistance) {
                  markAreaDataArr[0]={
                    name: "山火",
                    xAxis: Number(item.maxWarningDistance)-10,
                    itemStyle: {
                      color: "#dba6a6"
                    }
                  };
                }
                if(item.maxWarningDistance) {
                  markAreaDataArr[1]={
                    xAxis: item.maxWarningDistance
                  };
                } else {
                  markAreaDataArr[1]={
                    xAxis: ""
                  };
                }
                this.markAreaData.push(markAreaDataArr);
              }
              if(item.type===4) {
                var icingDataArr=[];
                if(item.minWarningDistance) {
                  icingDataArr[0]={
                    name: "覆冰",
                    xAxis: item.minWarningDistance,
                    itemStyle: {
                      color: "#8371fb"
                    }
                  };
                } else if(item.maxWarningDistance) {
                  icingDataArr[0]={
                    name: "覆冰",
                    xAxis: Number(item.maxWarningDistance)-10,
                    itemStyle: {
                      color: "#8371fb"
                    }
                  };
                }
                if(item.maxWarningDistance) {
                  icingDataArr[1]={
                    xAxis: item.maxWarningDistance
                  };
                } else {
                  icingDataArr[1]={
                    xAxis: ""
                  };
                }
                this.markAreaData.push(icingDataArr);
              }
            }
            this.realdata["warningDetails"].forEach((item,index,arr) => {
              if(item.minWarningDistance&&item.maxWarningDistance&&index<=arr.length-1) {
                if(item.type===3) {
                  if(index===arr.length-1) {
                    this.piecesDeploy.push({
                      gt: arr[index].minWarningDistance,
                      lte: item.maxWarningDistance,
                      color: 'red'
                    })
                  } else {
                    this.piecesDeploy.push({
                      gt: item.minWarningDistance,
                      lte: item.maxWarningDistance,
                      color: 'red'
                    })
                    this.piecesDeploy.push({
                      gt: item.maxWarningDistance,
                      lte: arr[index+1].minWarningDistance,
                      color: 'green'
                    })
                  }

                }
                if(item.type===4) {
                  if(index===arr.length-1) {
                    this.piecesDeploy.push({
                      gt: arr[index].minWarningDistance,
                      lte: item.maxWarningDistance,
                      color: 'blue'
                    })
                  } else {
                    this.piecesDeploy.push({
                      gt: item.minWarningDistance,
                      lte: item.maxWarningDistance,
                      color: 'blue'
                    })
                    this.piecesDeploy.push({
                      gt: item.maxWarningDistance,
                      lte: arr[index+1].minWarningDistance,
                      color: 'green'
                    })
                  }
                }
              }
            })
            // console.log(this.markAreaData);
            this.option.visualMap.pieces=this.piecesDeploy;
            this.option.series[0].markArea.data=this.markAreaData;
          }

          //  console.log(this.realdata[item])
          if(this.realdata["distanceAndTemps"].length>0) {
            for(let item of this.realdata["distanceAndTemps"]) {
              // console.log(this.realdata["channelName"]);
              let obj={
                // name: item.temp,
                value: [
                  item.node.fiberDistance, //x轴
                  item.temp, //y轴
                  item.warning||false, //报警
                  item.node.name, //节点名称
                  this.realdata["channelName"], //通道名称
                  this.realdata["hostName"] //主机名称
                ]
              };
              if(item.channelName!==null) {
                //hostName
                // this.form.ChannelName = this.realdata["ChannelName"];
                this.option.title.text=
                  this.realdata["hostName"]+
                  "主机"+
                  this.realdata["channelName"]+
                  "通道"+
                  "温度分布";
              }
              if(item.hostName!==null) {
                //hostName
                this.form.hostName=this.realdata["hostName"];
              }
              if(item.maxTemp!==null) {
                //hostName
                // this.option.yAxis.max = this.realdata["maxTemp"];
                this.max=this.realdata["maxTemp"];
                // console.log(this.option.yAxis.max);
              }
              if(item.minTemp!==null) {
                //hostName
                // this.option.yAxis.min = this.realdata["minTemp"];
                this.min=this.realdata["minTemp"];
              }
              if(this.max&&this.min) {
                this.option.yAxis.min=Number(((this.max+this.min-(this.max-this.min)*this.form.Rate)/2).toFixed(2));
                this.option.yAxis.max=(this.max+this.min+(this.max-this.min)*this.form.Rate)/2;
              }
              if(item.temp!==null&&item.distance!==null) {
                this.datay.push(obj);
                this.option.series[0].data=this.datay;
              }
            }
          } else {
            this.$message({
              type: "info",
              message: "该通道下没有节点数据"
            })
          }
          this.$nextTick(() => {
            if(this.$refs["refobj"]!==undefined) {
              this.$refs["refobj"].drawLineGraph("nameid",this.option);
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
      // let actions = this.sensorid;
      let actions=val||this.websocketsendId;
      this.websocket.send("dash"+actions);
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
    clearHostname() {
      this.PassageId="";
      this.form.ChannelName="";
      this.PassList=[];
    },
    clearChannelName() {
      this.PassageId="";
      this.form.ChannelName="";
    }
  },
  created() {
    if(localStorage.getItem("dashRate")) {
      this.form.Rate=localStorage.getItem("dashRate");
    }
  },
  filters: {
    warningType(type) {
      return getDictName(type,"t_warning_type");
    }
  },
  computed: {
    getItemtoken() {
      return {
        // Authorization : store.getters.token
        Authorization: localStorage.getItem("Admin-Token")
      };
    }
  },
  //数据自动刷新，必然需要一个监听机制告诉Echarts重新设置数据
  watch: {},
  async mounted() {
    await this.getListHosts();
    await this.initWebSocket();
  },
  beforeDestroy() {
    this.onbeforeunload();
  },
};
</script>

<style scoped>
.amap-demo {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.amap-logo {
  display: none;
}
.amap-copyright {
  bottom: -100px;
  display: none;
}
.prompt {
  background: white;
  width: 100px;
  height: 30px;
  text-align: center;
}
.el-form-item >>> .el-form-item__label {
  width: 180px !important;
}
.el-form /deep/ .el-form-item__content {
  margin-left: 10px !important;
}
</style>
