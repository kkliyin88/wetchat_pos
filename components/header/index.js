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
    condition:{
      type: Object,
      value: ''
    }
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
    changeDateType() {
      let temp = this.data.condition.dateType;
      this.setData({
        'condition.dateType': !this.data.condition.dateType
      });
      console.log('dateType', this.data.condition.dateType)
      // if(){

      // }
      this.triggerEvent('changeCondition',this.data.condition) //修改父组件的条件
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
