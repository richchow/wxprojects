var app = getApp()
var dataService = require('../../providers/dataService')
var payService = require('../../providers/payService')
Page({
  data: {
    showLoading: false,
    session: '',
    sfItems: {},
  },
  onShow: function () {
    var that = this
    this.setData({
      showLoading: true,
    })
    new app.UnreadPannel()
    // that.unreadPannel.show({ unreadnum: 5 })
   
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })
      dataService.alertMessage(that.data.session, function (items) {
        if (items.RetCode == 0) {
          that.unreadPannel.show({ unreadnum: items.data[0] })
        }
        else if (items.RetCode == 99) {
          app.tokenError()
        }
      })

        dataService.getMasterListAll(that.data.session, '', '', function (items) {
          if (items.RetCode == 0) {
            for (let i in items.data) {
              if (items.data[i].picurl.indexOf('http') < 0){
              items.data[i].picurl = app.getRequestUrl() + 'MpicData/' + items.data[i].masterid + '/' + items.data[i].picurl
              }
            }
            that.setData({
              sfItems: items.data,
            })
          } else if (items.RetCode == 99) {
            app.tokenError()
            that.onShow()
          }
          else {
            app.showModal("数据错误，请稍后重试");
          }
        })

      that.setData({
        showLoading: false
      })
    })
  },
  onLoad: function (options) {
    let scene = decodeURIComponent(options.scene)
    if (scene != null) {
      let bval = scene.split(',')
      if (bval.length == 2) {
        let roomid = bval[0].split('_')
        let uid = bval[1].split('_')
        if (roomid.length == 2 && uid.length == 2) {
          app.getSession(function (session) {
            dataService.binAgent(session, uid[1], roomid[1], function (items) {
              if(item.RetCode == 0){
                wx.redirectTo({
                  url: '/pages/shifu/shifu?id=' + item.data[0] ,
                })
              }
             
            })
          })
        }
      }
      else {
        let val = scene.split('_')
        if (val.length == 2) {
          wx.redirectTo({
            url: '/pages/passkey/passkey?id=' + val[1],
          })
        }
      }
    }

  },
  onReady: function () {
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