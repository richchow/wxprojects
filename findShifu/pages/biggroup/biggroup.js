var base64 = require("../../images/base64");
Page({
  data: {
  
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