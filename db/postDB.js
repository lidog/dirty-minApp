
import util from "../util/util.js"

export default class DBPost{

  constructor(postId){
    this.storageKeyName = "postList";
    this.postId = postId;
  }

  getAllPostData(){
    var res = wx.getStorageSync(this.storageKeyName);
    if(!res){
      res = require("../data/data.js");
      this.execSetStorageSync(this.storageKeyName,res)
    }
    return res;
  };

  //更新缓存函数
  execSetStorageSync(data){
    wx.setStorageSync(this.storageKeyName, data);
  };

  getPostById(){
    var postDB = this.getAllPostData();
    var len = postDB.length;
    for(var i=0;i<len;i++){
      if ( postDB[i].postId == this.postId ){
        return {
          index:i,
          data:postDB[i]
        }
      }
    }
  };

  collect(){
    return this.updatePostData("collect");
  };

  up(){
     return this.updatePostData('up');
  };

  updatePostData(str,newComment){
    var itemData = this.getPostById(),
       postData = itemData.data,
       allPostData = this.getAllPostData();

       switch(str){
         case "collect":
         if (!postData.collectionStatus){
             postData.collectionNum++;
             postData.collectionStatus = true;
         }else{
             postData.collectionNum--;
             postData.collectionStatus = false;
         }
         break;
         case "up":
         if(!postData.upStatus){
           postData.upNum++;
           postData.upStatus = true;
         }else{
           postData.upNum--;
           postData.upStatus = false;
         }
         break;
         case "comment":
         postData.comments.push(newComment);
         break;
         case "delectComment":
         const comments = postData.comments;
         for(var i=0;i<comments.length;i++){
          if(comments[i].id==newComment){
            postData.comments.splice(i,1);
          }
         } 
         default:
         break;
       }

       allPostData[itemData.index] = postData;
       this.execSetStorageSync(allPostData);
       return postData;
  };

  getCommentData(){
    var itemData = this.getPostById().data;
    itemData.comments.sort(this.compareWithTime);
    var len = itemData.comments.length,comment;
    for(var i=0;i<len;i++){
      comment=itemData.comments[i];
      comment.create_time=util.getDiffTime(comment.create_time,true);
    }
    return itemData.comments;
  }

  compareWithTime(a,b){
    var flag = parseFloat(a.create_time)-parseFloat(b.create_time);
    if(flag<0){
      return 1;
    }else if(flag>0){
      return -1
    }else{
      return 0
    }
  }

  newComment(newComment){
    this.updatePostData('comment',newComment);
  }
  delectComment(id){
    this.updatePostData('delectComment',id);
  }

};