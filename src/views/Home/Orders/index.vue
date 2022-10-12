<template>
  <div class="orders">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
       <!-- 搜索 -->
      <el-row :gutter="20" class="input-add">
        <el-col :span="12">
          <el-input @clear="getData" clearable v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getData" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单表格 -->
      <el-table
        :data="orderList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          min-width="250"
         >
        </el-table-column>
        <el-table-column
          width="80"
          prop="order_price"
          label="订单价格">
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="是否付款"
          width="100"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.pay_status === '1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80">
        </el-table-column>
        <el-table-column
          width="170"
          prop="create_time"
          label="下单时间">
          <template slot-scope='{row}'>
            <span>{{row.create_time | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="250"
        >
          <template slot-scope='{row}'>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAddress">修改地址</el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgress">物流进度</el-button>
          </template>
        </el-table-column>
      </el-table>


      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 25]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="50%"
      @close="editAddressClose"
    >
      <el-form :model="addressForm" :rules="rules" ref="addressForm" label-width="100px">
        <el-form-item label="省市/区" prop="address1">
          <el-input v-model="addressForm.address1"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="showProgressDialogVisible"
      width="50%"
    >
    <!-- 时间线 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in progressData"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showProgressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showProgressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Orders',
  data(){
    return {
      queryInfo:{
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 修改地址对话框标识
      editAddressDialogVisible: false,
      // 修改地址表单
      addressForm:{
        address1: '',
        address2: ''
      },
      rules:{
        address1:[
          { required: true, message: '请选择省市/区', trigger: 'blur' },
        ],
        address2:[
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      // 物流进度对话框标识
      showProgressDialogVisible: false,
      // 测试使用的物流单号
      progressId: '804909574412544580',
      // 物流进度数据
      progressData:[
        {
          time: '2019-03-19 13:07:40',
          ftime: '2019-03-19 13:07:40',
          context: '快件已签收 签收人: 家人 感谢使用圆通速递，期待再次为您服务',
          location: null
        },
        {
          time: '2019-03-19 07:49:12',
          ftime: '2019-03-19 07:49:12',
          context: '北京市顺义区顺义机场公司派件人: 侯国宝（155****5526） 正在派件',
          location: null
        },
        {
          time: '2019-03-19 06:38:38',
          ftime: '2019-03-19 06:38:38',
          context: '快件已到达 北京市顺义区顺义机场公司',
          location: null
        },
        {
          time: '2019-03-18 21:45:46',
          ftime: '2019-03-18 21:45:46',
          context: '快件已发往 北京市顺义区顺义机场公司',
          location: null
        },
        {
          time: '2019-03-18 19:32:10',
          ftime: '2019-03-18 19:32:10',
          context: '快件已到达 北京转运中心',
          location: null
        },
        {
          time: '2019-03-18 00:21:50',
          ftime: '2019-03-18 00:21:50',
          context: '快件已发往 北京转运中心',
          location: null
        },
        {
          time: '2019-03-17 21:25:35',
          ftime: '2019-03-17 21:25:35',
          context: '快件已到达 淮安转运中心',
          location: null
        },
        {
          time: '2019-03-17 19:16:06',
          ftime: '2019-03-17 19:16:06',
          context: '快件已发往 江苏省宿迁市沭阳县公司',
          location: null
        },
        {
          time: '2019-03-17 19:04:21',
          ftime: '2019-03-17 19:04:21',
          context: '江苏省宿迁市沭阳县公司取件人: 李红雨（15751571351） 已收件',
          location: null
        }
      ]

    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    // 获取订单数据
    getData:function(){
      this.$store.dispatch('getOrderList',this.queryInfo);
    },
    // 监听分页显示数量
    handleSizeChange: function(pagesize){
      this.queryInfo.pagesize = pagesize;
      this.getData();
    },
    // 监听当前页码
    handleCurrentChange: function(pagenum){
      this.queryInfo.pagenum = pagenum;
      this.getData();
    },
    // 操作：修改地址
    editAddress: function(){
      this.editAddressDialogVisible = true;
    },
    // 修改地址对话关闭
    editAddressClose: function(){
      this.$refs.addressForm.resetFields();
    },
    // 操作：物流进度
    showProgress:async function(){
      // try {
      //   const msg = await this.$store.dispatch('getProgress',this.progressId);
      //   this.$message.success(msg);
      //   this.showProgressDialogVisible = true;
      // } catch (error) {
      //   this.$message.error(error);
      // }\
      this.showProgressDialogVisible = true;


    }
  },
  computed:{
    ...mapState({
      orderList: state => state.order.orderList,
      total: state => state.order.total,
    })
  }
}
</script>

<style lang="less" scoped>
.orders{
  .el-breadcrumb{
    margin-bottom: 15px;
  }
  .el-table{
    margin: 15px 0;
  }



}
</style>