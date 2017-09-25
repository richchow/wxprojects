var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    groupitems: [],
    showLoading:true,
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
      new app.UnreadPannel()
      that.unreadPannel.show({ token: that.data.session, requestUrl: app.getRequestUrl() })
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
        dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
      })
      
      dataService.MessageTotal(that.data.session, function (items) {
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
   
  },
  onHide: function () {
    this.unreadPannel.hiden()
  },
})