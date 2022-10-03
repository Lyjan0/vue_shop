<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
        <div class="avatar">
        <img src="../../assets/logo.png" alt="">
      </div>
      <!-- 登录表单：开始 -->
      <!-- ref="form"  -->
      <el-form
        ref="form"
        :model="loginForm"
        label-width="80px"
        class="login_form"
        :rules="loginFormRules"
      >
        <!--用户名-->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" type="text" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮区 -->
         <el-form-item class="btns">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="info" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 登录表单：结束 -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return {
      // 表单数据
      loginForm: {
        username:'admin',
        password:'123456'
      },
      // 表单验证规则
      loginFormRules:{
        // 用户名验证规则
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // 密码验证规则
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max:12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    // 登录按钮
    login: function(){
      this.$refs.form.validate(async valid => {
        // 验证通过
        if(valid){

          this.$store.dispatch('login',this.loginForm)
          .then(()=>{
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            // 跳转到首页
            this.$router.push('/home');
          })
          .catch((err)=>{
            // 登录失败
            this.$message({
              message: err,
              type: 'error'
            });
          });
        }else{
          // 验证不通过
          this.$message.error('验证不通过');
        }
      })
    },
    // 重置按钮
    resetForm: function(){
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style scpoed lang="less">
.login{
  height: 100vh;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box{
    position: relative;
    width: 450px;
    height: 300px;
    background-color: #fff;
    // 头像区域
    .avatar{
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 130px;
      height: 130px;
      border: 1px solid #fff;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #fff;
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 50%;
      }
    }
    // 表单区域
    .login_form{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      .btns{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>