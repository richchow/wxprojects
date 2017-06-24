var app = getApp()
var dataService = require('../../providers/dataService')
var base64 = require("../../images/base64");
Page({
  data: {
    isMoreOpen:false,
    sfItem:{},
    icon20: base64.icon20,
    icon60: base64.icon60
  },
  bindOpenMore:function(e){
    if (e.currentTarget.dataset.tab === '1'){
      this.setData({isMoreOpen:false})
    }else{
      this.setData({ isMoreOpen: true })
    }
  },
  bindToBigGroup:function(e){
    wx.navigateTo({
      url: '/pages/biggroup/biggroup',
    })
  },
  onLoad: function (options) {
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
      dataService.getMasterListSignle(that.data.session,  options.id, function (items) {
          if (items.RetCode == 0) {
            that.setData({
              sfItem: items.data[0]
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