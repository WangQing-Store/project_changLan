<template>
  <div>
    <div class="disflex">
      <el-form-item label="经度" prop="longitude">
        <el-input v-model="longitudes" @change="setLongitude" />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <div class="disflex">
          <el-input style="margin-right:10px" v-model="latitudes" @change="setLatitude" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLngLat">选取坐标</el-button>
      </el-form-item>
    </div>
    <!--坐标选取-->
    <el-dialog :visible.sync="dialogVisible" class="dialogVisible" append-to-body title="选择坐标">
      <div>
        <el-input
          placeholder="请输入内容"
          ref="searchText"
          @input="initSearch"
          id="tipinput"
          v-model="searchKey"
          style="width:300px"
        ></el-input>
        <div class="tip-box" id="searchTip"></div>
        <el-button @click="initSearch" type="primary">搜索</el-button>
      </div>
      <el-row>
        <div class="amap-page-container">
          <el-amap :zoom="zoom" :center="center" :events="events" vid="vamap" :plugin="plugin">
            <el-amap-marker
              v-for="(marker,index) in markers"
              :key="index"
              :position="center"
              :events="marker.events"
            ></el-amap-marker>
            <el-amap-info-window
              v-if="window"
              :position="window.position"
              :visible="window.visible"
              :content="window.content"
              :offset="window.offset"
              :close-when-click-map="true"
              :is-custom="true"
            >
              <div id="info-window" v-html="window.address"></div>
            </el-amap-info-window>
          </el-amap>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        当前选取坐标: {{ lng }} {{ lat }} {{ currentAddress }}
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="lngLatSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueAMap from "vue-amap";
import { AMapManager } from "vue-amap";
export default {
  props: [
    // "isminingReadonly", //控制可读状态
    "longitude", //经度
    "latitude" //纬度
  ],
  data() {
    const self = this;
    return {
      markers: [],
      windows: [],
      window: "",
      poiPicker: null,
      address: "",
      searchKey: "",
      placeSearch: null,
      longitudes: "",
      latitudes: "",
      lng: "",
      lat: "",
      zoom: 15,
      center: [113.31609, 23.04072],
      currentAddress: "",
      dialogVisible: false,
      events: {
        click(e) {
          const { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          self.center = [lng, lat];
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                self.currentAddress = result.regeocode.formattedAddress;
                self.searchKey = result.regeocode.formattedAddress;
                self.point(self.lng, self.lat, self.currentAddress);
                self.$nextTick();
              }
            }
          });
        }
      },
      plugin: [
        {
          pName: "Scale",
          events: {
            init(instance) {
              // console.log(instance)
            }
          }
        },
        {
          pName: "ToolBar",
          events: {
            init(instance) {
              // console.log(instance)
            }
          }
        }
      ]
    };
  },
  methods: {
    initSearch() {
      let vm = this;
      let amapManager = new AMapManager();
      let map = amapManager.getMap();
      AMapUI.loadUI(["misc/PoiPicker"], function (PoiPicker) {
        var poiPicker = new PoiPicker({
          input: "tipinput", //输入框id
          placeSearchOptions: {
            map: map,
            pageSize: 10
          }, //地点搜索配置
          suggestContainer: "searchTip", //输入提示显示DOM
          searchResultsContainer: "searchTip" //搜索结果显示DOM
        });
        vm.poiPicker = poiPicker;
        //监听poi选中信息
        if (vm.searchKey != "") {
          vm.poiPicker.searchByKeyword(vm.searchKey);
        }
        poiPicker.on("poiPicked", function (poiResult) {
          let source = poiResult.source;
          let poi = poiResult.item;
          if (source !== "search") {
            poiPicker.searchByKeyword(poi.name);
          } else {
            poiPicker.clearSearchResults();
            vm.center = [
              poiResult.item.location.lng,
              poiResult.item.location.lat
            ];
            vm.address = poi.name;
            // vm.searchKey = "";
          }
        });
      });
    },
    getLocation() {
      let _that = this;
      const location = {
        initMap(id) {
          let mapObj = new AMap.Map(id, {});
          let geolocation;
          mapObj.plugin(["AMap.Geolocation"], function () {
            geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, //  是否使用高精度定位，默认:true
              timeout: 10000, //  超过10秒后停止定位，默认：无穷大
              maximumAge: 0, // 定位结果缓存0毫秒，默认：0
              convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
              showButton: true, //  显示定位按钮，默认：true
              buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
              buttonOffset: new AMap.Pixel(10, 20), //  定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              showMarker: true, //  定位成功后在定位到的位置显示点标记，默认：true
              showCircle: true, //  定位成功后用圆圈表示定位精度范围，默认：true
              panToLocation: true, //  定位成功后将定位到的位置作为地图中心点，默认：true
              zoomToAccuracy: true //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            //创建天气查询实例
            mapObj.addControl(geolocation);
            geolocation.getCurrentPosition();
            //执行实时天气信息查询
          });
          return geolocation;
        }
      };
      let geolocation = location.initMap("map-container"); //定位
      AMap.event.addListener(geolocation, "complete", result => {
        _that.point(
          result.position.lng,
          result.position.lat,
          result.formattedAddress
        );
        _that.lat = result.position.lat;
        _that.lng = result.position.lng;
        _that.currentAddress = result.formattedAddress;
        _that.center = [result.position.lng, result.position.lat];
        _that.searchKey = result.formattedAddress;
      });
    },
    point(lng, lat, text) {
      const markers = [];
      const windows = [];
      const that = this;
      let formatted = [
        {
          lng,
          lat,
          text
        }
      ];
      formatted.forEach((item, index) => {
        markers.push({
          center: [item.lng, item.lat],
          // icon:item.url, //不设置默认蓝色水滴
          events: {
            click() {
              // 方法：鼠标移动到点标记上，显示相应窗体
              that.windows.forEach(window => {
                window.visible = false; // 关闭窗体
              });
              that.window = that.windows[index];
              that.$nextTick(() => {
                that.window.visible = true;
              });
            }
          }
        });
        windows.push({
          position: [item.lng, item.lat],
          isCustom: true,
          offset: [0, -30], // 窗体偏移
          showShadow: false,
          visible: false, // 初始是否显示
          address: `<div style="background-color:#fff;border: 1px solid #fff; border-radius: 5px;padding:5px">${item.text
            }</div>`
        });
      });
      //  加点
      this.markers = markers;
      // 加弹窗
      this.windows = windows;
    },
    handleMap(o, a) {
      this.$emit("bMapDate", o, a);
    },
    setLongitude() {
      this.$emit("setLongitude", this.longitudes);
    },
    setLatitude() {
      this.$emit("setLatitude", this.latitudes);
    },
    handleLngLat() {
      this.getLocation();
      this.lng = "";
      this.lat = "";
      this.currentAddress = "";
      this.dialogVisible = true;
    },
    lngLatSubmit() {
      this.longitudes = this.lng;
      this.latitudes = this.lat;
      this.$emit(
        "setLongitudeLatitude",
        this.lng,
        this.lat,
        this.currentAddress
      );
      this.address = this.currentAddress;
      this.dialogVisible = false;
      this.lng = "";
      this.lat = "";
      this.currentAddress = "";
    }
  },
  watch: {
    longitude: {
      handler(newName, oldName) {
        this.longitudes = newName;
      },
      immediate: true
      // deep: true
    },
    latitude: {
      handler(newName, oldName) {
        this.latitudes = newName;
      },
      immediate: true
      // deep: true
    }
  },
  mounted() {
    this.getLocation();
    this.longitudes = this.longitude;
    this.latitudes = this.latitude;
  },
  created() { }
};
</script>

<style scoped>
.amap-page-container {
  margin-top: 20px;
  width: 100%;
  height: 500px;
}
.tip-box {
  width: 95%;
  max-height: 260px;
  position: absolute;
  top: 117px;
  overflow-y: auto;
  background-color: #fff;
  z-index: 1000;
}
</style>
