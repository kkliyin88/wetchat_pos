// pages/top/index.js
const app = getApp()
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
    console.log('返回首页')
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  change(targer) {
    let temp = 'query.'+targer.detail.key
    this.setData({ [temp]:targer.detail.value});
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
          item.index = index + 1;
        })
        this.setData({
          pageData: res.data.data.list
        })
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
    this.getPageData();
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh(); //这句也很重要
    setTimeout(() => {
      this.getPageData();
    }, 500)
  },
  
})