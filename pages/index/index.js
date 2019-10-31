//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   
  },
  getUserMsg:function(){
  	  let token = null;
  	  let token_type=null;
  	  token = wx.getStorageSync('token')
  	  token_type = wx.getStorageSync('token_type')
  	  let temp = 'Bearer' +' '+token;
  	  console.log('temp',temp)
  	 wx.request({
  	 	  url: 'http://oauth-test.pureh2b.com/sso/user/info', //仅为示例，并非真实的接口地址
  	 	  header:{
  	 		 Authorization:temp,
  	 	  },
  	 	  success (res) {
  	 		console.log(res.data)
  	 	  }
  	 }) 
  },
  onLoad: function (options) {
	  wx.setStorageSync('token',options.access_token)
	  wx.setStorageSync('token_type',options.token_type)
	  console.log('options',options);
	  this.getUserMsg();
    
  }

})
