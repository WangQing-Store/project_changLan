<template>
  <el-menu
    class="navbar"
    mode="horizontal"
  >
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb />
    <h3>超长电缆安全监控系统管理平台</h3>
    <el-dropdown
      class="avatar-container"
      trigger="click"
    >
      <div class="avatar-wrapper">
        <p style="margin-right:20px">当前用户：{{`${$store.state.user.userName}(${$store.state.user.name})`}}</p>
        <img
          src="@/assets/ExpandDown.png"
          class="user-avatar"
        />
      </div>
      <el-dropdown-menu
        slot="dropdown"
        class="user-dropdown"
      >
        <!--<router-link class="inlineBlock" to="/">-->
        <el-dropdown-item>
          <span
            style="display:block;"
            @click="handleUpdatePwd"
          >修改密码</span>
        </el-dropdown-item>
        <!-- 二次绑定 -->
        <el-dropdown-item>
          <span
            style="display:block;"
            @click="TheSecondBinding"
            v-show="!$store.state.user.BindingState"
          >开启二次绑定</span>
        </el-dropdown-item>
        <!-- 取消绑定 -->
        <el-dropdown-item>
          <span
            style="display:block;"
            @click="unbind"
            v-show="$store.state.user.BindingState"
          >取消二次绑定</span>
        </el-dropdown-item>
        <!-- 帮助 -->
        <el-dropdown-item>
          <span
            style="display:block;"
            @click="help"
          >帮助</span>
        </el-dropdown-item>
        <!--</router-link>-->
        <el-dropdown-item divided>
          <span
            style="display:block;"
            @click="logout"
          >退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      :visible.sync="dialogVisible"
      title="修改密码"
    >
      <el-form
        ref="dataForm"
        :rules="pwdRules"
        :model="temp"
        label-position="left"
        label-width="100px"
      >
        <el-form-item
          label="原密码"
          prop="oldPassword"
        >
          <el-input
            v-model="temp.oldPassword"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model="temp.newPassword"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPwd"
        >
          <el-input
            v-model="temp.confirmPwd"
            type="password"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="updatePwdData(temp.oldPassword, temp.newPassword)"
        >提交</el-button>
      </div>
    </el-dialog>
    <!-- 二次绑定 -->
    <el-dialog
      :visible.sync="TheSecondBindingDialogVisible"
      width
      @close="closeTheSecondBindingDialog"
    >
      <el-steps
        :active="active+1"
        finish-status="success"
      >
        <el-step
          title="步骤 1"
          description="扫描二维码获取动态密码"
        ></el-step>
        <el-step
          title="步骤 2"
          description="请输入动态密码"
        ></el-step>
      </el-steps>
      <div class="TheSecondBindingBox">
        <div
          id="qrcode"
          v-show="active==0"
          ref="qrCodeUrl"
        ></div>
        <div v-show="active==0">
          <p>请使用以下工具扫描二维码</p>
          <p>Google身份验证器</p>
          <p>Authy</p>
          <p>FreeOTP</p>
          <p>二次验证小程序</p>
          <p>其他基于TOTP算法的APP</p>
          <p>然后输入手机上显示的6位动态验证码</p>
        </div>
      </div>
      <div v-show="active==1">
        <el-input
          placeholder="请输入动态密码"
          v-model="dynamicPassword"
        ></el-input>
      </div>
      <div style="text-align: right">
        <el-button
          style="margin-top: 12px;"
          @click="next(-1)"
          v-show="active!=0"
        >上一步</el-button>
        <el-button
          style="margin-top: 12px;"
          @click="next(1)"
          v-show="active!=1"
        >下一步</el-button>
        <el-button
          style="margin-top: 12px;"
          @click="next(1)"
          v-show="active==1"
        >提交</el-button>
      </div>
    </el-dialog>
    <!-- 解除绑定 -->
    <el-dialog :visible.sync="unboundDialogVisible">
      <div class="TheSecondBindingBox">
        <div>
          <p>关闭二次验证后将无法保护你的账号安全！</p>
        </div>
        <el-input
          placeholder="请输入动态密码"
          v-model="unboundDynamicPassword"
        ></el-input>
      </div>
      <div style="text-align:right">
        <el-button
          style="margin-top: 12px;"
          @click="unboundDialogVisible=false"
        >取消</el-button>
        <el-button
          style="margin-top: 12px;"
          @click="confirmUnbound"
        >确定</el-button>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import {
  SecondaryValidation,
  SecondaryValidationURL,
  removeSecret
} from "@/api/navbar";
import QRCode from "qrcodejs2";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { updatePwd } from "@/api/system/account";
import md5 from "js-md5";
import { timer } from "@/utils/timer";
import { isUpdatePwd } from "@/api/navbar";
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  data() {
    const dateIsEqual = (rule, value, callback) => {
      // console.log(value)
      if (value === "" || value === null) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.temp.newPassword) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    const self = this;
    return {
      timerId: "",
      dialogVisible: false,
      temp: {
        oldPassword: "",
        newPassword: "",
        confirmPwd: ""
      },
      updatePwdQuery: {
        oldPwd: "",
        newPwd: ""
      },
      pwdRules: {
        oldPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 8, message: "长度至少要8个字符" },
          {
            pattern: /^(?=.*[a-z\d])(?=.*[a-z!@#$%^&*])(?=.*[!@#$%^&*\d]).{8,}$/gi,
            message: "密码至少选择数字,字母,特殊符号两种规则"
          }
        ],
        confirmPwd: [
          { required: true, validator: dateIsEqual, trigger: "blur" }
        ]
      },
      active: 0,
      link: "",
      dynamicPassword: "", //动态密码
      unboundDynamicPassword: "",
      TheSecondBindingDialogVisible: false,
      unboundDialogVisible: false,
      secret: ""
    };
  },
  mounted() {
    // console.log(this.$store.getters.getBindingState);
    self.timerId = timer();
    isUpdatePwd(this.$store.state.user.userId).then(res => {
      if (res.data.code == 200 && res.data.data == true) {
        this.$notify({
          title: "温馨提示",
          message: "你已6个月没修改密码了",
          position: "bottom-right",
          duration: 0
        });
      }
    });
  },
  methods: {
    resetTemp() {
      this.temp = {
        oldPassword: "",
        newPassword: "",
        confirmPwd: ""
      };
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    // logout() {
    //   this.$store.dispatch('LogOut').then(() => {
    //     location.reload() // 为了重新实例化vue-router对象 避免bug
    //   })
    // }
    logout() {
      this.$confirm("您确定要退出吗?", "退出管理平台", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        clearInterval(self.timerId);
        const info = {
          Authorization: localStorage.getItem("Authorization")
        };
        this.$store.dispatch("FedLogOut", info).then(() => {
          this.$router.push({ path: "/login" });
        });
      });
    },
    handleUpdatePwd() {
      this.resetTemp();
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields()
      })
    },
    updatePwdData(oldPassword, newPassword) {
      this.$refs["dataForm"].validate(valid => {
        this.updatePwdQuery.newPwd = md5(newPassword);
        this.updatePwdQuery.oldPwd = md5(oldPassword);
        if (valid) {
          updatePwd(this.updatePwdQuery).then(response => {
            if (response.data.code == 200) {
              this.dialogVisible = false;
              this.$notify({
                title: "成功",
                message: "修改成功，请重新登录",
                type: "success",
                duration: 2000
              });
              const info = {
                Authorization: localStorage.getItem("Authorization")
              };
              this.$store.dispatch("FedLogOut", info).then(() => {
                this.$router.push({ path: "/login" });
              });
            } else {
              this.$notify({
                title: "失败",
                message: "密码错误，请重新输入",
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },
    // 二次绑定
    TheSecondBinding() {
      this.dynamicPassword = "";
      this.TheSecondBindingDialogVisible = true;
      SecondaryValidationURL().then(res => {
        // console.log(res);
        this.link = res.data.data;
        this.secret = res.data.data.split("=")[1];
        this.$nextTick(function () {
          this.qrcode();
        });
      });
    },
    // 取消绑定
    unbind() {
      this.unboundDynamicPassword = "";
      this.unboundDialogVisible = true;
    },
    confirmUnbound() {
      if (this.unboundDynamicPassword == "") {
        this.$message({
          type: "info",
          message: "请输入动态密码"
        });
        return;
      }
      removeSecret({ code: this.unboundDynamicPassword }).then(res => {
        // console.log(res, 1);
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "解绑成功"
          });
          this.$store.commit("setBindingState", res.data.data);
        } else {
          this.$message.error(res.data.msg);
        }
        this.unboundDialogVisible = false;
      });
    },
    // 步骤
    next(n) {
      // console.log(this.active);
      this.active += n;
      if (this.active >= 2) {
        if (this.dynamicPassword == "") {
          this.active = 1;
          this.$message({
            type: "info",
            message: "请输入动态密码"
          });
          return;
        }
        SecondaryValidation({ code: this.dynamicPassword, secret: this.secret }).then(res => {
          // console.log(res);
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "绑定成功"
            });
            this.$store.commit("setBindingState", res.data.data);
            this.TheSecondBindingDialogVisible = false;
          } else {
            this.active = 1;
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    // 关闭二次绑定模态窗
    closeTheSecondBindingDialog() {
      this.active = 0;
      document.getElementById("qrcode").innerHTML = "";
    },
    // 生成二维码
    qrcode() {
      let that = this;
      // console.log(that.link);
      let qrcode = new QRCode(this.$refs.qrCodeUrl, {
        width: 200,
        height: 200, // 高度
        text: that.link, // 二维码内容
        colorDark: "#000000",
        colorLight: "#ffffff"
        // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f',   // 背景色
        // foreground: '#ff0'    // 前景色
      });
    },
    // 帮助
    help() {
      this.$router.push("/help")
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  // line-height: 50px;
  h3:focus {
    border: none;
    outline: none;
  }

  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      display: flex;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  .TheSecondBindingBox {
    text-align: center;
  }
  #qrcode {
    padding: 10px;
    margin-bottom: 10px;
    display: inline-block;
    img {
      width: 132px;
      height: 132px;
      background-color: #fff; //设置白色背景色
      padding: 6px; // 利用padding的特性，挤出白边
      box-sizing: border-box;
    }
  }
}
</style>
