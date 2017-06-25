var base64 = require("../../images/base64");
Page({
  data: {
    icon20: base64.icon20,
    icon60: base64.icon60,
    showModalStatus:false
  },
  bindToComment:function(){
    wx.navigateTo({
      url: '/pages/comment/comment',
    })
  },
  bindToSmallcomment:function(){
    wx.navigateTo({
      url: '/pages/biggroupsmallcomment/biggroupsmallcomment',
    })
  },
  onLoad: function (options) {
  
  },
})