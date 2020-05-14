App=getApp()

function getUserID() {
  var p= new Promise(
    function(resolve,reject){
      wx.request({
        url: App.globalData.urls.userid_url,
        header: App.globalData.headers_login,
        success(res){
          resolve(res.data)
        },
        fail(res){
          reject("getUserID调用失败")
        }
      })
    }    
  )
  return p
}
function getUserName(id) {
  // var name=null
  var p=new Promise(
    function(resolve,reject){
      wx.request({
        url: App.globalData.urls.username_url+id,
        header: App.globalData.headers_login,
        success(res){
          resolve(res.data)
        },
        fail(res){
          reject(res.data)
        }
      })
  })
  return p
}
// function gotUserName() {
//   return getUserID().then(id = {
//     getUserName(id))
// }
function getResponsible(){
  var p = new Promise(
    function (resolve, reject) {
      wx.request({
        url: App.globalData.urls.responsible_url,
        header: App.globalData.headers_login,
        success(res) {
          resolve(res.data)
        },
        fail(res) {
          reject(res.data)
        }
      })
    })
  return p
}
function appUserInit(){
  wx.request({
    url: App.globalData.urls.init_url,
    header: App.globalData.headers_login,
    success(res) {
      console.log("用户注册信息初始化成功：",res.data)
    }
  })
}
function taskSearch(num,page,queryData){
  var p=new Promise(
    function(resolve,reject){
      wx.request({
        url: App.globalData.urls.taskSearch_url+num+"/"+page,
        header:App.globalData.headers_login,
        data:queryData,
        success(res){
          resolve(res.data)
        },
        fail(res){
          reject("search error:",res)
        }
      })
    }
  )
return p
}

function putServerData (data,proc) {//任务单详情修改
  var _this = this

  console.log("更新前数据：", data)
  let _id = data._id
  var p=new Promise(function(resolve,reject){
    wx.request({
      url: App.globalData.urls.modifyTask_url + _id,
      method: "PUT",
      header: App.globalData.headers_login,
      data: data,
      success(res) {
        if (res.statusCode === 200) {
          console.log("问题单更新成功:", res.data)
          resolve(res.data)
        }

      }
    })
  })
  return p
}

function uploadImg(filepath) {//图片上传，还有问题
  var _this=this
  var p = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: App.globalData.urls.upload_url,
      header: App.globalData.headers_upload,
      filePath: filepath,//file.tempFilePaths[0]
      name: 'file',
      success(res) {
        if (res.statusCode === 200) {
          var res = JSON.parse(res.data)//json字符串转json对象
          var obj = { 'urls': res.url };
          resolve({
            urls: [obj]
          });
        }
      },
      fail(res) {
        console.log("上传图片失败:", res)
        reject(res)
      }
    })
  })
  return p
}
function getOvertimeTask(){
  var _this = this
  var p=new Promise(
    function(resolve,reject){
      wx.request({
        url: App.globalData.urls.expiredtask_url,
        headers: App.globalData.headers_login,
        success(res) {
          if (res.statusCode === 200) {
            // console.log('taskList:', res.data)
            // _this.setData({
            resolve(res.data)
            // })
            // console.log('overtimeList:', overtimeList)
          } else {
            reject("返回数据错误：", res)
          }
        }

      })
    }
    
  )
  return p
}
function getTasktodo(){
  var _this = this
  var p=new Promise(
    function(resolve,reject){
      wx.request({
        url: App.globalData.urls.tasktodo_url,
        headers: App.globalData.headers_login,
        success(res) {
          if (res.statusCode === 200) {
            console.log('taskList:', res.data)
            resolve(res.data)
          } else {
            console.log("返回数据错误：", res)
          }
        }

      })
    }
  )
  return p
}

function requestRobotinfo(num=100, page=1,showType=false,queryData) {
  if(showType){
    queryData.sorts=0
  }
  
  wx.showLoading({ //添加一个过渡的弹出框提示“加载中”  
    title: '加载中',
    icon: "loading",
  });
  var p = new Promise(
    function (resolve, reject) {
      wx.request({
        url: App.globalData.urls.robotinfo_url + num + "/" + page,
        header: App.globalData.headers_login,
        data: queryData,
        success(res) {
          resolve(res.data)
        },
        fail(res) {
          reject("search error:", res)
        },
        // complete(res) {
        //   wx.hideLoading()
        // }
      })
    }
  )
  return p
}


function requestStatisticinfo() {
  var p = new Promise(
    function (resolve, reject) {
      wx.request({
        url: App.globalData.urls.statistics_url,
        header: App.globalData.headers_login,
        // data: queryData,
        success(res) {
          resolve(res.data)
        },
        fail(res) {
          reject("search error:", res)
        }
      })
    }
  )
  return p
}

function uploadRobotinfoFile(tempFilePaths){
  var p= new Promise(
    function(resolve,reject){
      wx.uploadFile({
        url: App.globalData.urls.uploadRobotinfoFile_url,
        header: App.globalData.headers_login,
        filePath: tempFilePaths,
        name: 'file',
        // data: queryData,
        success(res) {
          console.log("success",res)
          if(res.statusCode===200){
            var data = JSON.parse(res.data) //json字符串转json对象
            // console.log("data:",data)
            resolve(data)
          }

        },
        fail(res) {
          reject("upload error:", res)
        }
    })
  }) 
  return p
  
}

function putRobotinfo(querydata) {
  var p = new Promise(
    function (resolve, reject) {
      wx.request({
        url: App.globalData.urls.putRobotinfo_url,
        header: App.globalData.headers_login,
        method: "PUT",
        data: querydata,
        timeout: 120000,
        success(res) {
          console.log("上传后", res)
          try{
            if (res.statusCode === 200) {
              resolve(res)
            } else{
              console.log(res.data.message)
              reject(res.data.message)
            }
          
          }catch(err){
            console.log(err.data.message)
            reject(err.data.message)
          }



        },
        fail(err) {
          console.log("上传失败", err)
          reject(err)
        }
      })
    }
  )
  return p
} 


module.exports = {
  getUserID: getUserID,
  getUserName: getUserName,
  // gotUserName: gotUserName,
  getResponsible: getResponsible,
  appUserInit:appUserInit,
  taskSearch: taskSearch,
  putServerData: putServerData,
  uploadImg: uploadImg,
  getOvertimeTask:getOvertimeTask,
  getTasktodo: getTasktodo,
  // getSearchedTask: getSearchedTask,
  requestRobotinfo:requestRobotinfo,
  requestStatisticinfo: requestStatisticinfo,
  uploadRobotinfoFile: uploadRobotinfoFile,
  putRobotinfo: putRobotinfo,
}
