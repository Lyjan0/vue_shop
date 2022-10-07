<template>
  <div class="rights">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 权限列表 -->
      <el-table
        :data="rightsList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="60">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
        >
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级"
        >
          <template slot-scope='{row}'>
            <el-tag v-if="row.level == '0'">一级</el-tag>
            <el-tag v-if="row.level == '1'" type="success">二级</el-tag>
            <el-tag v-if="row.level == '2'" type="warning">三级</el-tag>
          </template>

        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: 'Rights',
  data(){
    return {

    }
  },
  mounted(){
    this.getData('list');
  },
  methods:{
    // 发请求，获取权限列表数据
    getData:function(type){
      this.$store.dispatch('getRightsList',type);
    }

  },
  computed:{
    ...mapState({
      rightsList: state => state.permissions.rightsList || [],
    })
  }
}
</script>

<style scoped lang="less">
.rights{
  
  .el-breadcrumb{
    margin-bottom: 10px;
  }
}
</style>