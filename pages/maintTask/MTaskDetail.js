// pages/maintTask/MTaskDetail.js
App = getApp()
var serverAPI = require('../../utils/serverAPI.js');
var util = require('../../utils/util.js');
// var expiredDateTime = "", currentStatus="";//更新过程的中间变量
const originResponsibleNames=wx.getStorageSync('originResponsibleNames')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {
      taskid: '',
      title: '',
      section: '',
      discription: '',
      imagList: [],
      applier: '',
      responsible: '',
      acceptDateTime: "",
      transferredPerson:"",
      transferDateTime: "",
      expiredDateTime: "",
      currentStatus: '',
      closedPerson: '',
      closedDateTime: "",
      closedMeasure: '',
      closedImg: [],
      updatedTime:'',
      status: '',
    }, //问题单详情信息
    formData: {},
    // isAccept: false, //是否被接单了，确定接单按钮的颜色
    proc: 0, //问题单处理过程0：未被接单（open），1：接单（pending），2：转单（pending），3：更新信息（pending），4:去闭环（pending），5：闭环（closed）
    acceptBtnShow: false, //打开的用户能否看到接单按钮
    transferBtnShow: false, //打开的用户能否看到转单更新信息按钮
    closedBtnShow: false, //打开的用户能否闭环
    rules: [{
      name: 'closedMeasure',
      // date: '2020-05-01', //闭环日期初始值
      rules: {
        required: true,
        message: '闭环措施必填！'
      },
    }, ],
    error: "", //错误
    btnShow:false,//转单按钮的筛选按钮是否显示

    //转单
    multiArray: [Object.keys(originResponsibleNames), []],//['工长','技术员','班长','维修A班','维修B班','维修经理']//,
    multiIndex: [0, 0],
    transferredPerson:'',
    pickerhidden:true,//转给人picker是否隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var _this = this
    // var dd = _this.data.detailData
    _this.requestData(options.id).then(dd => {
      _this.calProc(dd)
      _this.calBtn()
      })

    // console.log("multiArray", this.data.multiArray)

//上传图片
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this),
      'searchList[0].screenValue': App.globalData.responsibleNames//.slice(0,10)//转单
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
  requestData: function(id) {
    var _this = this
    var p = new Promise(function(resolve, reject) {
        wx.request({
          url: App.globalData.urls.taskDetail_url + id,
          headers: App.globalData.headers_login,
          success(res) {
            // console.log("res.data[0]:", res.data[0])
            _this.dataClean(res.data[0])
            resolve(_this.data.detailData)
          }
        })
      }

    )
    return p
  },
  dataClean: function(data) {
    var detailData = this.data.detailData
    for (let key of Object.keys(data)) {
      if (Object.prototype.toString.call(data[key]) === "[object String]") {
        if (data[key].split(":").length === 3 && data[key].search('T')) {
          data[key] = util.formatTime(new Date(data[key]))
        }
      }
    }
    Object.assign(detailData, data)
    this.setData({
      detailData: detailData
    })
    console.log("clean后的detailData:", this.data.detailData)
  },
  calProc: function(data) {
    // console.log("calProc接收的detailData：",data)
    var _this = this
    var [d, c, b, a] = [data.closedMeasure, data.currentStatus, data.transferredPerson, data.responsible]
    var p = new Promise(
      function (resolve, reject) {
        if (d && d != null) {
          _this.setData({
            proc: 5,
          })
        } else {
          if (c && c != null) {
            _this.setData({
              proc: 3,
            })
          } else {
            if (b && b != null) {
              _this.setData({
                proc: 2,
              })
            } else {
              if (a && a != null) {
                _this.setData({
                  proc: 1,
                })
              } else {
                _this.setData({
                  proc: 0,
                })
              }

            }
          }
        }
      })
    console.log("proc:", _this.data.proc)
    return p
  },
  calBtn:function(){
    var _this=this
    // console.log("transferBtnShow:", (this.data.detailData.transferredPerson != "" && App.globalData.userName == this.data.detailData.transferredPerson), (this.data.detailData.transferredPerson === "" && App.globalData.userName == this.data.detailData.responsible))

    if (App.globalData.responsibleNames.indexOf(App.globalData.userName) > -1) {
      // console.log("1:", App.globalData.userName)
      // console.log("2:", App.globalData.responsibleNames.indexOf(App.globalData.userName))
      // console.log("进入acceptBtnShow赋值")
      _this.setData({
        acceptBtnShow: true
      })
      if ((!this.data.detailData.transferredPerson && App.globalData.userName == this.data.detailData.responsible) || (this.data.detailData.transferredPerson && App.globalData.userName == this.data.detailData.transferredPerson)) {
        
        _this.setData({
          transferBtnShow: true
        })
      } else {
        console.log("进入transBtn false赋值")
        _this.setData({
          transferBtnShow: false
        })
      }
        try {
          if ((this.data.detailData.transferredPerson!="" && App.globalData.userName == this.data.detailData.transferredPerson) || (this.data.detailData.transferredPerson==="" && App.globalData.userName == this.data.detailData.responsible)) {
            console.log("进入transBtn赋值")
            _this.setData({
              closedBtnShow: true
            })
          }else{
            _this.setData({
              closedBtnShow: false
            })
          }
        } catch { //detailData.transfferedPerson 为undefined
          if (App.globalData.userName == this.data.detailData.responsible) {
            _this.setData({
              closedBtnShow: true
            })
          }
        }
      
    }
    console.log("acceptBtnShow:", _this.data.acceptBtnShow, "transferBtnShow:", _this.data.transferBtnShow, "closedBtnShow:", _this.data.closedBtnShow)
  },


  updateForm: function() {
    var _this = this
    this.setData({
      "detailData.updatedTime": util.formatTime(new Date()),
      "detailData.expiredDateTime": this.data.detailData.expiredDateTime,
      "detailData.currentStatus": this.data.detailData.currentStatus,
    })
    // console.log("更新的数据：",this.data.detailData)
    serverAPI.putServerData(_this.data.detailData, _this.data.proc).then(proc => {
      _this.calProc(proc)
    })

  },
  responsibleTask: function(e) { //接单
    var _this = this
    try {
      _this.setPerson(App.globalData.userName, 'responsible')

    } catch (err) {
      console.log(`err = ${err}`);
    }

  },
  bindTransferTask: function (e) {
    //功能在bindMultiPickerChange中实现
    this.setData({ pickerhidden:false})
  },
  closedPerson: function() {
    var _this = this
    
    if (_this.data.proc === 4) {
      _this.setPerson(App.globalData.userName, 'closedPerson')
    }
  },
  setPerson: function(name, person) { //接单'responsible',转单'transferredPerson'，闭环'closedPerson'
    var _this = this
    var proc = _this.data.proc
    var p = new Promise(function(resolve, reject) {
      //做一些异步操作      
      switch (person) {
        case "responsible":
          _this.setData({
            "detailData.responsible": name,
            "detailData.acceptDateTime": util.formatTime(new Date()),
            "detailData.status": "Pending",
          })

          break;
        case "transferredPerson":
          _this.setData({
            "detailData.transferredPerson": name,
            "detailData.transferDateTime": util.formatTime(new Date()),
          })
          // serverAPI.putServerData(_this.data.detailData, _this.data.proc).then(data => {
          //   _this.calProc(data)
          //   _this.calBtn()
          // })//上传服务器
          break;
        case "closedPerson":          
          _this.setData({
            "detailData.closedPerson": name,
            "detailData.closedDateTime": util.formatTime(new Date()),
            "detailData.status": "Closed",
          })
          break;
      }
      serverAPI.putServerData(_this.data.detailData, _this.data.proc).then(data => {
        _this.calProc(data)
        _this.calBtn()
      })//上传服务器
    });
    return p;
  },
  bindDateChange: function(e) {
    var s = e.detail.value
    var dd = new Date(s)
    var ss = util.formatTime(dd)

    this.setData({
      "detailData.expiredDateTime": ss
    })
    console.log('picker发送选择改变，detailData.expiredDateTime为', this.data.detailData.expiredDateTime)
  },
  formInputStatusChange(e) {
    this.setData({
      [`formData.currentStatus`]: e.detail.value,
      "detailData.currentStatus": e.detail.value
    })
    // console.log("data:", e.detail.value)
  },
  formInputChange(e) {
    this.setData({
      [`formData.closedMeasure`]: e.detail.value,
      "detailData.closedMeasure": e.detail.value
    })
  },
  submitForm() {
    //表格提交校验
    var _this = this
    _this.closedPerson()
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid:', valid, "errors:", errors)
      if (!valid) {
        // console.log('object', Object)
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      } else {
        // wx.showToast({
        //   title: '问题单闭环成功！'
        // })
        wx.showModal({
          title: '提示框',
          content: '确定闭环该问题单吗？',
          confirmText: '确定',
          cancelText: '取消',
          success: function(res) {
            if (res.confirm) {
              // 
              wx.showToast({ // 显示Toast
                title: '闭环成功',
                icon: 'success',
                duration: 1500
              })
              _this.setPerson(App.globalData.userName, 'closedPerson')
            } else if (res.cancel) {
              console.log('用户点击次要操作')
            }
          }
        })

      }
    })
  },
  resetForm: function() {

    this.setData({
      proc: 3,

    })
    console.log("proc:", this.data.proc)
    // wx.navigateBack('/pages/maintTask/MTaskSum')
  },
  bindToClose: function() {
    this.calBtn()
    this.setData({
      proc: 4,
    })
    console.log("proc:", this.data.proc)
  },


  //上传图片的函数
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed', 'original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传

  },
 
  uplaodFile(files) { //图片上传的函数，返回Promise，Promise的callback里面必须resolve({urls})表示成功，否则表示失败
    var _this = this
    console.log('upload files:', files)
    var p = new Promise((resolve, reject) => {
      var tempFilePaths = files.tempFilePaths;

      _this.setData({
        urlArr: [], //这用来存放上传多张时的路径数组
      });
      var object = {};
      for (var i = 0; i < tempFilePaths.length; i++) {
        const upload_task = wx.uploadFile({
          url: App.globalData.urls.upload_url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址 
          header: App.globalData.headers_upload,
          filePath: files.tempFilePaths[i], //上传的文件本地地址    
          name: 'file',
          //附近数据，这里为路径     
          success: function (res) {
            // console.log("这里",res)
            var images = _this.data.images;
            var data = JSON.parse(res.data);
            // console.log("新上传：",data)
            if (data.url) {
              var url = data.url
              _this.setData({
                urlArr: _this.data.urlArr.concat(url), //拼接多个路径到数组中
              });
              object['urls'] = _this.data.urlArr;
              // console.log("上传后的：", object)

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
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
    // console.log("this.data.detailData.closedImg", this.data.detailData.closedImg.length === 0)
    if (!this.data.detailData.closedImg || this.data.detailData.closedImg.length === 0) {
      if (e.detail.urls.length === 1) {
        this.setData({
          [`detailData.closedImg`]: e.detail.urls,
          [`files[0].url`]: e.detail.urls,
        })
      } else if (e.detail.urls.length === 2) {
        this.setData({
          [`detailData.closedImg`]: e.detail.urls,
          [`files[0].url`]: e.detail.urls[0],
          [`files[1].url`]: e.detail.urls[1],
        })
      }
    } else {
      this.setData({
        [`detailData.closedImg`]: this.data.detailData.closedImg.concat(e.detail.urls),
        [`files[1].url`]: e.detail.urls,
      })
    }
    console.log("2", this.data.detailData, this.data.files)
  },

  //转单
  bindMultiPickerChange: function (e) {//value 改变时触发 change 事件，event.detail = {value}
      console.log('picker发送选择改变，携带值为', e.detail.value)
    
    this.setData({
      multiIndex: e.detail.value,
      transferredPerson: this.data.multiArray[e.detail.value[0]][e.detail.value[1]],
      pickerhidden: true
    })
    console.log("转给人：", this.data.transferredPerson)
    this.setPerson(this.data.transferredPerson, 'transferredPerson')//修改转给人
  },
  bindMultiPickerColumnChange: function (e) {//列改变时触发
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    // var dat = originResponsibleNames[this.data.multiArray[0]]
    // console.log("dat：", dat)
    // this.setData({ "multiArray[1]": dat })
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    data.multiIndex[e.detail.column] = e.detail.value;
    // console.log("**data",data)
    // console.log("originResponsibleNames:", originResponsibleNames)
    switch(e.detail.column){
      case 0:
        data.multiArray[1] = originResponsibleNames[data.multiArray[0][e.detail.value]]
        break;
      case 1:
        data.multiArray[0] = Object.keys(originResponsibleNames)
        break;
        
    }
    // console.log("转单人：",data)
    this.setData({multiArray: data.multiArray})
    console.log("multiArray:", this.data.multiArray)

  }

})