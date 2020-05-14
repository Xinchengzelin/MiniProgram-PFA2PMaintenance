// pages/register/register.js
App=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleItems: [{
        name: '生产人员',
        value: '1',
       },
      {
        name: '维修工',
        value: '2'
      },
      {
        name: '维修班长',
        value: '3'
      },
      {
        name: '维修工长',
        value: '4'
      },
      {
        name: '技术员',
        value: '5'
      },
      {
        name: '维修经理',
        value: '6'
      }
    ],
    isSVWer: [{
      key: "1",
      name: "是",
    }, {
      key: "0",
      name: "否"
    }],
    company: ["上汽大众", "BASF", "AXALTA", "PPG", "BK", "HKP", "CHEMTALL", "其他"],
    showJobNo: false, //是否显示工号
    showCompany: false, //是否显示公司
    formData: {},
    isAgree: false, //是否同意条款
    rules: [{
        name: "username",
        rules: {
          required: true,
          message: "姓名必填"
        }
      },
      {
        name: 'mobile',
        rules: [{
          required: true,
          message: '手机号必填'
        }, {
          mobile: true,
          message: '手机号格式不对'
        }]
      }, {
        name: 'useremails',
        rules:  [{
          required: true,
          message: '邮箱必填'
        },{
          email: true,
          message: '邮箱格式不正确'
        }]
      }, {
          name: "userno", 
          rules: [{ required: true, message: '选择是否大众员工后，填写工号' }, { minlength: 5, message: '工号长度不对' }, { maxlength: 5, message: '工号长度不对' }],
        }, {
        name: "password1",
        rules: { required: true, message: '必须输入密码' },
      },{
        name: "password2",
        rules: [{ required: true, message: '必须输入密码' }, { equalTo: 'password1', message: '密码不一致' }],
      },{
          name: "company",
          rules: { required: true, message: '公司名称必填' },
      }, {
        name: "isAgree",
        rules: { required: true, message: '必须同意相关条款' },
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  nameInputChange(e) {
    this.setData({
      [`formData.username`]: e.detail.value
    })
  },
  mobileInputChange(e) {
    this.setData({
      [`formData.mobile`]: e.detail.value
    })
  },
  emailInputChange(e){
    this.setData({
      [`formData.useremails`]: e.detail.value
    })
  },
  passwordInputChange(e) {
    this.setData({
      [`formData.password1`]: e.detail.value
    })
  },
  repasswordInputChange(e){
    this.setData({
      [`formData.password2`]: e.detail.value
    })
  },
  radioSvwChange: function(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == "是") {
      // console.log('radio发生change事件，携带value值为：', e.detail.value)
      this.setData({
        showJobNo: true,
        showCompany: false,
        [`formData.company`]: "上汽大众汽车有限公司",
      })
    } else {
      // console.log('radio发生change事件，携带value值为：', e.detail.value)
      this.setData({
        showJobNo: false,
        showCompany: true,
        [`formData.userno`]: "00000",
      })
    }
    // console.log("selectCmp:",this.selectComponent('#radioSvwChange').selectComponent('#radioSvwChangeSon'))
  },
  jobNoInputChange: function(e) { //工号输入
    this.setData({
      [`formData.userno`]: e.detail.value
    })
  },
  radioRoleChange: function(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    var roleItems = this.data.roleItems;
    for (var i = 0, len = roleItems.length; i < len; ++i) {
      roleItems[i].checked = (roleItems[i].name == e.detail.value);
    }

    this.setData({
      roleItems: roleItems,
      [`formData.role`]: e.detail.value
    });
  },
  companyInputChange(e) {
    this.setData({
      [`formData.company`]: e.detail.value
    })
  },
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length,
      [`formData.isAgree`]: !!e.detail.value.length,
    });
    // console.log(this.data.isAgree)
    // console.log(e.detail.value)
    // console.log(this.data.formData)
  },

  submitForm: function() {
    var _this=this
    this.setData({
      [`formData.weixinID`]:App.globalData.openid,
    })
    var formData=this.data.formData
    console.log("****提交formData:", formData)
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid的值：', valid, errors)

      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        
        console.log("formData:", formData)
          wx.request({
            url: App.globalData.urls.register_url,
            method:"POST",
            data: formData,
            success(res){
              if(res.statusCode===200){
                console.log('注册成功回包：', res)
                App.globalData.token = res.data
                App.globalData.headers_login = {
                  Authorization: 'bearer ' + App.globalData.token,
                  'content-type': 'application/json'
                }
                App.globalData.userName = res.data.username
                wx.showToast({
                  title: '注册成功'
                })
                wx.switchTab({
                  url: '/pages/maintTask/maintTask',
                })
              } else if (res.statusCode === 422){
                _this.setData({
                  error: '已经注册过'
                })
              }

            },
            fail(res){
              console.log(res)

            },
            complete(res){

            }
          })

      }
    })
  },
  resetForm:function(){
    console.log('用户点击了取消')
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }



})