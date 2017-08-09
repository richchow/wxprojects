var app = getApp()
var dataService = require('../../providers/dataService')
var payService = require('../../providers/payService')
Page({
  data: {
    showLoading: false,
    session: '',
    sfItems: {},
    isonLoad: true,
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

      if (that.data.isonLoad) {
        dataService.getMasterListAll(that.data.session, '', '', function (items) {
          if (items.RetCode == 0) {
            that.setData({
              sfItems: items.data,
              isonLoad: false
            })
          } else if (items.RetCode == 99) {
            app.tokenError()
          }
          else {
            app.showModal("数据错误，请稍后重试");
          }
        })
      }
      that.setData({
        showLoading: false
      })
    })
  },
  onLoad: function (options) {
    let scene = decodeURIComponent(options.scene)
    if (scene != null) {
      let val = scene.split('_')
      if (val.length == 2) {
        wx.redirectTo({
          url: '/pages/passkey/passkey?id=' + val[1],
        })
      }
    }

  },
  onReady: function () {
    new app.UnreadPannel()
    this.unreadPannel.show({
    })
    this.showUnread
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl, function (items) {
        if (items.RetCode == 99) {
          app.tokenError()
        }
      })
    })
  },
 
})