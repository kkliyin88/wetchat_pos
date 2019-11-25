//app.js
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager();
    //检测版本更新
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        //监听小程序有版本更新事件
        //新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
        wx.showModal({
          title: '提示',
          content: '检测到有新版本，是否更新？',
          success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: '更新中...',
              })
              updateManager.onUpdateReady(function () {
                wx.hideLoading();
                updateManager.applyUpdate();
              })
            } else if (res.cancel) {
              wx.showToast({
                title: '取消更新',
                duration: 2000,
                icon: 'none'
              });
            }
          }
        })
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          wx.showModal({
            title: '已经有新版本喽~',
            content: '请您删除当前小程序,通过二维码重新获取',
          })
        })
      }
    });
  },
  globalData: {
    userInfo: {},
    roleLevel:null, // 1 是高层super 2 区域经理 3 店员 4 无权限
    systemInfo:{},
    menberBrandList: [{id:'',desc:'今日销售额'}],//会员品牌列表
    currentMenberBrandIndex:0,
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
  }
})