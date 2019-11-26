// components/tabBar/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbar: {

    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  attached() {
    // 默认选项
    
    this.setData({
      tabbar: app.globalData.tabbar
    })
    console.log('tabbar', this.data.tabbar)
  }
})