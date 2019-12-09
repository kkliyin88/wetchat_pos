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
    windowHeight:736,
    popFlag:false,
    condition: {
      dateType: '2',
      platform:'2'
    },
    activeIndex: 0,
    imgBaseUrl: 'https://resource.pureh2b.com/wechat-look-start-platform/image',
    contentList1: [],
    content2Arr:[],
    econe: {
      lazyLoad: true
    },
    ectwo: {
      lazyLoad: true
    },
    tableData:[],
    columns: [],
  },
  openPop() {
    console.log(1111)
    this.setData({
      popFlag: !this.data.popFlag
    })
    console.log('popFlag', this.data.popFlag)
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
  init_echartTwo(xdata, ydata) {
    this.twoComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(app.globalData.echartoption2);
      this.chart = chart;
      return chart;
    });
  },
  changeCondition(condition) { 
    this.setData({
      condition: condition.detail //子组件传回来的参数
    })
    this.getContent1Data(condition.detail);
    this.getechart1Data(condition.detail);
  },
  changeIndex(){
    this.init_echartOne();
  },
  getContent1Data(condition) {
    let params = {
      url: 'behaviorapi/mini/sap/getTerminalProfitInfo',
      data: condition ? condition : this.data.condition
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      wx.hideLoading()
      if (res.data.code != 200) {
        return false ;
      }
      let obj = res.data.data;
      let contentList1 = app.globalData.contentList1;
      app.globalData.echartoption2.series[1].data
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

      //******组装echart2的数据开始******
      //将对象转换为数组
      let arr = [];
      for (let i in obj) {
        let o = {};
        o[i] = obj[i];
        arr.push(o)
      }
      let echart2Data = arr.filter((item)=>{
        return  Object.keys(item)[0].indexOf('yl')>-1
      });
      echart2Data.map((item,i)=>{
        if (Object.keys(item)[0].indexOf('zsryl') != -1) {
          item.name = '收入'; item.index = 0; item.value = item.zsryl;
        } else if (Object.keys(item)[0].indexOf('zcbyl') != -1) {
          item.name = '成本'; item.index = 1; item.value = item.zcbyl;
        } else if (Object.keys(item)[0].indexOf('zfyyl') != -1) {
          item.name = '费用'; item.index = 2; item.value = item.zfyyl;
        } else if (Object.keys(item)[0].indexOf('zlryl') != -1) {
          item.name = '利润'; item.index = 3; item.value = item.zlryl;
        } 
      });
      echart2Data.sort(this.compare('index')); //数组排序;
      app.globalData.echartoption2.xAxis.data = echart2Data.map((item)=>{
        return item.name
      })
      app.globalData.echartoption2.series[1].data = echart2Data.map((item) => {
        return Number(item.value.replace('%', ''));
      })
      app.globalData.echartoption2.series[0].data = [0,0,0,0];
      app.globalData.echartoption2.series[0].data[2] = app.globalData.echartoption2.series[1].data[3];
      app.globalData.echartoption2.series[0].data[1] = app.globalData.echartoption2.series[1].data[2] + app.globalData.echartoption2.series[1].data[3];
      console.log(app.globalData.echartoption2.series[0].data)
     //******组装echart2的数据结束******
    }).catch((err) => {
      wx.hideLoading()
    })
  },
  compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  getechart1Data(condition) { //三年赢利图数据
    let params = {
      url: '/behaviorapi/mini/sap/getTerminalProfitYearList',
      data:  condition? condition : this.data.condition
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
     //*******组装echart1的数据*******
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
    
    //******组装echart1的数据结束******
    //******组装table 的数据开始******
      list.map((item, i) => {  //table头部colunms
        app.globalData.columns[i+1].title = item.ryear +'年';
        app.globalData.columns[i + 1].key = item.ryear;
      })
      this.setData({
        columns: app.globalData.columns
      })
      //组装表格内容收入 毛利 费用 利润
      app.globalData.tableData = [];
      app.globalData.contentList1.map((item,i)=>{
         item.tableData = {code:item.name};
         item.threeyearValue.map((item2,i2)=>{
           item.tableData[app.globalData.columns[i2+1].key] = item2
         })
        app.globalData.tableData.push(item.tableData);
      })
      //单独插入成本这一项
      let chengben = { code: '成本' }
      list.map((item, i) => {
        chengben[item.ryear] = item.zcb
      })
      app.globalData.tableData.splice(1,0,chengben)
      this.setData({
       tableData: app.globalData.tableData
      })
      this.init_echartOne();
      this.init_echartTwo();
    }).catch((err) => {
      wx.hideLoading()
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      statusBarHeight: app.globalData.systemInfo.statusBarHeight,
      windowHeight: app.globalData.systemInfo.windowHeight
    });
    this.getContent1Data();
    this.getechart1Data();
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.oneComponent = this.selectComponent('#mychart-one');
    this.twoComponent = this.selectComponent('#mychart-two');
    this.init_echartOne();
    this.init_echartTwo();
  },
  /**
   * 生命周期函数--监听页面显示
   */

})