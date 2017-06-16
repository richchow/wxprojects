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
  showDetail: function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  onLoad: function (option) {
    var that = this
    this.setData({
      showLoading: true
    });
    //获得session
    app.getSession(function (session) {
      console.log("session:" + session)
      that.setData({
        session: session
      })
      if (option.type === 'catalog') {
        //获得值得一看
        dataService.getDataInfoList('', option.val, that.data.session, function (DataInfoList) {
          that.setData({
            docItems: DataInfoList.data
          })
          if (that.data.docItems.length === 0) {
            that.setData({
              dataStatus: true
            })
          }
          that.setData({
            showLoading: false
          });
        })

      } 
      else {
        that.setData({
          showLoading: false
        });
      }
    })
  }
})
