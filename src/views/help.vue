<template>
  <!-- 侧边导航栏 -->
  <div>
    <el-row :gutter="20">
      <el-col
        :span="3"
        style="position:fixed"
      >
        <div class="grid-content bg-purple">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu index="1">
              <template slot="title">
                <span>登录</span>
              </template>
              <el-menu-item-group
                v-for="(item,index) of Exporter1"
                :key="item.id"
                @click.native="SweepPoint(item.id)"
              >
                <el-menu-item :index="`1-${index+1}`">{{item.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <span>路由管理</span>
              </template>
              <el-menu-item-group
                v-for="(item,index) of Exporter2"
                :key="item.id"
                @click.native="SweepPoint(item.id)"
              >
                <el-menu-item :index="`2-${index+1}`">{{item.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <span>维保管理</span>
              </template>
              <el-menu-item-group
                v-for="(item,index) of Exporter3"
                :key="item.id"
                @click.native="SweepPoint(item.id)"
              >
                <el-menu-item :index="`3-${index+1}`">{{item.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <span>报警管理</span>
              </template>
              <el-menu-item-group
                v-for="(item,index) of Exporter4"
                :key="item.id"
                @click.native="SweepPoint(item.id)"
              >
                <el-menu-item :index="`4-${index+1}`">{{item.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <span>系统管理</span>
              </template>
              <el-menu-item-group
                v-for="(item,index) of Exporter5"
                :key="item.id"
                @click.native="SweepPoint(item.id)"
              >
                <el-menu-item :index="`5-${index+1}`">{{item.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </el-col>
      <el-col
        :span="16"
        style="margin-left:15%"
      >
        <div class="grid-content bg-purple">
          <div id="1">
            <h3>用户登录</h3>
            <div class="ml-40">
              <p>系统登录的地址为：http://localhost:9527/#/login，用浏览器打开后显示界面如下图所示；输入用户名和密码之后，点击【Sign in】按钮，进入系统。</p>
              <img src="@/assets/help_images/login.png">
            </div>
          </div>
          <div id="2">
            <h3>首页</h3>
            <div class="ml-40">
              <p>登录成功进入首页，输入查询条件，点击【查看】曲线图显示该主机通道下的所有节点最近的温度数据，XY轴可以缩放，标移动上去时可查看节点的相关信息。若有节点报警，曲线图上需要显示报警的区间，同时用颜色表示报警的类型（红色为山火，蓝色为覆冰）</p>
              <img
                width="100%"
                src="../assets/help_images/dash.png"
              >
            </div>
          </div>
          <div id="3">
            <h3>开启二次绑定</h3>
            <div class="ml-40">
              <p>鼠标移至顶部右侧的图标，点击【开启二次绑定】弹窗绑定页面 如下图所示</p>
              <img
                width="100%"
                src="../assets/help_images/nav.png"
              >
              <img
                style="margin-top:10px"
                width="100%"
                src="../assets/help_images/binding.png"
              >
              <img
                style="margin-top:10px"
                width="100%"
                src="../assets/help_images/binding2.png"
              >
              <p>打开微信小程序二次验证码扫描二维码后绑定该用户，则出现验证码。输入验证码 提交后绑定成功，则下次用户登录时，还需输入正确的动态验证码才可登录成功，否则验证失败。如下图所示</p>
              <img
                style="margin-top:10px"
                width="100%"
                src="../assets/help_images/binding3.png"
              >
            </div>
          </div>
          <div id="4">
            <h3>关闭二次绑定</h3>
            <div class="ml-40">
              <p>成功开启二次绑定后，鼠标移至顶部右侧的图标，点击【关闭二次绑定】弹窗绑定页面如下图所示，打开微信小程序二次验证码绑定该用户，输入验证码 提交后关闭绑定成功。下次用户登录时无需验证。</p>
              <img src="../assets/help_images/closebinding.png">
              <img src="../assets/help_images/closebinding2.png">
            </div>
          </div>
          <div id="5">
            <h3>修改密码</h3>
            <div class="ml-40">
              <p>鼠标移至顶部右侧的图标，点击【修改密码】弹窗修改密码如下图所示</p>
              <img src="../assets/help_images/setpwd.png">
              <p>输入旧密码，新密码，点击【提交】修改密码成功，退出当前的登录状态。回到登录页面 输入账号以及新修改的密码 重新登录</p>
              <img src="../assets/help_images/setpwd2.png">
            </div>
          </div>
          <div id="6">
            <h3>退出登录</h3>
            <div class="ml-40">
              <p>鼠标移至顶部右侧的图标，点击【退出】弹出二次确认框 确定退出管理平台吗?确定后退出当前登录平台，回到登录页面</p>
              <img src="../assets/help_images/logout.png">
              <img
                class="mt-10"
                src="../assets/help_images/logout2.png"
              >
            </div>
          </div>
          <div id="7">
            <h3>主机管理</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【路由管理】→【主机管理】 进入主机管理页面，如下图所示
                注意！未关联维保单位的用户可以查看所有的主机，且可以添加主机。已关联维保单位的用户只能查看自己所属单位所关联的节点，以及节点所属的主机，不能添加主机
              </p>
              <img src="../assets/help_images/host.png">
              <p>点击【添加】按钮 弹窗添加主机页面，录入新增主机信息，点击【提交】，添加主机成功，注意！主机编号唯一，用于区分不同主机</p>
              <img src="../assets/help_images/host2.png">
              <p>点击【编辑】按钮 弹窗编辑主机页面，修改主机信息后，点击【提交】，修改主机信息成功,
                点击【删除】弹出二次确认框 删除警告提示删除此主机还会删除相关的通道，节点，报警数据等信息? 确定后删除相关信息成功
              </p>
              <img src="../assets/help_images/deleteHost.png">
            </div>
          </div>
          <div id="8">
            <h3>通道管理</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【路由管理】→【通道管理】 进入通道管理页面，如下图所示
                注意！未关联维保单位的用户可以查看所有的通道，且可以添加通道。已关联维保单位的用户只能查看自己所属单位所关联的节点，以及节点所属的通道，不能添加通道
              </p>
              <img src="../assets/help_images/channel.png">
              <p>点击【添加】按钮 弹窗添加通道页面，录入新增通道信息，点击【提交】添加通道成功，注意！一个主机可以有多条通道，每条通道必须添加通道编号，因此同一主机下通道编号唯一</p>
              <img src="../assets/help_images/channel2.png">
              <p>【设置】基准温度。基准距离之间的基准温度，使用线性方程计算y = (y2*(x-x1) + y1*(x2-x)) / (x2-x1)，其中x为距离，y为温度</p>
              <img src="../assets/help_images/fiducialTemp.png">
              <p>点击【编辑】按钮 弹窗编辑通道页面，修改通道信息后，点击【提交】，修改通道信息成功
                点击【删除】弹出二次确认框 确定删除该通道信息吗? 确定后删除通道成功
              </p>
              <p>点击【删除】弹出二次确认框 删除警告提示删除此通道还会删除相关的节点，报警数据等信息? 确定后删除相关信息成功</p>
              <img src="../assets/help_images/deleteChannel.png">
            </div>
          </div>
          <div id="9">
            <h3>节点管理</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【路由管理】→【节点管理】 进入节点管理页面，如下图所示
                注意！未关联维保单位的用户可以查看所有的节点，且可以添加节点。已关联维保单位的用户只能查看自己所属单位所关联的节点，不能添加节点
              </p>
              <img src="../assets/help_images/node.png">
              <p>点击【添加】按钮 弹窗添加节点页面，录入新增节点信息，点击【提交】添加节点成功</p>
              <img src="../assets/help_images/node2.png">
              <p>点击【编辑】按钮 弹窗编辑节点页面，修改节点信息后，点击【提交】，修改节点信息成功</p>
              <p>点击【删除】弹出二次确认框 删除警告提示删除此节点还会删除相关的报警数据等信息? 确定后删除相关信息成功</p>
              <img src="../assets/help_images/deleteNode.png">
              <p>点击【导出】按钮，将节点管理页面的信息以excel表格形式导出存到本地</p>
              <img src="../assets/help_images/node3.png">
            </div>
          </div>
          <div id="10">
            <h3>单位管理</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【维保管理】→【单位管理】 进入单位管理页面，如下图所示
                注意！管理单位的用户不用关联单位，可以查看和管理各个单位的信息。维保单位的用户需要关联单位，只能查看和修改自己单位的信息
              </p>
              <img src="../assets/help_images/unit.png">
              <p>点击【添加】按钮 弹窗添加单位页面，录入新增单位信息，点击【提交】添加单位成功</p>
              <img src="../assets/help_images/unit2.png">
              <p>点击【编辑】按钮 弹窗编辑单位页面，修改单位信息后，点击【提交】，修改单位信息成功</p>
              <p>点击【删除】弹出二次确认框 确定删除该单位信息吗? 若单位下已关联用户，则删除失败给出提示。若单位未关联用户，确定后删除单位成功</p>
              <p>点击【节点】按钮 弹窗节点权限页面，单位可以关联需要管理的节点，点击【提交】后，关联了对应维保单位的用户只能查看自己所属单位所关联的节点和对应的主机和通道</p>
              <img src="../assets/help_images/unit3.png">
            </div>
          </div>
          <div id="11">
            <h3>撤防历史</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【维保管理】→【撤防历史】 进入撤防历史页面，在通道管理页面通道操作撤/布防之后，列表则新增一条信息 ，每次撤防时添加开始时间，布防时添加结束时间。如下图所示</p>
              <img src="../assets/help_images/withdraw.png">
            </div>
          </div>
          <div id="12">
            <h3>实时温度</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【维保管理】→【实时温度】 进入实时温度页面，输入查询条件，点击【查看】曲线图显示该主机通道下的为实时温度，X轴可以缩放，Y轴通过显示倍率来缩放，默认为2倍。当数据过多时，温度和距离取平均值，最多只显示1000个点。如下图所示</p>
              <img src="../assets/help_images/temperature.png">
            </div>
          </div>
            <div id="13">
            <h3>历史温度</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【维保管理】【历史温度】 进入历史温度页面，输入查询条件，点击【查看】曲线图显示该主机通道下的历史温度（使用绝对温度=原始温度+通道设置的基准温度），X轴可以缩放，Y轴通过显示倍率来缩放，默认为2倍。时间下拉框显示数据库中历史温度的温度采集时间，倒序排列。历史温度保存7天</p>
              <img src="../assets/help_images/historyTemp.png">
            </div>
          </div>
          <div id="14">
            <h3>报警管理</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【报警管理】→【报警管理】 进入报警管理页面，如下图所示，页面展示所有的报警信息。对接收到的报警做一个处理流程的操作，可以查看每个时间段中报警的详细数据</p>
              <img src="../assets/help_images/alarm.png">
              <p>(1) 接收到报警信息 未读状态，这时【开始处理】按钮置灰。点击查看报警【详情】</p>
              <img src="../assets/help_images/alarm2.png">
              <p>(2) 查看详情后为 待处理状态，才能点击【开始处理】，点击后变为处理中状态，按钮为【完成处理】</p>
              <img src="../assets/help_images/alarm3.png">
              <p>(3) 点击【完成处理】确认情况属实。则状态变为已完成，可以操作【提交报告】</p>
              <img src="../assets/help_images/alarm4.png">
              <img src="../assets/help_images/alarm5.png">
              <p>点击【提交报告】 输入报告内容，点击【提交】报告成功</p>
              <img src="../assets/help_images/alarm6.png">
              <p>这时状态变为已提交，可操作【查看报告】</p>
              <img src="../assets/help_images/alarm7.png">
              <p>(4) 点击【完成处理】确认情况不属实，则状态变为不属实，可操作【查看报告】</p>
              <img src="../assets/help_images/alarm8.png">
              <p>【查看报告】</p>
              <img src="../assets/help_images/alarm9.png">
            </div>
          </div>
          <div id="15">
            <h3>离线历史</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【报警管理】→【离线历史】 进入主机管理页面，如下图所示，页面展示每个主机离线的时间段，并添加备注</p>
              <img src="../assets/help_images/Offlinehistory.png">
            </div>
          </div>
          <div id="16">
            <h3>角色管理</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【系统管理】→【角色管理】 进入角色管理页面，如下图所示，页面展示所有的角色信息</p>
              <img src="../assets/help_images/role.png">
              <p>点击【添加】按钮弹窗添加角色页面，录入新增角色信息，点击【提交】，添加角色成功</p>
              <img src="../assets/help_images/role2.png">
              <p>【是否启用】为绿色时当前角色可用，添加账号时可以关联该角色，为红色时则不可用，添加账号时不可选择关联。点击按钮实现状态的转换
                点击【编辑】按钮弹窗编辑角色页面，修改角色信息后，点击【提交】，修改角色成功
                点击【权限】按钮弹窗分配权限页面，如下图所示，页面展示所有的模块数据，根据实际情况勾选对应模块前的单选框，点击【提交】按钮后，角色便可拥有所选模块的访问权限；管理员默认拥有所有模块的访问权限
              </p>
              <img src="../assets/help_images/role3.png">
            </div>
          </div>
          <div id="17">
            <h3>账号管理</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【系统管理】→【账号管理】 进入账号管理页面，如下图所示，页面展示所有的账号信息</p>
              <img src="../assets/help_images/account.png">
              <p>点击【添加】按钮弹窗添加账号页面，录入新增账号信息，点击【提交】，添加账号成功。注意！用户关联单位后，只能查看自己单位的用户，仅未关联单位的管理人员可以查看所有的用户</p>
              <img src="../assets/help_images/account 2.png">
              <p>【是否启用】为绿色时当前账号可用登录，为红色时则不可用登录。点击按钮实现状态的转换；管理员账号默认启用
                点击【编辑】按钮弹窗编辑账号页面，修改账号信息后，点击【提交】，修改账号成功
                点击【详情】按钮弹窗详情页面，展示账号的详细信息
              </p>
              <p>如有用户忘记密码时，可点击【重置密码】完成密码重置，原始密码为123456</p>
            </div>
          </div>
          <div id="18">
            <h3>系统日志</h3>
            <div class="ml-40">
              <p>点击左侧导航栏【系统管理】→【系统日志】 进入系统日志页面，如下图所示，查看每个用户对系统进行的一些如登录、编辑、添加、删除的操作的记录 </p>
              <img src="../assets/help_images/log.png">
            </div>
          </div>
        </div>
      </el-col>
      <div class="p_fixed">
        <div class="d_block">
          <p
            class="p1"
            @click="SweepPoint(1)"
          >回到顶部</p>
          <p
            class="p2"
            @click="backHomepage"
          >返回首页</p>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Exporter1: [
        { title: "用户登录", id: 1 },
        { title: "首页", id: 2 },
        { title: "开启二次绑定", id: 3 },
        { title: "关闭二次绑定", id: 4 },
        { title: "修改密码", id: 5 },
        { title: "退出登录", id: 6 }
      ],
      Exporter2: [
        { title: "主机管理", id: 7 },
        { title: "通道管理", id: 8 },
        { title: "节点管理", id: 9 }
      ],
      Exporter3: [
        { title: "单位管理", id: 10 },
        { title: "撤防历史", id: 11 },
        { title: "实时温度", id: 12 },
        { title: "历史温度", id: 13 }
      ],
      Exporter4: [{ title: "报警管理", id: 14 }, { title: "离线历史", id: 15 }],
      Exporter5: [
        { title: "角色管理", id: 16 },
        { title: "账号管理", id: 17 },
        { title: "系统日志", id: 18 }
      ],
      scrollTop: 0,
      path: ""
    };
  },
  methods: {
    handleOpen() { },
    handleClose() { },
    // 瞄 点
    SweepPoint(val) {
      // window.location.hash = `#${val}`;
      document.getElementById(val).scrollIntoView(true)
      // document.querySelector(`#${val}`).scrollIntoView(true);
    },
    // 返回首页
    backHomepage() {
      this.$router.push("/")
    },
    // 清空浏览器历史记录
    // pushHistory() {
    //   var url = "#";
    //   var state = {
    //     title: "title",
    //     url: "#"
    //   }
    //   window.history.pushState(state, "title", "#")
    // }
  },
  mounted() {
    // this.pushHistory()
    // window.addEventListener("popstate", function (e) {
    // }, false);
    // pushHistory()
    window.onscroll = function () {
      this.scrollTop = document.documentElement.scrollTop;
      var ele = document.querySelector(".p_fixed");
      if (ele != null) {
        if (scrollTop > 30) {
          ele.style.display = "block";
        } else {
          ele.style.display = "none";
        }
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.path = from.path;
    })
    // ...
  }
};
</script>

<style scoped>
.el-menu {
  height: 100vh;
}
.ml-40 {
  margin-left: 40px;
}
.mt-10 {
  margin-top: 10px;
}
.p_fixed {
  position: fixed;
  display: none;
  top: 50%;
  right: 100px;
}
.d_block {
  display: block;
  width: 100px;
  height: 100px;
  background-color: rgba(130, 160, 200, 0.6);
  border-radius: 50%;
  line-height: 50px;
  text-align: center;
}
.p1:hover {
  color: #fff;
  cursor: pointer;
}
.p2:hover {
  color: #fff;
  cursor: pointer;
}
.p1,
.p2 {
  margin: 0;
  display: block;
  height: 30px;
  line-height: 66px;
}
img {
  width: 100%;
}
</style>
