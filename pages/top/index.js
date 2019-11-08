// pages/top/index.js
import {
  http
} from '../../utils/http.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    areaList: [],
    pageData: [],
    query: {
      statisticalMode: '1',
      regionCode: '',
      dateType: '3',
    },
    saleTypeArray: [{
      "id": "1",
      "text": '销售额',
      "value": "1",
    }, {
      "id": "2",
      "value": "2",
      "text": '销售量'
    }],
    dateTypeArray: [{
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

    columns: [{
        title: '排行',
        key: 'index',
        style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2',
        width: '110rpx'
      },
      {
        title: '',
        key: 'picUrl',
        style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2;',
        width: '90rpx'
      },
      {
        title: '商品名称',
        key: 'goodsName',
        style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2'
      },
      {
        title: '销售量',
        key: 'netSalesCnt',
        style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2',
        width: '120rpx'
      },
      {
        title: '销售额',
        key: 'netSalesAmt',
        style: 'textalign:center;color:#FFF;fontsize:30rpx;background:#7886F2',
        width: '140rpx'
      }
    ]
  },
  goback() {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  change(targer) {
    let temp = 'query.'+targer.detail.key
    this.setData({ [temp]:targer.detail.value});
    this.getpageData();
  },
  getAreaList() {
    let params = {
      url: 'behaviorapi/mini/fegin/listRegionAndCity',
    }
    http(params).then((res) => {
      if (res.data.code == 200) {
        let temparr = res.data.data.map((item) => {
          item.text = item.regionName
        })
        this.setData({
          areaList: res.data.data
        })
        return
      }
    }).catch((err) => {
      console.log('err'.err)
    })
  },
  getpageData() {
    let params = {
      url: 'behaviorapi/mini/pos/getGoodsSalesRankingList',
      data: this.data.query
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      console.log('res', res)
      wx.hideLoading()
      if (res.data.code == 200) {
        res.data.data.list.map((item, index) => {
          item.picUrl = 'http://c4.haibao.cn/img/600_0_100_0/1509425278.7843/d37c2358fb2fa49af2e72602ef1b3935.jpg';
          item.index = index + 1;
        })
        this.setData({
          pageData: res.data.data.list
        })
        console.log('pageData', this.data.pageData);
      }
    }).catch((err) => {
      wx.hideLoading()
      console.log('err'.err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAreaList();
    this.getpageData();
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