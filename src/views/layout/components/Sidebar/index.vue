<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  // inject:['reload'],
  // data(){
  //   return{
  //     routes:''
  //   }
  // },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar',
    ]),
    routes() {
      // console.log(123)
      // console.log(1)
      // console.log(this.$router.options.routes)
      // console.log(this.$store.state.user.routers)
      // return this.$router.options.routes
      return this.$store.state.user.routers;
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  // created(){
  //   //在页面加载时读取localStorage里的状态信息
  //   localStorage.getItem("userMsg") && this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(localStorage.getItem("userMsg"))));
  //
  //   //在页面刷新时将vuex里的信息保存到localStorage里
  //   window.addEventListener("beforeunload",()=>{
  //     localStorage.setItem("userMsg",JSON.stringify(this.$store.state))
  //   })
  // }

}
</script>
