var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
  walletinfo:{},
  userInfo:{},
  session:'',
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      showLoading: true,
    })
    wx.showShareMenu({
      withShareTicket: true
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
      dataService.WalletInfo(that.data.session, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            walletinfo: items.data[0]
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
})