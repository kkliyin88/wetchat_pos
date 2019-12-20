// pages/top/index.js
const app = getApp()
import {
  http
} from '../../utils/http.js';
const base_url ='https://resource.pureh2b.com/wechat-look-start-platform/image/topAnalyze/';
Page({
  /**
   * 页面的初始数据
   */
  data: {
   statusBarHeight: 20,
    pageData: [],
    condition: {
      topTheme: 1, // 1收入TOP20 2、盈利TOP20 3、亏损额TOP20
      dateType: 2,
    },
	popFlag:false,
    topThemeArr:[
		{
			name:'收入TOP20',
			value:1
		},
		{
			name:'盈利TOP20',
			value:2
		},
		{
			name:'亏损额TOP20',
			value:3
		},
	],
    
  },
  goback() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  popSumit(){
	  this.setData({
	  	 popFlag:!this.data.popFlag
	  })
	  this.getPageData();
  },
  changeTopic(){
	  this.setData({
		  popFlag:!this.data.popFlag
	  })
  },
  selectTopic(e){
	  this.setData({'condition.topTheme':e.target.dataset.set})
  },
  changeDateType(){
	 this.setData({
		 'condition.dateType':this.data.condition.dateType==1?2:1
	 });
	 this.getPageData();
  },
  formatData(value1){
	let value  = value1.toFixed(2).toString();
	let strArr  = value.split('.');
	let num = strArr[0];
	let str = ''
	for(var i=num.length- 1,j=1;i>=0;i--,j++){  
		if(j%3==0 && i!=0){//每隔三位加逗号，过滤正好在第一个数字的情况  
			str+=num[i]+",";//加千分位逗号  
			continue;  
		}  
		str+=num[i];//倒着累加数字
	}
	return  str.split('').reverse().join("") +'.'+ strArr[1]
  },
  getPageData() {
    let params = {
      url: '/behaviorapi/mini/sap/getTerminalProfitTop',
      data: this.data.condition
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      wx.hideLoading()
      if (res.data.code == 200) {
        res.data.data.list.map((item, index) => {
          item.index = index + 1;
		  item.value = this.formatData((item.zsr || item.zlr))
		  item.test = (item.zsr || item.zlr).toString().split('.')
		  
		  console.log( 'item.test',item.test)
        });
		
		res.data.data.list.map((item,i)=>{
			if(i<3){
				item.pic = base_url + (i+1) +'.png'
			}
		})
        this.setData({
          pageData: res.data.data.list
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
     statusBarHeight: app.globalData.systemInfo.statusBarHeight,
   });
  
   this.getPageData();
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh(); //这句也很重要
    setTimeout(() => {
      this.getPageData();
    }, 500)
  },
  
})