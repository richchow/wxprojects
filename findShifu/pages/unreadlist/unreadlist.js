var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    session: '',
    userInfo: {},
    message: {},
    appurl:'',
    cardurl:'',
  },
  onLoad: function (options) {
    this.setData({
      appurl: app.getRequestUrl() + 'UploadedData/' + options.masterid + '/',
      cardurl: app.getRequestUrl() + 'UploadedData/',
    })
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
      dataService.displayAlertMessage(that.data.session, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            message: items.data,
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
  onReady:function(){
    dataService.PushUserPic(this.data.session, this.data.userInfo.nickName, this.data.userInfo.avatarUrl)
  },
})