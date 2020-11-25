import { login, getInfo, twoLogin } from "@/api/login";
import {
  getToken,
  setToken,
  removeToken,
  setDict,
  setRoleType,
  setWorkFlow
} from "@/utils/auth";
import { getSide, generaMenu } from "@/api/system/role";
import router from "@/router";
import { constantRouterMap } from "@/router";
import { Message } from "element-ui";

const user = {
  state: {
    token: getToken(),
    name: "",
    userName: "",
    avatar: "",
    roles: [],
    routers: constantRouterMap,
    addRouters: [],
    userId: "",
    BindingState: "", //绑定状态
    isUnitId: ""
  },

  mutations: {
    SET_USERID: (state, userId) => {
      state.userId = userId;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName;
    },
    SET_ISUNITID: (state, isUnitId) => {
      state.isUnitId = isUnitId;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_ROUTER: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
      router.options.routes = state.routers;
      router.addRoutes(state.routers);
      // console.log(router);
    },
    CLEAR_ROUTER: (state, routers) => {
      router.options.routes = routers;
    },
    setBindingState: (state, val) => {
      state.BindingState = val;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      commit("SET_ROLES", [], { root: true });
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(response => {
            const data = response.data;
            if (data.msg) {
              Message.error(data.msg);
            }
            // console.log(data)
            if (!data.data.isBinding) {
              setToken(data.data.jws);
              localStorage.setItem("ExpirationTime", data.data.expirationTime);
              commit("SET_TOKEN", data.data.jws);
            }
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    TwoLogin({ commit }, obj) {
      return new Promise((resolve, reject) => {
        twoLogin(obj)
          .then(res => {
            if (res.data.code == 200) {
              setToken(res.data.data.jws);
              localStorage.setItem(
                "ExpirationTime",
                res.data.data.expirationTime
              );
              commit("SET_TOKEN", res.data.data.jws);
            }
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(response => {
            const data = response.data;
            // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            //   commit('SET_ROLES', data.roles)
            // } else {
            //   reject('getInfo: roles must be a non-null array !')
            // }
            commit("SET_ISUNITID", data.data.isUnitId);
            commit("SET_NAME", data.data.username);
            commit("SET_USERNAME", data.data.name);
            commit("SET_USERID", data.data.id);
            // commit('SET_AVATAR', data.avatar)
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("SET_TOKEN", "");
            // commit('SET_ROLES', [])
            removeToken();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    GenerateRoutes({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (localStorage.getItem("Router") == null) {
          getSide()
            .then(response => {
              const data = response.data.data;
              if (data.length == 0) {
                alert("此账号关联权限出错,请联系管理员");
                removeToken();
                resolve();
              } else {
                const routers = [];
                generaMenu(routers, data);
                // console.log(routers)
                commit("SET_ROUTER", routers);
                localStorage.setItem("Router", JSON.stringify(routers));
                resolve();
              }
            })
            .catch(error => {
              reject(error);
            });
        } else {
          commit("SET_ROUTER", JSON.parse(localStorage.getItem("Router")));
          resolve();
        }
      });
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        commit("CLEAR_ROUTER", "");
        removeToken();
        localStorage.removeItem("ExpirationTime");
        localStorage.removeItem("Router");
        localStorage.removeItem("Dict");
        localStorage.removeItem("workflow");
        localStorage.removeItem("RoleType");
        localStorage.removeItem("editPidData");
        localStorage.removeItem("pageId");
        // 清除历史温度数据
        sessionStorage.removeItem("hostName");
        sessionStorage.removeItem("channelName");
        sessionStorage.removeItem("passageId");
        sessionStorage.removeItem("createTimeData");
        sessionStorage.removeItem("passList");
        sessionStorage.removeItem("dateList");
        resolve();
      });
    }
  }
};

export default user;
