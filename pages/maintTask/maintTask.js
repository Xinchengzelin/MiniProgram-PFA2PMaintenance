// pages/maintTask/maintTask.js
var base64 = require("../../image/base64");
var serverAPI = require('../../utils/serverAPI.js');
App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maintTaskNavi: ['新建报修单', '问题单总览', '我的任务单'],
    orderBy: '',
    taskList: [], //获取的任务列表
    overtimeList:[],//超期任务单列表
    tabs: [], //tabs组件
    activeTab: 0, //tabs组件
    sta: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //tabs组件
    var _this=this
    const titles = ['未接单问题', '过期问题', '任务单统计']
    const tabs = titles.map(item => ({
      title: item
    }))
    this.setData({
      tabs
    }) 


    this.setData({
      icon: base64.icon60, //每个任务单列表前的图标
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
    //服务器获取数据
    this.requestData()
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
  requestData:function(){
    var _this=this
    serverAPI.getTasktodo().then(
      data => {
        _this.setData({
          taskList: data
        })
      }
    )
  },
  onTabCLick(e) {//点击 tab 时触发
    const index = e.detail.index
    var _this=this
    // console.log("index:",index)
    this.setData({
      activeTab: index
    })
    // this.switchTab(index)
  },
  onChange(e) {//内容区域滚动导致 tab 变化时触发
    const index = e.detail.index
    this.setData({
      activeTab: index
    })
    this.switchTab(index) //滚动内容后再次获取问题列表
  },
  switchTab(index){
    switch (index) {
      case 0:
        this.requestData()
        break;
      case 1:
        serverAPI.getOvertimeTask().then(
          data => {
            this.setData({
              overtimeList: data
            })
          }
        )
        break;
      case 2:
        serverAPI.requestStatisticinfo().then(data=>{
          console.log("统计数据：",data)
          var sta=data
          sta.closeRate = (100*sta.closeCounter / (sta.closeCounter + sta.PendingCounter + sta.openCounter)).toFixed(1)
          this.setData({
            sta           
          })
          
        })
        break;
        
    }
  },
  listenSwiper: function (res) {

    //if res.current==0
  },
})