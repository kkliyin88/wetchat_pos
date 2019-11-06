Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData: {
      type: Array,
      value: []
    },
	columns:{
		type: Array,
		value: []
	},
	title:{
		type:String,
		value:''
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
   ColunmstoArr(){
     let colunmsArr=[]
     this.data.columns.map((item)=>{
       colunmsArr.push(item.key)
     })
     this.setData({ columnsArr:colunmsArr});
     console.log('columnsArr', this.data.columnsArr)
   },
  
  },
  attached(){
    this.ColunmstoArr();
    console.log('listData',this.data.listData)
  }
})