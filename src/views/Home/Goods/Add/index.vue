<template>
  <div class="goods-add">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 文字提示区 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step status="process" title="完成"></el-step>
      </el-steps>
      <!-- 左侧标签页 -->
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" label-position="top">
        <el-tabs
        tab-position="left"
        v-model="activeIndex"
        :before-leave="tabBeforeLeave"
        @tab-click="tabClicked"
      >
          <!-- 基本信息表单：开始 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" >
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_number">
              <!-- 商品分类级联选择器 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
                clearable
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 基本信息表单：结束 -->

          <!-- 商品参数表单：开始 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabList"
              :key="item.attr_id"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="val"
                  v-for="(val,index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
            <!-- 商品参数表单：结束 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabList"
              :key="item.attr_id"
            >
              <!-- <el-input v-model="item.attr_vals"></el-input> -->
              <el-input v-if="item.attr_sel == 'only'" v-model="item.attr_vals" placeholder=""></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headersObj"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
              v-model="addForm.goods_introduce"
              ref="myQuillEditor"
            >
            </quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="addGoods" style="margin-top: 15px;">添加商品</el-button>

          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imgDialogVisible"
      width="50%"
    >
      <img :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
export default {
  name:'Add',
  data(){
    return {
      // 步骤条默认位置
      activeIndex: '0',
      // 需要添加的商品信息
      addForm:{
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 级联选择器选择的值
        goods_cat: [],
        // 图片上传成功的临时路径
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 校验规则
      rules:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number:[
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat:[

        ]
      },
      // 级联选择器的设置
      cateProps:{
        label:'cat_name',
        value: 'cat_id',
        children:'children',
        expandTrigger:'hover',

      },

      // upload请求的请求头
      headersObj:{
        Authorization: window.localStorage.getItem('TOKEN'),
      },
      // 图片预览的路径
      previewPath: '',
      // 图片预览对话框的标志
      imgDialogVisible: false,
    }
  },
  mounted(){
    // 获取商品分类数据
    this.$store.dispatch('getCateList',{});
  },
  methods:{
    // 监听级联选择器
    handleChange: function(){
      const len = this.addForm.goods_cat.length;
      if(len<3){
        // 限制选择非三级的分类
        this.addForm.goods_cat = [];
        return;
      }
    },
    // tab标签页切换前的钩子
    tabBeforeLeave: async function(oldIndex){

      if(this.addForm.goods_cat.length !==3){
        this.$message.error('请选择一个三级分类');
        return Promise.reject('分类未选择');
      }
    },

    // tab被选中时的回调
    tabClicked:function(tab){
      // 商品参数标签页
      if(tab.index === '1'){
        // 请求获取动态参数列表
        this.getTabList('many');
      }else if(tab.index === '2'){
        this.getTabList('only');
      }
    },
    // 获取动态参数和静态属性
    getTabList: function(type){
      const data = {
        id: this.addForm.goods_cat[2],
        params:{
          sel: type
        }
      };
      this.$store.dispatch('getTabsPaneList',data);
    },
    // 点击已上传文件的钩子
    handlePreview: function(file){
      this.previewPath = file.response.data.url;
      this.imgDialogVisible = true;
    },
    // 上传文件移除的钩子
    handleRemove: function(file){
      // 整理图片临时路径
      const imgPath = file.response.data.tmp_path;

      const index = this.addForm.pics.findIndex(x=>x.pic === imgPath)
      this.addForm.pics.splice(index,1);
    },
    // 图片上传成功的钩子
    handleSuccess: function(response){
      // 整理图片路径
      const imgPath = {pic: response.data.tmp_path};
      // 添加到addForm中
      this.addForm.pics.push(imgPath);
    },

    // 添加商品
    addGoods: function(){
      this.$refs.addForm.validate(async (valid)=>{
        if(valid){
          // 整理参数，组件中需要绑定的goods_cat为数组，请求中的为字符串，
          // 做一下深度拷贝
          const formData = cloneDeep(this.addForm);
          // 处理goods_cat
          formData.goods_cat = formData.goods_cat.join(',');

          // 处理商品参数：动态和静态的
          // 动态参数
          this.manyTabList.forEach((item)=>{
            const newObj = {attr_id: item.attr_id, attr_value: item.attr_vals.join(' ')};
            formData.attrs.push(newObj);
          });
          // 静态属性
          this.onlyTabList.forEach((item)=>{
            const newObj = {attr_id: item.attr_id, attr_value: item.attr_vals};
            formData.attrs.push(newObj);
          });

          // 发起请求
          try {
            const msg = await this.$store.dispatch('addGoods',formData);
            this.$message.success(msg);
            this.activeIndex = '5';
            this.$router.push('/goods');
          } catch (error) {
            return this.$message.error(error);
          }



        }else{
          return this.$message.error('请填写必填项');
        }
      })
    }
  },
  computed:{
    ...mapState({
      cateList: state => state.goods.addCateList,
      manyTabList: state => state.goods.manyTabList,
      onlyTabList: state => state.goods.onlyTabList,
      token: state => state.user.token
    })
  }
}
</script>

<style lang="less" scoped>
.goods-add{
  .el-breadcrumb{
    margin-bottom: 10px;
  }
  .el-alert{
    background-color: #fff;
  }
  .el-steps{
    margin: 15px 0;
  }
  // 穿透修改字体大小
  /deep/ .el-step__title{
    font-size: 13px;
  }
  .el-checkbox{
    margin: 0 10px 0 0 !important;
  }
  .el-dialog{
    img{
      width: 100%;
      height: 100%;
    }
  }
  /deep/ .ql-editor{
    min-height: 300px;
  }
}


</style>