const formatTime = date => {//日期转字符串
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatServerDate (date) {
  var o = {
    YY: date.getFullYear(),//年份
    M: date.getMonth() + 1, //月份 
    d: date.getDate(), //日 
    h: "00", //小时 
    m: "00", //分 
    s: "00",//new Date().getSeconds(), //秒 
    // "q": Math.floor((this.getMonth() + 3) / 3), //季度 
    S: "000" //毫秒 
  }
  // if (/(y+)/.test(fmt))
  //   fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  // for (var k in o) {
  //   if (new RegExp("(" + k + ")").test(fmt)) {
  //     fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  //   }
  // }
  var fmt = [o.YY, o.M, o.d].join("-") + "T" + [o.h, o.m, o.s].join(":") + "." + o.S.toString() + "Z"
  // o.Y+"-"+o.M+"-"+o.d+"T"+o.h+":"+o.m+":"+o.s+"."+o.S+"Z"
  return fmt;
}

function isObjectValueEqual(a, b) {//判断两个对象是否一样
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    var propA = a[propName];
    var propB = b[propName];
    if (propA !== propB) {
      return false;
    }
  }
  return true;
}

// 去前后空格
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 提示错误信息
function isError(msg, that) {
  that.setData({
    showTopTips: true,
    errorMsg: msg
  })

}

// 清空错误信息
function clearError(that) {
  that.setData({
    showTopTips: false,
    errorMsg: ""
  })
  
}

module.exports = {
  formatTime: formatTime,  
  trim: trim,
  isError: isError,
  clearError: clearError,
  formatServerDate: formatServerDate,
  isObjectValueEqual: isObjectValueEqual
}