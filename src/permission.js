import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { Message } from "element-ui";
import { getToken } from "@/utils/auth"; // 验权
// import {constantRouterMap} from './router'
const whiteList = ["/login"]; // 不重定向白名单
router.beforeEach(async (to, from, next) => {
  // console.log(store.getters.roles.length)
  if (to.path == from.path) {
    next();
    return;
  }
  NProgress.start();
  if (getToken()) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        try {
          const res = await store.dispatch("GetInfo");
          var roles = [res.data.data.username];
          store.commit("SET_ROLES", roles, { root: true });
          const accessRouter = await store.dispatch("GenerateRoutes");
          next({ ...to, replace: true });
        } catch (err) {
          store.dispatch("FedLogOut").then(() => {
            Message.error(err || "Verification failed, please login again");
            next({
              path: "/"
            });
            NProgress.done();
          });
        }
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next("/login");
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
