var dataObj = require("./data/data.js")

App({
  onLaunch: function () {
    
      var value = wx.getStorageSync('postList')
      if (value) {
        // Do something with return value
      }else{
        wx.setStorage({
          key: 'postList',
          data: dataObj.postList,
          success: function (res) {
          }
        })
      }
  
  },
  to:function(url){
    wx.navigateTo({
      url: url
    })
  }
})