// pages/top/index.js
const app = getApp()
import {
  http
} from '../../utils/http.js';
const base_url ='https://resource.pureh2b.com/wechat-look-start-platform/image/top/';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    areaList: [],
    pageData: [],
	menberBrandList:[],
	menberBrandItem:{},
    query: {
      statisticalMode: '1',
      regionCode: '',
      dateType: '2',
	  memberBrandId:''
    },
	selectList:[],
	popFlag:false,
	saleTypeItem:{
		id: "1",
		text: '销售额',
		value: "1",
		type:'saleType'
	},
	dateTypeItem:{
		id: "1",
		text: '当月',
		value: "2",
		type:'dateType'
	},
	areaItem:{},
	popTitle:'',
    columns: [{
        title: '排行',
		index:1,
      },
      {
        title: '',
		index:2,
      },
      {
        title: '商品名称',
		index:3,
      },
      {
        title: '销售量',
		index:4,
      },
      {
        title: '销售额',
		index:5,
      }
    ]
  },
  goback() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  sumitSelect(e){
	  if(e.detail.type=='saleType'){
		 this.setData({
			saleTypeItem: e.detail,
			'query.statisticalMode':e.detail.value
		 }) 
	  }else if(e.detail.type=='dateType'){
		  this.setData({
			 dateTypeItem: e.detail,
			 'query.dateType':e.detail.value
		  }) 
	  }else if(e.detail.type=='area'){
		   this.setData({
			  areaItem: e.detail,
			  'query.regionCode':e.detail.value,
		   })
	  }else if(e.detail.type=='menberBrand'){
		  this.setData({
			  menberBrandItem: e.detail,
			  'query.memberBrandId':e.detail.value,
		  })
	  }
	  console.log('query',this.data.query);
	  console.log('menberBrandItem',this.data.menberBrandItem)
	  this.getPageData();
  },
  clickSaleType(){
	  this.setData({
	  	 selectList:app.globalData.saleTypeList,
		 popTitle:'选择统计类型'
	  }) 
	  this.showPop();
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
  clickMenberBrand(){
	  this.setData({
	  	 selectList:this.data.menberBrandList,
	  		  popTitle:'选择会员品牌'
	  }) 
	  this.showPop();  
  },
  showPop(){
	 this.setData({
		 popFlag:!this.data.popFlag
	 }) 
  },
  getMenberBrand() {
	  let menberBrandList = app.globalData.menberBrandList.filter((item,index)=>{
		 return item.id !="" 
	  });
	  menberBrandList.map((item,i)=>{
		  item.text =item.desc;
		  item.value =item.id;
		  item.type= 'menberBrand';
	  });
	  menberBrandList.unshift({text:'全部会员品牌',value:'',id:'',type:'menberBrand'})
	  this.setData({
	    menberBrandList: menberBrandList
	  })
	  console.log('menberBrandList',this.data.menberBrandList)
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
  getPageData() {
    let params = {
      url: 'behaviorapi/mini/pos/getGoodsSalesRankingList',
      data: this.data.query
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      wx.hideLoading()
      if (res.data.code == 200) {
        res.data.data.list.map((item, index) => {
		  if(index<=2){
			 item.pic = base_url + (index+1) +'.png'
		  }
		  item.netSalesAmt  = this.formatData(item.netSalesAmt)
          item.index = index + 1;
        })
        this.setData({
          pageData: res.data.data.list
        })
		console.log('pageData',this.data.pageData)
      }
    }).catch((err) => {
      wx.hideLoading()
      console.log('err'.err)
    })
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
  getdateTypeList() {
    this.setData({
      dateTypeList: app.globalData.dateTypeList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAreaList();
	this.getMenberBrand();
    this.getPageData();
    this.getdateTypeList();
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh(); //这句也很重要
    setTimeout(() => {
      this.getPageData();
    }, 500)
  },
  
})