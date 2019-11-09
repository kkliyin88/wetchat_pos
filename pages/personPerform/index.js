import { http } from '../../utils/http.js';
import * as echarts from '../../common/ec-canvas/echarts';
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
      textStyle: {
        color: '#666',
        fontSize: 15,
        height: 30,
        lineHeight: 30
      }
    },
    grid: {
      containLabel: false,
      left: 30,
      top: 40,
      right: 20,
      bottom: 40
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
      nameTextStyle: {
        color: 'green',
        fontSize: 15,
      },
      axisLine: {
        show: false,//是否显示x轴线
      },
      axisTic: {
        show: false
      },
      splitLine: {
        show: false
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
      symbol: 'circle',//拐点样式
      symbolColor: 'green',
      symbolSize: 8,//拐点大小
      lineStyle: {
        color: '#27C69B', //改变折线颜色
        shadowColor: '#27C69B',//阴影
        shadowBlur: 10, //模糊度
        width: 3,//线条宽度
      },
      itemStyle: {
        normal: { //拐点显示数值
          color: '#27C69B', //拐点颜色
          label: {
            show: true,
            color: 'gray',//拐点文字样式
            fontSize: 15,
          }
        }
      },
      smooth: true,
      data: [700, 800, 988]
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
    pageData: [],
    storeCode: '',
    storeName: '',
    sumData: {},
    personData: [],
    areaList: [],
    dateTypeList: [{
        "id": "1",
        "text": '当天',
        "value": "1",
      }, {
        "id": "2",
        "value": "2",
        "text": '本周'
      },
      {
        "id": "3",
        "value": "3",
        "text": '本月'
      }
    ],
    query: {
      regionCode: '',
      dateType: '3',
      storeCode: ''
    },
  },

  change(targer) {
    let temp = 'query.' + targer.detail.key
    this.setData({
      [temp]: targer.detail.value
    });
    this.getPageData();
  },
  getAreaList() {
    let that = this
    wx.getStorage({
      key: 'areaList',
      success(res) {
        that.setData({
          areaList: res.data
        })
      }
    })
  },
  getPerformTrend(){
    let params = {
      url: 'behaviorapi/mini/pos/getGuideSalesPerformanceMonthList',
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      console.log('res_trend', res)
      wx.hideLoading()
      if (res.data.code == 200) {
      }
    }).catch((err) => {
      wx.hideLoading()
      console.log('err'.err)
    })
  },
  getPageData() {
    let params = {
      url: 'behaviorapi/mini/pos/getGuideSalesPerformanceList',
      data: this.data.query
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      console.log('res', res)
      wx.hideLoading()
      if (res.data.code == 200) {

        this.setData({
          sumData: res.data.data.list.slice(-1)[0],
          personData: res.data.data.list.slice(0, res.data.data.list.length - 1)
        });
      }
    }).catch((err) => {
      wx.hideLoading()
      console.log('err'.err)
    })
  },
  goback() {
    wx.showLoading({
      title: '返回首页'
    });
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options', options)
    if (options.storeCode && options.storeName) {
      this.setData({
        storeCode: options.storeCode,
        storeName: options.storeName
      })
      console.log('storeName222', this.data.storeName)
      this.setData({
        'qurey.storeCode': options.storeCode
      });
    }
    this.getAreaList();
    this.getPerformTrend();
    this.getPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})