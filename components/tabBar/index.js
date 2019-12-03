// components/tabBar/index.js
const app = getApp()
const base_url ='https://resource.pureh2b.com/wechat-look-start-platform/image';
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
    activeIndex:0,
    tabbar: {
      list:[
        {
          name:'总体',
          pic: base_url+'/tabbar/zongti.png',
          pic1: base_url + '/tabbar/zongti1.png',
          url:'/pages/main/index',
          index:0
        },
        {
          name: '线下',
          pic: base_url + '/tabbar/xianxia.png',
          pic1: base_url + '/tabbar/xianxia1.png',
          index: 1
        },
        {
          name: '电商',
          pic: base_url + '/tabbar/dianshang.png',
          pic1: base_url + '/tabbar/dianshang1.png',
          url: '/pages/electronicBusiness/index',
          index: 2
        },
        {
          name: 'TOP分析',
          pic: base_url + '/tabbar/top.png',
          pic1: base_url + '/tabbar/top1.png',
          url: '/pages/topAnalyze/index',
          index: 3
        },
        {
          name: '预算达成',
          pic: base_url + '/tabbar/yusuan.png',
          pic1: base_url + '/tabbar/yusuan1.png',
          url: '/pages/budget/index',
          index: 4
        },
      ]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeTab(e){
      
      this.setData({
        activeIndex: e.currentTarget.dataset.index
      })
      // wx.redirectTo({
      //   url: this.data.tabbar.list[this.data.activeIndex].url
      // });
    }
  },
  attached() {
    // 默认选项
    
    this.setData({
      tabbar: app.globalData.tabbar
    })
    console.log('tabbar', this.data.tabbar)
  }
})