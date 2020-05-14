// pages/equipmentResume/equipmentResume.js 
App = getApp()
var serverAPI = require('../../utils/serverAPI.js');
var querydata = {
  "lineNo": "",
  "excelUrl": ""
}; //上传履历的参数 
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    line1Name: "",
    line2Name: "",
    errorMsg: "", //错误 
    allowTCRobot: false, //不允许上传机器人履历 
    httpErr: "", //上传返回的错误
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(options) {
    if (['吕振宇', '许泽霖'].indexOf(App.globalData.userName) > -1) {
      this.setData({
        allowTCRobot: true
      })
    }
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
  uploadTC1: function(e) {
    this.uploadTC(1)
  },
  uploadTC2: function(e) {
    this.uploadTC(2)
  },
  uploadTC: function(line) {
    var _this = this
    _this.setData({
      httpErr: ""
    })
    wx.showModal({
      title: '提示',
      content: '确认要上传吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success(res) {
              // tempFilePath可以作为img标签的src属性显示图片 
              console.log("res:", res)
              const tempFilePaths = res.tempFiles[0].path
              // querydata.lineNo = res.tempFiles[0].path 
              // console.log("querydata.lineNo", querydata.lineNo) 
              if (line === 1) {
                _this.setData({
                  line1Name: res.tempFiles[0].name
                })
                serverAPI.uploadRobotinfoFile(tempFilePaths).then(dd => {
                  if (_this.data.line1Name === "LINE1.xlsm") {
                    wx.showModal({
                      title: '确认后服务器所有数据都会更新',
                      content: '确认要继续上传该文件吗？',
                      success(res) {
                        console.log("upload后服务器返回参数：", dd)
                        querydata.lineNo = "Line1"
                        querydata.excelUrl = "./data/" + dd.filename
                        if (res.confirm) {
                          console.log("querydata:", querydata)
                         
                            serverAPI.putRobotinfo(querydata).then(res => {
                              // console.log("********",res) 
                              if (res.statusCode === 200 && res.data === "success") {
                                wx.showToast({
                                  title: '上传成功',
                                  icon: 'success',
                                  duration: 3000
                                })

                              } else {
                                console.log("http失败", res)
                                _this.setData({
                                  httpErr: res
                                })
                              }
                            }).catch(e => { console.log("***catch", e) 
                                _this.setData({
                                httpErr: e
                              })
                            })

                        }
                      }
                    })

                  } else {
                    _this.setData({
                      errorMsg: "上传文件不匹配"
                    })
                  }
                })
              } else if (line === 2) {
                _this.setData({
                  line2Name: res.tempFiles[0].name
                })

                serverAPI.uploadRobotinfoFile(tempFilePaths).then(dd => {
                  if (_this.data.line2Name === "LINE2.xlsm") {
                    wx.showModal({
                      title: '确认后服务器所有数据都会更新',
                      content: '确认要继续上传该文件吗？',
                      success(res) {
                        console.log("upload后服务器返回参数：", dd)
                        querydata.lineNo = "Line2"
                        querydata.excelUrl = "./data/" + dd.filename
                        if (res.confirm) {
                          console.log("querydata:", querydata)

                          serverAPI.putRobotinfo(querydata).then(res => {
                            // console.log("********",res) 
                            if (res.statusCode === 200 && res.data === "success") {
                              wx.showToast({
                                title: '上传成功',
                                icon: 'success',
                                duration: 3000
                              })

                            } else {
                              console.log("http失败", res)
                              _this.setData({
                                httpErr: res
                              })
                            }
                          }).catch(e => {
                            console.log("***catch", e)
                            _this.setData({
                              httpErr: e
                            })
                          })

                        }
                      }
                    })

                  } else {
                    _this.setData({
                      errorMsg: "上传文件不匹配"
                    })
                  }
                })

              }
              console.log("linename:", _this.data.line1Name, _this.data.line2Name)
            }
          })
        }
      }
    })
  },





})