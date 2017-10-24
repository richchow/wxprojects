var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    picurl: '',
    showLoading: true,
    userInfo: {},
    session: '',
    cardurl: '',
    remark: '',
    isSave: true,
    showLoading:true,
  },
  bindShowPic: function (e) {
    var that = this
    if (that.data.isSave) {
      that.setData({isSave:false})
      wx.saveImageToPhotosAlbum({
        filePath: that.data.picurl,
        success(res) {
          wx.showToast({
            title: '成功保存图片到系统相册！',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (res) {
          that.setData({ isSave: true })
          wx.showToast({
            title: '保存图片到系统相册出错！',
            icon: 'fail',
            duration: 2000
          },succes)
        },
      })
    }
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      showLoading: true,
      cardurl: app.getRequestUrl() + 'UploadedData/',
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
      if (options.masterid && options.masterid == 1) {
        dataService.getMasterCard(that.data.session, function (item) {
          if (item.RetCode == 0) {
            wx.downloadFile({
              url: that.data.cardurl + item.data[0],
              success: function (res) {
                that.setData({
                  picurl: res.tempFilePath,
                  remark: '点击图片保存到相册，分享到朋友圈邀请更多人围观',
                })
              }
            })
          }
          that.setData({
            showLoading: false
          })
        })
      } else {

        dataService.getMasterRecommendCard(that.data.session, options.masterid, function (item) {
          if (item.RetCode == 0) {
            wx.downloadFile({
              url: app.getRequestUrl() + 'UploadedAgentData/' + item.data[0],
              success: function (res) {
                that.setData({
                  picurl: res.tempFilePath,
                  remark: '扫描此图片进入房间获得推广费',
                })
              }
            })
          }
          that.setData({
            showLoading: false
          })
        })
      }
    })
  },

})