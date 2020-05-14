// components/filterwindow/filterwindow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    filterOn: {type:Boolean,value:false},
    buttonShow: { type: Boolean, value: true },
    query: { type: Array, value: [] },//默认已选的
    // selected:{},
    searchList:{
      type:Array
    },
    extClass: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    querydata:{},
    filter_HL:false
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created:function(){
      
    },
    attached: function () {
      this._getSearchItems()
      // const queryitems = this.properties.searchList.map(n=>{return Object.assign(querydata,{n.screenName:''})})
      // querydata={}
      // console.log('******', queryitems)
     },
    moved: function () { },
    detached: function () { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //筛选
    bindtapFilter() {
      this.setData({
        filterOn: true
      })
    },
    // 获取搜索选项
    _getSearchItems() {
      const _this = this
      // 异步请求数据后处理，这里直接拿假数据
      const searchItems = this.data.searchList.map(n => {
        return Object.assign({}, n, {
          screenValue: n.screenValue.map(m =>
            Object.assign({}, {
              checked: _this.data.query.includes(m), // 回显query里有,则返回true
              value: m
            })
          )
        })
      })
      // console.log("searchList:", searchItems)
      this.setData({
        searchList: searchItems
      })
    },
    // 点击筛选项
    _onChange(e) {
      var _this = this
      // console.log("e.currentTarget.dataset:", e.currentTarget.dataset)
      const { parentIndex, item, index } = e.currentTarget.dataset
      // 如果选中状态
      if (item.screenValue[index].checked) {
        console.log('ifchecked')
        item.screenValue[index].checked = false // 取消选择
      } else {
        // 如果不是多选
        if (item.type != 'checkbox') {
          // 全部重置为未选择状态
          item.screenValue.map(n => (n.checked = false))
        }
        // 将点击的设置为选中
        item.screenValue[index].checked = true
      }

      this.setData({
        [`searchList[${parentIndex}]`]: item //模板字符串
      })

    },
    // 取消,清空数据返回上一个页面
    doCancel() {

      console.log('reset')
      
      this.setData({
        filterOn: false,
      })
      this.triggerEvent('cancel', this.data.filterOn)
      // console.log("进入组件cancel",this.data.filterOn)
    },
    // 提交，携带数据返回上一个页面
    doSubmit() {

      this.setData({
        filterOn: false
      })
      let selected = {}
      // 获取所有选中
      // this.data.searchList.map(n => {
      //   n.screenValue.map(m => {
      //     if (m.checked == true) {
      //       selected.push(m.value)
      //     }
      //   })
      // })   

      for (let ele of this.data.searchList) {
        var obj = {}, choosenEle = []
        for (let v of ele.screenValue) {
          if (v.checked == true) {
            if (!obj.hasOwnProperty(ele.screenName)) {
              choosenEle.push(v.value)
              obj[ele.screenName] = choosenEle
            } else {
              choosenEle.push(v.value)
            }
          }
          // console.log(obj)
          selected[ele.screenName] = choosenEle
        }
      }
      this.setData({ querydata: selected })
     
      var arr=[]//将所有选择的value保存进去
      Object.values(selected).map(m=>{arr=arr.concat(m)})
      if(!!arr.length){
        this.setData({ filter_HL: true })
      } else{
        this.setData({ filter_HL: false })
      }

      this.triggerEvent('submit', selected)
      

      // var pages = getCurrentPages() // 获取页面栈
      // var prevPage = pages[pages.length - 2] // 前一个页面
      // // 携带数据，返回登录之前的页面
      // prevPage.setData({
      //   querydata: selected,
      //   isBack: true
      // })
      // wx.navigateBack({
      //   delta: 1
      // })
    },
  }
})
