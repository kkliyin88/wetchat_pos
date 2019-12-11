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
    tabBar: {
      list:[
        {
          name:'总体',
          pic: base_url+'/tabbar/zongti.png',
          pic1: base_url + '/tabbar/zongti1.png',
          url:'/pages/zongti/index',
          index:0
        },
        {
          name: '线下',
          pic: base_url + '/tabbar/xianxia.png',
          pic1: base_url + '/tabbar/xianxia1.png',
          url: '/pages/xianxia/index',
          index: 1
        },
        {
          name: '电商',
          pic: base_url + '/tabbar/dianshang.png',
          pic1: base_url + '/tabbar/dianshang1.png',
          url: '/pages/dianshang/index',
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
      app.globalData.activeIndex = e.currentTarget.dataset.index;
      if (app.globalData.activeIndex>2){
        wx.showToast({
          title: '页面开发中',
          icon: 'none',
          duration: 2000
        })
        return 
      }
      wx.redirectTo({
        url: this.data.tabBar.list[app.globalData.activeIndex].url
      });
    }
  },
  attached() {
    // 默认选项

   
    this.setData({
      tabbar: app.globalData.tabbar,
      activeIndex: app.globalData.activeIndex
    })
  }
})