// components/top/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: ''
    },
    backflag:{
      type: Boolean,
      value: true
    }
  },
  data: {
    statusBarHeight:'',
	base_url:'https://resource.pureh2b.com/wechat-look-start-platform/image/',
	left:'<'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goback() {
      this.triggerEvent('goback') 
    }
  },
  attached() {
    let  that= this
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            statusBarHeight: res.statusBarHeight
          })
        }
      })
  }

})
