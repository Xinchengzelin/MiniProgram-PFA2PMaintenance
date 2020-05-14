// pages/maintTask/newMT.js
var util = require('../../utils/util.js');
var serverAPI = require('../../utils/serverAPI.js');
var app = getApp();
var hasSubmit = false; //是否点击提交
const workSections = app.globalData.workSections;
//  ['预处理', '电泳', 'PVC一线', 'PVC二线', '打磨', '底面漆一线', '底面漆二线', '调漆间', '烘房', '报交', '注蜡一线', '注蜡二线', 'ADR', 'BDC', "非流水线设备"]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    workSections: workSections,
    //value: workSections[0],
    workSectionInput: "",
    loading: false, //提交按钮的loading属性
    loadingPic: false, //照片上传的loading提示
    showTopTips: false, //提示
    errorMsg: "", //错误

    formData: {}, //填写的数据
    files: [], //上传的图片
    rules: [{
      name: "title",
      rules: {
        required: true,
        message: "请输入问题标题！"
      }
    }, {
      name: "discription",
      rules: {
        required: true,
        message: "请输入问题详述！"
      },
    }],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //wx.setNavigationBarTitle({title:"新建报修单"})
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this),
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
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      [`formData.section`]: workSections[e.detail.value],
      workSectionInput: workSections[e.detail.value]
    })
    console.log(this.data.formData)
  },
  bindTitleInput: function(e) {
    this.setData({
      [`formData.title`]: e.detail.value
    })
  },
  bindDetailInput: function(e) {
    this.setData({
      [`formData.discription`]: e.detail.value
    })
  },

  formSubmit: function(e) {

    var _this = this
    this.getApplier() //获取报修人
    // if (hasSubmit) {//为了防止用户极快速度触发两次tap回调，我们还加了一个hasClick的“锁”，在开始请求前检查是否已经发起过请求，如果没有才发起这次请求，等到请求返回之后再把锁的状态恢复回去。
    //   return
    // }
    // hasSubmit = true
    // 把按钮的loading状态显示出来
    this.setData({
      loading: true
    })
    // 接着做耗时的操作
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid的值：', valid, errors)
      // console.log("before:",this.data.formData.workSection)
      if (!valid) {

        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            errorMsg: errors[firstError[0]].message,
            loading: false,
          })

        }
      } else {
        // console.log(this.data.formData.workSection)
        if (!this.data.formData.section) {
          this.setData({
            errorMsg: "请选择工段！",
            loading: false,
          })
          return;
        }
        console.log("formData:", this.data.formData)
        // console.log(app.globalData.headers_login)
        wx.showModal({
          title: '提示框',
          content: '您确定提交该报修单吗？',
          confirmText: '确定',
          cancelText: '取消',
          success: function(res) {
            if (res.confirm) {
              wx.request({
                url: app.globalData.urls.newMT_url, //
                method: "POST",
                data: _this.data.formData,
                header: app.globalData.headers_login,
                success(res) {
                  console.log("服务器回包：", res.data)
                  wx.showToast({ // 显示Toast
                    title: '提交成功',
                    icon: 'success',
                    duration: 1500
                  })
                },
                fail(res) {
                  console.log("提交服务器失败，服务器反馈：", res.data)
                },
                complete(res) {
                  wx.hideLoading() //??
                  wx.hideToast() // https请求complete后，隐藏Toast??
                  hasSubmit = false
                }
              })

              wx.switchTab({
                url: '/pages/maintTask/maintTask'
              })
            } else if (res.cancel) {
              _this.setData({
                loading: false,
              })
              console.log('用户取消')
            }
          }
        })


      }
    })




  },


  //上传图片的函数
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed', 'original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传

  },

  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
    // console.log("1",this.data.formData,this.data.files)
    if (!this.data.formData.imagList || this.data.detailData.closedImg.length === 0){
      if (e.detail.urls.length === 1){
        this.setData({
          [`formData.imagList`] : e.detail.urls,
          [`files[0].url`]: e.detail.urls,
        })
      } else if (e.detail.urls.length === 2){
        this.setData({
          [`formData.imagList`]: e.detail.urls,
          [`files[0].url`]: e.detail.urls[0],
          [`files[1].url`]: e.detail.urls[1],
        })
      }
    }else{
      this.setData({
        [`formData.imagList`]: this.data.formData.imagList.concat(e.detail.urls),
        [`files[1].url`]: e.detail.urls,
      })
    }
    console.log("2", this.data.formData, this.data.files)
  },
  getApplier() {
    var _this = this
    if (App.globalData.userName) {
      _this.setData({
        [`formData.applier`]: App.globalData.userName,
        "formData.applyDateTime": util.formatTime(new Date()),
        'formData.status': "Open"
      })
    } else {
      try {
        serverAPI.getUserID()
          .then(id => {
            return serverAPI.getUserName(id)
          })
          .then(name => {
            _this.setData({
              [`formData.applier`]: name,
              'formData.status': "Open"
            })
            App.globalData.userName = name
          })

      } catch (err) {
        console.log(`err = ${err}`);
      }
    }

  },
  uplaodFile(files) { //图片上传的函数，返回Promise，Promise的callback里面必须resolve({urls})表示成功，否则表示失败
    var _this = this
    console.log('upload files', files)
    var p= new Promise((resolve, reject) => {
      var tempFilePaths = files.tempFilePaths;
    
      _this.setData({
        urlArr: [], //这用来存放上传多张时的路径数组
      });
      var object = {};
      for (var i = 0; i < tempFilePaths.length; i++) {
        const upload_task = wx.uploadFile({
          url: app.globalData.urls.upload_url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址 
          header: App.globalData.headers_upload, 
          filePath: files.tempFilePaths[i], //上传的文件本地地址    
          name: 'file',
          //附近数据，这里为路径     
          success: function (res) {
            var images = _this.data.images;
            var data = JSON.parse(res.data);
            // console.log("新上传：",data)
            if (data.url) {
              var url = data.url
              _this.setData({
                urlArr: _this.data.urlArr.concat(url), //拼接多个路径到数组中
              });
              object['urls'] = _this.data.urlArr;
              console.log("上传后的：",object)

              if (_this.data.urlArr.length == tempFilePaths.length) {
                resolve(object)  //这就是判断是不是最后一张已经上传了，用来返回，
              }
            } else {
              reject(res)
            }
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    })

  return p
  },

})