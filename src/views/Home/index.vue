<template>
  <div class="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods:{
    // 退出登录
    logout: function(){
      this.$store.dispatch('logout')
      .then(()=>{
        //退出成功，跳转到登录页
        this.$router.push('/login');
      });
    }
  }
}
</script>

<style scoped lang="less">

</style>