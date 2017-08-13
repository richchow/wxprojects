var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
  picurl:'',
  showLoading:false,
  userInfo:{},
  session:'',
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
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
      dataService.getMasterCard(that.data.session, function (item) {
        if (item.RetCode == 0) {
          wx.downloadFile({
            url: that.data.cardurl + item.data[0],
            success: function (res) {
             /* wx.previewImage({
                current: res.tempFilePath,
                urls: [res.tempFilePath]
              })*/
              that.setData({ picurl: res.tempFilePath})
            }
          })
        }
        that.setData({
          showLoading: false
        })
      })
    })
  },

})