<template>
    <div style="width:100%;height:100%;" id="zhu"></div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'zhu',
data(){
    return {
     timer:'',
      date:[],
      account:[],
  }
},
methods:{
    user(){
      this.getRequest('/counts/getUserRecharge').then(res => {
        //alert(1)
        if(res.success===true){
          let account = [];
          let date=[];
          // alert(1)
          account= res.result.account;
          date= res.result.date;
          const option = {
            // color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              top: '3%',
              left: '1.2%',
              right: '1%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: date,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '充值金额',
                type: 'bar',
                barWidth: '40%',
                data: account
              }
            ]
          };

          const serviceRequestCharts = echarts.init(document.getElementById('zhu'));
          serviceRequestCharts.setOption(option);

          window.addEventListener('resize', function () {
            serviceRequestCharts.resize();
          });
        }
      });
    }
},
  mounted() {
   this.user();
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
      this.user();
      }, 180000)
    }


  },

};
</script>
