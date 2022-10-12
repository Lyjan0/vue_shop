<template>
  <div class="reports">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <div class="charts" ref="charts" style="width: 750px;height: 400px;"></div>

    </el-card>
    
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { mapState } from 'vuex';
export default {
  name: 'Reports',
  data(){
    return {
      option:{
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
    }
  },
  mounted(){
    this.getData();
    var that = this;
    setTimeout(() => {
        // 初始化echarts
      var myCharts = echarts.init(that.$refs.charts);
      // echarts配置项
      // 数据渲染
      myCharts.setOption(that.lineData);
    }, 100);





  },
  methods:{
    getData: function(){
      this.$store.dispatch('getLineData');
    },
  },
  computed:{
    ...mapState({
      lineData: state => state.reports.lineData,
    })
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
</style>