<template>
  <div></div>
</template>

<script>
  export default {
    name: 'empty',
    data(){
      return{
        isone:''
      }
    },
    created() {
      // this.$router.push('/system/role')
      // console.log(123456)
      // this.$router.go(-1);
    },
    mounted() {
        // this.isone = 1;
        this.$router.push('/system/role')
        // console.log(123456)
    },
    // deactivated() {
    //   this.$destroy()
    // },
  }
</script>

<style scoped>

</style>
