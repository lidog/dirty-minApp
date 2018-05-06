// page/postComment/postComment.js

import DBPost from "../../db/postDB.js"


Page({

  /**
   * 页面的初始数据
   */
  data: {
   useKeyboardFlag:true,
   keyboardInputValue:'',
   sendMoreMsgFlag:false,
   chooseFiles:[],
   deleteIndex:-1,
   recodingClass:'',
   currentAudio:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id
    this.dbPost = new DBPost(postId);
    var comments = this.dbPost.getCommentData();
    this.setData({
      comments:comments
    })

  },
  switchInputType:function(){
    this.setData({
      useKeyboardFlag: !this.data.useKeyboardFlag
    })
  },

  previewImg:function(e){
    var id = e.currentTarget.dataset.commentIdx,
    imgIdx = e.currentTarget.dataset.imgIdx;
    var imgs = this.data.comments[id].content.img;
    wx.previewImage({
      urls: imgs,
      current:imgs[imgIdx]
    })
  },
  bindCommentInput:function(e){
    var val = e.detail.value;
    // var pos = e.detail.cursor;
    // if(pos!=-1){
    //   var left = e.detail.value.slice(0,pos);
    //   pos = left.replace(/qq/g,'*').length;
    // }
    // return {
    //   value: val.replace(/qq/g,'*'),
    //   cursor:pos
    // }
    this.data.keyboardInputValue = val;
  },
  submitComment:function(e){
    var imgs = this.data.chooseFiles;
    var newData = {
      username: "黎镇华",
      avatar: "/images/avatar/avatar-3.png",
      create_time: new Date().getTime() / 1000,
      id: new Date().getTime() / 1000,
      content: {
        txt: this.data.keyboardInputValue,
        img:imgs
      },
    };
    if(!newData.content.txt&&imgs.length===0){
      return;
    }
    this.dbPost.newComment(newData);
    this.showCommitSuccessToast();
    this.bindCommentData();
    this.resetAllDefaultStatus();
  },
  showCommitSuccessToast: function () {
    wx.showToast({
      title: '评论成功',
      duration: 1000,
      icon: "success"
    })
  },
  delectCommitSuccessToast: function () {
    wx.showToast({
      title: '删除成功',
      duration: 1000,
      icon: "success"
    })
  },
  bindCommentData:function(){
    var comments = this.dbPost.getCommentData();
    this.setData({
      comments:comments
    })
  },
  resetAllDefaultStatus:function(){
    //清空input 设置一个绑定至，清空这个值就是清空input
    this.setData({
      keyboardInputValue:'',
      chooseFiles:[],
      sendMoreMsgFlag:false
    })
  },
  delectComment:function(e){
    var _this = this;
    wx.showModal({
      title:"删除评论",
      content:"确定要删除此评论吗？",
      success: function (res) {
        if (res.confirm) {
          var id = e.currentTarget.dataset.commentId;
          if (id) {
            _this.dbPost.delectComment(id);
          }
          _this.delectCommitSuccessToast();
          _this.bindCommentData();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  sendMoreMsg:function(){
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },
  chooseImage:function(e){
    var imgArr = this.data.chooseFiles;
    var leftCount = 3-imgArr.length;
    if(leftCount<=0){
      return;
    }
    var sourceType = [e.currentTarget.dataset.category],
    that = this;
    wx.chooseImage({
      count:leftCount,
      sourceType:sourceType,
      success:function(res){
        that.setData({
          chooseFiles:imgArr.concat(res.tempFilePaths)
        })
      }
    })
  },
  deleteImage:function(e){
    var index = e.currentTarget.dataset.idx,that=this;
    that.setData({
     deleteIndex:index
    });
    that.data.chooseFiles.splice(index, 1);
    setTimeout(function(){
      that.setData({
        deleteIndex:-1,
        chooseFiles: that.data.chooseFiles
      })
    },500)
  },
  recordStart:function(){
    var that = this;
    this.setData({
      recodingClass:'recoding'
    });
    this.startTime = new Date();
    wx.startRecord({
      success:function(res){
        var diff = (that.endTime - that.startTime)/1000;
        diff = Math.ceil(diff);//返回最小整数
        that.submitVoiceComment({url:res.tempFilePath,timeLen:diff});
      },
      fail:function(res){
        console.log(res);
      },
      complete:function(res){
        console.log(res);
        that.setData({
          recodingClass: ""
        });
      }
    })
  },
  recordEnd:function(){
    this.setData({
      recordingClass:""
    });
    this.endTime = new Date();
    wx.stopRecord();
  },
  submitVoiceComment:function(audio){
    var newData = {
      username:"黎镇华",
      avatar:"/images/avatar/avatar-3.png",
      create_time:new Date().getTime()/1000,
      id: new Date().getTime() / 1000,
      content:{
        txt:'',
        img:[],
        audio:audio
      }
    }
    this.dbPost.newComment(newData);
    this.showCommitSuccessToast();
    this.bindCommentData();
  },
  playAudio: function (event){
    var url = event.currentTarget.dataset.url,
      that = this;

    //暂停当前录音
    if (url == this.data.currentAudio) {
      wx.pauseVoice();
      this.data.currentAudio = ''
    }

    //播放录音
    else {
      this.data.currentAudio = url;
      wx.playVoice({
        filePath: url,
        complete: function () {
          //只有当录音播放完后才会执行
          that.data.currentAudio = '';
          console.log('complete')
        },
        success: function () {
          console.log('success')
        },
        fail: function () {
          console.log('fail')
        }
      });
    }
  },
  onShareAppMessage:function(){
    return {
      title:"lzh.rj",
      desc:"那一年的毕业季，我们挥挥手，来不及说再见，就踏上了远行的火车。",
      path:"/pages/post/postComment/postComment/"
    }
  }









})