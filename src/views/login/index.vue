<template>
  <div>
    <div class="login-container">
      <el-form
        :rules="pwdRules"
        ref="loginForm"
        :model="loginForm"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <h3 class="title">超 长 电 缆 安 全 监 控 系 统 管 理 平 台</h3>
        <el-form-item prop="username">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            v-model="loginForm.username"
            name="username"
            type="text"
            auto-complete="on"
            placeholder="username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :type="pwdType"
            v-model="loginForm.password"
            name="password"
            auto-complete="on"
            placeholder="password"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width:81%;"
            @click.native.prevent="handleLogin"
          >Sign in</el-button>
          <el-popover placement="bottom" trigger="hover">
            <el-button type="primary" slot="reference" style="padding: 9px 19px;">APP下载</el-button>
            <img :src="avatar" style="width: 200px; height: 200px" />
          </el-popover>
        </el-form-item>
      </el-form>
      <!-- 二次验证模态框 -->
    </div>
    <el-dialog title="二次验证" :visible.sync="dialogFormVisible" @close="closeDialogFormVisible">
      <div style="text-align:center">
        <p>动态验证码有4次的容错，也就是说最近2分钟的验证码都有效</p>
      </div>
      <el-input v-model="code" placeholder="请输入动态密码"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="VerifyModalTwice">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from "js-md5";
import avatar from "@/views/login/timg.jpg";
import { getSide } from "@/api/system/role";

export default {
  name: "Login",
  data() {
    const dateIsEqual = (rule, value, callback) => {
      // console.log(value)
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('仅支持英文或数字!'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loading: false,
      pwdType: "password",
      avatar: avatar,
      dialogFormVisible: false,
      code: "",
      pwdRules: {
        username: [
          { required: true, validator: dateIsEqual, trigger: "blur" },
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, validator: dateIsEqual, trigger: "blur" },
          { required: true, message: "密码不能为空", trigger: "blur" }
        ]
      },
    };
  },
  methods: {
    // /^(?=.*[a-z\d])(?=.*[a-z~!@#$%^&*()_<>])(?=.*[!~@#$%^&*()_<>\d]).{8,}$/gi
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginForm.password = md5(this.loginForm.password);
          this.loading = true;
          this.$store.dispatch("Login", this.loginForm).then(res => {
            //跳转之前处理
            if (res.data.data.isBinding) {
              this.dialogFormVisible = true;
              this.$store.commit("setBindingState", res.data.data.isBinding);
              //跳转
            } else {
              // getSide()
              //   .then(res => {
              //     //菜单权限数组
              //     var data = res.data.data;
              //     //存储所有具有编辑权限的父节点ID
              //     var editPid = [];
              //     if (data != null && data.length > 0) {
              //       for (let i = 0; i < data.length; i++) {
              //         //二级菜单
              //         //接收children数组
              //         var dataChildren = [];
              //         dataChildren = data[i].children;
              //         if (dataChildren != null && dataChildren.length > 0) {
              //           for (let d = 0; d < dataChildren.length; d++) {
              //             //三级菜单
              //             var threeChildren = [];
              //             threeChildren = dataChildren[d].children;
              //             if (
              //               threeChildren != null &&
              //               threeChildren.length > 0
              //             ) {
              //               for (let e = 0; e < threeChildren.length; e++) {
              //                 if (threeChildren[e].name == "编辑") {
              //                   editPid.push(threeChildren[e].parentId);
              //                 }
              //               }
              //             }
              //           }
              //         }
              //       }
              //     }
              //     localStorage.setItem(
              //       "editPidData",
              //       JSON.stringify(editPid)
              //     );
              //   })
              //   .catch(err => {
              //     console.log("登录用户权限获取出错" + err);
              //   });
              this.$router.push({ path: "/" });
              this.$store.commit("setBindingState", res.data.data.isBinding);
            }
          })
            .catch(() => {
              this.loginForm.password = "";
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    VerifyModalTwice() {
      this.$store
        .dispatch("TwoLogin", {
          code: this.code,
          ...this.loginForm
        })
        .then(res => {
          if (res.data.code == 200) {
            //登录成功
            //loading 收起来
            this.$message({
              type: "success",
              message: "登录成功"
            });
            this.loading = false;
            //跳转
            this.$router.push({ path: "/" });
          } else {
            this.$message.error('二次验证动态码错误');
          }
        });
    },
    closeDialogFormVisible() {
      this.loading = false;
      this.code = "";
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 15px 15px 15px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
