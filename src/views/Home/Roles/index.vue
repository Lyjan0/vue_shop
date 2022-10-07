<template>
  <div class="roles">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary">添加角色</el-button>
      <!-- 角色列表表格 -->
      <el-table
        :data="rolesList"
        style="width: 100%"
        border
      >
        <el-table-column
          type="expand"
          width="60"
        >
        <template slot-scope='{row}'>
          <!-- 一级权限：开始 -->
          <el-row
            v-for="(itemL1,iL1) in row.children"
            :key="itemL1.id"
            :class="['bbottom',iL1 == 0 ? 'btop':'','vcenter']"
          >
            <el-col :span="4">
              <el-tag closable @close="removeRightsById(row,itemL1.id)">{{itemL1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限：开始 -->
              <el-row
                v-for="(itemL2,indexL2) in itemL1.children"
                :key="itemL2.id"
                :class="[indexL2 != 0 ?'btop':'','vcenter']"
              >
                <el-col :span="6">
                  <el-tag closable type="success" @close="removeRightsById(row,itemL2.id)">{{itemL2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <!-- 三级权限:开始 -->
                    <el-tag
                      closable
                      type="warning"
                      :key="itemL3.id"
                      v-for="itemL3 in itemL2.children"
                      @close="removeRightsById(row,itemL3.id)"
                    >
                      {{itemL3.authName}}
                    </el-tag>
                    <!-- 三级权限:结束 -->
                </el-col>

              </el-row>
              <!-- 二级权限：结束 -->
            </el-col>
          </el-row>
          <!-- 一级权限：结束 -->
        </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="60"
          label="#"
        >
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
        >
        <template slot-scope='{row}'>
          <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRolesDialog(row)">分配权限</el-button>
        </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框: 开始 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRolesDialogTableVisible"
      width="50%"
      @close="setRolesDialogClose"
    >

      <!-- 树形控件 -->
      <el-tree
      ref="treeRef"
      :data="rightsList"
      show-checkbox
      :props="defaultProps"
      node-key="id"
      default-expand-all
      :default-checked-keys="defaultCheck"

      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框: 结束 -->
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: 'Roles',
  data(){
    return {
      // 控制分配权限对话框的显示或隐藏
      setRolesDialogTableVisible: false,
      // 树形控件显示设置
      defaultProps: {
        // 指定子树为节点对象的某个属性值
        children: 'children',
        // 指定节点标签为节点对象的某个属性值
        label: 'authName'
      },
      // 树形选中id
      defaultCheck:[],

      // 当前分配权限id
      rolesId: '',

    }
  },
  mounted(){
    this.getRolesData();
  },
  methods:{
    // 发请求获取角色列表
    getRolesData: function(){
      this.$store.dispatch('getRolesList');
    },
    // 发请求获取权限列表(树形)
    getRightsData: function(type){
      this.$store.dispatch('getRightsList',type);
    },

    // 点击tag标签x删除该权限
    removeRightsById:async function(roles,rightsId){

      const result = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err=> err);

      if(result == 'cancel'){
        return this.$message.info('已取消删除');
      }else if(result == 'confirm'){
        try {
          let rolesData = await this.$store.dispatch('removeRightsById',{rolesId:roles.id,rightsId});
          roles.children = rolesData.data;
          this.$message.success(rolesData.meta.msg);
        } catch (error) {
          return this.$message.error(error);
        }
      }


    },

    // 点击操作：分配按钮展开对话框
    showSetRolesDialog:async  function(row){
      this.rolesId = row.id;
      // 获取权限数据
      await this.getRightsData('tree');
      // 筛选选中的三级权限id
      this.checkLevel3Id(row,this.defaultCheck);

      // 展开对话框
      this.setRolesDialogTableVisible = true;
    },

    // 筛选选中的三级权限id
    checkLevel3Id: function(node,arr){
      if(!node.children){
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        return this.checkLevel3Id(item,arr);
      });

    },

    // 监听分配权限对话框的关闭回调
    setRolesDialogClose: function(){
      this.defaultCheck = [];
    },
    // 分配权限对话框确认按钮回调
    allotRights:async  function(){
      // getCheckedKeys返回的是树形控件当前选中的节点key
      // getHalfCheckedKeys半选中节点key
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];

      const rids = keys.join(',');
      try {
        const msg = await this.$store.dispatch('allotRights',{rolesId:this.rolesId,rids});
        this.$message.success(msg);
        this.getRolesData();
        // 关闭对话框
        this.setRolesDialogTableVisible = false;

      } catch (error) {
        return this.$message.error(error);
      }



    }
  },
  computed:{
    // 角色列表
    ...mapState({
      rolesList: state => state.permissions.rolesList || [],
      rightsList: state => state.permissions.rightsList || [],
    }),
  }

}
</script>

<style scoped lang="less">

.roles{
  .el-breadcrumb{
    margin-bottom: 10px;
  }
  .el-card{
    .el-button{
      margin-bottom: 10px;
    }
    .el-col{
      min-width: 115px;
    }
    .el-tag{
      margin: 7px;
    }

  }
}
.btop{
  border-top: 1px solid #ccc;
}
.bbottom{
  border-bottom: 1px solid #ccc;
}
.vcenter{
  display: flex;
  align-items: center;
}

</style>