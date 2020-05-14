//index.js
//获取应用实例
const App = getApp()
var serverAPI = require('../../utils/serverAPI.js');
var util = require('../../utils/util.js');
Page({
  data: {
    motto: 'Hello Boy!',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time: (new Date()).toString(),
    phoneInfo:wx.getSystemInfoSync(),
    canIUseBT: wx.canIUse('openBluetoothAdapter'),

    imgUrls: [//显示图片集
      // '/image/image3.jpg',
      // 'http://desk-fd.zol-img.com.cn/g5/M00/02/05/ChMkJ1bKyZmIWCwZABEwe5zfvyMAALIQABa1z4AETCT730.jpg',
      'https://test.tmps-cp2.xyz/uploads/bannerdefault4',
      'https://test.tmps-cp2.xyz/uploads/bannerdefault1',
      // 'http://localhost:3000/uploads/bannerdefault2',
      'https://test.tmps-cp2.xyz/uploads/bannerdefault3',
      // https://test.tmps-cp2.xyz/uploads/bannerdefault5'
    ],
    show: true//是否显示gallery

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (App.globalData.userInfo) {
      this.setData({
        userInfo: App.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      App.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          App.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    App.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  naviToMaintTask: function() {
    var _this = this

    // 获取用户信息
    wx.getSetting({
      success: res => {
 
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
      
          wx.getUserInfo({
            success: res => {
              //登录
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId        
                  var code = res.code; //返回code
                  console.log("返回code：", code)
                  wx.request({
                    url: App.globalData.urls.wxinterface_url,
                    data: {
                      code: code
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log('wxinterface回调：', res)
                      if (res.statusCode === 200) {
                        App.globalData.openid = res.data.openid //返回openid
                        App.globalData.session_key = res.data.session_key
                        App.globalData.token = res.data.token
                        App.globalData.userName = res.data.username
                        console.log('openid为：', App.globalData.openid)
                        console.log('登陆token为：', App.globalData.token)
                        console.log('登陆姓名为：', App.globalData.userName)
                        App.globalData.headers_login = {
                          Authorization: 'bearer ' +App.globalData.token,
                          'content-type': 'application/json'
                        }
                       App.globalData.headers_upload = {
                          Authorization: 'bearer ' +App.globalData.token,
                          'content-type': 'multipart/form-data'
                        }
                        if (App.globalData.token === null || App.globalData.token ==='') {
                          wx.redirectTo({
                            url: "/pages/register/register",
                          })
                        } else {
                          wx.switchTab({
                            url: "/pages/maintTask/maintTask",
                          })
                        }
                        
                        let arr = []//将所有选择的value保存进去
                        serverAPI.getResponsible().then(name => {
                          const name1 = wx.getStorageSync('originResponsibleNames')
                          if (!name1 || !util.isObjectValueEqual(name, name1)){
                            // console.log("originResponsibleNames:", name1)
                            wx.setStorageSync('originResponsibleNames', name)
                            Object.values(name).map(m => {
                              arr = arr.concat(m)
                              App.globalData.responsibleNames = arr
                              
                            })
                          
                          }
                        })

                      } else if (res.statusCode === 422) {
                        console.log(res.statusCode)
                      }
                    },
                    fail: function (res) {
                      console.log("获取openid失败", res)
                    }
                  })

                }
              })
              // 可以将 res 发送给后台解码出 unionId
              App.globalData.userInfo = res.userInfo
              App.globalData.nickName = res.userInfo.nickName
              App.globalData.avatarUrl = res.userInfo.avatarUrl //用户头像
              // console.log("UserInfo:", res)

            },
            fail(res) {
              console.log("用户未同意授权")

            }
          })
        }
      }

    })

    // if (app.globalData.token === null) {
    //   console.log('token为空，需要注册')
    //   wx.redirectTo({
    //     url: "/pages/register/register"
    //   })
    // }
    // wx.navigateTo({
    //   url: '/pages/register/register',
    // })

  },
  
  onShareAppMessage: function () {
    return {
      title: 'PFA2P维保系统',
      path: '/pages/index/index'
    }
  },
  change:function(e) {
    // console.log('current index has changed', e.detail)
  }

})
