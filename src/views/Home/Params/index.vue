<template>
  <div class="params">
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon
      :closable="false"
    >
    </el-alert>
    <!-- 级联选择框 -->
    <div class="cascader_container" >
      <span>选择商品分类：</span>
      <el-cascader
        style="width:300px;"
        v-model="selectKeys"
        clearable
        :options="cateList"
        :props="cateProps"
        @change="handleChange"
      ></el-cascader>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :disabled="isBtnDisable" @click="addManyOrOnly">添加参数</el-button>
        <el-table v-if="activeName == 'many'"  :data="tabsPaneList" border stripe>
          <el-table-column
            type="expand"
            width="50"
          >
          <template slot-scope='{row}'>
            <el-tag
              :key="index"
              v-for="(tag,index) in row.attr_vals"
              closable
              :disable-transitions="false"
              @close="handleClose(index,row)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
          </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="#"
            width="50"
          >
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="参数名称"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
          <template slot-scope='{row}'>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAttributes(row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttributes(row)">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="isBtnDisable" @click="addManyOrOnly">添加属性</el-button>
        <el-table v-if="activeName == 'only'" :data="tabsPaneList" border stripe>
          <el-table-column
            type="expand"
            width="50"
          >
          <template slot-scope='{row}'>
            <el-tag
              :disable-transitions="false"
              @close="handleClose(index,row)">
              {{row.attr_vals}}
            </el-tag>
          </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="#"
            width="50"
          >
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
          <template slot-scope="{row}">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAttributes(row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttributes(row)">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    </el-card>

    <!-- 添加参数/添加属性对话框 -->
    <el-dialog
      :title="activeName == 'many' ? '添加动态参数': '添加静态属性'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="activeName == 'many' ? '动态参数': '静态属性'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttributes">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="activeName == 'many' ? '修改动态参数': '修改静态属性'"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="activeName == 'many' ? '动态参数': '静态属性'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subitEditAttributes">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
let cloneDeep = require('lodash/cloneDeep');
import { mapState } from 'vuex';
export default {
  name: 'Params',
  data(){
    return {
      // 级联列表选中的数据
      selectKeys:[],
      // 级联列表配置
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover',
      },

      // 默认选中的标签页
      activeName: 'many',
      // 是否禁用标签页中的按钮
      isBtnDisable:true,
      // 级联选中的三级id
      cateId: '',
      // 添加数据对话标识
      addDialogVisible: false,
      // 收集添加的数据
      addForm:{
        attr_name: '',
        attr_sel: ''
      },
      // 校验规则
      rules:{
        attr_name:[
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ]
      },
      // 编辑对话框的标识
      editDialogVisible: false,
      // 收集编辑的数据
      editForm:{
        attr_name: '',
        attr_sel: '',
        attr_id:'',
        cat_id: ''
      },
      // 判断是否编辑了
      old_attr_name:'',
      // // tag：input和button切换的标志
      // inputVisible: false,
      // // input绑定的值
      // inputValue: '',
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    // 获取级联数据
    getData:function(){
      this.$store.dispatch('getCateList',{});
    },
    // 监听级联选择器值改变
    handleChange: function(){
      const len = this.selectKeys.length;
      // 判断选择的数据是否为三级数据
      if(len !== 3){
        if(len !== 0){
          // 清空选择框的数据
          this.selectKeys = [];
          // 清空参数列表
          this.tabsPaneList = [];
          console.log(this.tabsPaneList);
          return this.$message.warning('只能选择三级分类')
        }
        return;
      }else if(len === 3){
        this.isBtnDisable = false;
        this.cateId = this.selectKeys[len -1];
        // 获取对应标签页的数据
        this.getTabsPaneList();
      }
    },
    // 监听标签页的切换
    handleClick: function(){
      if(this.selectKeys.length === 3){
         // 重新获取标签贾数据
        this.getTabsPaneList();
      }

    },
    // 获取对应标签页的数据
    getTabsPaneList: function(){
      this.$store.dispatch('getTabsPaneList',{id: this.cateId,params: {sel:this.activeName}});
    },
    // 添加参数/添加属性回调
    addManyOrOnly: function(){
      this.addDialogVisible = true;
    },

    // 监听添加对话框的关闭
    addDialogClose:function(){
      this.$refs.addForm.resetFields();
    },
    // 点击对话框确认发起请求
    addAttributes: function(){
      this.$refs.addForm.validate(async (valid)=>{
        if(valid){
          // 校验通过，发请求添加
          this.addForm.attr_sel = this.activeName;
          try {
            const msg = await this.$store.dispatch('addAttributes',{id: this.cateId,data:this.addForm});
            this.getTabsPaneList();
            this.$message.success(msg);
            this.addDialogVisible = false;
          } catch (error) {
            return this.$message.error(error);
          }


        }
      })
    },
    // 监听编辑对话框的关闭
    editDialogClose: function(){
      this.$refs.editForm.resetFields();
    },
    // 确认提交编辑
    subitEditAttributes:function(){
      this.$refs.editForm.validate(async(valid)=>{
        if(valid){
          // 判断编辑后的值是否与原属性一致
          if(this.editForm.attr_name === this.old_attr_name){
            this.editDialogVisible = false;
            return;
          }
          try {
            // 整理参数
            const data = {
              id:this.editForm.cat_id,
              attrId:this.editForm.attr_id,
              data:{
                attr_name:this.editForm.attr_name,
                attr_sel: this.editForm.attr_sel,
              }
            };
            const msg = await this.$store.dispatch('subitEditAttributes',data);
            // 提示
            this.$message.success(msg);
            // 重新获取新数据
            this.getTabsPaneList();
            // 关闭对话框
            this.editDialogVisible = false;
          } catch (error) {
            return this.$message.error(error);
          }

        }
      })

    },
    // 编辑按钮回调
    editAttributes:function(row){
      // 整理要编辑的参数
      let data = cloneDeep(row);
      this.old_attr_name = data.attr_name;
      this.editForm = {
        attr_name: data.attr_name,
        attr_sel: data.attr_sel,
        attr_id: data.attr_id,
        cat_id: data.cat_id
      },
        // 打开对话框
      this.editDialogVisible = true;
    },
    // 删除按键回调
    deleteAttributes:async function(row){
      const result = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err);
      // cancel
      if(result=='confirm'){
        // 确认要删除,发请求
        try {
          const msg = await this.$store.dispatch('deleteAttributes',{id:row.cat_id,attrid:row.attr_id});
          // 提示删除成功,
          this.$message.success(msg);
          // 重新获取数据
          this.getTabsPaneList();

        } catch (error) {
          // 提示删除失败
          return this.$message.error(error);
        }
      }else{
        return this.$message.info('取消删除');
      }
    },
    // tag:添加tag
    handleInputConfirm: function(row){
      const value = row.inputValue.trim();
      if(value){
        if(!row.attr_vals.includes(value)){
          row.attr_vals.push(row.inputValue);
          this.saveAttrVals(row);
        }
      }
      row.inputValue = '';
      row.inputVisible = false;
      return;

    },
    // 点击btn的回调：切换到输入框
    showInput:function(row){
      row.inputVisible = true;
      // 自动获取焦点
      this.$nextTick(()=>{
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    // 删除参数项（tag）
    handleClose:function(index,row){
      const result = row.attr_vals.splice(index,1);
      if(result){
        this.saveAttrVals(row);
      }
    },
    // 编辑提交参数
    saveAttrVals: async function(row){
      // 整理参数
      const data = {
        id: row.cat_id,
        attrId: row.attr_id,
        data:{
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      };
      try{
        const msg = await this.$store.dispatch('subitEditAttributes',data);
        // 提示
        this.$message.success(msg);

        // 关闭对话框
        this.editDialogVisible = false;
      } catch (error) {
        return this.$message.error(error);
      }
    }
  },
  computed:{
    ...mapState({
      cateList: state => state.goods.addCateList,
    }),
    tabsPaneList:{
      get() {
        return this.$store.state.goods.tabsPaneList;
      },
      set(val){
        return this.$store.commit('GETTABSPANELIST',val);
      }
    }
  }

}
</script>

<style lang="less" scoped>
.params{
  .el-breadcrumb{
    margin-bottom: 10px;
  }
  .el-alert{
    color: #eda332;
    background-color: #fffff4;
  }
  .cascader_container{
    margin: 10px 0;
    span{
      font-size: 15px;
    }
  }
  .el-tab-pane{
    .el-button{
      margin-bottom: 10px;
    }
  }

  .el-tag{
    margin: 10px;
  }
  .input-new-tag,.button-new-tag{
    width: 90px;
    margin-left: 10px;
  }
}

</style>