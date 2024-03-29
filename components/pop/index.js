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
    selectItem:{},
	left:'<',
	base_url:'https://resource.pureh2b.com/wechat-look-start-platform/image/'
  },

  /**
   * 组件的方法列表
   */
  methods: {
	  select(e){
		  
		  this.setData({
			  selectItem:e.currentTarget.dataset.item
		  })
		  console.log('selectItem',this.data.selectItem)
	  },
	  sumit(e){
		 console.log('selectItem111',this.data.selectItem)
		  if(Object.keys(this.data.selectItem).length>0){ //判断是否为空对象
			  this.triggerEvent('sumitSelect',this.data.selectItem); 
		  }
		 this.close();
	  },
    close() {
      this.triggerEvent('close') //修改父组件的条件
    },
  },
  attached() {
   
  }
})
