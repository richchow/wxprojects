var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    showLoading: false,
    session: '',
    sfItems: {},
    isonLoad: true,
  },
  onShow: function () {
    var that = this
    if (!that.data.isonLoad) {
      this.setData({
        showLoading: true
      })
      dataService.getMasterListAll(that.data.session, '', '', function (items) {
        if (items.RetCode == 0) {
          that.setData({
            sfItems: items.data
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
    }
  },
  onLoad: function () {
    var that = this
    this.setData({
      showLoading: true
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
      if (that.data.isonLoad) {
        dataService.getMasterListAll(that.data.session, '', '', function (items) {
          if (items.RetCode == 0) {
            that.setData({
              sfItems: items.data
            })
          } else if (items.RetCode == 99) {
            app.tokenError()
          }
          else {
            app.showModal("数据错误，请稍后重试");
          }
        })
        that.setData({
          isonLoad: false
        })
      }
      that.setData({
        showLoading: false
      })
    })
  }
})