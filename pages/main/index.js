//https://lanhuapp.com/url/qe5u1-E9Ks3
import * as echarts from '../../common/ec-canvas/echarts';
import {
  http
} from '../../utils/http.js';
var loginServer = require('../../utils/loginServer');
const app = getApp()
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var option = {
    title: {
      text: '业务趋势-收入',
      left: 20,
      textStyle:{
        color:'#666',
        fontSize:15,
        height:30,
        lineHeight:30
      }
    },
    grid: {
      containLabel: false,
      left:30,
      top:40,
      right:20,
      bottom:40
    },
    tooltip: {
      show: false,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false, //从0开始
      data: ['17年', '18年', '19年'],
      show: true,
      nameTextStyle:{
        color:'green',
        fontSize:15,
      },
      axisLine:{
        show:false,//是否显示x轴线
      },
      axisTic:{
        show:false
      },
      splitLine:{
        show:false
      }
    },
    yAxis: {
      x: 'center',
      type: 'value',
      show: false,
    },
    series: [{
      name: 'A',
      type: 'line',
      symbol:'circle',//拐点样式
      symbolColor:'green',
      symbolSize: 8,//拐点大小
      lineStyle:{
        color: '#27C69B', //改变折线颜色
        shadowColor: '#27C69B',//阴影
        shadowBlur: 10, //模糊度
        width:3,//线条宽度
      },
      itemStyle:{
        normal:{ //拐点显示数值
          color: '#27C69B', //拐点颜色
          label:{
            show:true,
            color:'gray',//拐点文字样式
            fontSize:15,
          }
        }
      },
      smooth: true,
      data: [700,800,988]
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:20,
	condition:{
		monthFlag:false,
		sumFlag:false,
		sameCompareFlag:false,
		budgetFlag:false
	},
	ec: {
	  onInit: initChart
	},
   listData:[
     {"code":"收入","text":"text1","type":"type1",name:'DW'},
     {"code":"成本","text":"text2","type":"type2",name:'DW'},
     {"code":"毛利","text":"text3","type":"type3",name:'DW'},
     {"code":'费用',"text":"text4","type":"type4",name:'DW'},
     {"code":"利润","text":"text5","type":"type5",name:'DW'},
    
   ],
  //  columns:[
	//    {},
	//    {title:'2017年',key:'yearone'},
	//    {title:'2018年',key:'yeartwo'},
	//    {title:'2019年',key:'yearthree'},
  //  ],
    columns: [
      {
        title: '',
        key: 'code',
        style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2',
        width: '110rpx'
      },
      {
      title: '2017年',
        key: 'text',
      style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2',
      // width: '110rpx'
    },
    {
      title: '2018年',
      key: 'type',
      style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2;',
      width: '110rpx'
    },
    {
      title: '2019年',
      // width: '110rpx',
      key: 'name',
      style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2'
    }
    ]
  },
  
  changeCondition(e){
	  let temp= this.data.condition.monthFlag;
	  this.setData({[temp]:true});
	  console.log('condition',this.data.condition);
  },
  goback() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusBarHeight: app.globalData.systemInfo.statusBarHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  
})