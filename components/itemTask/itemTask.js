// components/itemTask/itemTask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {    
    itemdata: {
      type: Object,
      value:{taskid: '',title: '',section: '',discription: '',imagList: [],applier: '',responsible: '',acceptDateTime: "",transferredPerson: '',transferDateTime: "",expiredDateTime: "",currentStatus: '',closedPerson: '',closedDateTime: "",closedMeasure: '',closedImg: [],status: ''
  }}
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

  }
})
