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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goback() {
      this.triggerEvent('goback') 
    }
  }
})
