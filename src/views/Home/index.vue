<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="title">
        <img src="../../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单：开始 -->
        <div class="toggle-button" @click="changeCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#45afff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="submenu.order+ ''"
            v-for="submenu in menuList"
            :key="submenu.id"
          >
            <template slot="title">
              <i :class="iconObj[submenu.id]"></i>
              <span>{{submenu.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+item.path"
              v-for="item in submenu.children"
              :key="item.id"
              @click="savePath('/'+item.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 侧边栏菜单：结束 -->
      </el-aside>
      <!-- 内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import {mapState} from 'vuex';
export default {
  name: "Home",
  data(){
    return {
      // 左侧菜单图标
      iconObj:{
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },

      // 左侧菜单栏收起/展开标志
      isCollapse: false,

      // 子菜单选中
      activePath:'',
    }
  },
  mounted(){
    // 加载菜单列表
    this.getData();
    // 设置activePath的值
    this.activePath = window.sessionStorage.getItem('ACTIVEPATH');
  },
  methods:{
    // 退出登录
    logout: function(){
      this.$store.commit('CLEARUSERINFO');
      if(!this.$store.state.user.token){
        this.$router.push('/login');
      }
    },
    // 请求菜单列表
    getData: function(){
      this.$store.dispatch('reqMenuList');
    },

    // 点击收起/展开左侧菜单栏
    changeCollapse: function(){
      this.isCollapse = !this.isCollapse;
    },

    // 保存选中的二级菜单的路径
    savePath: function(path){
      this.activePath = path;
      // 本地化存储
      window.sessionStorage.setItem('ACTIVEPATH',path);
    }
  },

  computed:{
    ...mapState({
      menuList: state => state.permissions.menuList || [],
    })
  }
}
</script>

<style scoped lang="less">
  .el-container{
    overflow-y: hidden;
    height: 100vh;
    .el-header{
      background-color: #373d41;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title{
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: 50px;
          height: 50px;
        }
        span{
          margin-left: 20px;
          font-size: 25px;

        }
      }
    }
    .el-aside {
      overflow: hidden;
      background-color: #333744;
      color: #333;
      .toggle-button{
        background-color: #636d7f;
        line-height: 24px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
        letter-spacing: 0.1em;
      }
      .el-menu{
        border-right: none;
        .iconfont{
          margin-right: 8px;
        }
      }
    }
    .el-main {
      min-width: 900px;
      background-color: #eaedf1;
      color: #333;
    }
  }












</style>