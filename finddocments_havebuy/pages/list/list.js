var app = getApp()
var dataService = require('../../providers/dataService.js')
Page({
  data: {
    showLoading: false,
    session: '',
    isPayed: true,
    dataStatus: false,
    docItems: {}
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
      dataService.getUserPayed(that.data.session, function (items) {
        if (items.RetCode == 0) {
          if (items.data != 0) {
            //更新数据
            that.setData({
              isPayed: false
            })
          }
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
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
