<template>
  <div class="categories">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addCate">添加分类</el-button>
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        :expand-type="false"
        :selection-type="false"
      >
      <!-- 是否有效 -->
      <template slot="isok" slot-scope='{row}'>
        <i v-if="row.cat_deleted === false" style="color: limegreen" class="el-icon-success"></i>
        <i v-else class="el-icon-error" style="color: red"></i>
      </template>
      <!-- 排序 -->
      <template slot="isSort" slot-scope="{row}">
        <el-tag v-if="row.cat_level == 0">一级</el-tag>
        <el-tag v-else-if="row.cat_level == 1" type="success">二级</el-tag>
        <el-tag v-else-if="row.cat_level == 2" type="warning">三级</el-tag>
      </template>

      <!-- 操作 -->
      <template slot="opt" slot-scope="{row}">
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 6, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 表单区域 -->
      <el-form :model="cateForm" :rules="rules" ref="cateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="addCateList"
            @change="handleChange"
            :props="cateProps"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: 'Categories',
  data(){
    return {
      // 请求参数
      queryInfo:{
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // tree-tableg列设置
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          type:"template",
          template: 'isok'
        },
        {
          label:'排序',
          type:"template",
          template: 'isSort'
        },
        {
          label:'操作',
          type:'template',
          template:'opt'
        },
      ],

      // 添加分类对话框标识
      addCatedialogVisible: false,
      cateForm:{
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      rules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]

      },
      // 指定配置选项
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover',
        checkStrictly: 'true'
      },
      // 级联选择器选中的数据id
      selectKeys: [],

    }
  },
  mounted(){
    this.getData();

  },
  methods:{
    // 发请求获取数据
    getData: function(type){
      if(!type){
        this.$store.dispatch('getCateList',this.queryInfo);
      }else{
        this.$store.dispatch('getCateList',{type:type});
      }
    },

    // 监听分页中分页数的改变
    handleSizeChange: function(newSize){
      this.queryInfo.pagesize = newSize;
      this.getData();
    },
    // 监听分页当前页码
    handleCurrentChange: function(newNum){
      this.queryInfo.pagenum = newNum;
      this.getData();
    },

    // 添加分类按钮
    addCate: function(){
      // 发请求获取数据
      this.getData(2);
      this.addCatedialogVisible = true;
    },
    //
    handleChange: function(){
      // 判断value是否存在不为空的值
      const len = this.selectKeys.length;
      if(len>0){
        // 父级id
        this.cateForm.cat_pid = this.selectKeys[len - 1];
        // 等级
        this.cateForm.cat_level = len;
        return;
      }else{
        // 恢复父级id和等级
        this.cateForm.cat_pid = 0;
        this.cateForm.cat_level = 0;
      }
    },

    // 点击对话框确定提交添加的分类
    submitCate: function(){
      this.$refs.cateForm.validate(async (valid) => {
          if (valid) {
            // 校验通过发请求提交新增的分类
            try {
              const msg = await this.$store.dispatch('addCategories',this.cateForm);
              this.getData();
              this.addCatedialogVisible = false;
              return this.$message.success(msg);

            } catch (error) {
              return this.$message.error(error);
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      //
      // 关闭对话框
      // this.addCatedialogVisible = true;
    },

    // 监听添加分类对话框的关闭
    addCateDialogClose: function(){
      // 重置form
      this.$refs.cateForm.resetFields();
      // 重置级联框
      this.selectKeys = [];
      // 重置收集的数据
      this.cateForm = {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      };
    }
  },
  computed:{
    ...mapState({
      cateList: state => state.goods.cateList,
      total: state => state.goods.total,
      addCateList: state => state.goods.addCateList,
    })

  }
}
</script>

<style scoped lang="less">
.categories{
  .tree-table{
    margin: 10px 0;
  }
  .el-cascader{
    width: 100%;
  }
}
</style>