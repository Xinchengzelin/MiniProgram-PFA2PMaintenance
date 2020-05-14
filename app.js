//app.js

var url = 'https://test.tmps-cp2.xyz/web/api' //  //           'http://localhost:3000/web/api'
// var ipAddr ='192.168.1.4' 
// var url = 'http://'+ipAddr+':3000/web/api'

App({
  onLaunch: function() {
    var _this = this
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var serverAPI = require('/utils/serverAPI.js')

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // console.log(res)
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },


  globalData: {
    userInfo: null,
    openid: null,
    session_key: null,
    token: null,
    headers_login: null,
    headers_upload: null,
    userName: "",
    workSections :['预处理', '电泳', 'PVC一线', 'PVC二线', '打磨', '底面漆一线', '底面漆二线', '调漆间', '烘房', '报交', '注蜡一线', '注蜡二线', 'ADR', 'BDC', "非流水线设备"],
    responsibleNames:[],
    urls: {
      // ipAddr:ipAddr,
      init_url: url + '/employee/init', //用于初始化数据，只需要运行一次，将数据存到数据库
      wxinterface_url: url + '/wxinterface', //返回微信session_key和openid
      username_url: url + '/username/', //获取员工姓名
      responsible_url: url + '/responsible', //获取接单人姓名
      userid_url: url + '/userid', //根据token，获取用户id
      register_url: url + '/register', //注册
      newMT_url: url + '/taskinsert', //新建问题单
      upload_url: url + '/upload', //上传图像等文件
      tasktodo_url: url + '/tasktodo', //待接单任务
      expiredtask_url: url + '/overtiemtask', //获取过期任务单
      update_url: url + "/task/", //修改任务单，或者获取我的任务单，区别在于POST和GET
      taskSearch_url: url + "/tasksearch/", //根据搜索条件获取相关任务单
      taskDetail_url: url + "/task/", //
      modifyTask_url: url + "/task/", //接单转单更新任务单等
      statistics_url:url+'/statistics',//统计接口
      robotinfo_url: url +"/robotInfo/",//底面漆机器人履历
      uploadRobotinfoFile_url: url +"/robotInfo/upload",//机器人履历上传文件接口
      putRobotinfo_url: url +"/robotInfo/import",//修改机器人履历数据库接口

    }
  },
  // request: promisify(wx.request),
})