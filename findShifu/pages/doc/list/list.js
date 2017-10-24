var app = getApp()
var docService = require('../../../providers/docService')
Page({
  data: {
    showFlush: false,
    showLoading: false,
    session: '',
    masterid:'',
    iOwner:0,
    docItems: [],
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      showLoading: true,
      id: options.id,
    })
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })
      docService.getMasterDatum(that.data.session, that.data.id, -1, function (ditems) {
        if (ditems.RetCode == 0) {
          that.setData({
            docItems: ditems.data
          })
        }
      })
      that.setData({
        showLoading: false
      })
    })
  },
  onReady: function () {
   
  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onShareAppMessage: function () {
  
  }
})