// pages/maintTask/myTask.js
const App = getApp()
var serverAPI = require('../../utils/serverAPI.js');
var util = require('../../utils/util.js');
var pg = 1;
var mGetTaskLen = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filterOpen: false,
    querydata: {
      sorts: 0,
      section: '',
      status: '',
      responsible: '',
      searchBar: ''
    }, // 
    MTaskList: [], //清单
    isTrigger: false, //下拉刷新触发标志
    // isLoading:false,//上拉加载标志
    ascendOn: false, //是否升序 
    searchList: [{
        type: 'checkbox',
        screenKey: '工段',
        screenName: 'section', //写入querydata的字段名
        screenValue: App.globalData.workSections
      },
      {
        type: 'checkbox',
        screenName: 'status',
        screenKey: '状态',
        screenValue: ["Open", "Pending", "Closed"]
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      MTaskList: wx.getStorageSync('MyMTaskList')
    })
    this.data.querydata.responsible=App.globalData.userName
    console.log("querydata:", this.data.querydata, App.globalData.userName)
    var _this = this
    pg = 1
    serverAPI.taskSearch(10, pg, _this.data.querydata).then(data => {
      _this.dataClean(data)
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  dataClean: function(data, down = false) {
    var _this = this
    mGetTaskLen = data.length
    var MTaskList = _this.data.MTaskList
    // console.log("MTaskList1:", MTaskList)
    var List = []
    for (let item of data) {
      if (item.imagList.length === 0) {
        item.imagList[0] = "/image/camera.png"
      }
      let s = item.applyDateTime
      if (item.applyDateTime) {
        item.applyDateTime = util.formatTime(new Date(s)).substring(0, 16)
      } else {
        item.applyDateTime = s
      }
      List.push(item)
    }

    if (down) {
      MTaskList = MTaskList.concat(List)
    } else {
      console.log("进入else")
      MTaskList = List
      _this.setData({
        isTrigger: false,
      })
    }
    this.setData({
      MTaskList: MTaskList
    })
    // console.log("MTaskList:", MTaskList)
    console.log("清理后的MTaskList：", _this.data.MTaskList)
    // return MTaskList
    wx.setStorageSync('MyMTaskList', _this.data.MTaskList)
  },

  bindSort: function(e) { //排序按钮
    var _this = this
    this.setData({
      ascendOn: !this.data.ascendOn
    })
    if (this.data.ascendOn) {
      this.data.querydata.sorts = 1
    } else {
      this.data.querydata.sorts = -1
    }
    pg = 1
    serverAPI.taskSearch(10, pg, this.data.querydata).then(data => {
      _this.dataClean(data)
    })

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
    pg = 1
    serverAPI.taskSearch(10, pg, this.data.querydata).then(data => {
      _this.dataClean(data) //清理数据
    })
  },
  bindcancel(e) {
    console.log("点击了取消", e)
    this.bindclear()
  },
  bindclear(e) {
    this.setData({
      'querydata.searchBar': "",
    })
    console.log(this.data.querydata)
    pg = 1
    serverAPI.taskSearch(10, pg, this.data.querydata).then(data => {
      _this.dataClean(data) //清理数据

    })
  },





  filtersubmit(e) {
    // console.log("e:",e)
    var _this = this
    Object.assign(this.data.querydata, e.detail)
    this.setData({
      querydata: this.data.querydata
    })
    console.log("querydata:", this.data.querydata)
    // console.log("filterOn:",this.data.filterOn)
    pg = 1
    serverAPI.taskSearch(10, pg, this.data.querydata).then(data => {
      _this.dataClean(data) //清理数据

    })
  },

  //加载
  bindscrolltolower(e) {
    var _this = this
    // console.log("底部触发")
    console.log("底部触发前数据", mGetTaskLen)
    if (!(mGetTaskLen<10)) {
      pg = pg + 1
      console.log("pg:", pg)
      serverAPI.taskSearch(10, pg, _this.data.querydata).then(data => {
        _this.dataClean(data, true)
      })
    } else {
      wx.showToast({
        title: '已加载完毕',
      })
    }

  },
  bindrefresherrefresh(e) {
    var _this = this
    console.log("下拉刷新")
    pg = 1
    serverAPI.taskSearch(10, pg, this.data.querydata).then(data => {
      _this.dataClean(data) //清理数据

    })

  },

})