<template>
  <div class="goods">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索/添加 -->
      <el-row :gutter="20" class="input-add">
        <el-col :span="12">
          <el-input @clear="getData" clearable v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getData" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="toAddGoods" type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <el-table
        :data="goodsList"
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"

        >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          width="120"
          label="商品价格(元)">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          width="120"
          label="商品重量">
        </el-table-column>
        <el-table-column
          prop="add_time"
          width="200"
          label="创建时间">
          <template slot-scope='{row}'>
            {{row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
        >
        <template slot-scope='{row}'>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(row.goods_id)"></el-button>
        </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Goods',
  data(){
    return {
      queryInfo:{
        // 查询关键字
        query:'',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
    }
  },
  mounted(){
    // 挂载时获取数据
    this.getData();
    
  },
  methods:{
     // 获取商品列表
    getData: function(){
      this.$store.dispatch('getGoodsList',this.queryInfo);
    },
    // 添加商品
    toAddGoods:function(){
      // 跳转到添加商品页面
      this.$router.push('/goods/add');
    },
    // 操作：编辑商品
    editGoods: function(){

    },
    // 操作：删除按钮
    deleteGoods:function(id){
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        // 确定要删除发请求
        this.$store.dispatch('deleteGoods',id)
        .then((res)=>{
          // 删除成功：重新加载数据
          this.getData();
          // 提示删除成功信息
          this.$message.success(res);
        })
        .catch((err)=>{
          // 提示删除失败信息
          this.$message.error(err);
        });
      })
      .catch(()=>{
        // 点击取消，提示取消删除
        this.$message.info('取消删除');
      })

    },
    // 分页：监听当前页显示条数变化
    handleSizeChange:function(new_size){
      this.queryInfo.pagesize = new_size;
      this.getData();
    },
    // 监听页码变化
    handleCurrentChange: function(current){
      this.queryInfo.pagenum = current;
      this.getData();
    }
  },
  computed:{
    ...mapState({
      goodsList: state => state.goods.goodsList,
      total: state => state.goods.goods_total,
    })
  }
}
</script>

<style lang="less" scoped>
.goods{
  .el-breadcrumb{
    margin-bottom: 10px;
  }
}
</style>