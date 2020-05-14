// pages/equipmentResume/paintRobot/paintRobot.js
App = getApp()
var util = require('../../../utils/util.js');
var serverAPI = require('../../../utils/serverAPI.js');
var pg = 1;//打开的页码
var querydata = { sorts: -1, searchBar:'', lineNo: [], coatType: [], robotStation: [], robot: [] };//默认已选的,searchBar: '' 
var num=100;//每页返回的数目
var mGetTaskLen = 0;
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    showType:false,//true的话单个机器人显示
    isTrigger: false,//下拉刷新触发标志
    searchList: [{
        type: 'checkbox',
        screenKey: '面漆线',
        screenName: 'lineNo',
        screenValue: ['Line1', 'Line2']
      },
      {
        type: 'checkbox',
        screenKey: '油漆种类',
        screenName: 'coatType',
        screenValue: ["BC", "CC"]
      },
      {
        type: 'checkbox',
        screenKey: '机器人站',
        screenName: 'robotStation',
        screenValue: ["剑刷", "预喷涂", "气喷枪", "外表", "内腔", "膜厚"]
      },
      {
        type: 'checkbox',
        screenKey: '机器人',
        screenName: 'robot',
        screenValue: ["R11", "R12", "R13", "R14", "R21", "R22", "R23", "R24", "DO11", "DO12", "DO13", "HO11", "DO21", "DO22", "DO23",  "HO21"]
      }
    ],
    resumeList:[],
    // [{'lineNo': "Line1",
    //   'coatType': "BC",
    //   'robotStation': "预喷涂",
    //   'robot': "R21",
    //   'timeInfo': "2019-04-01",
    //   'faultInfo': "夜班更换雾化器后法兰泄漏",
    //   'measurement': "法兰端面防尘圈与，雾化器匹配问题，拆除密封圈，更换雾化器",
    //   'result': "OK",
    //   'spareInfo': ''}],
     
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)

    
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
    var _this=this
    pg=1
    serverAPI.requestRobotinfo(num,pg,this.data.showType,querydata).then(d=>{
      _this.dataClean(d,false)
     })
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

  dataClean: function (data, down) {
    var _this=this
    mGetTaskLen = data.length
    wx.showLoading({ //添加一个过渡的弹出框提示“加载中”  
      title: '清理中',
      icon: "loading",
    });
    console.log("request返回data:", data)
    var resumeList = _this.data.resumeList
    var list = [], lis = [], title = { coatType: '', lineNo: '', robot: '', robotStation: ''},name=''//
        for (let item of data) {
          let s = item.timeInfo
          
          if (item.timeInfo) {
            item.timeInfo = util.formatTime(new Date(s)).substring(0, 10)
          } 
          // else {
          //   item.applyDateTime = s
          // }
          if(!_this.data.showType){//
            list.push(item)

          }else if(this.data.showType){
            if (title.coatType===item.coatType&&title.lineNo===item.lineNo&&title.robot === item.robot&&title.robotStation===item.robotStation){
              lis.push(item)
            }else{
              if(!!lis.length){
                // console.log("进入list")
                list.push(lis)
                lis = []
              }
              title.coatType = item.coatType
              title.lineNo = item.lineNo 
              title.robot = item.robot
              title.robotStation = item.robotStation              
              lis.push(item)
            }
          }
      
        }
        if(!!lis.length){
          list.push(lis)
        }
        
        if (down) {
          resumeList = resumeList.concat(list)
        } else {
          resumeList = list
        //   _this.setData({
        //     isTrigger: false,
        //     // isLoading:false
        //   })
        }
        _this.setData({
          resumeList: resumeList
        })
        console.log("清理后的resumeList：", _this.data.resumeList)
        //保存到本地
        // wx.setStorageSync('resumeList', resumeList)
        wx.hideLoading()
        // resolve(_this.data.resumeList)

    //   }
    // )
    // return p
  },

  filtersubmit(e) {
    var _this=this
    pg=1
    // console.log("e:",e)
    Object.assign(querydata, e.detail)
    console.log("querydata:", querydata)
    // console.log("filterOn:",this.data.filterOn)
    serverAPI.requestRobotinfo(num,pg,this.data.showType,querydata).then(d => {
      _this.dataClean(d, false)
    })
  },
  filterReset(e) {
    console.log("进入reset")

  },

  //搜索框函数
  confirmResult(e) {
    // console.log('用户点击完成后返回的值', e.detail);
    var _this = this
    pg=1
    //console.log('select result', e.detail)

    querydata.searchBar= e.detail

    console.log('querydata:', querydata)
    serverAPI.requestRobotinfo(num,pg,this.data.showType,querydata).then(d => {
      _this.dataClean(d, false)
    })
  },
  bindcancel(e) {
    console.log("点击了取消", e)
    this.bindclear()
  },
  bindclear(e) {

      querydata.searchBar=""

    console.log(querydata)
  },
//scroll-view函数
  bindscrolltolower(e) {//滚动到底部/右边时触发
    var _this = this
    console.log("底部触发", mGetTaskLen)

    if (!(mGetTaskLen < 10)) {
      pg = pg + 1
      // _this.requestData(10, pg, true)
      console.log("pg:", pg)
      serverAPI.requestRobotinfo(num, pg,this.data.showType, querydata).then(data => {
        _this.dataClean(data, true)//清理数据

      })

    } else {
      // wx.setStorageSync('MTaskList', _this.data.MTaskList)
      wx.showToast({
        title: '已加载完毕',
      })
    }  

  },
  bindrefresherrefresh(e) {//自定义下拉刷新被触发
    console.log("下拉刷新")
    pg = 1
    serverAPI.requestRobotinfo(num, pg,this.data.showType, false)

  },
  bindpic(e){
    var _this=this
    var pg=1
    this.setData({
      showType: !this.data.showType,
    })
    serverAPI.requestRobotinfo(num,pg,this.data.showType,querydata).then(d => {
      _this.dataClean(d, false)
    })
  },


})