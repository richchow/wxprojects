//获取应用实例
var app = getApp()
var dataService = require('../../providers/dataService')
var message = ''
Page({
  data: {
    message: "",
    showLoading: false,
    session: '',
    isPayed: true,
    hotItems: {},
    userInfo: {}
  },
  btnClick: function (e) {
    wx.navigateTo({
      url: '/pages/list/list?type=catalog&val=' + e.target.dataset.item
    })
  },
  bindChange: function (e) {
    message = e.detail.value
  },
  btnSearch: function () {
    wx.navigateTo({
      url: '/pages/list/list?type=search&val=' + message
    })
  },
  onShow: function () {
    var that = this
    dataService.getUserPayed(that.data.session, function (isPayed) {
      if (isPayed.item != 0) {
        //更新数据
        that.setData({
          isPayed: false
        })
      }
    })
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
      if (session == null || session == '') {
        app.showModal('数据获取错误！请重启小程序再试！');
      }

      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })


      //获得热门搜索
      dataService.getDataCatalogList(function (items) {
        if (items.RetCode == 0) {
          that.setData({
            hotItems: items.data
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
      })

    })

    this.setData({
      showLoading: false
    });

  }
})
