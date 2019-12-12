//app.js
const base_url = 'https://resource.pureh2b.com/wechat-look-start-platform/image';
import * as echarts from './common/ec-canvas/echarts';
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
    tabActiveIndex:0,
    // tableData: [],
    columns: [{
      title: '',
      key: 'code',
      style: 'textalign:center;color:#666;fontsize:30rpx;background:#FFF',
    },
    {
      style: 'textalign:center;color:#666;fontsize:30rpx;background:#FAFBFF',
    },
    {
    
      style: 'textalign:center;color:#666;fontsize:30rpx;background:#FFF;',
    
    },
    {
      style: 'textalign:center;color:#666;fontsize:30rpx;background:#FAFBFF'
    }
    ],
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
    contentList: [{
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
        left: 10,
        textStyle: {
          color: '#666',
          fontSize: 15,
		  fontWeight:'bold',
          height: 30,
          lineHeight: 30
        }
      },
     grid: {
       containLabel: false,
       left: 40,
       top: 60,
       right: 40,
       bottom: 40
     },
      xAxis: {
        type: 'category',
        boundaryGap: false, //从0开始
        data: [],
        nameTextStyle: {
          color: 'green',
          fontSize: 15,
        },
		axisLabel:{
			show:true,
			color:'#999',
			fontWeight:'bold',
			fontSize:15
		},
        axisTick: {
          show: false
        },
        axisLine: {
          show: false, //是否显示x轴线
        },
        splitLine: {
          show: false
        },
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
            color: '#999', //拐点颜色
            label: {
              show: true,
              color: '#999', //拐点文字样式
              fontSize: 13,
			  formatter:'{c}万'
            }
          },
		 
        },
        smooth: true,
        data: []
      }]
    },
    echartOption2:{
     title: {
       text: '赢利结构(百分比%)',
       left: 10,
       textStyle: {
         color: '#666',
         fontSize: 15,
		 fontWeight:'bold',
         height: 30,
         lineHeight: 30
       }
     },
     
      grid: {
        containLabel: false,
        left: 40,
        top: 60,
        right: 0,
        bottom: 40
      },
      xAxis: {
        type: 'category',
        boundaryGap: true, //从0开始
		axisLabel:{
			show:true,
			color:'#999',
			fontWeight:'bold',
			fontSize:15
		},
        axisTick: {
          show: false
        },
        axisLine: {
          show: false, //是否显示x轴线
        },
        splitLine: {
          show: false
        },
        data: []
      },
      yAxis: {
        type: 'value',
        x: 'center',
		axisLine: {
		  show: false, 
		},
		axisTick: {
		  show: false
		},
		splitLine: {
		  show: false
		},
		axisLabel:{
			show:true,
			color:'#999',
			fontSize:15
		},
      },
      series: [
        {
          name: '',
          type: 'bar',
          stack: '',
		  barWidth : 20,
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              barBorderRadius:5,
			  label:{
				  show:true,
				  position:'top',
				  textStyle:{
					  color:'#999999',
					  fontSize:13,
				  }
			  },
			  color:function(params){
				  if(params.value>0){
					  return new echarts.graphic.LinearGradient(
						0, 0, 0, 1,
						[ 
						  { offset: 0, color: '#8F81F7' },
						  { offset: 1, color: '#4E6EF5' },
						]
					  )
				  }
				  else{
					  return new echarts.graphic.LinearGradient(
							0, 0, 0, 1,
							[ 
							  { offset: 1, color: '#F9AF6D' },
							  { offset: 0, color: '#FF8989' },
							]
					  )
				  }
			  },
            },
          },
          data: []
        }
      ]
    }
  }
})