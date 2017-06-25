var base64 = require("../..//images/base64");
Page({
  data: {
  
  },
  bindToComment:function(){
    wx.navigateTo({
      url: '/pages/biggroupcomment/biggroupcomment',
    })
  },
  bindToQA:function(){
    wx.navigateTo({
      url: '/pages/biggroupqa/biggroupqa',
    })
  },
  onLoad: function (options) {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
  },
})