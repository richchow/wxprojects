var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    id: '',
    isInput: true,
    v1: '',
    v2: '',
    v3: '',
    v4: '',
  },
  bindInput: function (e) {
    this.setData({ isInput: true })
  },
  bindKeyInput: function (e) {
    var val = e.detail.value

    var that = this
    if (val.length == 4) {
      dataService.EnterRoomCheck(that.data.session, that.data.id, e.detail.value, function (items) {
        if (items.RetCode == 0) {
          wx.redirectTo({
            url: '/pages/biggroup/biggroup?masterid=' + items.data[0],
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        } else {
          app.showModal(items.ErrorMsg)
        }
      })

    }
    this.setData({
      v1: val.charAt(0),
      v2: val.charAt(1),
      v3: val.charAt(2),
      v4: val.charAt(3),
    })
  },
  onShow:function(){
    
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    var that = this
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })
    })
  },
})