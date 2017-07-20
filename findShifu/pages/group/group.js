var app = getApp()
var subRoomService = require('../../providers/subRoomService.js')
Page({
  data: {
    groupitems: []
  },
  bindToCreateChat:function(){
    wx.navigateTo({
      url: '/pages/createchat/createchat',
    })
  },
  onShow:function(){
    var that = this
    this.setData({
      showLoading: true
    })
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })

      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
      subRoomService.SRoomListAll(that.data.session, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            groupitems: items.data,
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        else {
          app.showModal("数据错误，请稍后重试");
        }
        that.setData({
          showLoading: false
        })
      })
    })
  },
  onLoad: function (options) {
    
  }
})