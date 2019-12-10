// components/pop/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	list:{
		type:Array,
	},
	title:{
		type:String,
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
    
      this.triggerEvent('close') //修改父组件的条件
    },
  },
  attached() {
    
  }
})
