// pages/index/index.js
Page({
   toArticle:function(){
     
     wx.navigateTo({
       url: '../article/index',
     })
     
    /*
     wx.redirectTo({
       url: '../article/index',
     })
     */
   } 
})