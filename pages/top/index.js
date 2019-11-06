// pages/top/index.js
import { http } from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: [],
    pageData:[],
    saleTypeArray: [{
      "id": "1",
      "text":'销售额'
    }, {
      "id": "2",
      "text": '销售量'
    }],
    dateTypeArray: [{
      "id": "1",
      "text": '本天'
    }, {
      "id": "2",
        "text": '本周'
    },
      {
        "id": "3",
        "text": '本月'
      }
    ],
    
    columns:
    [
      {
        title:'排行',
        key:''
      },
        {
          title: '商品名称',
          key: ''
        },
        {
          title: '销售量',
          key: ''
        },
        {
          title: '销售额',
          key: ''
        }

    ]
  },
  goback(){
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  getAreaList() {
    let params = {
      url: '/behaviorapi/mini/fegin/listRegionAndCity',
    }
    http(params).then((res) => {
      if (res.data.code==200){
        let temparr = res.data.data.map((item)=>{
          item.text = item.regionName
        })
        this.setData({ areaList: res.data.data })
        return 
      }
    }).catch((err) => {
      console.log('err'.err)
    })
  },
  getSaleTop(){
    let params = {
      url: '/behaviorapi/mini/pos/getGoodsSalesRankingList',
      data:{
        dateType:3,
        statisticalMode:1
      }
    }
    http(params).then((res) => {
      if (res.data.code == 200) {
        console.log('res',res)
      }
    }).catch((err) => {
      console.log('err'.err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAreaList();
    this.getSaleTop();
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})