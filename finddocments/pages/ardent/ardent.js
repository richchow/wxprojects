// pages/ardent/ardent.js
var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    session: '',
    userInfo: {},
    topavatarUrl: '',
    showLoading: false,
    CurCommonweal: {},
    mineardent: null,
    ardentlist: [],
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: 'BIM找资料',
      path: '/pages/ardent/ardent',
      success: function (res) {
        // 分享成功
        dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
        dataService.putDataSharp(that.data.session, -2)
      }
    }
  },
  onLoad: function (options) {
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
        that.setData({
          userInfo: userInfo
        })
        dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
      })

      dataService.getCurCommonweal(that.data.session, function (items) {
        if (items.RetCode == 0) {
          if (items.data != null) {
            that.setData({
              CurCommonweal: items.data[0]
            })
            let list = []
            let sourcelist = that.data.CurCommonweal.ltRankingInfo
            if (sourcelist != null) {
              for (let i = 0; i < sourcelist.length; i++) {
                if (sourcelist[i].IFlag == 0) {
                  that.setData({ mineardent: sourcelist[i] })
                } else if (sourcelist[i].IFlag == 1) {
                  list.push(sourcelist[i])
                }
              }
            }
            that.setData({ ardentlist: list })

          }
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
      })
      that.setData({
        showLoading: false
      });

    })
  },
})