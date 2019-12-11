// components/content/index.js
const app =getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:'Array',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight:20,
    activeIndex:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeActiveIndex(e) {
      this.setData({
        activeIndex: e.currentTarget.dataset.index
      })
      app.globalData.echartOption1.series[0].data = this.data.list[this.data.activeIndex].threeyearValue;
      app.globalData.echartOption1.title.text = '业务趋势-' + this.data.list[this.data.activeIndex].name
      this.triggerEvent('changeIndex')
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
