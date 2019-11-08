// Componet/Componet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propArray: {
      type: Array,
    },
    width: {
      type: String,
      value:'120rpx'
    },
    placeholder: {
      type: String,
      value: '请选择'
    },
    key: {   //绑定的key
      type: String,
      value: ''
    },
    value:{  //默认值
      type: String,
      value: ''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    selectShow: false,//初始option不显示
    nowText: "",//初始内容
    animationData: {}//右边箭头的动画
  },


  /**
   * 组件的方法列表
   */
  methods: {
    　　　//option的显示与否
    selectToggle(){
      var nowShow = this.data.selectShow;//获取当前option显示的状态
      //创建动画
      var animation = wx.createAnimation({
        timingFunction: "ease"
      })
      this.animation = animation;
      if (nowShow) {
        animation.rotate(0).step();
        this.setData({
          animationData: animation.export()
        })
      } else {
        animation.rotate(180).step();
        this.setData({
          animationData: animation.export()
        })
      }
      this.setData({
        selectShow: !nowShow
      })
    },
    //设置内容
    setText(e){
      let nowData = this.properties.propArray;//当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
      let nowIdx = e.target.dataset.index;//当前点击的索引
      // this.triggerEvent('changeSelect', this.data.key)
      console.log()
      let nowText = nowData[nowIdx].text;//当前点击的内容
      let value = nowData[nowIdx].value;//选择的值
      this.triggerEvent('change-select', { value:nowData[nowIdx].value,key:this.data.key})
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
      this.animation.rotate(0).step();
      this.setData({
        selectShow: false,
        nowText: nowText,
        animationData: this.animation.export()
      })
    }
  },
  attached() {
     // 默认选项
    console.log('propArray', this.data.propArray);
    this.data.propArray.map((item)=>{
      if(item.value==this.data.value){
        this.setData({ nowText: item.text})
      }
    })
  }

})