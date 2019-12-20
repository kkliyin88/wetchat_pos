import {
  http
} from '../../utils/http.js';
const app = getApp()
import * as echarts from '../../common/ec-canvas/echarts';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageData: [],
    storeCode: '',
    storeName: '',
    container1Height:'',
    sumData: {},
    shopRegionCode:'',
    personData: [],
	areaList:[],
	selectList:[],
	areaItem:{},
	popTitle:'',
	dateTypeList: [],
	popFlag:false,
    ec: {
      lazyLoad: true // 延迟加载
    },
    query: {
      regionCode: '',
      dateType: '1',
      storeCode: ''
    },
  },
  goback() {
    wx.redirectTo({
      url: app.globalData.roleLevel == 3 ? '/pages/shopPerformance/index?dateType=' + this.data.query.dateType + '&regionCode='+this.data.shopRegionCode:'/pages/index/index'
    })
  },
  
  sumitSelect(e){
  	  if(e.detail.type=='area'){
  		this.setData({
  			  areaItem: e.detail,
  			  'query.regionCode':e.detail.value,
  		})
  	  }else if(e.detail.type=='dateType'){
  		  this.setData({
  			 dateTypeItem: e.detail,
  			 'query.dateType':e.detail.value
  		  }) 
  	  }
  	  this.getPageData();
  	  this.getPerformTrend();
  },
   clickArea(){
   	  this.setData({
   	  	 selectList:this.data.areaList,
   		  popTitle:'选择区域'
   	  }) 
   	   this.showPop(); 
   },
   clickDateType(){
   	  this.setData({
   	  	 selectList:app.globalData.dateTypeList,
   	  		  popTitle:'选择时间维度'
   	  }) 
   	  this.showPop(); 
   },
  getAreaList() {
    let params = {
      url: 'behaviorapi/mini/fegin/listRegionAndCity',
    }
    http(params).then((res) => {
  	  console.log('res',res)
      if (res.data.code == 200) {
         res.data.data.map((item) => {
          item.text = item.regionName;
          item.value = item.regionCode;
  		   delete item.regionCode;
  		  item.type = 'area';
        })
  		let temparr = res.data.data
        temparr.unshift({
          text: '全国',
          value: '',
  		   id:'',
  		   type:'area',
          regionName: '全国'
        })
        this.setData({
          areaList: temparr
        })
        return
      }
    }).catch((err) => {
      console.log('err'.err)
    })
  },
  showPop(){
  	 this.setData({
  		 popFlag:!this.data.popFlag
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
      wx.hideLoading()
      if (res.data.code == 200) {
        let nosum = res.data.data.list.filter((item)=>{
          return item.guideName != '总计'
        })
        if (res.data.data.list.length<1){
          this.setData({
            sumData: {},
            personData: []
          });
        }else{
          this.setData({
            sumData: res.data.data.list.slice(-1)[0],
            personData: this.data.query.regionCode == "" ? nosum : nosum.slice(0, 5)
          });
        }
       
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 5000
        })
      }
    }).catch((err) => {
      wx.hideLoading()
      console.log('err'.err)
    })
  },
  getPerformTrend() {
    let data = (({ regionCode, storeCode }) => ({ regionCode, storeCode }))(this.data.query)
    let params = {
      url: 'behaviorapi/mini/pos/getGuideSalesPerformanceMonthList',
      data: data
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
  init_echarts(dataList) {
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
  getOption(dataList) {
    let xdata = dataList.map((item) => {
      return item.month + '月'
    })
    let sdata = dataList.map((item) => {
      if (item.netSalesAmt == 0 || item.netSalesAmt ==null){
          return 0
      }else {
        return (item.netSalesAmt/10000).toFixed(2)
      }
    });
    let option = {
      title: {
        text: '',
        left: 0,
        textStyle: {
          color: '#000537',
          fontSize: 15,
          height: 42,
          lineHeight: 42,
          fontWeight:'normal',
        }
      },
      grid: {
        containLabel: false,
        left: 20,
        top: 40,
        right: 20,
        bottom: 40
      },
      xAxis: {
        type: 'category',
        boundaryGap: false, //从0开始
        data: xdata,
        show: true,
        nameTextStyle: {
          color: 'green',
          fontSize: 15,
        },
        axisLine: {
          show: false, //是否显示x轴线\
          lineStyle:{
            color:'#757272' //x轴线以及字体颜色
          },
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
        // name: '销售额(万)',
        type: 'line',
        symbolColor: '#757272',
        symbolSize: 8, //拐点大小
        lineStyle: {
          color: '#7482EB', //改变折线颜色
          width: 1, //线条宽度
        },
        tooltip:{
          trigge: 'item',
          show:true,
          formatter: '{b}'
        },
        itemStyle: {
          normal: { //拐点显示数值
            color: '#7482EB', //拐点颜色,
            borderColor: 'blue',
            label: {
              show: true,
              backgroundColor:'#7482EB',
              color: '#FFF', //拐点文字样式
              fontSize: 12,
              height:22,
              lineHeight:22,
              padding:[0,5]
            }
          }
        },
        smooth: false,
        data: sdata
      }]
    };
    return option;
  },
  getdateTypeList() {
    this.setData({
      dateTypeList: app.globalData.dateTypeList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options_person', options)
    if (options.storeCode && options.storeName) {
      this.setData({
        storeCode: options.storeCode,
        storeName: options.storeName,
        'query.storeCode': options.storeCode,
        'query.dateType': options.dateType,
      })
    }
    if (options.regionCode){
      this.setData({
        shopRegionCode: options.regionCode
      })
    }
    this.getAreaList();
    this.getPageData();
    this.getdateTypeList();
  
    this.setData({ statusBarHeight: app.globalData.systemInfo.statusBarHeight*2});
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.echartsComponnet = this.selectComponent('#mychart');
    this.getPerformTrend();
    
    const objselect = wx.createSelectorQuery();
    objselect.select('#con1').boundingClientRect( (rect)=> {
     this.setData({
       container1Height: rect.height
     })
    }).exec();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh(); //这句也很重要
    setTimeout(() => {
      this.getPageData();
      this.getPerformTrend();
    }, 500)
  },
})