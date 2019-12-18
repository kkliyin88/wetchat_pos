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
  chart.setOption(this.data.echartOption1);
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
	shopItem:{},
	platformItem:{},
    condition: {
      dateType: '2',
      platform:'2',
	  pttype:'',
	  werks:''
    },
	echartOption1:{},
	echartOption2:{},
    selectList:[], //弹窗数据
	popTitle:'',
    shopList:[], //店铺
	plafromList: [], //平台
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
  goback(){
	 wx.redirectTo({
	   url: '/pages/index/index'
	 }) 
  },
    selectPlatform(e){
      this.setData({
  		platformItem:e.detail,
		shopItem:{},
  		'condition.pttype':e.detail.value,
		'condition.werks':'',
  	});
  	this.getShopList(e.detail.value)
  	this.getContent1Data();
  	this.getechart1Data();
    },
    openPlatformPop(){
      this.setData({
        selectList: this.data.plafromList,
  	  popTitle:'选择平台'
      });
      this.openPop();
    },
	getPlaformList() {
	  let params = {
	    url: 'behaviorapi/mini/sap/getZPTList',
	    data: {
	      platform: this.data.condition.platform
	    }
	  }
	  http(params).then((res) => {
	    if (res.data.code == 200) {
	      res.data.data.list.map((item) => {
	        item.text = item.zpt;
	        item.value = item.pttype;
			  item.type= 'pttype'
	      })
		  res.data.data.list.unshift({text:'全部电商平台',value:'',type:'pttype'})
	      this.setData({
	        plafromList: res.data.data.list
	      })
	    }
	  }).catch((err) => {
	    wx.hideLoading()
	  })
	},
  changeDateType(){
	  if(this.data.condition.dateType=='1'){
		  this.setData({
			  'condition.dateType':'2'
		  })
	  }else if(this.data.condition.dateType=='2'){
		  this.setData({
			  'condition.dateType':'1'
		  })
	  }
	  this.getContent1Data();
	  this.getechart1Data();
  },
  sumitSelect(e){
	  if(Object.keys(e.detail).length==0){ //判断是否为空对象
	  		 return false
	  };
	  if(e.detail.type=='pttype'){
		  this.selectPlatform(e)
	  }else if(e.detail.type=='werks'){
		  this.selectShop(e)
	  }
  },
  openShopPop(){
	 this.setData({
	   selectList: this.data.shopList,
	   popTitle:'选择店铺'
	 });
	 this.openPop(); 
  },
  selectShop(e){
	  if(Object.keys(e.detail).length==0){ //判断是否为空对象
	  	 return false
	   }
	  this.setData({
	  	shopItem:e.detail,
	  	'condition.werks':e.detail.value
	  });
	  this.getContent1Data();
	  this.getechart1Data();
  },
  openPop() {
    this.setData({
      popFlag: !this.data.popFlag
    })
  },
  init_echartOne(xdata, ydata) {
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.data.echartOption1);
      return chart;
    });
  },
  init_echartTwo(xdata, ydata) {
    this.twoComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.data.echartOption2);
      return chart;
    });
  },
  
  changeIndex(e){
	
    this.setData({
		 activeIndex:e.detail,
		'echartOption1.series[0].data':this.data.contentList[e.detail].threeyearValue,
		'echartOption1.title.text':'业务趋势-' + this.data.contentList[e.detail].name
	})
	
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
	this.setData({
	   contentList:JSON.parse(JSON.stringify(app.globalData.contentList))
	})
    http(params).then((res) => {
      wx.hideLoading()
      if (res.data.code != 200) {
        return false ;
      }
	  if(res.data.data==null){
	  		  return 
	  }
      let obj = res.data.data;
      let contentList = this.data.contentList;
      contentList.map((item, i) => {
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
        contentList: contentList,
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
	  let echart2DataName = [];
	  let echart2DataData = [];
      echart2DataName = echart2Data.map((item)=>{
        return item.name
      });
     echart2DataData = echart2Data.map((item) => {
        return Number(item.value.replace('%', ''));
      })
	  this.setData({
		  'echartOption2.xAxis.data':echart2DataName,
		 'echartOption2.series[0].data':echart2DataData
	  })
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
	let columns = this.data.columns;
	let contentList = this.data.contentList;
	let tableData =[];
    http(params).then((res) => {
      wx.hideLoading()
      if (res.data.code != 200) {
        return false;
      }
      let list = res.data.data.list;
     //*******组装echart1的数据*******
     let echart1NameArr = [];
     list.map((item)=>{ //
		echart1NameArr.push(item.ryear)
     })
     this.setData({
		'echartOption1.xAxis.data':echart1NameArr  //名字
     })
       contentList.map((item,index)=>{
         item.threeyearValue = [];
         list.map((item2,index2)=>{
           if (index == 0) item.threeyearValue.push(item2.zsr==0?0:(item2.zsr/10000).toFixed(2));
           if (index == 1) item.threeyearValue.push(item2.zml==0?0:(item2.zml / 10000).toFixed(2));
           if (index == 2) item.threeyearValue.push(item2.zfy == 0 ? 0 :(item2.zfy / 10000).toFixed(2));
           if (index == 3) item.threeyearValue.push(item2.zlr == 0 ? 0 :(item2.zlr / 10000).toFixed(2));
         })
       })
    this.setData({
      'echartOption1.series[0].data':contentList[this.data.activeIndex].threeyearValue
    })
    //******组装echart1的数据结束******
    //******组装table 的数据开始******
      list.map((item, i) => {  //table头部colunms
	    columns[i+1].title = item.ryear +'年';
		columns[i+1].key = item.ryear
      })
	  this.setData({
	  	columns: columns
	  })
      //组装表格内容收入 毛利 费用 利润
      contentList.map((item,i)=>{
         item.tableData = {code:item.name};
         item.threeyearValue.map((item2,i2)=>{
           item.tableData[this.data.columns[i2+1].key] = item2
         })
         tableData.push(item.tableData);
      })
      //单独插入成本这一项
      let chengben = { code: '成本' }
      list.map((item, i) => {
         chengben[item.ryear] = item.zcb?(item.zcb/10000).toFixed(2):0;
      })
     tableData.splice(1,0,chengben)
      this.setData({
       tableData: tableData,
	   contentList:contentList
      });
      this.init_echartOne();
	  setTimeout(()=>{
	  	this.init_echartTwo(); 
	  },1000)
    }).catch((err) => {
      wx.hideLoading()
    })
  },
  getShopList(pttype) {
    let params = {
      url: 'behaviorapi/mini/sap/getZPTStoreList',
      data: {
        platform: this.data.condition.platform,
        pttype: pttype||''
      }
    }
    http(params).then((res) => {
      if (res.data.code == 200) {
        res.data.data.list.map((item) => {
          item.text = item.storeName;
          item.value = item.werks;
		  delete item.werks;
		  delete item.storeName;
		  delete item.pttype;
		  item.type= 'werks';
        });
		res.data.data.list.unshift({text:'全部店铺',value:'',type:'werks'})
        this.setData({
          shopList: res.data.data.list
        })
      }
    }).catch((err) => {
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
	 this.setData({
		 columns:JSON.parse(JSON.stringify(app.globalData.columns)),
		 contentList:JSON.parse(JSON.stringify(app.globalData.contentList)),
		 echartOption1:JSON.parse(JSON.stringify(app.globalData.echartOption1)),
		 echartOption2:app.globalData.echartOption2
	 });
	 this.setData({
		'echartOption1.series[0].lineStyle.color': '#5D72F5',
		'echartOption1.series[0].lineStyle.shadowColor': '#5D72F5',
		'echartOption1.series[0].itemStyle.normal.color': '#5D72F5'
	 })
	 this.oneComponent = this.selectComponent('#mychart-one');
	 this.twoComponent = this.selectComponent('#mychart-two');
    this.setData({
      statusBarHeight: app.globalData.systemInfo.statusBarHeight,
      windowHeight: app.globalData.systemInfo.windowHeight
    });
    this.getContent1Data();
    this.getechart1Data();
	this.getPlaformList();
	this.getShopList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  
    // this.init_echartOne();
    // this.init_echartTwo();
  },
  /**
   * 生命周期函数--监听页面显示
   */

})