var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    walletitems: [],
    showLoading: true,
  },
  onShow: function () {
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

      dataService.WalletGet(that.data.session, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            walletitems: items.data,
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