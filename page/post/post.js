
// import data from "../../data/data.js"

import postDB from "../../db/postDB.js"


Page({
  data:{
    postList:[]
  },
  onLoad:function(option){
    this.postDB = new postDB();
    this.setData({
      postList: this.postDB.getAllPostData()
    })
  },
  onShow:function(){
  },
  onReady:function(){
  },
  onHide:function(){
  },
  toPostDetial(ev){
    var id = ev.currentTarget.dataset.postId;
    wx.navigateTo({
      url: '../postDetail/postDetail?id='+id,
    })
  }
})  