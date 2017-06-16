var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    showLoading: false,
    session: null,
    payedinfo: {}
  },
  onShareAppMessage: function () {
    return {
      title: 'BIM找资料',
      path: '/pages/payed/payed'
    }
  },
  onLoad: function () {
    var that = this
    this.setData({
      showLoading: true
    });
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })

      //获得内容详情
      dataService.getPayedInfo(that.data.session, function (items) {
        if (items.RetCode == 0) {
          if (items.data != 0) {
            that.setData({
              payedinfo: items.data
            })
            that.setData({
              showLoading: false
            })
          }
        } else if (items.RetCode == 99) {
          app.tokenError()
        }

      })
    })
  }
})