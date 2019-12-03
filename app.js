//app.js
const base_url = 'https://resource.pureh2b.com/wechat-look-start-platform/image';
App({
  onLaunch: function() {
    const updateManager = wx.getUpdateManager();
    //检测版本更新
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        //监听小程序有版本更新事件
        //新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
        wx.showModal({
          title: '提示',
          content: '检测到有新版本，是否更新？',
          success: function(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '更新中...',
              })
              updateManager.onUpdateReady(function() {
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
        updateManager.onUpdateFailed(function() {
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
    token: '',
    token_type: '',
    roleLevel: null, // 1 是高层super 2 区域经理 3 店员 4 无权限
    systemInfo: {},
    menberBrandList: [{
      id: '',
      desc: '今日销售额'
    }], //会员品牌列表
    currentMenberBrandIndex: 0,
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
    contentList1: [{
        name: '收入',
        index: 0
      },
      {
        name: '毛利',
        index: 1
      },
      {
        name: '费用',
        index: 2
      },
      {
        name: '利润',
        index: 3
      },
    ],
    echartOption1: {
      title: {
        text: '业务趋势-收入',
        left: 20,
        textStyle: {
          color: '#666',
          fontSize: 15,
          height: 30,
          lineHeight: 30
        }
      },
      grid: {
        containLabel: false,
        left: 30,
        top: 40,
        right: 20,
        bottom: 40
      },
      tooltip: {
        show: false,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false, //从0开始
        data: [],
        show: true,
        nameTextStyle: {
          color: 'green',
          fontSize: 15,
        },
        axisLine: {
          show: false, //是否显示x轴线
        },
        axisTic: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        x: 'center',
        type: 'value',
        show: false,
      },
      series: [{
        name: 'A',
        type: 'line',
        symbol: 'circle', //拐点样式
        symbolColor: 'green',
        symbolSize: 8, //拐点大小
        lineStyle: {
          color: '#27C69B', //改变折线颜色
          shadowColor: '#27C69B', //阴影
          shadowBlur: 10, //模糊度
          width: 3, //线条宽度
        },
        itemStyle: {
          normal: { //拐点显示数值
            color: '#27C69B', //拐点颜色
            label: {
              show: true,
              color: 'gray', //拐点文字样式
              fontSize: 15,
            }
          }
        },
        smooth: true,
        data: []
      }]
    },
    echartoption2:{
      title: {
        text: '深圳月最低生活费组成（单位:元）',
        subtext: 'From ExcelHome',
        sublink: 'http://e.weibo.com/1341556070/AjQH99che'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          var tar = params[1];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: ['总费用', '房租', '水电费', '交通费', '伙食费', '日用品数']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '辅助',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            }
          },
          data: [0, 1700, 1400, 1200, 300, 0]
        },
        {
          name: '生活费',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: [2900, 1200, 300, 200, 900, 300]
        }
      ]
    }
  }
})