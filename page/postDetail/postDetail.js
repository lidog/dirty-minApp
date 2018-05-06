// page/postDetail/postDetail.js
// var storeConstrater = require("../../db/postDB.js");
//调用这个类;得到的是一个构造函数
import DBPost from "../../db/postDB.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.dbPost = new DBPost(id); //实例化构造函数
    this.postDetail = this.dbPost.getPostById().data;  
    this.setData({
      post:this.postDetail
    });
   

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.postDetail.title,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  onCollectionTap:function(e){
    var newData = this.dbPost.collect();

    this.setData({
      'post.collectionStatus': newData.collectionStatus,
      'post.collectionNum': newData.collectionNum
    })

    wx.showToast({
      title: newData.collectionStatus?"收藏成功":"取消成功",
      duration:1000,
      icon:"success",
      mask:true
    })

  },
  onUpTap:function(e){
    var newData = this.dbPost.up();
    this.setData({
      'post.upStatus':newData.upStatus,
      'post.upNum': newData.upNum
    })
  },
  onCommentTap:function(e){
    var id = e.currentTarget.dataset.postId;
    wx.navigateTo({
      url: '../postComment/postComment?id='+id,
    })
  }


})