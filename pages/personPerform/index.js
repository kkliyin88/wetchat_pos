import { http } from '../../utils/http.js';
import * as echarts from '../../common/ec-canvas/echarts';
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
    ec: {
      lazyLoad: true // 延迟加载
    },
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
          personData: res.data.data.list.slice(0, 4)
        });
      }
    }).catch((err) => {
      wx.hideLoading()
      console.log('err'.err)
    })
  },
  goback() {
    wx.showToast({
      title: '返回首页',
      duration: 2000
    })
    wx.navigateTo({
      url: '/pages/index/index'
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
      wx.hideLoading()
      if (res.data.code == 200) {
		  this.init_echarts(res.data.data.list);
      }
    }).catch((err) => {
      wx.hideLoading()
      console.log('err'.err)
    })
  },
  init_echarts(dataList){
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      Chart.setOption(this.getOption(dataList));
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  getOption(dataList){
     console.log('dataList',dataList)
    let xdata = dataList.map((item)=>{
      return item.month+'月'
    })
    let sdata = dataList.map((item) => {
      return item.netSalesAmt
    })
    let option = {
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
        data: xdata,
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
        data: sdata
      }]
    };
    return option;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.storeCode && options.storeName) {
      this.setData({
        storeCode: options.storeCode,
        storeName: options.storeName
      })
      this.setData({
        'qurey.storeCode': options.storeCode
      });
    }
    this.getAreaList();
    this.getPageData();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.echartsComponnet = this.selectComponent('#mychart');
    this.getPerformTrend();
  },
})