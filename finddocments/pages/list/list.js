var app = getApp()
var dataService = require('../../providers/dataService.js')
Page({
  data: {
    showFollowModalStatus: false,
    showLoading: false,
    session: '',
    isPayed: true,
    dataStatus: false,
    docItems: {}
  },
  bindFollow: function (e) {
    var that = this
    wx.setClipboardData({
      data: 'AIB平台',
      success: function (res) {
        that.showFollowModal()
      }
    })
  },
  showFollowModal: function () {

    this.setData({
      showFollowModalStatus: true,
    })

  },
  hideFollowModal: function () {
    this.setData({
      showFollowModalStatus: false,
    })
  },
  btnToSearch: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (option) {
    var that = this
    this.setData({
      showLoading: true
    });
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })
      if (option.type === 'catalog') {
        //获得值得一看
        dataService.getDataInfoList('', option.val, that.data.session, function (items) {
          if (items.RetCode == 0) {
            that.setData({
              docItems: items.data
            })
            if (that.data.docItems.length === 0) {
              that.setData({
                dataStatus: true
              })
            }
          } else if (items.RetCode == 99) {
            app.tokenError()
          }
          that.setData({
            showLoading: false
          });
        })

      } else if (option.type === 'search') {
        //获得值得一看
        dataService.getDataInfoList(option.val, '', that.data.session, function (items) {
          if (items.RetCode == 0) {
            that.setData({
              docItems: items.data
            })
            if (that.data.docItems.length === 0) {
              that.setData({
                dataStatus: true
              })
            }
          } else if (items.RetCode == 99) {
            app.tokenError()
          }
        })
        that.setData({
          showLoading: false
        });
      }
      else {
        that.setData({
          showLoading: false
        });
      }
    })
  }
})
