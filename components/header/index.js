// components/header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 20,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goback() {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    },
  },
  attached() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
  }
})
