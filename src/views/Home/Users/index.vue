<template>
  <div class="users">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容 -->
    <el-card class="box-card">
      <!-- 搜索/添加 -->
      <el-row :gutter="20" class="input-add">
        <el-col :span="12">
          <el-input @clear="getData" clearable v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getData" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="dialogVisible = true" type="primary">添加</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <!-- :data="tableData" -->
      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="#"
          width="60"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.mg_state"
              active-color="#1d85ec"
              inactive-color="#ff4949"
              @change="changeState(row)"
            >
            </el-switch>
          </template>

        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
        <template slot-scope='{row}'>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(row.id)"></el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="allocationRoles(row)"></el-button>
          </el-tooltip>

        </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 4, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <!-- :before-close="handleClose" -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClosed"
      :close-on-click-modal="false"
    >
      <!-- 添加用户信息收集表单 -->
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户信息的对话框 -->
    <el-dialog
      @close="editDialogClosed"
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="editUserForm" :rules="rules" ref="editUserForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 操作：分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      width="50%"
    >
      <div class="username">当前的用户：{{userInfo.username}}</div>
      <div class="roles">当前的角色：{{userInfo.role_name}}</div>
      <!-- 下拉选择框 -->
      <div class="select">
        <span class="title">分配新角色：</span>
        <el-select v-model="selectValue"  placeholder="请选择">
           <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoles">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
let cloneDeep = require('lodash/cloneDeep.js');
import {mapState} from 'vuex';
export default {
  name: 'Users',
  data(){
    // 校验邮箱规则
    var validateEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9])+(\.[a-zA-Z0-9_-])+/;
      if(regEmail.test(value)){
        // 通过校验
        callback();
      }else{
        callback(new Error('请输入合法的邮箱'));
      }
    };
    // 校验手机号规则
    var validateMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if(regMobile.test(value)){
        // 通过校验
        callback();
      }else{
        callback(new Error('请输入合法的手机号'));
      }
    };
    return {
      // 用户列表请求参数
      queryInfo:{
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2
      },
      // 对话框显示/关闭的标识
      dialogVisible: false,
      // 添加的用户信息
      userForm:{
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 校验规制
      rules: {
        username:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur'}
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      // 编辑对话框标识
      editDialogVisible: false,
      // 编辑后的用户数据
      editUserForm: {
        id: '',
        email: '',
        mobile: '',
        username: '',
      },
      // 控制分配角色对话框的显示与隐藏
      setRolesDialogVisible: false,
      // 当前要分配角色的用户信息
      userInfo: {},
      // t选择框当前选中的数据
      selectValue: '',
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    // 获取数据
    getData: function(){
      this.$store.dispatch('getUserList',this.queryInfo);
    },

    // 监听pagesize的改变
    handleSizeChange: function(pagesize){
      this.queryInfo.pagesize = pagesize;
      // 改变每页显示数据条数后重新发请求获取数据
      this.getData();
    },
    // 监听pagenum的改变(当前页码)
    handleCurrentChange: function(pagenum){
      this.queryInfo.pagenum = pagenum;
      this.getData();
    },

    // 监听switch开关的状态
    changeState:async function(userInfo){
      try {
        let msg = await this.$store.dispatch('changeUserState',{id:userInfo.id,mg_state:userInfo.mg_state});
        this.$message.success(msg);
      } catch (error) {
        this.$message.error(error);
      }

    },

    // 监听对话框关闭时的回调
    addDialogClosed: function(){
      this.$refs.userForm.resetFields();
    },

    // 点击添加新用户
    addUser: function() {
      // 表单验证通过
      this.$refs.userForm.validate(async valid => {
        if(valid){
          try {
            await this.$store.dispatch('addUsers',this.userForm);
            this.$message.success('用户创建成功');
            // 清空当前输入
            this.userForm = {
              username: '',
              password: '',
              email: '',
              mobile: '',
            };
            // 关闭当前对话框
            this.dialogVisible = false;

            // 重新请求获取用户列表
            this.getData();
          } catch (error) {
            this.$message.error(error);
          }
        }
      })

    },

    // 操作：编辑用户
    editUser: function(row){
      let data = cloneDeep(row);
      this.editUserForm = {
        username: data.username,
        id: data.id,
        email: data.email,
        mobile: data.mobile,
      }
      this.editDialogVisible = true;
    },
    // 监听编辑对话框关闭，清除校验信息
    editDialogClosed: function(){
      this.$refs.editUserForm.resetFields();
    },
    // 点击确认验证后修改用户信息
    editUserInfo:function(){
      this.$refs.editUserForm.validate(async valid=>{
        if(valid){
          // 验证通过，发请求修改用户用户信息
          try {
            await this.$store.dispatch('editUser',this.editUserForm);
            this.$message.success('更新用户信息成功');
            this.getData()
            this.editDialogVisible = false;
          } catch (error) {
            this.$message.error(error);
          }
        }
      })
    },

    // 操作：删除用户
    deleteUser:async function(id){
      const result = await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // result接收的值：confirm确认   cancel取消
      if(result == 'cancel'){
        return this.$message.info('已取消删除');
      }else if(result == 'confirm'){
        try {
          let result = await this.$store.dispatch('deleteUser',id);
          this.getData();
          this.$message.success(result);
        } catch (error) {
          return this.$message.error(error);
        }

      }
    },

    // 操作：分配角色
    allocationRoles:function(userInfo){
      // 保存当前用户信息
      this.userInfo = userInfo;
      // 发请求获取角色信息
      this.$store.dispatch('getRolesList');
      // 打开对话框
      this.setRolesDialogVisible = true;

    },

    // 分配角色确认回调
    saveRoles: async function(){
      if(!this.selectValue){
        this.$message.error('请选择要分配的角色');
      };
      try {
        // 发请求分配角色
        const msg = await this.$store.dispatch('setRoles',{id:this.userInfo.id,rid:{rid:this.selectValue}});
        this.$message.success(msg);
        this.getData();
        this.setRolesDialogVisible = false;
      } catch (error) {
        this.$message.error(error);
      }

    }

  },
  computed:{
    ...mapState({
      userList: state => state.user.userList || [],
      total: state => state.user.total,
      // 角色列表
      rolesList: state => state.permissions.rolesList || [],
    })
  }
}
</script>

<style scoped lang="less">
.users{
  .el-breadcrumb{
    margin-bottom: 10px;
  }
  .el-card{
    .input-add{
      margin-bottom: 10px;
    }
    .el-pagination{
      margin-top: 15px;
    }
  }
  .roles{
    margin: 15px 0;
  }

}
</style>