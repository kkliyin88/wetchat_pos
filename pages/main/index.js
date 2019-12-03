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
  chart.setOption(app.globalData.echartOption1);
  return chart;
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 20,
    condition: {
      monthFlag: false,
      dateType: false,
      sameCompareFlag: false,
      budgetFlag: false
    },
    activeIndex: 0,
    imgBaseUrl: 'https://resource.pureh2b.com/wechat-look-start-platform/image',
    contentList1: [],
    content2Arr:[],
    ecOne: {
      lazyLoad: true
    },
    listData: [{
        "code": "收入",
        "text": "text1",
        "type": "type1",
        name: 'DW'
      },
      {
        "code": "成本",
        "text": "text2",
        "type": "type2",
        name: 'DW'
      },
      {
        "code": "毛利",
        "text": "text3",
        "type": "type3",
        name: 'DW'
      },
      {
        "code": '费用',
        "text": "text4",
        "type": "type4",
        name: 'DW'
      },
      {
        "code": "利润",
        "text": "text5",
        "type": "type5",
        name: 'DW'
      },

    ],
    columns: [{
        title: '',
        key: 'code',
        style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2',
        width: '110rpx'
      },
      {
        title: '2017年',
        key: 'text',
        style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2',
      },
      {
        title: '2018年',
        key: 'type',
        style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2;',
        width: '110rpx'
      },
      {
        title: '2019年',
        key: 'name',
        style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2'
      }
    ]
  },
  init_echartOne(xdata, ydata) {
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(app.globalData.echartOption1);
      this.chart = chart;
      return chart;
    });
  },
  changeDateType() {
    let temp = this.data.condition.dateType;
    this.setData({
      'condition.dateType': !this.data.condition.dateType
    });
    this.getContent1Data();
    this.getechart1Data();
  },
  changeActiveIndex(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    app.globalData.echartOption1.series[0].data = app.globalData.contentList1[this.data.activeIndex].threeyearValue;
    app.globalData.echartOption1.title.text = '业务趋势-' + app.globalData.contentList1[this.data.activeIndex].name
    this.init_echartOne();
  },
  getContent1Data() {
    let params = {
      url: 'behaviorapi/mini/sap/getTerminalProfitInfo',
      data: {
        dateType: this.data.condition.dateType ? 1 : 2 //本月为1,本年2
      }
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      wx.hideLoading()
      if (res.data.code != 200) {
        return false ;
      }
      let contentList1 = app.globalData.contentList1;
      contentList1.map((item, i) => {
        if (i == 0) { //收入
          item.value = (res.data.data.zsr / 10000).toFixed(2);
          item.samePercentage = res.data.data.zsrtb || ''
        } else if (i == 1) { //毛利
          item.value = (res.data.data.zml / 10000).toFixed(2);
          item.samePercentage = res.data.data.zmltb || ''
        } else if (i == 2) { //费用
          item.value = (res.data.data.zfy / 10000).toFixed(2);
          item.samePercentage = res.data.data.zfytb || ''
        } else if (i == 3) { //利润
          item.value = (res.data.data.zlr / 10000).toFixed(2);
          item.samePercentage = res.data.data.zlrtb || ''
        }
      })
      this.setData({
        contentList1: contentList1
      })
    }).catch((err) => {
      wx.hideLoading()
    })
  },
  getechart1Data(i) { //三年赢利图数据
    let params = {
      url: '/behaviorapi/mini/sap/getTerminalProfitYearList',
      data: {
        dateType: this.data.condition.dateType ? 1 : 2 //本月为1,本年2
      }
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      wx.hideLoading()
      if (res.data.code != 200) {
        return false;
      }
      let list = res.data.data.list;
      let echartDataArr = [];
      app.globalData.echartOption1.xAxis.data = [];
      list.map((item)=>{ //
        app.globalData.echartOption1.xAxis.data.push(item.ryear)
      })
       app.globalData.contentList1.map((item,index)=>{
         item.threeyearValue = [];
         list.map((item2,index2)=>{
           if (index == 0) item.threeyearValue.push(item2.zsr==0?0:(item2.zsr/10000).toFixed(2));
           if (index == 1) item.threeyearValue.push(item2.zml==0?0:(item2.zml / 10000).toFixed(2));
           if (index == 2) item.threeyearValue.push(item2.zfy == 0 ? 0 :(item2.zfy / 10000).toFixed(2));
           if (index == 3) item.threeyearValue.push(item2.zlr == 0 ? 0 :(item2.zlr / 10000).toFixed(2));
         })
       })
      app.globalData.echartOption1.series[0].data = app.globalData.contentList1[this.data.activeIndex].threeyearValue;
    }).catch((err) => {
      wx.hideLoading()
    })
  },
  goback() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      statusBarHeight: app.globalData.systemInfo.statusBarHeight
    });
    this.getContent1Data();
    this.getechart1Data();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.oneComponent = this.selectComponent('#mychart-one'); 
    this.init_echartOne();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


})