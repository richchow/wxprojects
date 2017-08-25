var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    session: '',
    userInfo: {},
    newmessage: '',
  },
  authSetting: function () {
    var that = this

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting["scope.userInfo"]) {
                app.getUserInfo(function (userInfo) {
                  //更新数据
                  that.setData({
                    userInfo: userInfo
                  })
                })
                dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl, function (items) {
                  if (items.RetCode == 99) {
                    app.tokenError()
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  onLoad: function (options) { },

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
      dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
      dataService.HaveNewMessage(that.data.session, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            newmessage: items.data,
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