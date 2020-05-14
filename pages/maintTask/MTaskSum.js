// pages/maintTask/MTaskSum.js
App = getApp()
var util = require('../../utils/util.js');
var serverAPI = require('../../utils/serverAPI.js');
var pg= 1;//打开的页码
var responsibleNames= [];
var mGetTaskLen=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MTaskList: [],
    querydata : { sorts: 0, section:'', status:'', responsible: '', searchBar: '' }, //后台搜索相关的参数
    isTrigger:false,//下拉刷新触发标志
    // isLoading:false,//上拉加载标志
    ascendOn:false,//是否升序
    

    filter_HL: false,//筛选的按钮状态
    filterOn: false,
    query: [], //默认已选的
    searchList: [{
        type: 'checkbox',
        screenKey: '工段',
        screenName: 'section',
        screenValue: App.globalData.workSections
      },
      {
        type: 'checkbox',
        screenName: 'status',
        screenKey: '状态',
        screenValue: ["Open", "Pending", "Closed"]
      },
      {
        type: 'checkbox',
        screenName:'responsible',
        screenKey: '负责人',
        screenValue: [],
      }
    ],
    url: "", //任务单详情url
    
    

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this=this
  
    // _this.requestData(10, pg, false)

    // 上个页面传递搜索关键词数组，目前在data里query设置
    //this.data.query = options.query    
    // 搜索关键词
    
    this.setData({ "searchList[2].screenValue":App.globalData.responsibleNames,
      MTaskList:wx.setStorageSync('MTaskList')
    })
    // console.log("responsibleNames:", App.globalData.responsibleNames)
    console.log("searchList:", this.data.searchList)
    this.getSearchItems()
    this.requestData(10, pg, false)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {
    pg=1
    // this.requestData(10, pg,false)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
  

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onReachBottom: function() {

    // 当界面的下方距离页面底部距离小于100像素时触发回调，需要填写内容

  },
  dataClean: function(data,down) {
    // wx.showLoading({ //添加一个过渡的弹出框提示“加载中”  
    //   title: '清理中',
    //   icon: "loading",
    // });
    console.log("data:",data)
    mGetTaskLen=data.length//reques到的数据条数
    var MTaskList = this.data.MTaskList 
    var List=[]    
    for (let item of data) {
      if (item.imagList.length === 0) {
        item.imagList[0] = "/image/camera.png"
      } else if (!item.imagList.id) {//本地ip替换,注意有点imagLise[0]是object，从56（taskid 040）开始正确
        // console.log("判断条件：", !item.imagList.id)
      }
      
        let s = item.applyDateTime
        if (item.applyDateTime){
          item.applyDateTime = util.formatTime(new Date(s)).substring(0, 16)
        }else{
          item.applyDateTime=s
        }
        List.push(item)
      

    }
    

    if(down){
      MTaskList=MTaskList.concat(List)
    }else{
      MTaskList=List
      this.setData({
        isTrigger:false,
        // isLoading:false
      })
    }    
    this.setData({
      MTaskList: MTaskList
    })
    console.log("清理后的MTaskList：",this.data.MTaskList)
    //保存到本地
    wx.setStorageSync('MTaskList', MTaskList)
  },
  requestData: function(num = 10, page = 1,down=false) {
    var _this=this
    // var p=new Promise(
    //   function(resolve,reject){
        wx.showLoading({ //添加一个过渡的弹出框提示“加载中”  
          title: '更新中',
          icon: "loading",
        });
        wx.request({
          url: App.globalData.urls.taskSearch_url + num + "/" + page,
          headers: App.globalData.headers_login,
          data: _this.data.querydata,
          success(res) {
            if (res.statusCode === 200) {
              _this.dataClean(res.data, down)
              // reject(_this.data.MTaskList)
            } else {
              console.log("返回数据错误：", res)
              // reject(res)
            }
          },
          complete(res) {
            wx.hideLoading()
          }
        // })
      }
    )

  //  return p
  },
 
  //搜索框函数
  confirmResult(e) {
    // console.log('用户点击完成后返回的值', e.detail);
    var _this = this
    //console.log('select result', e.detail)
    this.setData({
      'querydata.searchBar': e.detail,
    })
    console.log('querydata:', this.data.querydata)
    pg=1

    this.requestData(10, pg, false)
  
  },
  bindcancel(e){
    console.log("点击了取消",e)
    this.bindclear()
  },
  bindclear(e){
    var _this=this
    this.setData({
      'querydata.searchBar':"",
    })
    console.log(this.data.querydata)
    pg = 1
    serverAPI.taskSearch(10, pg, this.data.querydata).then(data => {
      _this.dataClean(data)//清理数据

    })
  },



  //筛选
  bindtapFilter() {
    this.setData({
      filterOn: true
    })
    // console.log(this.data.filterOn)
  },
  // 获取搜索选项
  getSearchItems() {
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
    console.log("searchList:", searchItems)
    this.setData({
      searchList: searchItems
    })
  },
  // 点击筛选项
  onChange(e) {
    var _this=this
    // console.log("e.currentTarget.dataset:", e.currentTarget.dataset)
    const {parentIndex,item,index} = e.currentTarget.dataset
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
    // this.setData({querydata:selected})
    Object.assign(this.data.querydata,selected)
    console.log("querydata submit:", this.data.querydata)
    //筛选的按钮状态
    var arr = []//将所有选择的value保存进去
    Object.values(selected).map(m => { arr = arr.concat(m) })
    if (!!arr.length) {
      this.setData({ filter_HL: true })
    } else {
      this.setData({ filter_HL: false })
    }

    pg = 1
    this.requestData(10, pg, false)
    // var pages = getCurrentPages() // 获取页面栈
    // var prevPage = pages[pages.length - 2] // 前一个页面
    // // 携带数据，返回登录之前的页面
    // prevPage.setData({
    //   query: selected,
    //   isBack: true
    // })
    // wx.navigateBack({
    //   delta: 1
    // })
  },
  naviBindtap(e) {
    // console.log('e', e)  
  },
  bindscrolltolower(e){
    var _this=this
    console.log("底部触发", mGetTaskLen)
    
    if(!(mGetTaskLen<10)){
      pg = pg + 1
      // _this.requestData(10, pg, true)
      console.log("pg:",pg)
      serverAPI.taskSearch(10, pg, this.data.querydata).then(data => {
        _this.dataClean(data,true)//清理数据

      })
      
    } else{
      // wx.setStorageSync('MTaskList', _this.data.MTaskList)
      wx.showToast({
        title: '已加载完毕',
      })
    }  

  },
  bindrefresherrefresh(e){
    console.log("下拉刷新")
      pg=1
      this.requestData(10, pg,false)

  },

  //下拉菜单
  // selectedFourth: function (e) {
  //   console.log("选中第" + e.detail.index + "个标签，选中的id：" + e.detail.selectedId + "；选中的内容：" + e.detail.selectedTitle);
  //   var title = e.detail.selectedTitle
  //   var querydata = this.data.querydata
  //   switch (e.detail.index){
  //     case "1": querydata.responsible.push(title)
  //               break;
  //     case "2": querydata.section.push(title)
  //             break;
  //     case "3": querydata.status.push( title )
  //             break;
  //     case "4": switch (e.detail.selectedId){
  //       case 1: querydata.sorts= 1 
  //         break;
  //       case 2: querydata.sorts = -1 
  //         break;
  //     }
   
  //   }
    
  //   this.setData({
  //       querydata: querydata
  //     }) 
  //   pg=1
  //   this.requestData(10, pg, false)
  //   console.log("querydata:",this.data.querydata)

  // },
  // showDialog: function (e) {

  // },
  // //取消事件
  // _cancelEvent: function (e) {
  //   console.log('你点击了取消');
  //   this.dialog.hideDialog();
  // },
  // //确认事件
  // _confirmEvent: function (e) {
  //   console.log('你点击了确定');
  //   this.dialog.hideDialog();
  // },
  bindSort:function(e){//排序按钮
    this.setData({
      ascendOn: !this.data.ascendOn
      })
      if(this.data.ascendOn){        
        this.data.querydata.sorts = 1 
      }else{
        this.data.querydata.sorts = -1 
      }
      pg=1
    this.requestData(10, pg, false)
    console.log("querydata:",this.data.querydata)

  }
  
})